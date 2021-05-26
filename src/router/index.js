import { createRouter, createWebHistory } from "vue-router";

import Home from "../components/Home.vue";
import store from "../store";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/create",
    name: "CreateRoom",
    meta: {
      requiresAuth: true,
    },
    component: () => import("../views/rooms/CreateRoom.vue"),
  },
  {
    path: "/404",
    name: "NotFound",
    component: () => import("../components/NotFound.vue"),
  },
  {
    path: "/:catchAll(.*)",
    redirect: "NotFound",
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (store.state.user.loggedIn === false) {
      next({ name: "Home" });
    } else {
      next(); // go to wherever I'm going
    }
  } else {
    next(); // does not require auth, make sure to always call next()!
  }
});

export default router;
