const vm = require('vm')
const { join } = require('path')
const {
  writeFile,
  ensureFile,
  writeFileSync,
  ensureFileSync
} = require('fs-extra')

const revHash = require('rev-hash')
const request = require('request-promise')
const bundlePages = require('./util/bundlePages')
const devServer = require('./util/devServer')
const logger = require('./util/logger')

const noop = () => {}
const sandBox = {
  console: new Proxy(
    {},
    {
      get () {
        return noop
      }
    }
  ),
  module: {}
}

module.exports = function (...args) {
  const isProd = process.env.DOKIV_ENV === 'production'

  const [
    documents,
    layouts,
    plugins,
    style,
    vendor,
    configuration
  ] = args

  const { routers, paths } = documents

  const {
    sse,
    port,
    output,
    externals,
    routerMode,
    staticOutput,
    staticSource
  } = configuration

  const { ssr, browser } = bundlePages({
    routers,
    mode: routerMode,
    code: [
      plugins.code,
      layouts.code
    ]
  })

  vm.runInNewContext(ssr, sandBox)

  const hash = revHash(browser)
  const app = {
    hash,
    content: browser,
    dest: `${staticOutput}/app.${hash}.js`
  }

  const bundles = { app, vendor, style }

  if (isProd) {
    // write bundles to disk on production
    logger.info(`Writing bundles to disk...`)
    Object.keys(bundles).forEach(key => {
      const { dest, content } = bundles[key]
      ensureFileSync(dest)
      writeFileSync(dest, content)
    })
  }

  const serverPort = devServer
    .config({
      sse,
      port,
      bundles,
      routerMode,
      externals,
      staticDir: isProd ? staticOutput : staticSource,
      ssrConfig: sandBox.module.exports
    })
    .port

  if (isProd) {
    const promises = []

    // Server Side Rendering
    const ssrPaths = routerMode === 'history' ? paths : ['/']

    ssrPaths.forEach(path => {
      const dest = join(output, `${path}/index.html`)
      const url = `http://127.0.0.1:${serverPort}${path}`

      const promise = request(url).then(resp => {
        logger.info(`Page renderred: ${url}`)
        return ensureFile(dest)
          .then(() => writeFile(dest, resp))
      })

      promises.push(promise)
    })

    Promise
      .all(promises)
      .then(() => {
        logger.info('SSR done.')
        process.exit()
      })
  } else {
    logger.info('Page reloading...')
    sse.send({ type: 'reload' })
  }

  return serverPort
}
