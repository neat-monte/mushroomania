import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
import colors from "vuetify/lib/util/colors";

import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const mushroomTheme = {
  dark: false,
  colors: {
    background: "#F7F7E8",
    panel: "#DACC96",
    accent: "#632626",
    "accent-lighten-1": "#9D5353",
    "accent-lighten-2": "#BF8B67",
    primary: "#6A8CAF",
    "primary-lighten-1": "#A0C1E7",
    "primary-lighten-2": "#D6F4FF",
    secondary: "#75B79E",
    card: "#557174",
    "gray-level-0": colors.grey.darken4,
    "gray-level-1": colors.grey.darken2,
    "gray-level-2": colors.grey.base,
  },
};

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "mushroomTheme",
    themes: {
      mushroomTheme,
    },
  },
});

const app = createApp(App);

app.use(vuetify);
app.use(createPinia());
app.use(router);

app.mount("#app");
