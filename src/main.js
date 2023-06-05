import { createApp } from "vue";
import App from "./App.vue";
import i18n from "@/locales";
import router from "@/routes";

const myApp = createApp(App);
myApp.use(i18n);
myApp.use(router);

myApp.mount("#app");
