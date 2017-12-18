const { basename } = require('path')
const { readFile } = require('fs-extra')
const LRU = require("lru-cache")
const revHash = require('rev-hash')
const pascalCase = require('./util/pascalCase')
const compileVueWithoutStyle = require('./util/compileVueWithoutStyle')
const lruCache = new LRU()

module.exports = function compileLayoutFile (file, content) {
  const fileName = basename(file, '.vue')

  return readFile(file, 'utf-8')
    .then(content => {
      const hash = revHash(content)
      const cache = lruCache.get(hash)
      if (cache) {
        return cache
      }
      return compileVueWithoutStyle(content, pascalCase(fileName))
        .then(compiled => {
          const ret = `
"${fileName}": (function () {
  var module = { exports: {} }; 
  ${compiled};
  return module.exports;
}())`
          lruCache.set(hash, ret)
          return ret
        })
    })
}
