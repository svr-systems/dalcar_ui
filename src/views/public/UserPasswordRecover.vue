<template>
  <v-row dense justify="center">
    <v-col cols="12" md="4" class="mt-11">
      <v-card elevation="24" :disabled="ldg" :loading="ldg">
        <v-card-title>
          <v-row dense>
            <v-col cols="10">
              <BtnBack v-if="!success" :route="{ name: 'login' }" />
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text class="text-center">
          <v-row>
            <Company />
            <v-col cols="12">
              <h2 class="font-weight-light">
                {{ !success ? 'Olvidé mi contraseña' : 'E-mail enviado' }}
              </h2>
            </v-col>
            <v-col v-if="!success" cols="12">
              <v-form v-if="item" ref="itemForm">
                <v-row dense>
                  <v-col cols="12">
                    <v-text-field
                      label="E-mail"
                      v-model="item.email"
                      density="compact"
                      variant="outlined"
                      type="text"
                      :rules="rules.email_rqd"
                      maxlength="50"
                    />
                  </v-col>
                  <v-col cols="12">
                    <div class="text-right">
                      <v-btn
                        block
                        size="small"
                        color="info"
                        @click.prevent="handleAction"
                        :loading="ldg"
                      >
                        Enviar E-mail de recuperación
                        <template v-slot:append>
                          <v-icon size="small">mdi-email-fast</v-icon>
                        </template>
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>
              </v-form>
            </v-col>
            <v-col v-else cols="12">
              <p>
                <v-icon size="x-large">mdi-check-circle</v-icon>
              </p>
              <p>
                Hemos enviado un correo a <b>{{ item.email }}</b> con instrucciones para restablecer
                tu contraseña
              </p>
              <p>
                <small> Cuentas con 5 min. para realizar esta acción </small>
              </p>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { useRoute } from 'vue-router'
import { URL_API, getHdrs, getErr, getRules, getObj } from '@/general'
import axios from 'axios'
import BtnBack from '@/components/BtnBack.vue'
import BtnTheme from '@/components/BtnTheme.vue'
import Company from '@/components/Company.vue'

const alert = inject('alert')
const route = useRoute()

// Refs
const ldg = ref(false)
const item = ref(null)
const rules = getRules()
const success = ref(false)
const itemForm = ref(null)

// Métodos
const getItem = () => {
  item.value = { email: null }

  if (route.query.email) {
    item.value.email = route.query.email
  }
}

const handleAction = async () => {
  const { valid } = await itemForm.value.validate()

  if (valid) {
    const obj = getObj(item.value, true)
    ldg.value = true

    try {
      await axios.post(URL_API + '/public/user/password/recover', obj, getHdrs())
      success.value = true
    } catch (err) {
      alert?.show('error', getErr(err))
    } finally {
      ldg.value = false
    }
  }
}

onMounted(() => {
  getItem()
})
</script>