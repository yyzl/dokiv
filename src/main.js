const vm = require('vm')
const { join } = require('path')
const {
  writeFile,
  ensureFile,
  writeFileSync,
  ensureFileSync
} = require('fs-extra')
const SSE = require('express-sse')
const revHash = require('rev-hash')
const request = require('request-promise')
const bundlePages = require('./util/bundlePages')
const devServer = require('./util/devServer')
const logger = require('./util/logger')
const expressSse = new SSE([{ type: 'init' }])

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

module.exports = function (args) {
  const [
    documents,
    pluginBundle,
    layoutBundle,
    styleHash,
    vendorHash,
    configuration
  ] = args
  const { routers, paths } = documents
  const {
    port,
    output,
    externals,
    routerMode,
    staticOutput
  } = configuration

  const { ssr, browser } = bundlePages({
    routers,
    mode: routerMode,
    code: [
      pluginBundle.code,
      layoutBundle.code
    ]
  })

  const appHash = revHash(browser)
  ensureFileSync(`${staticOutput}/app.${appHash}.js`)
  writeFileSync(`${staticOutput}/app.${appHash}.js`, browser)
  vm.runInNewContext(ssr, sandBox)

  const serverPort = devServer.config({
    port,
    routerMode,
    externals,
    hash: {
      app: appHash,
      vendor: vendorHash,
      style: styleHash
    },
    sse: expressSse,
    staticDir: staticOutput,
    ssrConfig: sandBox.module.exports
  }).port

  // SSR
  if (process.env.DOCKIV_ENV === 'production') {
    const promises = []
    const ssrPaths = routerMode === 'history' ? paths : ['/']

    for (let i = 0; i < ssrPaths.length; i++) {
      const path = ssrPaths[i]
      const dest = join(output, `${path}/index.html`)
      const url = `http://127.0.0.1:${serverPort}${path}`
      promises[i] = request(url).then(resp => {
        logger.info(`Renderred: ${url}`)
        return ensureFile(dest)
          .then(() => writeFile(dest, resp))
      })
    }

    Promise.all(promises).then(() => {
      logger.info('SSR done.')
      process.exit()
    })
  } else {
    expressSse.send({ type: 'reload' })
  }

  return serverPort
}
