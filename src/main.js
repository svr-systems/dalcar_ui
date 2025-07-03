import { createApp } from "vue";
import App from "./App.vue";
import { createVuetify } from "vuetify";
import { es } from "vuetify/locale";
import "vuetify/styles";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import router from "@/router";

const pinia = createPinia();
const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "light",
  },
  locale: {
    locale: "es",
    fallback: "es",
    messages: { es },
  },
});

const app = createApp(App);

app.config.productionTip = false;
app.config.globalProperties.$window = window;

app.use(vuetify);
app.use(pinia);
app.use(router);
pinia.use(piniaPluginPersistedstate);
app.mount("#app");
