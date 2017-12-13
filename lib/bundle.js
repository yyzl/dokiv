const UglifyJS = require('uglify-js')

/**
 * generate bundle of pages
 */
module.exports = function bundle ({
  routerMode = 'hash',
  routers = [],
  initialState = {},
  layoutSource,
  pluginSource
}) {
  const routesString = `var routes = [${routers.join(',\n')}];`
  const appConfig = `
  el: "#app",
  mode: "${routerMode}",
  routes: routes,
  render: function (h) {
    var layout = this.$route.meta.layout || 'default'
    return h('layout-' + layout)
  },
  data: ${JSON.stringify(initialState)},
  layouts: Layout,
  plugins: Plugins
`

  const clientSource = `
(function (){
  ${layoutSource}
  ${pluginSource}
  ${routesString}
  createApp({
    ${appConfig}
  });
}());
`
  const serverSource = `
${layoutSource}
${pluginSource}
${routesString}
module.exports = {
  ${appConfig}
};
`
   const { code } = UglifyJS.minify(clientSource)
   return {
    clientSource: clientSource,
    serverSource
   }
}
