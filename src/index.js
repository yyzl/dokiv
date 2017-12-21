const { resolve } = require('path')
const {
  readFileSync, existsSync
} = require('fs-extra')

const Promise = require('bluebird')
global.Promise = Promise

const jsYaml = require('js-yaml')
const { exec } = require('shelljs')
const { Observable } = require('rxjs')
const exitHook = require('async-exit-hook')
const logger = require('./util/logger')
const bootstrap = require('./bootstrap')

const npmPrefix = prettyPath(
  exec('npm prefix', { silent: true })
)
process.env.NPM_PREFIX = npmPrefix

module.exports = function (config, watch) {
  // yaml file
  if (typeof config === 'string') {
    if (existsSync(config)) {
      const content = readFileSync(config, 'utf-8')
      config = jsYaml.safeLoad(content)
      config.isProd = Boolean(watch)
    } else {
      console.error(`dokiv.yml not found.`)
      process.exit()
    }
  } else if (!config || typeof config !== 'object') {
    logger.error(`Invalid configuration.`)
    process.exit()
  }

  process.env.DOKIV_ENV = config.isProd
    ? 'development'
    : 'production'
  processConfig(config)
  bootstrap(Observable.of(config))
}

// Error handling
process.on('unhandledRejection', (reason, p) => {
  logger.error(`${reason}`)
  console.log(p)
  process.exit()
})

process.on('uncaughtException', (err) => {
  logger.error(err)
  console.log(err)
  process.exit()
})

exitHook.uncaughtExceptionHandler(err => {
  logger.error(`Exit on uncaught exception: ${err}`)
})

exitHook.unhandledRejectionHandler(err => {
  logger.error(`Exit on uncaught rejection: ${err}`)
})

function processConfig (configuration) {
  const {
    output,
    postcss,
    rootDir,
    documents
  } = configuration

  configuration.globs = {
    layouts: resolve(npmPrefix, rootDir, 'layouts/*.vue'),
    plugins: resolve(npmPrefix, rootDir, 'plugins/*.js'),
    documents: [].concat(documents).map(f => resolve(npmPrefix, f))
  }

  // postcss
  postcss.entry = resolve(npmPrefix, postcss.entry)
  postcss.watch = process.env.DOKIV_ENV !== 'production'

  // file system
  configuration.output = resolve(npmPrefix, output)
  configuration.staticSource = resolve(npmPrefix, rootDir, 'static')
  configuration.staticOutput = resolve(npmPrefix, output, 'static')

  return configuration
}

function prettyPath (p) {
  return `${p}`.trim().replace(/\\/g, '/')
}
