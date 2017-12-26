let vueEnv = null
let nodeEnv = null

function set () {
  vueEnv = process.env.VUE_ENV
  nodeEnv = process.env.NODE_ENV
  process.env.VUE_ENV = 'browser'
  process.env.NODE_ENV = 'production'
}

function restore () {
  process.env.VUE_ENV = vueEnv
  process.env.NODE_ENV = nodeEnv
}

export default { set, restore }
