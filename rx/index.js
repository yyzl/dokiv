const {
  join,
  basename,
  resolve,
  relative,
  normalize
} = require('path')

const {
  copy,
  ensureDir,
  existsSync,
  readFileSync,
  writeFileSync
} = require('fs-extra')

const { exec } = require('shelljs')

const yaml = require('js-yaml')
const globby = require('globby')
const revHash = require('rev-hash')
const MemoryFileSystem = require('memory-fs')

const { Observable } = require('rxjs')
const rxWatchGlob = require('rx-watch-glob')
const rxWatch = require('rx-watch-glob/lib/rxWatch')

const postCSS = require('./postCSS')
const bundlePages = require('./bundlePages')
const compilePlugin = require('./compilePlugin')
const compileLayout = require('./compileLayout')

const md2vue = require('./util/md2vue')
const getMetadata = require('./util/getMetadata')

const assign = Object.assign
const { fromPromise } = Observable

const cwd = process.cwd()
const spinner = require('ora')('Loading unicorns')
const configFile = resolve(cwd, './dokiv.yml')

if (existsSync(configFile) === false) {
  spinner.warn('dokiv.yml not found under current working directory!')
  process.exit()
}

const config = yaml.safeLoad(readFileSync(configFile, 'utf8'))
const outputDirectory = resolve(cwd, config.output)
const staticSrcDirectory = resolve(cwd, config.staticDirectory)
const staticDestination = join(outputDirectory, 'static')

const isProd = process.env.NODE_ENV === 'production'
const fs = isProd ? require('fs') : new MemoryFileSystem()
process.env.isProd = isProd

/**
 * file system
 */
exec(`rm -rf ${outputDirectory}/**/**`)
exec(`mkdir ${staticDestination}/`)
// copy static files
exec(`cp -R ${staticSrcDirectory} ${staticDestination}`)
!isProd && fs.mkdirpSync(staticDestination)

/**
 * watch static directory
 */
const staticfiles$ = rxWatch(staticSrcDirectory)

/**
 * styles
 */
const postcss = config.postcss
const option = {
  input: globby.sync(postcss.entry)[0],
  minify: postcss.minify,
  sourcemap: postcss.sourcemap,
  plugins: postcss.plugins,
  watch: true
}
const styleBundle$ = fromPromise(postCSS(option)).switch()

/**
 * plugins
 */
const pluginBundle$ = rxWatchGlob({ globs: config.plugins })
  .flatMap(({ change, map }) => {
    const { type, file, files, content } = change

    // add/change
    if (type !== 'unlink') {
      return compilePlugin(file, content).then(data => {
        map.set(file, data)
        return map
      })
    }

    // unlink
    file && map.delete(file)
    files && files.forEach(file => map.delete(file))
    return Promise.resolve(map)
  })
  .debounceTime(100)
  .map(map => Array.from(map.values()))
  .map(data => {
    const joinAt = (key, symbol = '\n') => data.map(item => item[key]).join(symbol)
    return joinAt('code') + `;var Plugins = [${joinAt('name', ', ')}];`
  })

/**
 * layouts
 */
const layoutBundle$ = rxWatchGlob({ globs: config.layout })
  .switchMap(({ change, map }) => {
    const { type, file, files, content } = change

    // add/change
    if (type !== 'unlink') {
      return compileLayout(file, content).then(content => {
        map.set(file, { content })
        return map
      })
    }

    // unlink
    file && map.delete(file)
    files && files.forEach(file => map.delete(file))
    return Promise.resolve(map)
  })
  .debounceTime(100)
  .map(map => {
    const str = Array.from(map.values()).map(item => item.content).join(',\n')
    return `var Layout = {${str}};`
  })

/**
 * markdown documents
 */
const documents$ = rxWatchGlob({ globs: config.documents })
  .switchMap(({ change, map }) => {
    const { type, file, files, content } = change

    // add/change
    if (type !== 'unlink') {
      const metadata = getMetadata(file, content)

      return fromPromise(md2vue(metadata))
        .map(component => assign(metadata, { component }))
        .do(_ => map.set(file, { metadata }))
        .map(_ => map)
    }

    // unlink
    file && map.delete(file)
    files && files.forEach(file => map.delete(file))
    return Promise.resolve(map)
  })
  .debounceTime(100)

const metadata$ = documents$
  .map(map => [...map.values()].map(o => o.metadata))
  .do(arr => {
    const index = arr.findIndex(item => item.fullPath === '/')
    if (index > -1) {
      arr.unshift(arr.splice(index, 1)[0])
    }
  })

const routers$ = metadata$
  .map(arr => arr.map(
      ({ component, layout, fullPath }) => JSON.stringify({
        path: fullPath,
        meta: { layout }
      }).replace(/\}$/, `,"component":(${component})}`)
    )
    .concat('{ path: "*", redirect: "/" }')
  )

const urls$ = metadata$.map(arr => arr.map(i => i.fullPath))

// ==========================================================
/**
 * we'll ignore `unlink/unlinkDir` events
 * simply focus on `change/add/addDir`
 */
staticfiles$
  .filter(e => /add|change/.test(e.event))
  .flatMap(({ fullname, event }) => {
    const rel = relative(staticSrcDirectory, fullname)
    const dest = resolve(staticDestination, rel)
    const ret = { fullname, dest }

    if (event === 'addDir') {
      return fromPromise(
        ensureDir(dest).then(_ => ret)
      )
    } else {
      return Promise.resolve(ret)
    }
  })
  .subscribe(({ fullname, dest }) => {
    // copy file/dir on `change/add` event
    copy(fullname, dest)
  })

styleBundle$.subscribe(code => {
  const hash = revHash(code)
  fs.writeFileSync(`${staticDestination}/vendor.${hash}.js`, code)
})

Observable
  .combineLatest(
    layoutBundle$,
    pluginBundle$,
    routers$
  )
  .map(([layouts, plugins, routers]) => bundlePages({
    mode: config.routerMode,
    routers,
    code: [plugins, layouts]
  }))
  .subscribe(({ srr, browser }) => {
    const hash = revHash(browser)
    fs.writeFileSync(`${staticDestination}/app.${hash}.js`, browser)
  })
