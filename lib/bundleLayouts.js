const globby = require('globby')
const { basename } = require('path')
const { readFile } = require('fs-extra')

const { pascalCase } = require('./util/case')
const compileVueWithoutStyle = require('./util/compileVueWithoutStyle')

module.exports = async function (globs) {
  let code = 'var Layout = {};'

  for (file of await globby(globs)) {
    code += await compileLayoutFile(file)
  }

  return code
}

async function compileLayoutFile (file) {
  const fileName = basename(file, '.vue')
  const compName = pascalCase(fileName)
  const content = await readFile(file, 'utf-8')
  const compiled = await compileVueWithoutStyle(content, compName)

  return `
Layout["${fileName}"] = (function () {
  var module = { exports: {} }; 
  ${compiled};
  return module.exports;
})();`
}
