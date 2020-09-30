import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/css/styles.css'
import './assets/css/darkmode.css'
import $ from 'jquery'


Vue.config.productionTip = false

// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)


new Vue({
  render: h => h(App),
  mounted: function() {

    $('.darkmode-toggle input').on('change',function(){
      $('body').toggleClass('darkmode');
      if($('body').hasClass('darkmode')){
        localStorage.setItem('Darkmode', true);
      }
      else{
        localStorage.removeItem('Darkmode');
      }
    });

    $(function() {
      if(localStorage.getItem('Darkmode')){
        $('body').toggleClass('darkmode');
      }
    });
  },
}).$mount('#main')
