const { join, resolve } = require('path')

const {
  existsSync,
  readFile,
  writeFile,
  emptyDir,
  ensureDir,
  ensureFile,
  copy
} = require('fs-extra')

const opn = require('opn')
const yaml = require('js-yaml')
const LRU = require('lru-cache')
const globby = require('globby')
const revHash = require('rev-hash')
const isEqual = require('lodash.isequal')
const getNpmPrefix = require('find-npm-prefix')

const { Observable } = require('rxjs')
const { fromPromise, combineLatest } = Observable

const logger = require('./util/logger')
const md2vue = require('./util/md2vue')
const rxWatch = require('./util/rxWatch')
const getMetadata = require('./util/getMetadata')

const postCSS = require('./postCSS')
const compileLayout = require('./compileLayout')
const compilePlugin = require('./compilePlugin')

const main = require('./main')
const lruCache = new LRU()

const arg = process.argv.slice(2)[0]
if (['-w', '--watch'].indexOf(arg) === -1) {
  process.env.DOCKIV_ENV = 'production'
} else {
  process.env.DOCKIV_ENV = 'development'
}

const npmPrefix$ = fromPromise(
  getNpmPrefix(process.cwd())
)

const configuration$ = npmPrefix$
  .switchMap(prefix => {
    const file = join(prefix, 'dokiv.yml')

    if (existsSync(file) === false) {
      return Observable.throw(
        `dokiv.yml ` + `not found under current working directory!`
      )
    }

    return rxWatch(file, { basedir: prefix })
  })
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
  .combineLatest(npmPrefix$)
  .map(([configuration, prefix]) => {
    const {
      postcss,
      rootDir,
      output,
      documents
    } = configuration

    configuration.npmPrefix = prefix

    configuration.globs = {
      layouts: resolve(prefix, rootDir, 'layouts/*.vue'),
      plugins: resolve(prefix, rootDir, 'plugins/*.js'),
      documents: [].concat(documents).map(f => resolve(prefix, f))
    }

    // postcss
    const { entry } = postcss
    postcss.entry = resolve(prefix, entry)
    postcss.watch = process.env.DOCKIV_ENV !== 'production'

    configuration.output = resolve(prefix, output)
    configuration.staticSource = resolve(prefix, rootDir, 'static')
    configuration.staticOutput = resolve(prefix, output, 'static')

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

const vendorHash$ = configuration$
  .switchMap(({ output, staticSource, staticOutput }) =>
    emptyDir(output)
      .then(() => ensureDir(staticOutput))
      .then(() => copy(staticSource, staticOutput))
      .then(() => {
        const bundle = resolve(
          __dirname,
          `../dist/bundle.${process.env.DOCKIV_ENV}.js`
        )

        return readFile(bundle).then(content => {
          const hash = revHash(content)
          const dest = `${staticOutput}/vendor.${hash}.js`
          return writeFile(dest, content).then(() => hash)
        })
      })
  )

const styleHash$ = configuration$.switchMap(
  ({ postcss, npmPrefix, staticOutput }) => {
    const option = Object.assign({}, postcss, { npmPrefix })

    return postCSS(option)
      .map(css => ({ css, hash: revHash(css) }))
      .switchMap(({ css, hash }) => {
        const file = resolve(`${staticOutput}/style.${hash}.css`)
        logger.info(`Style changed: ${file.replace(/\\/g, '/')}`)
        return ensureFile(file)
          .then(() => writeFile(file, css))
          .then(() => hash)
      })
  }
)

const pluginBundle$ = configuration$
  .flatMap(conf => {
    const { globs: { plugins }, npmPrefix } = conf
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

const layoutBundle$ = configuration$
  .flatMap(conf => {
    const { globs: { layouts }, npmPrefix } = conf
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
    const { globs: { documents }, npmPrefix } = conf
    return rxWatch(documents, npmPrefix)
  })
  .do(({ event, file }) =>
    logger.info(`Markdown ${event.replace(/e?$/, 'ed')}: ${file}`)
  )
  .scan((map, { event, file }) => {
    map = map || new Map()

    if (event === 'unlink') {
      map.delete(file)
    } else if (event === 'add' || event === 'change') {
      const metadata = getMetadata(file)

      if (typeof metadata === 'string') {
        logger.error(metadata + file)
      } else {
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
  pluginBundle$,
  layoutBundle$,
  styleHash$,
  vendorHash$,
  configuration$
]

const development$ = combineLatest(streams)
  .catch(e => logger.error(e))

const production$ = combineLatest([
  productionCounts$,
  ...streams
])
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
  .catch(e => logger.error(e))

if (process.env.DOCKIV_ENV === 'production') {
  production$
    .subscribe(main)
} else {
  let serverLaunched = false

  development$
    .subscribe((...args) => {
      const port = main.apply(null, args)

      if (serverLaunched === false) {
        logger.info('Launching browser...')
        opn(`http://localhost:${port}`)
        serverLaunched = true
      }
    })

  configuration$.subscribe(() => {
    logger.info('yaml configuration updated!')
  })
}
