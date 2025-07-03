<template>
  <v-btn size="x-small" icon="mdi-brightness-6" @click="handleAction">
    <v-icon />
    <v-tooltip activator="parent" location="start">
      Utilizar modo: {{ isDark ? "Obscuro" : "Claro" }}
    </v-tooltip>
  </v-btn>
</template>

<script setup>
import { computed, watch } from "vue";
import { useTheme } from "vuetify";
import { useAuthStore } from "@/store/index.js";

const theme = useTheme();
const authStore = useAuthStore();

const isDark = computed(() => authStore.conf.theme_dark);

const handleAction = () => {
  authStore.themeDarkAction();
};

watch(
  isDark,
  (newVal) => {
    theme.global.name.value = newVal ? "dark" : "light";
  },
  { immediate: true }
);
</script>
