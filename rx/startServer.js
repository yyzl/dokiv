const path = require('path')
const fs = require('fs-extra')
const express = require('express')
const serverRenderer = require('vue-server-renderer')
const createApp = require('../dist/ssr')

const server = express()
const renderer = serverRenderer.createRenderer({ template: '<!--vue-ssr-outlet-->'})

module.exports = async function ({
  hash,
  port,
  staticDir,
  ssrConfig
}) {
  server.use('/static', express.static(staticDir))
  server.use('/favicon.ico', (_, res) => res.end())

  server.get('*',  async ({ url }, res) => {
    ssrConfig.el = "#app"
    ssrConfig.data.url = url

    const { app, router } = createApp(ssrConfig)
    const onRouterReady = () => {
      const matchedComponents = router.getMatchedComponents()

      if (matchedComponents.length === 0) {
        res.status(404).end('<pre>Not found</pre>')
      } else {
        const respHead = getResponseHead(app, hash)
        const respTail = getResponseTail(app, hash)
        const stream = renderer.renderToStream(app)

        stream.once('data', _ => res.write(respHead))
        stream.on('data', chunk => res.write(chunk))
        stream.on('end', _ => res.end(respTail))

        stream.on('error', (error) => {
          console.log(error)
          res.status(500).end(`<pre>${error.stack}</pre>`)
        })
      }
    }

    res.set('Content-Type', 'text/html')
    router.push(url)
    router.onReady(onRouterReady)
  })

  server.listen(port)
  console.log('Server listening on port: ', port)
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
    <link rel="stylesheet" href="/static/style.${hash.style}.css">
  </head>
  <body ${bodyAttrs.text()}>`
}

function getResponseTail (app, hash) {
  return `<script src="/static/vendor.${hash.vendor}.js"></script>
    <script src="/static/app.${hash.app}.js"></script>
  </body>
</html>`
}
