<template>
  <v-btn
    size="x-small"
    icon="mdi-logout-variant"
    @click="handleAction"
  >
    <v-icon />
    <v-tooltip activator="parent" location="start"> Cerrar Sesión </v-tooltip>
  </v-btn>
</template>

<script setup>
import { inject } from "vue";
import { useAuthStore } from "@/store/index.js";
import { useRouter } from "vue-router";
import axios from "axios";
import { URL_API, getHdrs, getErr } from "@/general";

const authStore = useAuthStore();
const router = useRouter();
const confirm = inject("confirm");
const alert = inject("alert");

const logout = () => {
  authStore.logoutAction();
  router.push({ name: "login" });
};

const handleAction = async () => {
  try {
    const confirmed = await confirm?.show("¿Cerrar sesión?");
    if (!confirmed) return;

    await axios.get(
      URL_API + "/auth/logout",
      getHdrs(authStore.getAuth?.token)
    );
    logout();
  } catch (err) {
    alert?.show("error", getErr(err));
    logout();
  }
};
</script>
