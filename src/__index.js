global.Promise = require('bluebird')

const { resolve } = require('path')

const {
  copy,
  readFile,
  emptyDir,
  ensureDir,
  existsSync
} = require('fs-extra')

const opn = require('opn')
const yaml = require('js-yaml')
const LRU = require('lru-cache')
const globby = require('globby')
const getPort = require('get-port')
const revHash = require('rev-hash')
const { exec } = require('shelljs')
const isEqual = require('lodash.isequal')
const exitHook = require('async-exit-hook')

const { Observable } = require('rxjs')
const { combineLatest } = Observable

const SSE = require('express-sse')
const expressSse = new SSE([{ type: 'init' }])

const logger = require('./util/logger')
const md2vue = require('./util/md2vue')
const rxWatch = require('./util/rxWatch')
const getMetadata = require('./util/getMetadata')

const main = require('./main')
const postCSS = require('./postCSS')
const compileLayout = require('./compileLayout')
const compilePlugin = require('./compilePlugin')

const lruCache = new LRU()
const prettyPath = p => `${p}`.trim().replace(/\\/g, '/')

const arg = process.argv.slice(2)[0]
if (['-w', '--watch'].indexOf(arg) === -1) {
  process.env.DOKIV_ENV = 'production'
} else {
  process.env.DOKIV_ENV = 'development'
}

let npmPrefix = null
logger.info('Run `npm prefix`...')
npmPrefix = prettyPath(exec('npm prefix', { silent: true }))
logger.info('npm prefix is', npmPrefix)

const ymlfile = resolve(npmPrefix, 'dokiv.yml')

if (existsSync(ymlfile) === false) {
  logger.error(`dokiv.yml not found under ` +
    `current working directory!`
  )
  process.exit()
}

const configuration$ = rxWatch(ymlfile, { basedir: npmPrefix })
  .switchMap(({ event, file }) => {
    if (event === 'unlink') {
      return Observable.throw('dokiv.yaml was removed!')
    }
    return readFile(file)
  })
  .map(content => {
    const hash = revHash(content)
    const cache = lruCache.get(hash)

    if (!cache) {
      const ret = yaml.safeLoad(content)
      lruCache.set(hash, ret)
      return ret
    }

    return cache
  })
  .distinctUntilChanged(isEqual)
  .map((configuration) => {
    const {
      postcss,
      rootDir,
      output,
      documents
    } = configuration

    configuration.globs = {
      layouts: resolve(npmPrefix, rootDir, 'layouts/*.vue'),
      plugins: resolve(npmPrefix, rootDir, 'plugins/*.js'),
      documents: [].concat(documents).map(f => resolve(npmPrefix, f))
    }

    // postcss
    const { entry } = postcss
    postcss.entry = resolve(npmPrefix, entry)
    postcss.watch = process.env.DOKIV_ENV !== 'production'

    configuration.output = resolve(npmPrefix, output)
    configuration.staticSource = resolve(npmPrefix, rootDir, 'static')
    configuration.staticOutput = resolve(npmPrefix, output, 'static')

    return configuration
  })

const productionCounts$ = configuration$
  .pluck('globs')
  .map(({
    layouts,
    plugins,
    documents
  }) => ({
    layouts: globby.sync(layouts).length,
    plugins: globby.sync(plugins).length,
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
    const bundle = resolve(
      __dirname,
      `../dist/bundle.${process.env.DOKIV_ENV}.js`
    )

    return readFile(bundle)
      .then(content => {
        const hash = revHash(content)
        const dest = `${staticOutput}/vendor.${hash}.js`

        return { dest, content, hash }
      })
  })

const style$ = configuration$.switchMap(
  ({ postcss, staticOutput }) => {
    const option = Object.assign({}, postcss, { npmPrefix })

    return postCSS(option)
      .map(content => {
        const hash = revHash(content)
        const dest = resolve(`${staticOutput}/style.${hash}.css`)
        logger.info(`Style bundle changed.`)

        return {
          dest,
          hash,
          content
        }
      })
  }
)

const plugins$ = configuration$
  .flatMap(conf => {
    const { globs: { plugins } } = conf
    return rxWatch(plugins, npmPrefix)
  })
  .do(({ event, file }) =>
    logger.info(`Plugin ${event.replace(/e?$/, 'ed')}: ${file}`)
  )
  .scan((map, { event, file }) => {
    map = map || new Map()
    if (event === 'unlink') {
      map.delete(file)
    } else if (event === 'add' || event === 'change') {
      map.set(file, compilePlugin(file))
    }
    return map
  }, null)
  .flatMap(map =>
    Promise.all(Array.from(map.keys()).map(file => map.get(file)))
  )
  .map(data => {
    let code = data.map(({ code }) => code).join('\n')
    code += `\nvar Plugins = [`
    code += data
      .map(({ name }) => `typeof ${name} !== 'undefined' && ${name}`)
      .join(',\n')
    code += '\n]'

    return {
      code,
      count: data.length
    }
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
    const routers = metadatas
      .map(
        ({ component, layout, fullPath }) => `{
          path: "${fullPath}",
          component: (${component}),
          meta: { layout: "${layout}" }
        }`
      )
      .concat('{ path: "*", redirect: "/404" }')

    return {
      paths,
      routers,
      count: metadatas.length
    }
  })

const streams = [
  documents$,
  plugins$,
  layouts$,
  style$,
  vendor$,
  configuration$
]
const development$ = combineLatest(streams)
const production$ = productionCounts$
  .combineLatest(streams)
  .skipWhile(([
    counts,
    documents,
    pluginBundle,
    layoutBundle
  ]) => {
    return counts.documents > documents.count ||
      counts.plugins > pluginBundle.count ||
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
        main.apply(null, args)
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
    main.apply(null, args)

    if (browserLaunched === false) {
      logger.info('Launching browser...')
      opn(`http://localhost:${port}`)
      browserLaunched = true
    }
  })
})

// Error handling
process.on('unhandledRejection', (reason, p) => {
  logger.error(`${reason}`)
  console.log(p)
  process.exit()
})

process.on('uncaughtException', (err) => {
  logger.error(err)
  console.log(err)
  process.exit()
})

exitHook.uncaughtExceptionHandler(err => {
  logger.error(`Exit on uncaught exception: ${err}`)
})

exitHook.unhandledRejectionHandler(err => {
  logger.error(`Exit on uncaught rejection: ${err}`)
})
