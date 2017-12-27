import express from 'express'
import ssr from 'vue-server-renderer'
import exitHook from 'async-exit-hook'
import gracefulExit from 'express-graceful-exit'
import createApp from '../../lib/render'
import logger from './logger'

const app = express()
const renderer = ssr.createRenderer({
  template: '<!--vue-ssr-outlet-->'
})

app.use(gracefulExit.middleware(app))

export default {
  started: false,
  see: null,

  config ({
    sse,
    port,
    bundles,
    staticDir,
    ssrConfig,
    routerMode,
    externals = {}
  }) {
    this.sse = sse
    this.bundles = bundles
    this.staticDir = staticDir
    this.ssrConfig = ssrConfig
    this.routerMode = routerMode
    this.externals = getExternals(externals)

    this.hash = Object.keys(bundles)
      .reduce((acc, key) => {
        acc[key] = bundles[key].hash
        return acc
      }, {})

    if (this.started === false) {
      this.serveFavico()
      this.serveStatic()
      this.serveSse()
      this.serveOthers()
      this.started = true
    }

    // avoid tcp port collision
    if (port !== this.port) {
      this.port = port || new Date().getFullYear()
      const server = app.listen(this.port)
      logger.info('Server listening on port: ', this.port)

      exitHook(() => {
        logger.info('Express server exits gracefully.')
        gracefulExit.gracefulExitHandler(app, server, {})
      })
    }

    return this
  },

  serveStatic () {
    const regex = /^\/static\/(style|vendor|app)\.([a-z0-9]+)\.(css|js)/

    app.use(regex, (req, res) => {
      const type = req.params[0]
      const { content } = this.bundles[type]

      if (type === 'style') {
        res.set('Content-Type', 'text/css')
      } else {
        res.set('Content-Type', 'application/javascript')
      }

      res.end(content)
    })

    app.use('/static', (...args) => {
      express.static(this.staticDir)(...args)
    })
  },

  serveFavico () {
    app.use('/favicon.ico', (_, res) => res.end(''))
  },

  serveSse () {
    app.use('/__sse__', this.sse.init)
  },

  serveOthers () {
    app.get('*', (req, res) => {
      const { hash, externals, ssrConfig } = this
      if (this.routerMode !== 'history') {
        res.set('Content-Type', 'text/html')
        return res.end(getSPAHtml(hash, externals))
      }

      const { app, router } = createApp(ssrConfig)
      router.push(req.url)
      router.onReady(() => {
        if (!router.getMatchedComponents().length) {
          return res.status(404).end('<pre>Not found</pre>')
        }

        res.set('Content-Type', 'text/html')
        renderer.renderToString(app, function (err, html) {
          if (err) {
            console.log(err)
            return res.status(500)
              .end(`<pre>${err.stack}</pre>`)
          }

          const $meta = app.$meta().inject()
          res.write(getResponseHead($meta, hash, externals))
          res.write(html)
          res.end(getResponseTail($meta, hash, externals))
        })
      })
    })
  }
}

function getResponseHead (injection, hash, externals) {
  const {
    title,
    htmlAttrs,
    bodyAttrs,
    link,
    style,
    script,
    noscript,
    meta
  } = injection

  const arr = [title, link, style, script, noscript, meta]

  return `<!doctype html>
<html data-vue-meta-server-rendered ${htmlAttrs.text()}>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    ${arr.map(it => it.text()).join('')}
    ${externals.css}
    <link rel="stylesheet" href="/static/style.${hash.style}.css">
  </head>
  <body ${bodyAttrs.text()}>`
}

function getResponseTail (injection, hash, externals) {
  return `${externals.js}${injection.script.text({ body: true })}
    <script src="/static/vendor.${hash.vendor}.js"></script>
    <script src="/static/app.${hash.app}.js"></script>
  </body>
</html>`
}

function getSPAHtml (hash, externals) {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title></title>
  ${externals.css}
  <link rel="stylesheet" href="/static/style.${hash.style}.css">
</head>
<body>
  <div id="app">Loading...</div>
  ${externals.js}
  <script src="/static/vendor.${hash.vendor}.js"></script>
  <script src="/static/app.${hash.app}.js"></script>
</body>
</html>`
}

function getExternals (externals) {
  return (externals || []).reduce((acc, url) => {
    if (/\.css$/.test(url)) {
      acc.css += `<link rel="stylesheet" href="${url}" />`
    } else if (/\.js/.test(url)) {
      acc.js += `<script src="${url}"></script>`
    }
    return acc
  }, {
    css: '',
    js: ''
  })
}
