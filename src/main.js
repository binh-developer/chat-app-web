import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";
import store from "./store";
import { auth } from "./services/firebase";
import "./registerServiceWorker";
import "./assets/tailwind.css";

auth().onAuthStateChanged((user) => {
  store.dispatch("fetchUser", user);
});

createApp(App).use(store).use(router).mount("#app");
