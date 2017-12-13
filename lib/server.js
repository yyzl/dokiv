const path = require('path')
const fs = require('fs-extra')
const express = require('express')
const serverRenderer = require('vue-server-renderer')
const createApp = require('../dist/ssr')

const server = express()
const renderer = serverRenderer.createRenderer({ template: '<!--vue-ssr-outlet-->'})

module.exports = function ({
  ssrConfig,
  staticDirectory,
  hash
}) {
  const entryServer = context => {
    const url = context.url

    ssrConfig.data.url = url
    ssrConfig.el = "#app"

    return new Promise((resolve, reject) => {
      const { app, router } = createApp(ssrConfig)
      const meta = app.$meta()
      context.meta = meta

      router.push(url)
      router.onReady(() => {
        const matchedComponents = router.getMatchedComponents()

        if (!matchedComponents.length) {
          return reject({ code: 404 })
        }

        resolve(app)
      }, reject)
    })
  }

  server.use('/assets', express.static(path.join(staticDirectory, 'assets')))

  server.get('*',  async (req, res) => {
    if (req.path === '/favicon.ico') {
      return res.end()
    }

    const context = { url: req.url }
    const app = await entryServer(context)
    const renderStream = renderer.renderToStream(app)

    res.writeHead(200, {
      'Content-Type': 'text/html'
    })

    renderStream.once('data', () => {
      const {
        title, htmlAttrs, bodyAttrs, link, style, script, noscript, meta
      } = context.meta.inject()

      const arr = [title, link, style, script, noscript, meta]
      const content = `<!doctype html>
<html data-vue-meta-server-rendered ${htmlAttrs.text()}>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    ${arr.map(it => it.text()).join('')}
  </head>
  <body ${bodyAttrs.text()}>`
      res.write(content)
    })

    renderStream.on('data', chunk => res.write(chunk))

    renderStream.on('end', async () => {
      const content = `
    <script src="/static/vendor.${hash.vendor}.js"></script>
    <script src="/static/app.${hash.app}.js"></script>
  </body>
</html>`

      res.end(content)
    })

    renderStream.on('error', (error) => {
      console.log(error)
      res.status(500).end(`<pre>${error.stack}</pre>`)
    })
  })

  server.listen(1126)
}
