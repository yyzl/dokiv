const {
  join,
  resolve
} = require('path')

const {
  existsSync,
  readFile,
  writeFile,
  writeFileSync,
  emptyDir,
  ensureDir,
  ensureFileSync,
  copy
} = require('fs-extra')

const vm = require('vm')
const yaml = require('js-yaml')
const LRU = require("lru-cache")
const revHash = require('rev-hash')

const isEqual = require('lodash.isequal')
const getNpmPrefix = require('find-npm-prefix')

const { Observable } = require('rxjs')
const { fromPromise, combineLatest } = Observable

const logger = require('./util/logger')
const md2vue = require('./util/md2vue')
const rxWatch = require('./util/rxWatch')
const devServer = require('./util/devServer')
const bundlePages = require('./util/bundlePages')
const getMetadata = require('./util/getMetadata')
const compileLayout = require('./compileLayout')
const compilePlugin = require('./compilePlugin')

const noop = () => {}
const sandBox = {
  console: new Proxy({}, {
    get () {
      return noop
    }
  }),
  module: {}
}

process.env.DOCKIV_ENV = process.env.NODE_ENV

const lruCache = new LRU()

const npmPrefix$ = fromPromise(getNpmPrefix(process.cwd()))
const configuration$ = npmPrefix$
  .map(prefix => [prefix, join(prefix, 'dokiv.yml')])
  .flatMap(([prefix, file]) => {
    if (existsSync(file) === false) {
      return Observable.throw(`dokiv.yml ` +
        `not found under current working directory!`
      )
    }
    return rxWatch(file, { basedir: prefix })
  })
  .flatMap(({ event, fullname }) => {
    if (event === 'add' || event === 'change') {
      return readFile(fullname)
        .then(content => {
          const hash = revHash(content)
          const cache = lruCache.get(hash)
          if (cache) {
            return cache
          } else {
            const ret = yaml.safeLoad(content)
            lruCache.set(hash, ret)
            return ret
          }
        })
    }
    return Observable.throw('dokiv.yaml was removed!')
  })
  .distinctUntilChanged(isEqual)
  .combineLatest(npmPrefix$)
  .flatMap(([conf, prefix]) => {
    const {
      rootDir = prefix,
      output = resolve(prefix, 'dokiv'),
      documents = []
    } = conf

    conf.npmPrefix = prefix
    conf.globs = {
      layouts: resolve(prefix, rootDir, 'layouts/*.vue'),
      plugins: resolve(prefix, rootDir, 'plugins/*.js'),
      documents: [].concat(documents).map(f => resolve(prefix, f))
    }

    conf.output = resolve(prefix, output)
    conf.staticSource = resolve(prefix, rootDir, 'static')
    conf.staticOutput = resolve(prefix, output, 'static')

    // vendor bundle
    const bundle = resolve(__dirname, '../dist/bundle.js')
    return readFile(bundle)
      .then(content => {
        const hash = revHash(content)
        conf.vendor = { hash, content }
        return conf
      })
  })

const vendorHash$ = configuration$
  // prepare files & dirs
  .switchMap(({
    staticSource,
    staticOutput,
    output,
    vendor
  }) => emptyDir(output)
    .then(() => ensureDir(staticOutput))
    .then(() => copy(staticSource, staticOutput))
    .then(() => {
      const { hash, content } = vendor
      writeFile(`${staticOutput}/vendor.${hash}.js`, content)
      return hash
    })
  )

const pluginBundle$ = configuration$
  .flatMap(conf => {
    const { globs: { plugins }, npmPrefix } = conf
    return rxWatch(plugins, { basedir: npmPrefix })
  })
  .map(({ event, fullname }) => {
    return { event, file: fullname }
  })
  .scan((map, { event, file }, index) => {
    logger.info(`Plugin ${event.replace(/e?$/, 'ed')}: ${file}`)

    if (index === 0) {
      map = new Map()
    }

    if (event === 'unlink') {
      map.delete(file)
    } else if (event === 'add' || event === 'change') {
      map.set(file, compilePlugin(file))
    }
    return map
  }, null)
  .flatMap(map => Promise.all(
      Array.from(map.keys())
        .map(file => map.get(file))
    )
  )
  .map(data => {
    let code = data.map(({ code }) => code).join('\n')
    code += `\nvar Plugins = [`
    code += data.map(({ name }) => `typeof ${name} !== 'undefined' && ${name}`).join(',\n')
    code += '\n]'
    return code
  })

const layoutBundle$ = configuration$
  .flatMap(conf => {
    const { globs: { layouts }, npmPrefix } = conf
    return rxWatch(layouts, { basedir: npmPrefix })
  })
  .map(({ event, fullname }) => {
    return { event, file: fullname }
  })
  .scan((map, { event, file }, index) => {
    logger.info(`Layout ${event.replace(/e?$/, 'ed')}: ${file}`)
    if (index === 0) {
      map = new Map()
    }

    if (event === 'unlink') {
      map.delete(file)
    } else if (event === 'add' || event === 'change') {
      map.set(file, compileLayout(file))
    }
    return map
  }, null)
  .flatMap(map => Promise.all(
      Array.from(map.keys())
        .map(file => map.get(file))
    )
  )
  .map(data => `var Layout = {${data.join(',\n')}};`)

const documents$ = configuration$
  .flatMap(conf => {
    const { globs: { documents }, npmPrefix } = conf
    return rxWatch(documents, { basedir: npmPrefix })
  })
  .map(({ event, fullname }) => {
    return { event, file: fullname }
  })
  .scan((map, { event, file }, index) => {
    logger.info(`File ${event.replace(/e?$/, 'ed')}: ${file}`)
    if (index === 0) {
      map = new Map()
    }

    if (event === 'unlink') {
      map.delete(file)
    } else if (event === 'add' || event === 'change') {
      const metadata = getMetadata(file)
      map.set(file, {
        metadata,
        code$: md2vue(metadata)
      })
    }
    return map
  }, null)
  .switchMap(map => Promise.all(
      Array.from(map.keys())
        .map(file => map.get(file))
        .map(({ code$, metadata }) => {
          return code$.then((code) => {
            metadata.component = code
            return metadata
          })
        })
    )
  )
  .map(metadatas => {
    const urls = metadatas.map(i => i.fullPath)
    const routers = metadatas.map(({ component, layout, fullPath }) => `{
        path: "${fullPath}",
        component: (${component}),
        meta: { layout: "${layout}" }
      }`)
      .concat('{ path: "*", redirect: "/" }')
    return { routers, urls }
  })

combineLatest([
  configuration$,
  vendorHash$,
  pluginBundle$,
  layoutBundle$,
  documents$
])
  .catch(e => logger.error(e))
  .subscribe(([
    { routerMode, port, staticOutput },
    vendorHash,
    plugins,
    layouts,
    { routers, urls, codes }
  ]) => {
    const { ssr, browser } = bundlePages({
      mode: routerMode,
      routers,
      code: [plugins, layouts]
    })

    vm.runInNewContext(ssr, sandBox)

    const appHash = revHash(browser)
    ensureFileSync(`${staticOutput}/app.${appHash}.js`)
    writeFileSync(`${staticOutput}/app.${appHash}.js`, browser)

    const hash = {
      app: appHash,
      vendor: vendorHash
    }

    devServer.reset({
      hash,
      port,
      staticDir: staticOutput,
      ssrConfig: sandBox.module.exports
    })
  })
