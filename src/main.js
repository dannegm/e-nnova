import Vue from 'vue';
import App from './App.vue';
import Rx from 'rxjs';
import VueRx from 'vue-rx';

Vue.use (VueRx, Rx);

Vue.config.productionTip = false;
new Vue ({ render: h => h (App) }).$mount ('#app');

