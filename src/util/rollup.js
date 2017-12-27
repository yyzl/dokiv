import { resolve } from 'path'
import { rollup } from 'rollup'

import vue from 'rollup-plugin-vue'
import json from 'rollup-plugin-json'
import buble from 'rollup-plugin-buble'
import alias from 'rollup-plugin-alias'
import svgVue from 'rollup-plugin-svg-vue'
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
  buble({
    objectAssign: 'Object.assign'
  })
]

const cssNoop = {
  transform (code, id) {
    if (/\.css$/.test(id)) {
      return 'export default {}'
    }
  }
}

export default function ({ input, output, uglify, postcss }) {
  input = resolve(process.env.NPM_PREFIX, input)

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

  const inputOption = {
    input,
    plugins: [
      svgVue(),
      globImport(),
      alias({
        vue: resolve(
          process.env.NPM_PREFIX,
          'node_modules/vue/dist/vue.esm.js'
        )
      }),
      cssPlugin || cssNoop,
      ...plugins,
      uglify ? uglifyJS() : {}
    ]
  }

  output = [].concat(output)

  return rollup(inputOption).then(bundle => Promise.all(
    output.map(option => {
      const { externals, file } = option
      const type = file ? 'write' : 'generate'

      if (!externals) {
        return bundle[type](option)
      }

      const rules = externals.map(rule => {
        if (rule.indexOf('*') > -1) {
          return RegExp(rule)
        }
        return rule
      })

      return rollup({
        external (id) {
          return rules.some(rule => {
            if (rule.test) {
              return rule.test(id)
            }

            return rule === id
          })
        },
        ...inputOption
      })
        .then(bundle => bundle[type](option))
    })
  ))
}
