import Vue from 'vue'
import VueMeta from 'vue-meta'
import VueRouter from 'vue-router'
import objectAssign from 'object-assign'

Vue.use(VueMeta)
Vue.use(VueRouter)
Object.assign = objectAssign

const jsonpCache = {}
createApp.jsonp = function (id) {
  if (jsonpCache[id]) {
    return Promise.resolve(jsonpCache[id])
  }

  // client
  if (typeof window !== 'undefined') {
    window.__jsonpResolve = (id, module) => (jsonpCache[id] = module)
    return jsonpClient(`/static/page.${id}.js`).then(() => {
      return jsonpCache[id]
    })
  }
  return Promise.resolve(null)
}

export default function createApp ({
  routes,
  mode = 'hash',

  el,
  data = {},
  render,
  staticRenderFns,

  layouts,
  plugins
}) {
  const routerConfig = {
    mode,
    routes,
    scrollBehavior: () => ({ x: 0, y: 0 })
  }
  const router = new VueRouter(routerConfig)

  Object.keys(layouts).forEach(key => {
    Vue.component(`layout-${key}`, layouts[key])
  })

  Object.keys(plugins).forEach(key => {
    const plugin = plugins[key]
    if (plugin) {
      if (typeof plugin.install === 'function') {
        Vue.use(plugin)
      }

      if (typeof plugin.routing === 'function') {
        plugin.routing(router)
      }
    }
  })

  if (!Vue.component('vue-demo-tools')) {
    Vue.component('vue-demo-tools', {
      render (h) {
        return h('div', { className: 'vue-demo-tools' })
      }
    })
  }

  const app = new Vue({
    router,
    data: data,
    render,
    staticRenderFns
  })

  router.onReady(() => {
    app.$mount('#app')
  })

  registerSSE()

  return { app, router }
}

if (typeof window !== 'undefined' && window.window === window) {
  window.Vue = Vue
}

function registerSSE () {
  if (process.env.NODE_ENV === 'development') {
    if (typeof window !== 'undefined' && window.EventSource) {
      const source = new window.EventSource('/__sse__')
      source.addEventListener('message', function (event) {
        const { type } = JSON.parse(event.data)

        if (type === 'reload') {
          window.location.reload()
        }
      })
      source.addEventListener('error', function (event) {
        source.close()
      })
    }
  }
}

function jsonpClient (url) {
  if (typeof window === 'undefined') {
    return
  }

  const script = document.createElement('script')
  let done = false
  script.src = url
  script.async = true

  const deferred = defer()

  script.onload = script.onreadystatechange = function () {
    if (done) {
      return
    }
    const state = this.readyState

    if (!state || (state === 'loaded' || state === 'complete')) {
      done = true
      script.onload = script.onreadystatechange = null
      if (script && script.parentNode) {
        script.parentNode.removeChild(script)
      }
      deferred.resolve()
    }
  }
  const head = document.getElementsByTagName('head')[0]
  head.appendChild(script)

  return deferred.promise
}

function defer () {
  const deferred = {}
  const promise = new Promise(function (resolve, reject) {
    deferred.resolve = resolve
    deferred.reject = reject
  })
  deferred.promise = promise
  return deferred
}
