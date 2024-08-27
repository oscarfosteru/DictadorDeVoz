import Vue from 'vue';
import App from './App.vue';
import Vuetify from 'vuetify'; // Importa Vuetify como un módulo
import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.css'; // Importa los iconos de Material Design

Vue.use(Vuetify); // Usa Vuetify como un plugin

new Vue({
  render: h => h(App),
  vuetify: new Vuetify() // Configura Vuetify en tu instancia Vue
}).$mount('#app');
