// router/index.js
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
import ContractorMyPosts from "../components/ContractorMyPosts.vue";

const defaultSiteName = "aadhmichahiye";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      title: `${defaultSiteName} - Home`,
      description: "Find and hire manpower & contractors on aadhmichahiye.",
    },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      title: `Login | ${defaultSiteName}`,
      description: "Log in to your aadhmichahiye account.",
    },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: {
      title: `Register | ${defaultSiteName}`,
      description: "Create an aadhmichahiye account to post or hire workers.",
    },
  },
  {
    path: "/terms",
    name: "Terms",
    component: TermsAndConditions,
    meta: {
      title: `Terms & Conditions | ${defaultSiteName}`,
      description: "Terms and conditions for aadhmichahiye users.",
    },
  },
  {
    path: "/",
    component: MainLayout,
    children: [
      { path: "", redirect: "/contractor-posts/list" },

      {
        path: "client-posts/create",
        name: "ClientPostCreate",
        component: ClientPostsCreate,
        meta: {
          requiresAuth: true,
          roles: ["client"],
          title: `Create Job Post | ${defaultSiteName}`,
          description: "Create a job post to hire workers on aadhmichahiye.",
        },
      },

      {
        path: "client-posts/:id",
        name: "ClientPostEdit",
        component: ClientPostsCreate,
        props: true,
        meta: {
          requiresAuth: true,
          title: `Edit Job Post | ${defaultSiteName}`,
          description: "Edit your job post on aadhmichahiye.",
        },
      },

      {
        path: "contractor-posts/:id",
        name: "ContractorPostEdit",
        component: ContractorPostsCreate,
        props: true,
        meta: {
          requiresAuth: true,
          title: `Edit Contractor Post | ${defaultSiteName}`,
          description: "Edit your contractor/manpower post.",
        },
      },

      {
        path: "contractor-posts/create",
        name: "ContractorPostCreate",
        component: ContractorPostsCreate,
        meta: {
          requiresAuth: true,
          roles: ["contractor"],
          title: `Create Contractor Post | ${defaultSiteName}`,
          description: "Create contractor/manpower posts on aadhmichahiye.",
        },
      },

      {
        path: "settings",
        name: "Settings",
        component: Settings,
        meta: {
          title: `Settings | ${defaultSiteName}`,
          description: "Manage your account settings.",
        },
      },

      {
        path: "client-posts/list",
        name: "ClientPostList",
        component: ListOfClientPost,
        meta: {
          requiresAuth: true,
          roles: ["contractor"],
          title: `Client Job Posts | ${defaultSiteName}`,
          description: "Browse client job posts.",
        },
      },

      {
        path: "contractor-posts/list",
        name: "ContractorPostList",
        component: ListOfContractorPost,
        meta: {
          requiresAuth: true,
          roles: ["client"],
          title: `Contractor Posts | ${defaultSiteName}`,
          description: "Browse contractor manpower posts.",
        },
      },

      {
        path: "client-posts/my-posts",
        name: "ClientMyPosts",
        component: ClientMyPosts,
        meta: {
          requiresAuth: true,
          roles: ["client"],
          title: `My Job Posts | ${defaultSiteName}`,
          description: "Your created job posts.",
        },
      },

      {
        path: "contractor-posts/my-posts",
        name: "ContractorMyPosts",
        component: ContractorMyPosts,
        meta: {
          requiresAuth: true,
          roles: ["contractor"],
          title: `My Contractor Posts | ${defaultSiteName}`,
          description: "Your contractor/manpower posts.",
        },
      },

      {
        path: "client-posts/details/:id",
        name: "ClientPostDetails",
        component: ClientPostDetails,
        meta: {
          requiresAuth: true,
          roles: ["contractor"],
          title: `Job Post Details | ${defaultSiteName}`,
          description: "Details of client job post.",
        },
      },

      {
        path: "contractor-posts/details/:id",
        name: "ContractorPostsDetails",
        component: ContractorPostsDetails,
        meta: {
          requiresAuth: true,
          roles: ["client"],
          title: `Contractor Post Details | ${defaultSiteName}`,
          description: "Details of contractor manpower post.",
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
