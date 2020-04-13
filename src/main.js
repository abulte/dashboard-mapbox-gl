import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueResource from 'vue-resource'
import VueMq from 'vue-mq'

Vue.config.productionTip = false

Vue.use(VueResource)
Vue.use(VueMq, {
  breakpoints: { // default breakpoints - customize this
    small: 450,
    big: Infinity
  },
  defaultBreakpoint: 'big' // customize this for SSR
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
