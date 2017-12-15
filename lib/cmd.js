const path = require('path')
const fs = require('fs-extra')
const yaml = require('js-yaml')
const globby = require('globby')
const revHash = require('rev-hash')
const request = require('request-promise')

const bundlePages = require('./bundlePages')
const bundlePlugins = require('./bundlePlugins')
const bundleLayouts = require('./bundleLayouts')
const startSsrServer = require('./startSsrServer')

const getDocsInfo = require('./util/getDocsInfo')

const cwd = process.cwd()
const spinner = require('ora')('Loading unicorns')
const configFile = path.resolve(cwd, './dokiv.yml')

if (fs.existsSync(configFile) === false) {
  spinner.warn('dokiv.yml not found under current working directory!')
  process.exit()
}

const config = yaml.safeLoad(fs.readFileSync(configFile, 'utf8'))
const outputDirectory = path.resolve(cwd, config.output)
const staticDirectory =  path.resolve(cwd, config.staticDirectory)
const staticDest = path.join(outputDirectory, 'static')

;(async function () {
  try {
    await build(config)
  } catch (e) {
    console.log(e)
  } finally {
    process.exit()
  }
}())

async function build ({
  layout = './layout',
  plugins = './plugins',
  docs = []
}) {
  spinner.start('Building task starts...')

  await fs.emptyDir(outputDirectory)
  await fs.ensureDir(staticDest)
  await fs.copy(staticDirectory, staticDest)

  const vendor = await fs.readFile(
    path.resolve(__dirname, '../dist/bundle.js')
  )
  const vendorHash = revHash(vendor)
  await fs.writeFile(`${staticDest}/vendor.${vendorHash}.js`, vendor)

  const hash = {
    vendor: vendorHash,
    style: null,
    app: null
  }

  /**
   * compile & bundle plugins
   */
  const { styles, scripts } = await bundlePlugins(plugins)

  hash.style = revHash(styles)
  await fs.writeFile(`${staticDest}/style.${hash.style}.css`, styles)

  /**
   * collect routes and urls from .md files
   */
  const navInfo = await getDocsInfo(docs)

  /**
   * bundle pages for both client rendering and SSR
   */
  const { clientCode, ssrCode } = bundlePages({
    routerMode: config.mode,
    routers: navInfo.routers,
    code: [
      scripts,
      await bundleLayouts(layout)
    ]
  })

  hash.app = revHash(clientCode)
  await fs.writeFile(`${staticDest}/app.${hash.app}.js`, clientCode)

  if (config.mode !== 'history') {
    await fs.writeFile(`${outputDirectory}/index.html`, getSPA(hash))
    return spinner.succeed('Building task completed!')
  }

  spinner.start('Launching ssr server...')

  const ssrConfigFile = `${outputDirectory}/ssr.js`

  await fs.writeFile(ssrConfigFile, ssrCode)

  await startSsrServer({
    ssrConfig: require(ssrConfigFile),
    static: staticDest,
    hash
  })

  for (let url of navInfo.urls) {
    const resp = await request(`http://127.0.0.1:1126${url}`)
    const dest = path.join(outputDirectory, `${url}/index.html`)
    await fs.createFile(dest)
    await fs.writeFile(dest, resp)
  }

  await fs.remove(ssrConfigFile)

  spinner.succeed('SSR rendering completed!')
  spinner.succeed(`Documents can be found here: ${outputDirectory}`)
}

/**
 * spa HTML
 */
function getSPA (hash) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title></title>
  <link rel="stylesheet" href="/static/style.${hash.style}.css">
</head>
<body>
  <div id="app">Loading...</div>
  <script src="/static/vendor.${hash.vendor}.js"></script>
  <script src="/static/app.${hash.app}.js"></script>
</body>
</html>`
}