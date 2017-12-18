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
    layouts && Vue.component(("layout-" + key), layouts[key]);
  });

  plugins.forEach(function (plugin) { return plugin && plugin.install && Vue.use(plugin); });

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3NyLmpzIiwic291cmNlcyI6WyIuLi9saWIvcmVuZGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWdWUgZnJvbSAndnVlJ1xuaW1wb3J0IFZ1ZU1ldGEgZnJvbSAndnVlLW1ldGEnXG5pbXBvcnQgVnVlUm91dGVyIGZyb20gJ3Z1ZS1yb3V0ZXInXG5pbXBvcnQgb2JqZWN0QXNzaWduIGZyb20gJ29iamVjdC1hc3NpZ24nXG5cblZ1ZS51c2UoVnVlTWV0YSlcblZ1ZS51c2UoVnVlUm91dGVyKVxuT2JqZWN0LmFzc2lnbiA9IG9iamVjdEFzc2lnblxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVBcHAgKHtcbiAgdXJsLCAvLyBzc3JcbiAgcm91dGVzLFxuICBtb2RlID0gJ2hhc2gnLFxuXG4gIGVsLFxuICB0ZW1wbGF0ZSxcbiAgZGF0YSA9IHt9LFxuICByZW5kZXIsXG4gIHN0YXRpY1JlbmRlckZucyxcblxuICBsYXlvdXRzLFxuICBwbHVnaW5zXG59KSB7XG4gIGNvbnN0IHJvdXRlckNvbmZpZyA9IHtcbiAgICBtb2RlLFxuICAgIHJvdXRlcyxcbiAgICBzY3JvbGxCZWhhdmlvcjogKCkgPT4gKHsgeDogMCwgeTogMCB9KVxuICB9XG5cbiAgaWYgKHVybCkge1xuICAgIGRhdGEudXJsID0gdXJsXG4gIH1cblxuICBPYmplY3Qua2V5cyhsYXlvdXRzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgbGF5b3V0cyAmJiBWdWUuY29tcG9uZW50KGBsYXlvdXQtJHtrZXl9YCwgbGF5b3V0c1trZXldKVxuICB9KVxuXG4gIHBsdWdpbnMuZm9yRWFjaChwbHVnaW4gPT4gcGx1Z2luICYmIHBsdWdpbi5pbnN0YWxsICYmIFZ1ZS51c2UocGx1Z2luKSlcblxuICBjb25zdCByb3V0ZXIgPSBuZXcgVnVlUm91dGVyKHJvdXRlckNvbmZpZylcbiAgY29uc3QgYXBwID0gbmV3IFZ1ZSh7XG4gICAgdGVtcGxhdGUsXG4gICAgcm91dGVyLFxuICAgIGRhdGE6IGRhdGEsXG4gICAgcmVuZGVyLFxuICAgIHN0YXRpY1JlbmRlckZuc1xuICB9KVxuXG4gIHJvdXRlci5vblJlYWR5KCgpID0+IHtcbiAgICBhcHAuJG1vdW50KCcjYXBwJylcbiAgfSlcblxuICByZXR1cm4geyBhcHAsIHJvdXRlciB9XG59XG5cbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cud2luZG93ID09PSB3aW5kb3cpIHtcbiAgd2luZG93LlZ1ZSA9IFZ1ZVxufVxuIl0sIm5hbWVzIjpbImNvbnN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFLQSxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBQztBQUNoQixHQUFHLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBQztBQUNsQixNQUFNLENBQUMsTUFBTSxHQUFHLGFBQVk7O0FBRTVCLEFBQWUsU0FBUyxTQUFTLEVBQUUsR0FhbEMsRUFBRTtNQVpEO01BQ0E7cURBQ087TUFFUDtNQUNBO3FEQUNPO01BQ1A7TUFDQTtNQUVBO01BQ0E7O0VBRUFBLElBQU0sWUFBWSxHQUFHO1VBQ25CLElBQUk7WUFDSixNQUFNO0lBQ04sY0FBYyxjQUFLLFVBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBQztJQUN2Qzs7RUFFRCxJQUFJLEdBQUcsRUFBRTtJQUNQLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBRztHQUNmOztFQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxXQUFDLEtBQUk7SUFDL0IsT0FBTyxJQUFJLEdBQUcsQ0FBQyxTQUFTLGNBQVcsR0FBRyxHQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBQztHQUN4RCxFQUFDOztFQUVGLE9BQU8sQ0FBQyxPQUFPLFdBQUMsUUFBTyxTQUFHLE1BQU0sSUFBSSxNQUFNLENBQUMsT0FBTyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxJQUFDLEVBQUM7O0VBRXRFQSxJQUFNLE1BQU0sR0FBRyxJQUFJLFNBQVMsQ0FBQyxZQUFZLEVBQUM7RUFDMUNBLElBQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDO2NBQ2xCLFFBQVE7WUFDUixNQUFNO0lBQ04sSUFBSSxFQUFFLElBQUk7WUFDVixNQUFNO3FCQUNOLGVBQWU7R0FDaEIsRUFBQzs7RUFFRixNQUFNLENBQUMsT0FBTyxhQUFJO0lBQ2hCLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFDO0dBQ25CLEVBQUM7O0VBRUYsT0FBTyxPQUFFLEdBQUcsVUFBRSxNQUFNLEVBQUU7Q0FDdkI7O0FBRUQsSUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLElBQUksTUFBTSxDQUFDLE1BQU0sS0FBSyxNQUFNLEVBQUU7RUFDN0QsTUFBTSxDQUFDLEdBQUcsR0FBRyxJQUFHO0NBQ2pCOzs7OyJ9
