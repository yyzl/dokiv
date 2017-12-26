import os from 'os'
import {
  join,
  resolve
} from 'path'

import {
  readFile,
  ensureFile
} from 'fs-extra'

import { exec } from 'shelljs'
import revHash from 'rev-hash'
import chokidar from 'chokidar'
import { Observable } from 'rxjs'
import debounce from 'lodash.debounce'

const tempdir = join(os.tmpdir(), 'dokiv-css-temp')

export default function ({
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
  // we need error messages
  const option = { silent: false, async: true }

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
