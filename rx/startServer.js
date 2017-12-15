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
  const { app, router } = createApp(ssrConfig)

  server.use('/static', express.static(staticDir))
  server.use('/favicon.ico', (_, res) => res.end())

  server.get('*', async ({ url }, res) => {
    router.push(url)
    await new Promise(resolve => router.onReady(() => resolve()))

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
