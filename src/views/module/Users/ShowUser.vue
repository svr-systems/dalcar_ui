<template>
  <v-card>
    <v-card-title class="d-flex align-center">
      <BtnBack :route="{ name: 'module/usuarios' }" />

      <div class="flex-grow-1 px-4" style="min-width: 0">
        <CardTitle :text="'Detalle de ' + employee.name" icon="mdi-account" />
      </div>

      <v-btn
        v-if="employee.active"
        icon
        size="x-small"
        color="warning"
        :to="{ name: 'users-edit', params: { id: employee.id } }"
      >
        <v-icon>mdi-pencil</v-icon>
        <v-tooltip activator="parent" location="start"> Editar empleado </v-tooltip>
      </v-btn>
    </v-card-title>

    <v-card-text>
      <v-row>
        <v-col cols="12" md="4">
          <VisVal lab="Nombre" :val="employee.name" />
        </v-col>
        <v-col cols="12" md="4">
          <VisVal lab="Apellido Paterno" :val="employee.surname_p" />
        </v-col>
        <v-col cols="12" md="4">
          <VisVal lab="Email" :val="employee.email" />
        </v-col>
        <v-col cols="12" md="4">
          <VisVal lab="Teléfono" :val="employee.phone" />
        </v-col>
        <v-col cols="12">
          <v-btn color="error" @click="toggleActive">
            {{ employee.active ? 'Inactivar' : 'Activar' }}
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>


<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useEmployeeStore } from '@/store/index.js'
import CardTitle from '@/components/CardTitle.vue'
import BtnBack from '@/components/BtnBack.vue'
import VisVal from '@/components/VisVal.vue'
import { computed } from 'vue'

const employees = useEmployeeStore()
const route = useRoute()
const router = useRouter()
const employeeId = Number(route.params.id)
const employee = computed(() => employees.getEmployee(employeeId))

function toggleActive() {
  employees.deactivateEmployee(employeeId)
  router.push({ name: 'users' })
}
</script>