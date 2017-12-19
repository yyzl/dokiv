const express = require('express')
const serverRenderer = require('vue-server-renderer')
const createApp = require('../../dist/ssr')
const logger = require('./logger')

const server = express()
const renderer = serverRenderer
  .createRenderer({ template: '<!--vue-ssr-outlet-->' })

module.exports = {
  started: false,
  see: null,

  config ({
    sse,
    hash,
    port,
    staticDir,
    ssrConfig,
    routerMode,
    externals = {}
  }) {
    this.sse = sse
    this.hash = hash
    this.staticDir = staticDir
    this.ssrConfig = ssrConfig
    this.routerMode = routerMode
    this.externals = getExternals(externals)

    if (this.started === false) {
      this.serveFavico()
      this.serveStatic()
      this.serveSse()
      this.serveOthers()
      this.started = true
    }

    if (!this.port) {
      const port = new Date().getFullYear()
      this.port = port
      server.listen(port)
      logger.info('Server listening on port: ', port)
    }

    return this
  },

  serveStatic () {
    server.use('/static', (...args) => {
      express.static(this.staticDir)(...args)
    })
  },

  serveFavico () {
    server.use('/favicon.ico', (_, res) => res.end(''))
  },

  serveSse () {
    server.use('/__sse__', this.sse.init)
  },

  serveOthers () {
    server.get('*', (req, res) => {
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
