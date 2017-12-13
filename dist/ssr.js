'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Vue = _interopDefault(require('vue'));
var VueMeta = _interopDefault(require('vue-meta'));
var VueRouter = _interopDefault(require('vue-router'));
var objectAssign = _interopDefault(require('object-assign'));

Vue.use(VueMeta);
Vue.use(VueRouter);
Object.assign = objectAssign;

function createApp (ref) {
  var url = ref.url;
  var routes = ref.routes;
  var mode = ref.mode; if ( mode === void 0 ) mode = 'hash';
  var el = ref.el;
  var template = ref.template;
  var data = ref.data; if ( data === void 0 ) data = {};
  var render = ref.render;
  var staticRenderFns = ref.staticRenderFns;
  var layouts = ref.layouts;
  var plugins = ref.plugins;

  var routerConfig = {
    mode: mode,
    routes: routes,
    scrollBehavior: function () { return ({ x: 0, y: 0 }); }
  };
  
  if (url) {
    data.url = url;
  }

  Object.keys(layouts).forEach(function (key) {
    Vue.component(("layout-" + key), layouts[key]);
  });

  plugins.forEach(function (plugin) { return Vue.use(plugin); });

  var router = new VueRouter(routerConfig);
  var app = new Vue({
    template: template,
    router: router,
    data: data,
    render: render,
    staticRenderFns: staticRenderFns
  });

  router.onReady(function () {
    app.$mount('#app');
  });
  
  return { app: app, router: router }
}

if (typeof window !== 'undefined' && window.window === window) {
  window.Vue = Vue;
}

module.exports = createApp;
