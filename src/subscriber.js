import vm from 'vm'
import { join } from 'path'
import {
  writeFile,
  ensureFile,
  writeFileSync,
  ensureFileSync
} from 'fs-extra'

import swPrecache from 'sw-precache'
import revHash from 'rev-hash'
import request from 'request-promise'
import bundlePages from './util/bundlePages'
import devServer from './util/devServer'
import logger from './util/logger'

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

export default function (...args) {
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

  const { ssr, browser, pages } = bundlePages({
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

  const bundles = {
    vendor,
    style,
    app,
    pages: pages.reduce((acc, { hash, content }) => {
      acc[hash] = {
        hash,
        content,
        dest: `${staticOutput}/page.${hash}.js`
      }
      return acc
    }, {})
  }

  if (isProd) {
    // write bundles to disk on production
    logger.info(`Writing bundles to disk...`)
    const write = ({ dest, content }) => {
      ensureFileSync(dest)
      writeFileSync(dest, content)
    }
    Object.keys(bundles).forEach(key => {
      if (key === 'pages') {
        const page = bundles[key]
        Object.keys(page).forEach(key => {
          write(page[key])
        })
      } else {
        write(bundles[key])
      }
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
      .then(() => logger.info('SSR done'))
      .then(() => {
        logger.info('Generating service worker')
        const glob = `${staticOutput}/**/*.{js,html,css,png,jpg,gif,svg,eot,ttf,woff}`
        swPrecache.write(`${output}/service-worker.js`, {
          staticFileGlobs: [glob],
          stripPrefix: output.replace(/\//g, '/')
        }, function () {
          logger.info('Done')
          process.exit()
        })
      })
  } else {
    logger.info('Page reloading...')
    sse.send({ type: 'reload' })
  }

  return serverPort
}
