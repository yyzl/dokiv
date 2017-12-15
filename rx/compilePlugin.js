const { resolve, extname, basename } = require('path')

const rollup = require('rollup')
const chokidar = require('chokidar')
const { Observable } = require('rxjs')
const { writeFile } = require('fs-extra')

const vue = require('rollup-plugin-vue')
const json = require('rollup-plugin-json')
const buble = require('rollup-plugin-buble')
const replace = require('rollup-plugin-replace')
const commonjs = require('rollup-plugin-commonjs')
const nodeResolve = require('rollup-plugin-node-resolve')

const pascalCase = require('./util/pascalCase')

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
  buble()
]

module.exports = async function compilePlugin (file) {
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

  const bundle = await rollup.rollup(inputOptions)
  const { code } = await bundle.generate(outputOptions)

  return {
    name,
    code: code
  }
}
