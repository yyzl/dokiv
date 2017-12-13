import Vue from 'vue'
import VueMeta from 'vue-meta'
import VueRouter from 'vue-router'
import objectAssign from 'object-assign'

Vue.use(VueMeta)
Vue.use(VueRouter)
Object.assign = objectAssign

export default function createApp ({
  url, // ssr
  routes,
  mode = 'hash',

  el,
  template,
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
  
  if (url) {
    data.url = url
  }

  Object.keys(layouts).forEach(key => {
    Vue.component(`layout-${key}`, layouts[key])
  })

  plugins.forEach(plugin => Vue.use(plugin))

  const router = new VueRouter(routerConfig)
  const app = new Vue({
    template,
    router,
    data: data,
    render,
    staticRenderFns
  })

  router.onReady(() => {
    app.$mount('#app')
  })
  
  return { app, router }
}

if (typeof window !== 'undefined' && window.window === window) {
  window.Vue = Vue
}
