import { resolve } from 'path'

/**
 * Convert CommonJS modules to ES6,
 * so they can be includedin a Rollup bundle
 * SEE https://github.com/rollup/rollup-plugin-commonjs
 */
import commonjs from 'rollup-plugin-commonjs'

/**
 * Locate modules using the Node resolution algorithm,
 * for using third party modules in node_modules
 * SEE https://github.com/rollup/rollup-plugin-node-resolve
 */
import nodeResolve from 'rollup-plugin-node-resolve'

/**
 * replace loader
 */
import replace from 'rollup-plugin-replace'

/**
 * json loader
 */
import json from 'rollup-plugin-json'

/**
 * buble instead of babel(with babel-preset-env),
 * the latter is much more powerful, while the former is simpler
 */
import buble from 'rollup-plugin-buble'

/**
 * alias
 */
import alias from 'rollup-plugin-alias'

const ssr = {
  input: 'lib/render.js',
  output: {
    name: 'createApp',
    file: 'dist/ssr.js',
    format: 'cjs',
    sourcemap: 'inline',
    strict: true
  },
  external: Object.keys(require('../package.json').dependencies),
  plugins: [
    alias({
      'vue': resolve('node_modules/vue/dist/vue.esm.js')
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    nodeResolve({
      jsnext: true,
      main: true,
      browser: true,
      extensions: ['.js', '.json']
    }),
    commonjs(),
    json(),
    buble()
  ]
}

/**
 * Rollup: https://rollupjs.org/
 */
export default ssr
