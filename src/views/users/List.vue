<template>
  <v-card elevation="24" :disabled="ldg">
    <v-card-title>
      <v-row dense>
        <v-col cols="10">
          <CardTitle :text="route.meta.title" :icon="route.meta.icon" />
        </v-col>
        <v-col cols="2" class="text-right">
          <v-tooltip bottom>
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                fab
                icon
                size="x-small"
                color="success"
                :to="{ name: routeName + '/store' }"
              >
                <v-icon> mdi-plus </v-icon>
              </v-btn>
            </template>
            <span>Agregar</span>
          </v-tooltip>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-row dense>
        <v-col cols="12" md="9" class="pb-0">
          <v-row dense>
            <v-col v-if="store.getAuth?.user?.role_id == 1" cols="12" md="3" class="pb-0">
              <v-select
                label="Mostrar"
                v-model="active"
                dense
                :items="active_opts"
                item-title="name"
                item-value="id"
                :disabled="items.length > 0"
              />
            </v-col>
            <v-col cols="12" md="3" class="pb-0">
              <v-select
                label="Filtro"
                v-model="filter"
                dense
                :items="filter_opts"
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
            v-model="items_srch"
            dense
            type="text"
            :disabled="items.length == 0"
          >
            <template v-slot:append>
              <v-icon small> mdi-magnify </v-icon>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-btn
            v-if="items.length == 0"
            block
            color="info"
            x-small
            :loading="ldg"
            @click.prevent="getItems"
          >
            Aplicar parámetros
            <v-icon x-small right> mdi-database-search-outline </v-icon>
          </v-btn>
          <v-btn v-else block x-small @click.prevent="items = []">
            Cambiar parámetros
            <v-icon x-small right> mdi-database-refresh-outline </v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12">
          <v-data-table
            :items="items"
            :search="items_srch"
            :headers="items_hdrs"
            :loading="ldg"
            :items-per-page="15"
            density="compact"
          >
            <template v-slot:item.key="{ item }">
              <b>{{ item.key + 1 }}</b>
            </template>
            <template v-slot:item.action="{ item }">
              <div class="text-right">
                <v-tooltip left>
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      variant="text"
                      icon
                      size="x-small"
                      :color="item.active ? '' : 'error'"
                      :to="{
                        name: routeName + '/show',
                        params: { id: encodeId(item.id) },
                      }"
                    >
                      <v-icon> mdi-eye </v-icon>
                    </v-btn>
                  </template>
                  <span>Detalle</span>
                </v-tooltip>
              </div>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from "@/store/index.js";
import { URL_API, getHdrs, getRsp, getErr } from '@/general'
import axios from 'axios'
import CardTitle from '@/components/CardTitle.vue'
import VisVal from '@/components/VisVal.vue'

const route = useRoute()
const router = useRouter()
const store = useStore()
const alert = inject('alert')

const routeName = 'users'
const ldg = ref(false)
const items = ref([])
const items_srch = ref('')
const items_hdrs = ref([])
const active = ref(1)
const active_opts = ref([])
const filter = ref(0)
const filter_opts = ref([])

const encodeId = (id) => window.btoa(id);

const getItems = async () => {
  ldg.value = true
  items.value = []

  try {
    const response = await axios.get(
      `${URL_API}/system/${routeName}?active=${active.value}&filter=${filter.value}`,
      getHdrs(store.getAuth?.token)
    )
    const rsp = getRsp(response)
    items.value = rsp.data.items
  } catch (err) {
    alert?.show('error', getErr(err))
  } finally {
    ldg.value = false
  }
}

onMounted(() => {
  active_opts.value = [
    { id: 1, name: 'ACTIVOS' },
    { id: 0, name: 'INACTIVOS' },
  ]

  filter_opts.value = [{ id: 0, name: 'TODOS' }]

  items_hdrs.value = [
    {
      title: '#',
      key: "key",
      filterable: false,
      sortable: false,
      width: '60',
    },
    {
      title: 'Nombre',
      key: 'full_name',
    },
    {
      title: 'E-mail',
      key: 'email',
    },
    {
      title: 'Rol',
      key: 'role.name',
    },
    {
      title: 'ID',
      key: 'uiid',
    },
    {
      key: 'action',
      title: '',
      filterable: false,
      sortable: false,
      width: '60',
    },
  ]

  getItems()
})
</script>