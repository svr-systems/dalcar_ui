<template>
  <v-row justify="center" class="mt-12">
    <v-col cols="12" md="4">
      <v-card elevation="12" class="pa-6 text-center">
        <v-card-text>
          <v-img
            src="https://static.wixstatic.com/media/dbaee8_453933def9284ef29a843fa1c7645a89~mv2.png/v1/crop/x_0,y_133,w_500,h_198/fill/w_500,h_198,al_c,q_85,enc_avif,quality_auto/Logotipos.png"
            max-width="600"
            class="mb-10"
            alt="Logo"
            contain
          />

          <v-form @submit.prevent>
            <v-row dense justify="center">
              <v-col cols="12">
                <v-text-field
                  v-model="usuario"
                  variant="outlined"
                  density="compact"
                  label="E-mail"
                  prepend-inner-icon="mdi-account"
                  :rules="[(v) => !!v || 'El correo electronico es requerido']"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <InpPassword
                  label="Contraseña"
                  prepend-inner-icon="mdi-lock"
                  v-model="password"
                  density="compact"
                  :rules="[(v) => !!v || 'La contraseña es requerida']"
                  required
                />
              </v-col>

              <v-col cols="12">
                <v-btn
                  block
                  size="large"
                  color="blue-darken-3"
                  class="white--text"
                  @click.prevent="onLogin"
                >
                  Iniciar sesión
                </v-btn>
              </v-col>

              <v-col cols="12" class="mt-4">
                <v-btn variant="text">¿Olvidaste tu contraseña?</v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import InpPassword from '@/components/InpPassword.vue'

const router = useRouter()
const usuario = ref('')
const password = ref('')

function onLogin() {
  if (usuario.value === 'admin' && password.value === '1234') {
    router.push({ name: 'home' })
  }
}
</script>

<style scoped>
v-card {
  background-color: #c0c0c0;
  border-radius: 16px;
}
</style>
