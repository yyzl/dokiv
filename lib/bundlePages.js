const { minify } = require('uglify-js')

/**
 * generate bundle of pages
 */
module.exports = function ({
  code = [],
  routers = [],
  routerMode = 'hash'
}) {
  const routersCode = `var routes = [${routers.join(',\n')}];`

  const appConfig = `{
    el: "#app",
    mode: "${routerMode}",
    routes: routes,
    render: function (h) {
      var layout = this.$route.meta.layout || 'default'
      return h('layout-' + layout)
    },
    data: {},
    layouts: Layout,
    plugins: Plugins
  }`

  const clientCode = `
    (function (){
    ${code.join(';')}
    ${routersCode}
    createApp(${appConfig});
    }())
  `

  const ssrCode = `
    ${code.join(';')}
    ${routersCode}
    module.exports = ${appConfig};
  `

   return {
    clientCode: clientCode, //minify(clientCode).code,
    ssrCode
   }
}
