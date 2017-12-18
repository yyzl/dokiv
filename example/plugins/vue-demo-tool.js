module.exports = {
  install (Vue) {
    Vue.component('vue-demo-tools', {
      template: `
<div class="vue-demo-tools">
  <div>
    <a @click="$code.open($event)" title="在 Codepen 中打开"><c-icon type="feather" name="codepen" class="vue-demo-tools__icon"/></a>
    <a @click="$code.copy($event)" title="复制代码"><c-icon type="feather" name="copy" class="vue-demo-tools__icon"/></a>
  </div>
</div>
`,
      props: {
        index: {
          type: Number,
          required: true
        },
        page: {
          type: String,
          required: true
        }
      },
      created () {
        const { page, index } = this
        this.id = `${page}-${index}`
      }
    })
  }
}
