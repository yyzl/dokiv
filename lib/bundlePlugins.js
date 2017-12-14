const globby = require('globby')
const rollup = require('rollup')
const { resolve } = require('path')
const { writeFile } = require('fs-extra')

const vue = require('rollup-plugin-vue')
const json = require('rollup-plugin-json')
const buble = require('rollup-plugin-buble')
const replace = require('rollup-plugin-replace')
const commonjs = require('rollup-plugin-commonjs')
const nodeResolve = require('rollup-plugin-node-resolve')

const postcss = require('postcss')
const cssnano = require('cssnano')
const autoprefixer = require('autoprefixer')
const cssImport = require('postcss-import')

const postCSSPlugins = [
  cssImport(),
  autoprefixer(),
  cssnano({})
]

// inspired by:
// https://github.com/egoist/rollup-plugin-postcss
const rollupPluginPostCSS = function (obj) {
  const transform = (code, id) => {
    if (!/\.css$/.test(id)) {
      return
    }

    const opts = {
      from: id,
      to: id,
      map: {
        inline: false,
        annotation: false
      }
    }

    code = code.replace(/\/\*[@#][\s\t]+sourceMappingURL=.*?\*\/$/gm, '')

    return postcss(postCSSPlugins)
      .process(code, opts)
      .then(({ css }) => {
        obj.code += css + '\n'
        return `export default {}`
      })
  }

  return { transform }
}

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

async function bundlePlugin ({ file, name }) {
  const concat = { code: '' }

  const inputOptions = {
    input: file,
    plugins: [rollupPluginPostCSS(concat), ...plugins]
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
    js: code,
    css: concat.code
  }
}

module.exports = async function (plugins) {
  let index = 0
  const files = await globby(plugins)
  const names = []
  const result = {
    styles: '',
    scripts: ''
  }

  for (let file of files) {
    const name = `plugin_${index++}`
    const { js, css } = await bundlePlugin({ file, name })

    result.styles += css
    result.scripts += js
    names.push(name)
  }

  result.scripts += `;var Plugins = [${names.join(', ')}];`

  return result
}
