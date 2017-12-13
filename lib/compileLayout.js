const buble = require('buble')
const { compiler } = require('vueify')
const { parseComponent } = require('vue-template-compiler')

compiler.applyConfig({
  extractCSS: true,
  customCompilers: {
    buble (content, cb) {
      const { code } = buble.transform(content)
      const ret = code
        .replace(/\n{2,}/g, '\n')
        .replace(/^\s+/, '  ')
        .replace(/\s+$/, '')

      cb(null, ret)
    }
  }
})

const compileLayout = (content = '', filePath = '') => {
  let { template, script } = parseComponent(content)
  const isPug = ['jade', 'pug'].includes(template.attrs.lang)
  script = !script ? 'module.exports = {}' : script.content
  script = script.replace(/export default/ ,'module.exports =')

  const sfc = `<template lang="${isPug ? 'pug' : 'html'}">${template.content}</template>
<script lang="buble">${script}</script>`
  return new Promise((resolve, reject) => {
    compiler.compile(sfc, filePath, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

module.exports = compileLayout
