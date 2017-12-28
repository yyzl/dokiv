import os from 'os'
import { extname, basename, join } from 'path'
import { Observable } from 'rxjs'
import { readFile } from 'fs-extra'
import clairBundle from 'clair-bundle'

import logger from './util/logger'
import pascalCase from './util/pascalCase'

const tempdir = join(os.tmpdir(), 'dokiv-rollup-temp')
const prettyPath = function (p) {
  return `${p}`.trim().replace(/\\/g, '/')
}

export default function compilePlugin (files) {
  const tempfile = join(tempdir, 'plugins')
  const entryContent = files.map(file => {
    const name = pascalCase(basename(file, extname(file)))
    return `export { default as ${name} } from "${prettyPath(file)}";`
  }).join('\n')

  const option = {
    input: {
      path: 'virtualPluginBundle.js',
      contents: entryContent
    },
    output: {
      name: 'Plugins',
      format: 'iife',
      sourcemap: false,
      strict: true,
      file: tempfile
    }
  }

  return Observable.create(obs => {
    clairBundle({ options: [option] }, true)
      .then(([watcher]) => {
        watcher.on('event', function ({ code, error }) {
          if (error) {
            obs.error(error)
          }

          logger.info(`Plugin bundling: ${code}`)

          if (code === 'END') {
            readFile(tempfile, 'utf-8').then(result => {
              obs.next(result)
            })
          }
        })
      })
  })
}
