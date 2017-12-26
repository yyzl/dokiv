import { basename } from 'path'
import { readFile } from 'fs-extra'
import LRU from 'lru-cache'
import revHash from 'rev-hash'
import pascalCase from './util/pascalCase'
import compileVueWithoutStyle from './util/compileVueWithoutStyle'
const lruCache = new LRU()

export default function compileLayoutFile (file, content) {
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
