<template>
  <div id="app">
    <c-header></c-header>
    <c-box class="main no-gap">
      <c-box-item class="sidebar" xs="12" sm="3" md="2">
        <div class="navbar is-stacked">
          <router-link class="navbar__item" v-for="item in menu" :to="item.link" :key="item.title">{{item.title}}</router-link>
        </div>
      </c-box-item>
      <c-box-item class="is-flex">
        <div class="c-container is-lg">
          <transition name="fade">
            <router-view />
          </transition>
        </div>
      </c-box-item>
    </c-box>
    <c-footer class="in-article"></c-footer>
  </div>
</template>

<script>
export default {
  data () {
    return {
      menu: [
        {
          title: '核心理念',
          link: '/principle/introduction'
        },
        {
          title: '组件设计规范',
          link: '/principle/guides'
        }
      ]
    }
  }
}
</script>
