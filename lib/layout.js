const path = require('path')
const fs = require('fs-extra')
const vueCompiler = require('./vueCompiler')
const { pascalCase } = require('./util')

module.exports = async function (file) {
  const name = path.basename(file, '.vue')
  const componentName = pascalCase(name)

  const content = await fs.readFile(file, 'utf-8')
  const compiled = await vueCompiler.compilePromise(content, componentName)

  return `
Layout["${name}"] = (function () {
  var module = { exports: {} }; 
  ${compiled};
return module.exports;})()`
}
