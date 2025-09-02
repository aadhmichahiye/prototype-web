// main.js
import { createApp } from "vue";
import { createPinia } from "pinia";
import "./assets/sass/main.scss";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

// Create app & store
const app = createApp(App);
const pinia = createPinia();

// Use Pinia
app.use(pinia);
app.use(router);
app.use(ElementPlus);

// Mount app
app.mount("#app");
