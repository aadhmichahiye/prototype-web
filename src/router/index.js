import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "../layouts/MainLayout.vue";
import Settings from "../components/Settings.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import ListOfClientPost from "../components/ListOfClientPost.vue";
import ListOfContractorPost from "../components/ListOfContractorPost.vue";
import ClientPostsCreate from "../components/ClientPostsCreate.vue";
import ContractorPostsCreate from "../components/ContractorPostsCreate.vue";
import ClientPostDetails from "../components/ClientPostDetails.vue";
import ContractorPostsDetails from "../components/ContractorPostsDetails.vue";
import TermsAndConditions from "../views/TermsAndConditions.vue";
import ClientMyPosts from "../components/ClientMyPosts.vue";
import Home from "../views/Home.vue";
const routes = [
  //   { path: "/login", component: Login }, // auth without sidebar
  {
    path: "/",
    name: "Home",
    component: Home, // 👈 standalone, no MainLayout
  },
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
    path: "/terms",
    name: "terms",
    component: TermsAndConditions, // 👈 standalone, no MainLayout
  },
  {
    path: "/",
    component: MainLayout,
    children: [
      { path: "", redirect: "/contractor-posts/list" },
      {
        path: "client-posts/create",
        component: ClientPostsCreate,
        meta: { requiresAuth: true, roles: ["client"] },
      },
      {
        path: "/client-posts/:id",
        name: "ClientPostEdit",
        component: ClientPostsCreate,
        props: true, // passes { id } as prop if you want
      },
      {
        path: "contractor-posts/create",
        component: ContractorPostsCreate,
        meta: { requiresAuth: true, roles: ["contractor"] },
      },
      { path: "settings", component: Settings },
      {
        path: "client-posts/list",
        component: ListOfClientPost,
        meta: { requiresAuth: true, roles: ["contractor"] },
      },
      {
        path: "contractor-posts/list",
        component: ListOfContractorPost,
        meta: { requiresAuth: true, roles: ["client"] },
      },
      {
        path: "client-posts/my-posts",
        component: ClientMyPosts,
        meta: { requiresAuth: true, roles: ["client"] },
      },
      {
        path: "client-posts/details/:id",
        name: "ClientPostDetails",
        component: ClientPostDetails,
        meta: { requiresAuth: true, roles: ["contractor"] },
      },
      {
        path: "contractor-posts/details/:id",
        name: "ContractorPostsDetails",
        component: ContractorPostsDetails,
        meta: { requiresAuth: true, roles: ["client"] },
      },
    ],
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
