const os = require('os')
const fs = require('fs-extra')
const revHash = require('rev-hash')
const { exec } = require('shelljs')
const chokidar = require('chokidar')
const { Observable } = require('rxjs')
const { join, relative } = require('path')
const findPrefix = require('find-npm-prefix')

const tempdir = join(os.tmpdir(), 'dokiv-css-temp')
exec('node_modules/.bin/postcss ./example/assets/css/main.css | cssnano')
// let postcss = null
// let npmPrefix = null

// module.exports = async function ({
//   input,
//   plugins = [],
//   minify = false,
//   sourcemap = true,
//   watch = false
// }) {
//   if (!postcss) {
//     npmPrefix = await findPrefix(process.cwd())
//     postcss = relative(npmPrefix, 'node_modules/.bin/postcss')
//   }

//   watch = watch ? '--watch' : ''
//   sourcemap = !sourcemap ? '--no-map' : ''
//   plugins = plugins.length ? plugins : ['postcss-import', 'postcss-cssnext']
//   plugins = `--use ${plugins.join(' ')}`

//   const hashName = revHash(input)
//   const tempfile = join(tempdir, hashName)

//   const compile = `${postcss} ${input} ${plugins} ${sourcemap} ${watch}`
//   const cssnano = `${postcss} --use cssnano ${sourcemap}`

//   if (!watch) {
//     const command = compile + (minify ? ` | ${cssnano}` : '')

//     return Observable.of(
//       exec(command, { silent: true }).toString()
//     )
//   }

//   await fs.ensureFile(tempfile)

//   const command = `${compile} -o ${tempfile}`
//   const watcher = chokidar.watch(tempfile)
//   const fn = obs => {
//     watcher.on('change', () => {
//       console.log(`[CSS change] ${input}`)
//       const code =
//       fs.readFileSync(tempfile)
//       obs.next(code.toString())
//     })

//     exec(command, { silent: true, async: true })
//   }

//   return Observable.create(fn).throttleTime(100)
// }
