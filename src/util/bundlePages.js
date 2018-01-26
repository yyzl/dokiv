/**
 * generate bundle of pages
 */
import revHash from 'rev-hash'
export default function ({
  code = [],
  routers = [],
  mode = 'hash'
}) {
  const ssrRoutes = routers.map(({ fullPath, component, layout }) => `{
    path: "${fullPath}",
    component: (${component}),
    meta: { layout: "${layout}" }
  }`).concat('{ path: "*", redirect: "/404" }')

  const pages = []
  const clientRoutes = routers.map(({ fullPath, component, layout }) => {
    const hash = revHash(component)
    pages.push({ hash, content: `__jsonpResolve("${hash}", ${component})` })
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

  const isProd = process.env.DOKIV_ENV === 'production'
  const browser = isProd ? require('uglify-js').minify(client).code : client

  return {
    ssr,
    browser,
    pages
  }
}
