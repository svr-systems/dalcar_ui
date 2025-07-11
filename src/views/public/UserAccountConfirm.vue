<template>
  <v-row justify="center" class="mt-12">
    <v-col cols="12" md="6">
      <v-card elevation="12" class="pa-6 text-center" :loading="loading" :disabled="loading">
        <v-card-text>
          <v-icon size="64" color="success" v-if="success">mdi-check-circle</v-icon>
          <v-icon size="64" color="error" v-else-if="error">mdi-close-circle</v-icon>
          <v-icon size="64" color="info" v-else>mdi-email-check-outline</v-icon>

          <h2 class="my-4">
            {{
              success
                ? 'Cuenta confirmada exitosamente'
                : error
                ? 'Error al confirmar tu cuenta'
                : 'Confirmando tu cuenta...'
            }}
          </h2>

          <v-btn v-if="success" color="success" @click="router.push({ name: 'login' })">
            Ir a iniciar sesión
          </v-btn>

          <v-btn v-if="error" color="error" @click="router.push({ name: 'main' })">
            Regresar al inicio
          </v-btn>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { URL_API, getHdrs, getErr, getRsp } from '@/general'

const route = useRoute()
const router = useRouter()

const success = ref(false)
const error = ref(false)
const loading = ref(true)

onMounted(async () => {
  const id = route.params.id

  try {
    const rsp = await axios.get(`${URL_API}/public/user/account_confirm/${id}`, getHdrs())
    getRsp(rsp)
    success.value = true
  } catch (err) {
    console.error(err)
    error.value = true
  } finally {
    loading.value = false
  }
})
</script>