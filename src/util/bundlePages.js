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

  const client = `
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

  const isProd = process.env.DOC_ENV === 'production'
  const browser = isProd ? require('uglify-js').minify(client).code : client

  return {
    ssr,
    browser
  }
}
