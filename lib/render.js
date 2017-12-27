import Vue from 'vue'
import VueMeta from 'vue-meta'
import VueRouter from 'vue-router'
import objectAssign from 'object-assign'

Vue.use(VueMeta)
Vue.use(VueRouter)
Object.assign = objectAssign

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

  Object.keys(layouts).forEach(key => {
    Vue.component(`layout-${key}`, layouts[key])
  })

  Object.keys(plugins).forEach(key => {
    const plugin = plugins[key]
    if (plugin && plugin.install) {
      Vue.use(plugin)
    }
  })

  if (!Vue.component('vue-demo-tools')) {
    Vue.component('vue-demo-tools', {
      render (h) {
        return h('div', { className: 'vue-demo-tools' })
      }
    })
  }

  const router = new VueRouter(routerConfig)
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
          location.reload()
        }
      })
      source.addEventListener('error', function (event) {
        source.close()
      })
    }
  }
}
