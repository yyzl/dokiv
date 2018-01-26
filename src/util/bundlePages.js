/**
 * generate bundle of pages
 */
import revHash from 'rev-hash'

export default function ({
  code = [],
  routers = [],
  mode = 'hash'
}) {
  const uglifyjs = require('uglify-js')
  const isProd = process.env.DOKIV_ENV === 'production'

  const ssrRoutes = routers.map(({ fullPath, component, layout }) => `{
    path: "${fullPath}",
    component: (${component}),
    meta: { layout: "${layout}" }
  }`).concat('{ path: "*", redirect: "/404" }')

  const pages = []
  const clientRoutes = routers.map(({ fullPath, component, layout }) => {
    const hash = revHash(component)
    const code = `__jsonpResolve("${hash}", ${component})`
    const content = isProd ? uglifyjs.minify(code).code : code
    pages.push({ hash, content })
    return `{
      path: "${fullPath}",
      component: function () {
        return createApp.jsonp("${hash}")
      },
      meta: { layout: "${layout}" }
    }`
  }).concat('{ path: "*", redirect: "/404" }')

  const appConfig = `{
    el: "#app",
    mode: "${mode}",
    routes: routes,
    render: function (h) {
      var layout = this.$route.meta.layout || 'default'
      return h('layout-' + layout)
    },
    data: {},
    layouts: Layout,
    plugins: Plugins
  }`

  const client = `
    ;(function (){
    ${code.join(';')}
    var routes = [${clientRoutes.join(',\n')}];
    createApp(${appConfig});
    }());
  `

  const ssr = `
    ${code.join(';')}
    var routes = [${ssrRoutes.join(',\n')}];
    module.exports = ${appConfig};
  `

  const browser = isProd ? uglifyjs.minify(client).code : client

  return {
    ssr,
    browser,
    pages
  }
}
