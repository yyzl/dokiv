import md2vue from 'md2vue'
import { prepackSources } from 'prepack'
import revHash from 'rev-hash'
import LRU from 'lru-cache'
import isEqual from 'lodash.isequal'

import prodEnv from './prodEnv'

const lrucCache = new LRU()

/**
 * compile markdown to precompiled vue component
 */
export default function compileVue ({
  meta,
  markdown,
  highlight,
  componentName
}) {
  const hash = revHash(markdown)
  const cache = lrucCache.get(hash) || {}
  const hit = cache.code &&
    // meta 不变
    isEqual(cache.meta, meta) &&
    // route & layout 不变
    cache.name === componentName

  if (hit) {
    return Promise.resolve(cache.code)
  }

  let id = 0

  // FIXME
  const customMarkups = () => {
    return `<vue-demo-tools page="${componentName}" :index="${id++}"/>`
  }

  const documentInfo = {
    // eslint-disable-next-line
    metaInfo: new Function(`return ${JSON.stringify(meta)}`)
  }

  const conf = {
    target: 'js',
    highlight,
    documentInfo,
    componentName,
    customMarkups
  }

  return Promise.resolve(prodEnv.set())
    .then(() => md2vue(markdown, conf))
    .then((raw) => {
      prodEnv.restore()
      const sources = [{
        filePath: '',
        fileContents: raw,
        sourceMapContents: ''
      }]
      const code = `(function(){
  var ${componentName} = null;
  ${prepackSources(sources).code};
  return ${componentName};
})()`
      lrucCache.set(hash, { meta, code, name: componentName })
      return code
    })
}
