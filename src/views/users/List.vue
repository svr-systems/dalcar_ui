<template>
  <v-card elevation="24" :disabled="isLoading">
    <v-card-title>
      <v-row dense>
        <v-col cols="10">
          <CardTitle :text="route.meta.title" :icon="route.meta.icon" />
        </v-col>
        <v-col cols="2" class="text-right">
          <v-btn
            icon
            variant="flat"
            size="x-small"
            color="success"
            :to="{ name: `${routeName}/store` }"
          >
            <v-icon>mdi-plus</v-icon>
            <v-tooltip activator="parent" location="bottom">Agregar</v-tooltip>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-title>

    <v-card-text>
      <v-row dense>
        <v-col cols="12" md="9" class="pb-0">
          <v-row dense>
            <v-col v-if="store.getAuth?.user?.role_id === 1" cols="12" md="3" class="pb-0">
              <v-select
                label="Mostrar"
                v-model="active"
                variant="outlined"
                density="compact"
                :items="activeOptions"
                item-title="name"
                item-value="id"
                :disabled="items.length > 0"
              />
            </v-col>
            <v-col cols="12" md="3" class="pb-0">
              <v-select
                label="Filtro"
                v-model="filter"
                variant="outlined"
                density="compact"
                :items="filterOptions"
                item-title="name"
                item-value="id"
                :disabled="items.length > 0"
              />
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" md="3" class="pb-0">
          <v-text-field
            label="Buscar"
            v-model="search"
            type="text"
            variant="outlined"
            density="compact"
            append-inner-icon="mdi-magnify"
            :disabled="items.length === 0"
          />
        </v-col>

        <v-col cols="12">
          <v-btn
            v-if="items.length === 0"
            block
            size="x-small"
            color="info"
            :loading="isLoading"
            @click.prevent="getItems"
          >
            Aplicar parámetros
            <v-icon right>mdi-database-search-outline</v-icon>
          </v-btn>
          <v-btn v-else block size="x-small" @click.prevent="items = []">
            Cambiar parámetros
            <v-icon right>mdi-database-refresh-outline</v-icon>
          </v-btn>
        </v-col>

        <v-col cols="12">
          <v-data-table
            density="compact"
            :items="items"
            :headers="headers"
            :search="search"
            :items-per-page="15"
            :loading="isLoading"
          >
            <template #item.key="{ item }">
              <b>{{ item.key + 1 }}</b>
            </template>

            <template #item.email_verified_at="{ item }">
              <v-icon size="x-small" :color="item.email_verified_at ? 'info' : ''">
                mdi-checkbox-blank-circle{{ item.email_verified_at ? '' : '-outline' }}
              </v-icon>
            </template>

            <template #item.action="{ item }">
              <div class="text-right">
                <v-btn
                  icon
                  variant="text"
                  size="x-small"
                  :color="item.active ? '' : 'error'"
                  :to="{ name: `${routeName}/show`, params: { id: getEncodeId(item.id) } }"
                >
                  <v-icon>mdi-eye</v-icon>
                  <v-tooltip activator="parent" location="left">Detalle</v-tooltip>
                </v-btn>
              </div>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
// Importaciones de librerías externas
import { ref, inject, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

// Importaciones internas del proyecto
import { useStore } from '@/store'
import { URL_API } from '@/utils/config'
import { getHdrs, getErr, getRsp } from '@/utils/http'
import { getEncodeId } from '@/utils/coders'

// Componentes
import CardTitle from '@/components/CardTitle.vue'

// Constantes fijas
const routeName = 'users'

// Estado y referencias
const alert = inject('alert')
const store = useStore()
const router = useRouter()
const route = useRoute()

// Estado reactivo
const isLoading = ref(false)
const items = ref([])
const headers = ref([])
const search = ref('')
const active = ref(1)
const activeOptions = ref([])
const filter = ref(0)
const filterOptions = ref([])

// Cargar registros
const getItems = async () => {
  isLoading.value = true
  items.value = []

  try {
    const endpoint = `${URL_API}/system/${routeName}?active=${active.value}&filter=${filter.value}`
    const response = await axios.get(endpoint, getHdrs(store.getAuth?.token))
    items.value = getRsp(response).data.items
  } catch (err) {
    alert?.show('error', getErr(err))
  } finally {
    isLoading.value = false
  }
}

// Inicializar
onMounted(() => {
  headers.value = [
    { title: '#', key: 'key', filterable: false, sortable: false, width: 60 },
    { title: 'Nombre', key: 'full_name' },
    { title: 'E-mail', key: 'email' },
    { title: 'Rol', key: 'role.name' },
    { title: 'ID', key: 'uiid' },
    { title: 'Verif.', key: 'email_verified_at' },
    { title: '', key: 'action', filterable: false, sortable: false, width: 60 },
  ]

  activeOptions.value = [
    { id: 1, name: 'ACTIVOS' },
    { id: 0, name: 'INACTIVOS' },
  ]

  filterOptions.value = [{ id: 0, name: 'TODOS' }]

  getItems()
})
</script>
