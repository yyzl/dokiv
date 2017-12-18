const { extname, basename } = require('path')
const rollup = require('rollup')
const { readFile } = require('fs-extra')
const LRU = require('lru-cache')
const revHash = require('rev-hash')

const vue = require('rollup-plugin-vue')
const json = require('rollup-plugin-json')
const buble = require('rollup-plugin-buble')
const replace = require('rollup-plugin-replace')
const commonjs = require('rollup-plugin-commonjs')
const nodeResolve = require('rollup-plugin-node-resolve')

const pascalCase = require('./util/pascalCase')
const lruCache = new LRU()

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

module.exports = function compilePlugin (file) {
  return readFile(file).then(content => {
    const hash = revHash(content)
    const cache = lruCache.get(hash)

    if (cache) {
      return cache
    }

    const name = pascalCase(basename(file, extname(file)))
    const inputOptions = {
      input: file,
      plugins: plugins
    }
    const outputOptions = {
      name,
      format: 'iife',
      sourcemap: false,
      strict: true
    }

    return rollup
      .rollup(inputOptions)
      .then(bundle => bundle.generate(outputOptions))
      .then(({ code }) => {
        const ret = { name, code }
        lruCache.set(hash, ret)
        return ret
      })
  })
}
