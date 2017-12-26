const { rollup } = require('rollup')
const { ensureFileSync } = require('fs-extra')

const vue = require('rollup-plugin-vue')
const json = require('rollup-plugin-json')
const buble = require('rollup-plugin-buble')
const replace = require('rollup-plugin-replace')
const globImport = require('rollup-plugin-glob')
const postCSS = require('rollup-plugin-postcss')
const commonjs = require('rollup-plugin-commonjs')
const nodeResolve = require('rollup-plugin-node-resolve')

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

const cssNoop = {
  transform (code, id) {
    if (/\.css$/.test(id)) {
      return 'export default {}'
    }
  }
}

module.exports = function ({ input, name, output, postcss }) {
  let cssPlugin = null

  if (postcss) {
    const { extract, minify, sourcemap } = postcss
    const plugins = postcss.plugins.reduce((acc, item) => {
      if (typeof item === 'string') {
        acc.push(require(item)())
      } else {
        Object.keys(item).forEach(key => {
          acc.push(require(key)(item[key]))
        })
      }
      return acc
    }, [])

    if (minify) {
      plugins.push(require('cssnano')())
    }

    cssPlugin = postCSS({
      extract,
      plugins,
      sourceMap: sourcemap
    })
  }

  const inputOptions = {
    input,
    plugins: [
      globImport(),
      cssPlugin || cssNoop,
      ...plugins
    ]
  }

  return rollup(config).then(bundle => Promise.all(
    output.map(({ file, format }) => bundle.write({ name, file, format }))
  ))
}
