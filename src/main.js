import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './modules/router';
import { DatePicker } from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
const app = createApp(App);
app.use(router);
app.use(DatePicker);
app.mount('#app');


// const scaleValue = window.innerWidth / 1920;
// document.body.style.transform = `scale(${scaleValue})`;
