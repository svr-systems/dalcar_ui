<template>
  <v-row align="center" justify="center" class="my-2">
    <v-icon :color="!isDark ? 'orange' : 'grey'">mdi-white-balance-sunny</v-icon>
    <v-switch
      v-model="isDarkLocal"
      hide-details
      inset
      class="mx-2"
      color="primary"
      style="margin-top: -10px;"
    />
    <v-icon :color="isDark ? 'blue-grey' : 'grey'">mdi-weather-night</v-icon>
  </v-row>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useTheme } from "vuetify";
import { useAuthStore } from "@/store/index.js";

const theme = useTheme();
const authStore = useAuthStore();

const isDark = computed(() => authStore.conf.theme_dark);

const isDarkLocal = ref(isDark.value);

watch(isDarkLocal, (val) => {
  authStore.themeDarkAction(); 
  theme.global.name.value = val ? "dark" : "light";
});

watch(isDark, (val) => {
  isDarkLocal.value = val;
}, { immediate: true });
</script>
