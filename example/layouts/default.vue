<template>
  <div id="app">
    <c-header />
    <div>
      <transition name="fade">
        <router-view />
      </transition>
    </div>
    <c-footer />
  </div>
</template>
