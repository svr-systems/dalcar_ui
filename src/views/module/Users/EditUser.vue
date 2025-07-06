<template>
  <v-card>
    <v-card-title>
      <BtnBack :route="{ name: 'module/usuarios' }" />
      <CardTitle text="Editar Empleado" icon="mdi-account-edit" />
    </v-card-title>
    <v-card-text>
      <v-form ref="form" @submit.prevent="submit">
        <v-row dense>
          <v-col cols="12" md="4">
            <v-text-field v-model="localEmployee.name" label="Nombre" dense required />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="localEmployee.surname_p"
              label="Apellido Paterno"
              dense
              required
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field v-model="localEmployee.surname_m" label="Apellido Materno" dense />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="localEmployee.email" label="Email" dense required />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field v-model="localEmployee.phone" label="Teléfono" dense />
          </v-col>
          <v-col cols="12" class="d-flex justify-end">
            <v-btn color="success" icon size="x-small" type="submit">
              <v-icon>mdi-check</v-icon>
              <v-tooltip activator="parent" location="start"> Confirmar </v-tooltip>
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEmployeeStore } from '@/store/index.js'
import CardTitle from '@/components/CardTitle.vue'
import BtnBack from '@/components/BtnBack.vue'

const employees = useEmployeeStore()
const route = useRoute()
const router = useRouter()
const employeeId = Number(route.params.id)
const localEmployee = ref({ ...employees.getEmployee(employeeId) })

function submit() {
  employees.updateEmployee(employeeId, localEmployee.value)
  router.push({ name: 'module/usuarios' })
}
</script>
