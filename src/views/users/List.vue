<template>
  <v-card>
    <v-card-title class="d-flex justify-space-between">
      <CardTitle text="Empleados" icon="mdi-account-group" />
      <v-btn color="success" size="x-small" @click.prevent="Add" icon>
        <v-icon>mdi-plus</v-icon>
        <v-tooltip activator="parent" location="start"> Agregar empleado </v-tooltip>
      </v-btn>
    </v-card-title>

    <v-card-text>
      <v-row dense class="mb-2">
        <v-col cols="12" md="6">
          <v-text-field
            v-model="search"
            label="Buscar empleado..."
            clearable
            dense
            prepend-inner-icon="mdi-magnify"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            v-model="filterStatus"
            :items="filterOptions"
            label="Filtrar por estado"
            dense
            clearable
          />
        </v-col>
      </v-row>

      <v-data-table :headers="headers" :items="filteredEmployees" dense class="elevation-1">
        <template #item.active="{ item }">
          <v-icon :color="item.active ? 'success' : 'error'">
            {{ item.active ? 'mdi-check' : 'mdi-close' }}
          </v-icon>
        </template>

        <template #item.action="{ item }">
          <v-btn
            variant="text"
            color="warning"
            icon
            size="x-small"
            :to="{ name: 'users-view', params: { id: item.id } }"
          >
            <v-icon>mdi-eye</v-icon>
            <v-tooltip activator="parent" location="start"> Detalles </v-tooltip>
          </v-btn>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { useEmployeeStore } from '@/store/index.js'
import CardTitle from '@/components/CardTitle.vue'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const employees = useEmployeeStore()
const router = useRouter()

const headers = ref([
  { title: '#', value: 'id' },
  { title: 'Nombre', value: 'name' },
  { title: 'Apellido Paterno', value: 'surname_p' },
  { title: 'Email', value: 'email' },
  { title: 'Activo', value: 'active' },
  { title: 'Acciones', value: 'action', sortable: false },
])

const search = ref('')
const filterStatus = ref('active')
const filterOptions = [
  { title: 'Todos', value: 'all' },
  { title: 'Activos', value: 'active' },
  { title: 'Inactivos', value: 'inactive' },
]

const filteredEmployees = computed(() => {
  let list = employees.employees

  if (filterStatus.value === 'active') {
    list = list.filter((e) => e.active)
  } else if (filterStatus.value === 'inactive') {
    list = list.filter((e) => !e.active)
  }

  if (search.value) {
    const term = search.value.toLowerCase()
    list = list.filter(
      (e) =>
        e.name.toLowerCase().includes(term) ||
        e.surname_p.toLowerCase().includes(term) ||
        e.surname_m?.toLowerCase().includes(term) ||
        e.email.toLowerCase().includes(term) ||
        e.phone?.toLowerCase().includes(term) ||
        String(e.id).includes(term)
    )
  }

  return list
})

const Add = () => {
  router.push({ name: 'module/usuarios/agregar' })
}
</script>
