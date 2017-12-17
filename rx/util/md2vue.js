const md2vue = require('md2vue')
const Prepack = require('prepack')
const revHash = require('rev-hash')
const LRU = require('lru-cache')

const prodEnv = require('./prodEnv')

const lrucCache = new LRU()

/**
 * compile markdown to precompiled vue component
 */
module.exports = function compileVue ({
  title,
  markdown,
  componentName
}) {
  const hash = revHash(markdown)
  const cache = lrucCache.get(hash) || {}
  const hit = cache.code &&
    (cache.title === title &&
      cache.name === componentName)

  if (hit) {
    return Promise.resolve(cache.code)
  }

  let id = 0
  // FIXME
  const customMarkups = () => {
    const uid = `${componentName}-${id++}`
    return `
<input id="${uid}" type="checkbox" tabindex="-1" aria-hidden="true"/>
<label for="${uid}" aria-hidden="true"></label>
<div class="vue-demo-tools">
  <div>
    <a @click="$code.open($event)" title="在 Codepen 中打开"><c-icon type="feather" name="codepen" class="vue-demo-tools__icon"/></a>
    <a @click="$code.copy($event)" title="复制代码"><c-icon type="feather" name="copy" class="vue-demo-tools__icon"/></a>
  </div>
</div>`
  }

  const documentInfo = {
    // eslint-disable-next-line
    metaInfo: new Function(`return { title: "${title}" }`)
  }

  const conf = {
    target: 'js',
    highlight: 'highlight.js',
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
      lrucCache.set(hash, { title, code, name: componentName })
      return code
    })
}
