<template>
  <v-row justify="center">
    <v-col cols="12" md="4" class="mt-11">
      <v-card elevation="24" class="py-4 px-4" :loading="ldg" :disabled="ldg">
        <v-card-text class="text-center">
          <v-row>
            <v-col cols="12" class="pb-6">
              <img :src="logo" width="70%" alt="Logo" />
            </v-col>
            <v-col cols="12">
              <v-form @submit.prevent ref="itemForm">
                <v-row dense>
                  <v-col cols="12">
                    <v-text-field
                      label="E-mail"
                      v-model="item.email"
                      variant="outlined"
                      type="text"
                      density="compact"
                      maxlength="50"
                      :rules="rules.email_rqd"
                    />
                  </v-col>
                  <v-col cols="12">
                    <InpPassword
                      label="Contraseña"
                      :model-value="item.password"
                      @update:model-value="(val) => (item.password = val)"
                      density="compact"
                      :rules="rules.rqd"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-btn block size="small" color="success" @click.prevent="handleAction">
                      Iniciar sesión
                    </v-btn>
                  </v-col>
                  <v-col cols="12" class="mt-4">
                    <v-btn variant="text" size="x-small">¿Olvidaste tu contraseña?</v-btn>
                  </v-col>
                  <v-col cols="12" class="pt-11">
                    <span class="text-caption font-weight-thin text-medium-emphasis">
                      Desarrollado por SVR © {{ new Date().getFullYear() }}
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
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { URL_API, getHdrs, getRsp, getErr, getRules } from '@/general'
import { useStore } from '@/store/index.js'
import logo from '@/assets/logo.png'
import InpPassword from '@/components/InpPassword.vue'

const router = useRouter()
const store = useStore()
const alert = inject('alert')

const rules = getRules()

const itemForm = ref(null)
const ldg = ref(false)
const item = ref({
  email: '',
  password: '',
})

const handleAction = async () => {
  const { valid } = await itemForm.value.validate()

  if (valid) {
    ldg.value = true

    try {
      const rsp = getRsp(await axios.post(URL_API + '/auth/login', item.value, getHdrs()))

      store.loginAction(rsp.data.auth)
      router.push({ name: 'home' })
    } catch (err) {
      alert?.show('error', getErr(err))
    } finally {
      ldg.value = false
    }
  }
}
</script>
