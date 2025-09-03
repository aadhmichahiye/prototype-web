import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "../layouts/MainLayout.vue";
import Settings from "../components/Settings.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import ListOfClientPost from "../components/ListOfClientPost.vue";
import ListOfContractorPost from "../components/ListOfContractorPost.vue";
import ClientPostsCreate from "../components/ClientPostsCreate.vue";
import ContractorPostsCreate from "../components/ContractorPostsCreate.vue";
import component from "element-plus/es/components/tree-select/src/tree-select-option.mjs";
const routes = [
  //   { path: "/login", component: Login }, // auth without sidebar
  {
    path: "/login",
    name: "Login",
    component: Login, // 👈 standalone, no MainLayout
  },
  {
    path: "/register",
    name: "Register",
    component: Register, // 👈 standalone, no MainLayout
  },
  {
    path: "/",
    component: MainLayout,
    children: [
      { path: "", redirect: "/contractor-posts/list" },
      { path: "client-posts/create", component: ClientPostsCreate },
      {
        path: "contractor-posts/create",
        component: ContractorPostsCreate,
      },
      { path: "settings", component: Settings },
      {
        path: "client-posts/list",
        component: ListOfClientPost,
      },
      {
        path: "contractor-posts/list",
        component: ListOfContractorPost,
      },
    ],
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
