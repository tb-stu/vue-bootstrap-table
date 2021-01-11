import Vue from 'vue'
import App from './App.vue'
import BtnLoading from './components/BtnLoading'
import DatePicker from './components/DatePicker'
import Pagination from './components/Pagination'
import Table from './components/Table'

try {
  window.Popper = require('popper.js').default;
  window.$ = window.jQuery = require('jquery');

  require('bootstrap');
} catch (e) {}

window.axios = require('axios')
window._ = require('lodash')

Vue.config.productionTip = false

Vue.component('v-btn-loading', BtnLoading)
Vue.component('v-datepicker', DatePicker)
Vue.component('v-pagination', Pagination)
Vue.component('v-table', Table)

new Vue({
  render: function (h) { return h(App) },
}).$mount('#app')
