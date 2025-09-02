import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "../layouts/MainLayout.vue";
import ContractorJobList from "../components/ContractorJobList.vue";
import ClientJobListing from "../components/ClientJobListing.vue";
import ClientPostJob from "../components/ClientPostJob.vue";
import Settings from "../components/Settings.vue";
import ContractorPostDetails from "../components/ContractorPostDetails.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
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
      { path: "", redirect: "/contractor/list" },
      { path: "contractor/list", component: ContractorJobList },
      { path: "client/list", component: ClientJobListing },
      { path: "my-posts", component: ClientJobListing },
      { path: "create-post", component: ClientPostJob },
      { path: "settings", component: Settings },
      { path: "contractor/post-details", component: ContractorPostDetails },
    ],
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
