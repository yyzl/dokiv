import { resolve } from 'path'
import {
  copy,
  emptyDir,
  ensureDir
} from 'fs-extra'

import opn from 'opn'
import globby from 'globby'
import getPort from 'get-port'
import revHash from 'rev-hash'
import { Observable } from 'rxjs'
import clairBundle from 'clair-bundle'

import SSE from 'express-sse'
import logger from './util/logger'
import md2vue from './util/md2vue'
import postCSS from './util/postCSS'
import rxWatch from './util/rxWatch'
import getMetadata from './util/getMetadata'

import subscriber from './subscriber'
import compileLayout from './compileLayout'
import bundlePlugins from './bundlePlugins'

const expressSse = new SSE([{ type: 'init' }])

export default function (configuration$) {
  const npmPrefix = process.env.NPM_PREFIX

  const productionCounts$ = configuration$
    .pluck('globs')
    .map(({
      layouts,
      documents
    }) => ({
      layouts: globby.sync(layouts).length,
      documents: globby.sync(documents).length
    }))

  const prepareFs$ = configuration$
    .switchMap(({ output, staticSource, staticOutput }) =>
      ensureDir(output)
        .then(() => emptyDir(output))
        .then(() => ensureDir(staticOutput))
        .then(() => copy(staticSource, staticOutput))
        .then(() => logger.info('File system prepared...'))
    )

  const vendor$ = configuration$
    .switchMap(({ output, staticOutput }) => {
      const isProd = process.env.DOKIV_ENV === 'production'
      return clairBundle({
        options: [
          {
            input: resolve(__dirname, '../lib/render.js'),
            output: {
              name: 'createApp',
              format: 'iife',
              sourcemap: !isProd ? 'inline' : false
            },
            uglify: isProd
          }
        ]
      }).then(([result]) => {
        const [{ code }] = result
        const hash = revHash(code)
        const dest = `${staticOutput}/vendor.${hash}.js`
        logger.info('Vendor bundling done')
        return { dest, hash, content: code }
      })
    })

  const style$ = configuration$.switchMap(
    ({ postcss, staticOutput }) => {
      const option = Object.assign({}, postcss, { npmPrefix })

      return postCSS(option)
        .map(content => {
          const hash = revHash(content)
          const dest = resolve(`${staticOutput}/style.${hash}.css`)
          logger.info(`Style bundle changed`)

          return {
            dest,
            hash,
            content
          }
        })
    }
  )

  const plugins$ = configuration$
    .pluck('globs', 'plugins')
    .switchMap(glob => globby(glob))
    .switchMap(files => bundlePlugins(files))
    .map(code => {
      return { code }
    })

  const layouts$ = configuration$
    .flatMap(conf => {
      const { globs: { layouts } } = conf
      return rxWatch(layouts, npmPrefix)
    })
    .do(({ event, file }) =>
      logger.info(`Layout ${event.replace(/e?$/, 'ed')}: ${file}`)
    )
    .scan((map, { event, file }) => {
      map = map || new Map()

      if (event === 'unlink') {
        map.delete(file)
      } else if (event === 'add' || event === 'change') {
        map.set(file, compileLayout(file))
      }
      return map
    }, null)
    .flatMap(map =>
      Promise.all(Array.from(map.keys()).map(file => map.get(file)))
    )
    .map(data => {
      const code = `var Layout = {${data.join(',\n')}};`

      return {
        code,
        count: data.length
      }
    })

  const documents$ = configuration$
    .flatMap(conf => {
      const {
        globs: { documents },
        highlight = 'highlight.js'
      } = conf

      return rxWatch(documents, npmPrefix)
        // side effect
        .do(o => {
          o.__hl__ = highlight
        })
    })
    .do(({ event, file }) =>
      logger.info(`Markdown ${event.replace(/e?$/, 'ed')}: ${file}`)
    )
    .scan((map, { event, file, __hl__ }) => {
      map = map || new Map()

      if (event === 'unlink') {
        map.delete(file)
      } else if (event === 'add' || event === 'change') {
        const metadata = getMetadata(file)
        const { highlight } = metadata

        if (typeof metadata === 'string') {
          logger.error(metadata + file)
        } else {
          metadata.highlight = highlight || __hl__
          map.set(file, {
            metadata,
            code$: md2vue(metadata)
          })
        }
      }
      return map
    }, null)
    .switchMap(map =>
      Promise.all(
        Array.from(map.keys())
          .map(file => map.get(file))
          .map(({ code$, metadata }) => {
            return code$.then(code => {
              metadata.component = code
              return metadata
            })
          })
      )
    )
    .map(metadatas => {
      const paths = metadatas.map(i => i.fullPath)
      return {
        paths,
        routers: metadatas,
        count: metadatas.length
      }
    })

  const streams = [
    documents$,
    layouts$,
    plugins$,
    style$,
    vendor$,
    configuration$
  ]
  const development$ = Observable.combineLatest(streams)
  const production$ = productionCounts$
    .combineLatest(streams)
    .skipWhile(([
      counts,
      documents,
      layoutBundle
    ]) => {
      return counts.documents > documents.count ||
        counts.layouts > layoutBundle.count
    })
    .map(([_, ...rest]) => rest)

  getPort({ port: 3000 }).then(port => {
    if (process.env.DOKIV_ENV === 'production') {
      return production$
        .combineLatest(prepareFs$)
        .map(([arg]) => arg)
        .subscribe(args => {
          const config = args[args.length - 1]
          config.port = port
          config.sse = expressSse
          subscriber.apply(null, args)
        })
    }

    let browserLaunched = false

    // for watching static files
    configuration$
      .do(() => {
        logger.info('Configuration updated')
      })
      .pluck('staticSource')
      .switchMap(dir => rxWatch(dir))
      .debounceTime(100)
      .subscribe(() => {
        logger.info('Static source directory changed')

        if (browserLaunched) {
          expressSse.send({ type: 'reload' })
        }
      })

    development$.subscribe(args => {
      const config = args[args.length - 1]
      config.port = port
      config.sse = expressSse
      subscriber.apply(null, args)

      if (browserLaunched === false) {
        logger.info('Launching browser...')
        opn(`http://localhost:${port}`)
        browserLaunched = true
      }
    })
  })
}
