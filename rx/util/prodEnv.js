let vueEnv = null
let nodeEnv = null

exports.set = () => {
  vueEnv = process.env.VUE_ENV
  nodeEnv = process.env.NODE_ENV
  process.env.VUE_ENV = 'browser'
  process.env.NODE_ENV = 'production'
}

exports.restore = () => {
  process.env.VUE_ENV = vueEnv
  process.env.NODE_ENV = nodeEnv
}
