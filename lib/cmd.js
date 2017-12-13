const path = require('path')
const http = require('http')
const fs = require('fs-extra')
const globby = require('globby')
const yaml = require('js-yaml')
const request = require('request-promise')
const revHash = require('rev-hash')

const rollup = require('./rollup')
const bundle = require('./bundle')
const compileVue = require('./md2vue')
const compileLayout = require('./layout')
const getMetadata = require('./metadata')
const createSsrServer = require('./server')

const cwd = process.cwd()
const spinner = require('ora')('Loading unicorns')
const configFile = path.resolve(cwd, './vmdoc.yml')

if (fs.existsSync(configFile) === false) {
  spinner.warn('dokiv.yml not found under current working directory!')
  process.exit()
}

const config = yaml.safeLoad(fs.readFileSync(configFile, 'utf8'))
const outputDirectory = path.resolve(cwd, config.output)
const staticDirectory =  path.resolve(cwd, config.static)
const routerMode = config.mode

buildFromGlobs(config)
  .catch(e => {
    console.log(e)
  })
  .then(() => {
    process.exit()  
  })

async function buildFromGlobs ({
  layout = './layout',
  plugins = './plugins',
  docs = []
}) {
  spinner.start('Building task starts...')

  const { urls, routers } = await getNavInfo(docs)

  // layouts
  let layoutSource = 'var Layout = {};'
  for (file of await globby(layout)) {
    layoutSource += await compileLayout(file)
    layoutSource += ';'
  }

  // plugins
  let pluginFiles = await globby(plugins)
  let pluginSource = ''
  for (let i = 0; i < pluginFiles.length; i++) {
    pluginSource += await rollup({
      file: pluginFiles[i],
      name: `plugin_${i}`
    })
  }
  pluginSource += `var Plugins = [${pluginFiles.map((_, i) => `plugin_${i}`)}];`

  const {
    clientSource,
    serverSource
  } = bundle({
    routers,
    routerMode,
    layoutSource,
    pluginSource
  })

  await fs.emptyDir(outputDirectory)
  await fs.ensureDir(path.join(outputDirectory, 'static'))
  await fs.copy(staticDirectory, path.join(outputDirectory, 'static'))

  const vendorSource = await fs.readFile(abs('../dist/bundle.js'))
  const vendorHash = revHash(vendorSource)
  await fs.writeFile(`${outputDirectory}/static/vendor.${vendorHash}.js`, vendorSource)

  const appHash = revHash(clientSource)
  await fs.writeFile(`${outputDirectory}/static/app.${appHash}.js`, clientSource)


  if (routerMode !== 'history') {
    const html = appShell({
      app: appHash,
      vendor: vendorHash
    })

    await fs.writeFile(`${outputDirectory}/index.html`, html)
    return spinner.succeed('Building task completed!')
  }

  spinner.start('Launching ssr server...')

  await fs.writeFile(`${outputDirectory}/ssr.js`, serverSource)
  createSsrServer({
    ssrConfig: require(path.join(outputDirectory, 'ssr.js')),
    staticDirectory: outputDirectory,
    hash: {
      app: appHash,
      vendor: vendorHash
    }
  })

  for (let url of urls) {
    spinner.info(`Start server-rendering ${url}`)
    const resp = await request(`http://127.0.0.1:1126${url}`)
    const dest = path.join(outputDirectory, `${url}/index.html`)
    await fs.createFile(dest)
    await fs.writeFile(dest, resp)
    spinner.succeed(`Done server-rendering ${url}`)
  }

  // await fs.remove(`${outputDirectory}/ssr.js`)
  spinner.succeed('SSR rendering completed!')
  spinner.succeed(`Documents can be found here: ${outputDirectory}`)
}


/**
 *  get router info and urls
 */
async function getNavInfo (glob) {
  const pages = await extractDocumentInfo(glob)
  const routers = []
  const urls = []

  for (let page of pages) {
    const {
      component,
      layout,
      fullPath,
      isMain
    } = page

    if (isMain) {
      urls.unshift('/')
      routers.unshift(`{
        path: "/",
        component: (${component}),
        meta: { layout: "${layout}" }
      }`)
    } else {
      urls.push(fullPath)
      routers.push(`{
        path: "${fullPath}",
        component: (${component}),
        meta: { layout: "${layout}" }
      }`)
    }
  }

  routers.push(`{ path: "*", redirect: "/" }`)
  return { urls, routers }
}

/**
 * extract metadata from files
 */
async function extractDocumentInfo (glob) {
  const pages = []

  for (file of await globby(glob)) {
    const metadata = await getMetadata(file)
    const {
      title,
      category,
      markdown,
      componentName
    } = metadata

    metadata.component = await compileVue({
      markdown,
      componentName,
      title
    })

    pages.push(metadata)
  }

  return pages
}

/**
 * absolute path to this file
 */
function abs (arg) {
  return path.resolve(__dirname, arg)
}

function appShell (hash) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title></title>
</head>
<body>
  <div id="app">Loading...</div>
  <script src="/static/vendor.${hash.vendor}.js"></script>
  <script src="/static/app.${hash.app}.js"></script>
</body>
</html>`
}