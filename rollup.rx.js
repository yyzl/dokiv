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
 * json loader
 */
import json from 'rollup-plugin-json'

/**
 * buble instead of babel(with babel-preset-env),
 * the latter is much more powerful, while the former is simpler
 */
import buble from 'rollup-plugin-buble'

const deps = require('./package.json').dependencies
const external = Object.keys(deps).concat(['path', 'vm'])
export default {
  input: './rx/index.js',
  output: {
    name: "test",
    file: 'dist/rx.js',
    format: 'cjs',
    sourcemap: false,
    strict: true
  },
  external,
  plugins: [
    nodeResolve({
      jsnext: true,
      main: true,
      preferBuiltins: true
    }),
    commonjs(),
    json(),
    buble()
  ]
}
