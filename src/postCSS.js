const os = require('os')
const {
  join,
  resolve
} = require('path')

const {
  readFile,
  ensureFile
} = require('fs-extra')

const { exec } = require('shelljs')
const revHash = require('rev-hash')
const chokidar = require('chokidar')
const { Observable } = require('rxjs')
const debounce = require('lodash.debounce')

const tempdir = join(os.tmpdir(), 'dokiv-css-temp')

module.exports = function ({
  entry,
  plugins = [],
  minify = false,
  sourcemap = true,
  watch = false,
  npmPrefix
}) {
  const postcss = resolve(npmPrefix, 'node_modules/.bin/postcss')

  watch = watch ? '--watch' : ''
  sourcemap = !sourcemap ? '--no-map' : ''
  plugins = plugins.length ? plugins : ['postcss-import', 'postcss-cssnext']

  const compile = `${postcss} ${entry} --use ${plugins.join(' ')} ${sourcemap} ${watch}`
  const cssnano = `${postcss} --use cssnano ${sourcemap}`

  if (!watch) {
    const command = compile + (minify ? ` | ${cssnano}` : '')

    return Observable.of(
      exec(command, { silent: true }).toString()
    )
  }

  const hashName = revHash(entry)
  const tempfile = join(tempdir, hashName)
  const command = `${compile} -o ${tempfile}`
  const option = { silent: true, async: true }

  return Observable
    .fromPromise(
      ensureFile(tempfile)
        .then(() => chokidar.watch(tempfile))
    )
    .switchMap(watcher =>
      Observable.create(obs => {
        const fn = () => readFile(tempfile, 'utf-8')
          .then(css => obs.next(css))
        watcher.on('change', debounce(fn, 100))
        exec(command, option)
      })
    )
}
