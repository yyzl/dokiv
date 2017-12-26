import { resolve } from 'path'
import { rollup } from 'rollup'
import { ensureFileSync } from 'fs-extra'

import vue from 'rollup-plugin-vue'
import json from 'rollup-plugin-json'
import buble from 'rollup-plugin-buble'
import alias from 'rollup-plugin-alias'
import uglifyJS from 'rollup-plugin-uglify'
import replace from 'rollup-plugin-replace'
import globImport from 'rollup-plugin-glob'
import postCSS from 'rollup-plugin-postcss'
import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'

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

export default function ({ input, name, output, uglify, postcss }) {
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

  const vue = resolve(process.env.NPM_PREFIX, 'node_modules/vue/dist/vue.esm.js')
  const inputOptions = {
    input,
    plugins: [
      globImport(),
      alias({ vue }),
      cssPlugin || cssNoop,
      ...plugins,
      uglify ? uglifyJS() : {}
    ]
  }

  output = [].concat(output)

  return rollup(inputOptions).then(bundle => Promise.all(
    output.map(item => {
      item.name = name
      return item.file ? bundle.write(item) : bundle.generate(item)
    })
  ))
}
