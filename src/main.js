import Vue from 'vue'
import router from './router'
import App from './App.vue'
import store from './store'

new Vue({
  el: '#app',
  router,   // vue-router
  store,    // vuex
  render: h => h(App)
})
