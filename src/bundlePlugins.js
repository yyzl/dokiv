import {
  extname, basename, join, resolve
} from 'path'
import os from 'os'
import rollup from 'rollup'
import { readFile } from 'fs-extra'
import chokidar from 'chokidar'
import { Observable } from 'rxjs'

import vue from 'rollup-plugin-vue'
import json from 'rollup-plugin-json'
import buble from 'rollup-plugin-buble'
import alias from 'rollup-plugin-alias'
import svgVue from 'rollup-plugin-svg-vue'
import replace from 'rollup-plugin-replace'
import globImport from 'rollup-plugin-glob'
import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'

import logger from './util/logger'
import pascalCase from './util/pascalCase'
import pluginMemory from './util/rollupPluginMemory'

const tempdir = join(os.tmpdir(), 'dokiv-rollup-temp')

const prettyPath = function (p) {
  return `${p}`.trim().replace(/\\/g, '/')
}

const cssNoop = function () {
  return {
    transform (code, id) {
      if (/\.css$/.test(id)) {
        // logger.info(`Skipped CSS import: ${id}`)
        return 'export default {}'
      }
    }
  }
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
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }),
  json(),
  buble()
]

export default function compilePlugin (files) {
  const tempfile = join(tempdir, 'plugins')
  const entryContent = files.map(file => {
    const name = pascalCase(basename(file, extname(file)))
    return `export { default as ${name} } from "${prettyPath(file)}";`
  }).join('\n')

  const outputOptions = {
    name: 'Plugins',
    format: 'iife',
    sourcemap: false,
    strict: true,
    file: tempfile
  }

  const vue = resolve(process.env.NPM_PREFIX, 'node_modules/vue/dist/vue.esm.js')
  const inputOptions = {
    plugins: [
      pluginMemory({
        path: 'virtualPluginBundle.js',
        contents: entryContent
      }),
      svgVue(),
      alias({ vue }),
      globImport(),
      cssNoop(),
      ...plugins
    ],
    exports: 'named',
    output: [outputOptions],
    watch: {
      chokidar,
      exclude: [
        'node_modules/**',
        '**/*.css'
      ]
    }
  }

  return Observable.create(obs => {
    const watcher = rollup.watch(inputOptions)

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
}
