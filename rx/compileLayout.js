const globby = require('globby')
const { basename } = require('path')
const { readFile } = require('fs-extra')

const pascalCase = require('./util/pascalCase')
const compileVueWithoutStyle = require('./util/compileVueWithoutStyle')

module.exports = async function compileLayoutFile (file, content) {
  const fileName = basename(file, '.vue')

  const compiled = await compileVueWithoutStyle(
    content || await readFile(file, 'utf-8'),
    pascalCase(fileName)
  )
  return `
"${fileName}": (function () {
  var module = { exports: {} }; 
  ${compiled};
  return module.exports;
}())`
}
