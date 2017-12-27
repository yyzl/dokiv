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
const builtins = require('builtin-modules/builtin-modules.json')
const external = Object.keys(deps).concat(builtins)

export default {
  input: 'src/index.js',
  output: {
    name: 'dokiv',
    file: 'dist/dokiv.js',
    format: 'cjs',
    sourcemap: false,
    strict: true
  },
  external,
  plugins: [
    nodeResolve({
      jsnext: true,
      main: true,
      extensions: [ '.js', '.json' ],
      preferBuiltins: true
    }),
    json(),
    buble({
      objectAssign: 'Object.assign'
    })
  ]
}
