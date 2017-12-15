const { minify } = require('uglify-js')

/**
 * generate bundle of pages
 */
module.exports = function ({
  code = [],
  routers = [],
  mode = 'hash'
}) {
  const routersCode = `var routes = [${routers.join(',\n')}];`

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

  const browser = `
    ;(function (){
    ${code.join(';')}
    ${routersCode}
    createApp(${appConfig});
    }());
  `

  const ssr = `
    ${code.join(';')}
    ${routersCode}
    module.exports = ${appConfig};
  `

  return {
    ssr: ssr,
    browser: process.env.isProd ? minify(browser).code : browser
  }
}
