import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "../layouts/MainLayout.vue";
import ContractorJobList from "../components/ContractorJobList.vue";
// import Home from "@/views/Home.vue";
// import MyJobs from "@/views/MyJobs.vue";
// import PostJob from "@/views/PostJob.vue";
// import Settings from "@/views/Settings.vue";
// import Login from "@/views/Login.vue";

const routes = [
  //   { path: "/login", component: Login }, // auth without sidebar

  {
    path: "/",
    component: MainLayout,
    children: [
      { path: "", redirect: "/contractor/list" },
      { path: "contractor/list", component: ContractorJobList },
      //   { path: "my-jobs", component: MyJobs },
      //   { path: "post-job", component: PostJob },
      //   { path: "settings", component: Settings },
    ],
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
