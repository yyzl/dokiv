const md2vue = require('md2vue')
const Prepack = require('prepack')
const revHash = require('rev-hash')
const LRU = require('lru-cache')
const isEqual = require('lodash.isequal')

const prodEnv = require('./prodEnv')

const lrucCache = new LRU()

/**
 * compile markdown to precompiled vue component
 */
module.exports = function compileVue ({
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
      const code = `(function(){
  var ${componentName} = null;
  ${Prepack.prepack(raw).code};
  return ${componentName};
})()`
      lrucCache.set(hash, { meta, code, name: componentName })
      return code
    })
}
