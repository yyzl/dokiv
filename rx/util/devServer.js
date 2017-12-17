const express = require('express')
const serverRenderer = require('vue-server-renderer')
const createApp = require('../../dist/ssr')
const logger = require('./logger')
const server = express()
const renderer = serverRenderer
  .createRenderer({ template: '<!--vue-ssr-outlet-->' })

module.exports = {
  started: false,
  reset ({
    hash,
    port,
    staticDir,
    ssrConfig
  }) {
    const { app, router } = createApp(ssrConfig)
    this.app = app
    this.router = router
    this.hash = hash
    this.staticDir = staticDir

    if (this.started === false) {
      this.serveFavico()
      this.serveStatic()
      this.serveOthers()
    }

    if (!this.port) {
      const port = new Date().getFullYear()
      this.port = port
      server.listen(port)
      logger.info('Server listening on port: ', port)
    }
  },

  serveStatic () {
    server.use('/static', (...args) => {
      express.static(this.staticDir)(...args)
    })
  },

  serveFavico () {
    server.use('/favicon.ico', (_, res) => res.end(''))
  },

  serveOthers () {
    server.get('*', (req, res) => {
      const url = req.url
      const { app, router, hash } = this
      router.push(url)
      router.onReady(() => {
        if (!router.getMatchedComponents().length) {
          return res.status(404).end('<pre>Not found</pre>')
        }

        const stream = renderer.renderToStream(app)

        stream.once('data', _ => res.write(getResponseHead(app, hash)))
        stream.on('data', chunk => res.write(chunk))
        stream.on('end', _ => res.end(getResponseTail(app, hash)))
        stream.on('error', (error) => {
          console.log(error)
          res.status(500).end(`<pre>${error.stack}</pre>`)
        })
        res.set('Content-Type', 'text/html')
      })
    })
  }
}

function getResponseHead (app, hash) {
  const {
    title,
    htmlAttrs,
    bodyAttrs,
    link,
    style,
    script,
    noscript,
    meta
  } = app.$meta().inject()

  const arr = [title, link, style, script, noscript, meta]
  return `<!doctype html>
<html data-vue-meta-server-rendered ${htmlAttrs.text()}>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    ${arr.map(it => it.text()).join('')}
    <link rel="stylesheet" href="/static/style.${hash.style || 'xxx'}.css">
  </head>
  <body ${bodyAttrs.text()}>`
}

function getResponseTail (app, hash) {
  return `<script src="/static/vendor.${hash.vendor}.js"></script>
    <script src="/static/app.${hash.app}.js"></script>
  </body>
</html>`
}
