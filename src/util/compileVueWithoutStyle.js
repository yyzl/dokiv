import clairBundle from 'clair-bundle'
import { compiler } from 'vueify'
import { parseComponent } from 'vue-template-compiler'

import prodEnv from './prodEnv'

compiler.applyConfig({
  extractCSS: true,
  customCompilers: {
    clairbundle (content, cb) {
	  const option = {
	    input: {
		  path: 'virtual.js',
		  contents: content
		},
        output: {
		  format: 'cjs',
		  sourcemap: false
		}
	  }
	  clairBundle({ options: [option] }).then(([result]) => {
	    const [{ code }] = result
	    cb(null, code)
	  })
    }
  }
})

export default (content = '', filePath = '') => {
  let { template, script } = parseComponent(content)
  const isPug = ['jade', 'pug'].includes(template.attrs.lang)
  script = !script ? 'module.exports = {}' : script.content
  script = script.replace(/export default/, 'module.exports =')

  const sfc = `<template lang="${isPug ? 'pug' : 'html'}">${template.content}</template>
<script lang="clairbundle">${script}</script>`

  return new Promise((resolve, reject) => {
    prodEnv.set()
    compiler.compile(sfc, filePath, (err, result) => {
      prodEnv.restore()
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}
