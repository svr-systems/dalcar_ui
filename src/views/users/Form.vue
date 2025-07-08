<template>
  <v-card elevation="24">
    <v-card-title>
      <BtnBack :route="{ name: 'module/usuarios' }" />
      <CardTitle text="Agregar Empleado" icon="mdi-account-plus" />
    </v-card-title>

    <v-card-text>
      <v-form ref="form" v-model="valid" @submit.prevent="submit">
        <v-row dense>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="item.name"
              label="Nombre"
              dense
              :rules="[(v) => !!v || 'El nombre es requerido']"
              required
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field
              v-model="item.surname_p"
              label="Apellido Paterno"
              dense
              :rules="[(v) => !!v || 'El apellido paterno es requerido']"
              required
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field v-model="item.surname_m" label="Apellido Materno" dense />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="item.email"
              label="Email"
              dense
              :rules="[
                (v) => !!v || 'El email es requerido',
                (v) => /.+@.+\..+/.test(v) || 'Ingresa un email válido',
              ]"
              required
            />
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field v-model="item.phone" label="Teléfono" dense />
          </v-col>
        </v-row>

        <v-row justify="end" class="my-1 pr-4">
          <v-btn color="success" icon size="x-small" type="submit" :loading="ldg" :disabled="ldg">
            <v-icon>mdi-check</v-icon>
            <v-tooltip activator="parent" location="start"> Confirmar </v-tooltip>
          </v-btn>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
import { useEmployeeStore } from '@/store/index.js'
import { useRouter } from 'vue-router'
import CardTitle from '@/components/CardTitle.vue'
import BtnBack from '@/components/BtnBack.vue'

const employees = useEmployeeStore()
const router = useRouter()
const ldg = ref(false)
const valid = ref(false)

const item = ref({
  name: '',
  surname_p: '',
  surname_m: '',
  email: '',
  phone: '',
})

function submit() {
  if (!valid.value) return

  ldg.value = true
  employees.addEmployee(item.value)
  ldg.value = false
  router.push({ name: 'module/usuarios' })
}
</script>
