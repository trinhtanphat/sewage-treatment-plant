import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './modules/router';
import i18n from './i18n/index.js';
import { DatePicker } from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

const app = createApp(App);
app.use(router);
app.use(i18n);
app.use(DatePicker);
app.mount('#app');
