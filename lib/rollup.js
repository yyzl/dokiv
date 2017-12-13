const globby = require('globby')
const rollup = require('rollup')
const { resolve } = require('path')

const vue = require('rollup-plugin-vue')
const json = require('rollup-plugin-json')
const buble = require('rollup-plugin-buble')
const replace = require('rollup-plugin-replace')
const commonjs = require('rollup-plugin-commonjs')
const nodeResolve = require('rollup-plugin-node-resolve')

const cssnano = require('cssnano')
const autoprefixer = require('autoprefixer')
const cssImport = require('postcss-import')
const postCSS = require('rollup-plugin-postcss')

module.exports = async function ({ file, name }) {
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
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    json(),
    postCSS({
      plugins: [
        cssImport(),
        autoprefixer(),
        cssnano({})
      ]
    }),
    buble()
  ]

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

  const bundle = await rollup.rollup(inputOptions)
  const { code } = await bundle.generate(outputOptions)
  return code
}
