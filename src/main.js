// main.js
import { createApp } from "vue";
import { createPinia } from "pinia";
import "./assets/sass/main.scss";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { useUserStore } from "./stores/userStore";
import authGuard from "./utils/authGuard";

// Create app & store
const app = createApp(App);
const pinia = createPinia();

// Use Pinia
app.use(pinia);
app.use(router);
app.use(ElementPlus);

const user = useUserStore();
user.pageLoadedORRefreshed(); // restores token and starts timer if token exists
// Mount app
router.beforeEach(authGuard);
router.beforeEach((to, from, next) => {
  // Update title from meta
  if (to.meta?.title) {
    document.title = to.meta.title;
  } else {
    document.title = "aadhmichahiye"; // default fallback
  }
  next();
});
app.mount("#app");
