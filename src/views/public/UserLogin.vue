<template>
  <v-row justify="center">
    <v-col cols="12" md="4" class="mt-11">
      <v-card elevation="24" class="py-4 px-4" :loading="isLoading" :disabled="isLoading">
        <v-card-text class="text-center">
          <v-row>
            <v-col cols="12" class="pb-6">
              <Logo />
            </v-col>
            <v-col cols="12">
              <v-form ref="formRef" @submit.prevent="handleAction">
                <v-row dense>
                  <v-col cols="12">
                    <v-text-field
                      label="E-mail"
                      v-model="item.email"
                      type="email"
                      variant="outlined"
                      density="compact"
                      prepend-inner-icon="mdi-email-outline"
                      maxlength="50"
                      :rules="rules.emailRequired"
                      autocomplete="email"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="12">
                    <InpPassword
                      label="Contraseña"
                      v-model="item.password"
                      :rules="rules.required"
                      autocomplete="current-password"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-btn block size="small" color="success" type="submit" :loading="isLoading">
                      Iniciar sesión
                      <v-icon end>mdi-login</v-icon>
                    </v-btn>
                  </v-col>

                  <v-col cols="12" class="mt-4">
                    <v-btn
                      variant="text"
                      size="x-small"
                      :to="{ name: 'user_password_recover', query: { email: item.email } }"
                      >¿Olvidaste tu contraseña?</v-btn
                    >
                  </v-col>

                  <v-col cols="12" class="pt-11">
                    <span class="text-caption font-weight-thin text-medium-emphasis">
                      Desarrollado por SVR © {{ getCurrentYear() }}
                    </span>
                  </v-col>
                </v-row>
              </v-form>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
// Importaciones de librerías externas
import { ref, inject, onBeforeUnmount, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

// Importaciones internas del proyecto
import { useStore } from '@/store'
import { URL_API } from '@/utils/config'
import { getHdrs, getErr, getRsp } from '@/utils/http'
import { getRules } from '@/utils/validators'
import { getCurrentYear } from '@/utils/helpers'

// Componentes
import Logo from '@/components/Logo.vue'
import InpPassword from '@/components/InpPassword.vue'

// Estado y referencias
const alert = inject('alert')
const store = useStore()
const router = useRouter()

// Estado reactivo
const isLoading = ref(false)
const formRef = ref(null)
const item = ref({
  email: '',
  password: '',
})
const rules = getRules()

// Función de envío del formulario de login
const handleAction = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  isLoading.value = true

  try {
    const endpoint = `${URL_API}/auth/login`
    const response = await axios.post(endpoint, item.value, getHdrs())

    await store.loginAction(getRsp(response).data.auth)
    await router.push({ name: 'home' })
  } catch (err) {
    alert?.show('error', getErr(err))
  } finally {
    isLoading.value = false
  }
}
</script>
