<template>
  <div id="app">
    <c-header></c-header>
    <c-box class="hero no-gap">
      <c-box-item xs="offset-0" sm="offset-3" md="offset-2">
        <h1 class="is-text-xxl is-weight-light">Clair Design</h1>
        <p>一套包含设计规范、Vue 组件和配套资源的设计系统。</p>
        <p>
          <c-button href="/principle/introduction" primary="primary" icon="book">设计原则</c-button>
          <c-button href="/component/install" icon="layers">Vue 组件</c-button>
        </p>
      </c-box-item>
    </c-box>
    <div>
      <transition name="fade">
        <router-view />
      </transition>
    </div>
    <c-footer></c-footer>
  </div>
</template>
