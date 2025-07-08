<template>
  <v-app>
    <Alert ref="alert" />
    <Confirm ref="confirm" />
    <NavBar v-if="store.auth" />
    <v-main>
      <v-container>
        <router-view :key="$route.fullPath" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, provide, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/store/index.js'
import BtnTheme from '@/components/BtnTheme.vue'
import Alert from '@/components/Alert.vue'
import Confirm from '@/components/Confirm.vue'
import NavBar from '@/components/NavBar.vue'

const router = useRouter()
const store = useStore()
const alert = ref(null)
const confirm = ref(null)
const auth = computed(() => store.getAuth)
const app = getCurrentInstance()?.appContext.app

provide('alert', {
  show: (color, msg) => alert.value?.show(color, msg),
})

provide('confirm', {
  show: (options) => confirm.value?.show(options),
})
</script>

<style>
@import '@/style.css';
</style>
