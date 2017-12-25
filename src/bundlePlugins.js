const {
  extname, basename, join
} = require('path')
const os = require('os')
const rollup = require('rollup')
const { readFile } = require('fs-extra')
const LRU = require('lru-cache')
const revHash = require('rev-hash')
const chokidar = require('chokidar')
const { Observable } = require('rxjs')

const vue = require('rollup-plugin-vue')
const json = require('rollup-plugin-json')
const buble = require('rollup-plugin-buble')
const replace = require('rollup-plugin-replace')
const commonjs = require('rollup-plugin-commonjs')
const nodeResolve = require('rollup-plugin-node-resolve')

const logger = require('./util/logger')
const pascalCase = require('./util/pascalCase')
const pluginMemory = require('./util/rollupPluginMemory')
const tempdir = join(os.tmpdir(), 'dokiv-rollup-temp')

const plugins = [
  vue(),
  nodeResolve({
    jsnext: true,
    main: true,
    browser: true,
    extensions: ['.js', '.json']
  }),
  commonjs(),
  replace({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }),
  json(),
  buble()
]

const prettyPath = function (p) {
  return `${p}`.trim().replace(/\\/g, '/')
}

module.exports = function compilePlugin (files) {
  const tempfile = join(tempdir, 'plugins')
  const entryContent = files.map(file => {
    const name = pascalCase(basename(file, extname(file)))
    return `export { default as ${name} } from "${prettyPath(file)}";`
  }).join('\n')

  const outputOptions = {
    name: 'Plugins',
    format: 'iife',
    sourcemap: 'false',
    strict: true,
    file: tempfile
  }

  const inputOptions = {
    plugins: [
      pluginMemory({
        path: 'virtualPluginBundle.js',
        contents: entryContent
      }),
      ...plugins
    ],
    exports: 'named',

    output: [outputOptions],
    watch: { chokidar }
  }

  return Observable.create(obs => {
    const watcher = rollup.watch(inputOptions)

    watcher.on('event', function ({ code, error }) {
      if (error) {
        obs.error(error)
      }

      logger.info(`Plugin bundling: ${code}`)

      if (code === 'END') {
        readFile(tempfile, 'utf-8').then(result => {
          obs.next(result)
        })
      }
    })
  })
}
