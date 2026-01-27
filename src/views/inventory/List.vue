<template>
  <v-card elevation="24" :disabled="isLoading">
    <v-card-title>
      <v-row dense>
        <v-col cols="10">
          <CardTitle :text="route.meta.title" :icon="route.meta.icon" />
        </v-col>
        <v-col cols="2" class="text-right">
          <div class="d-flex justify-end" style="gap: 10px">
            <!-- <v-btn
              icon
              variant="flat"
              size="x-small"
              color="primary"
              :to="{ name: routeName }"
            >
              <v-icon>mdi-file-swap-outline</v-icon>
              <v-tooltip activator="parent" location="bottom"
                >Agregar</v-tooltip
              >
            </v-btn>
            <v-btn
              icon
              variant="flat"
              size="x-small"
              color="success"
              :to="{ name: 'purchaseOrders' }"
            >
              <v-icon>mdi-cash-multiple</v-icon>
              <v-tooltip activator="parent" location="bottom"
                >Orden de compra</v-tooltip
              >
            </v-btn> -->
          </div>
        </v-col>
      </v-row>
    </v-card-title>

    <v-card-text>
      <v-row dense>
        <v-col cols="12" md="9" class="pb-0">
          <v-row dense>
            <v-col
              v-if="[1, 4].includes(store.getAuth?.user?.role_id)"
              cols="12"
              md="3"
              class="pb-0"
            >
              <v-select
                label="Mostrar"
                v-model="active"
                variant="outlined"
                density="compact"
                :items="activeOptions"
                item-title="name"
                item-value="id"
                :disabled="!isItemsEmpty"
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
                :disabled="!isItemsEmpty"
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
            :disabled="isItemsEmpty"
          />
        </v-col>

        <v-col cols="12">
          <v-btn
            block
            size="small"
            :color="isItemsEmpty ? 'info' : 'grey-darken-1'"
            :loading="isItemsEmpty && isLoading"
            @click.prevent="isItemsEmpty ? getItems() : (items = [])"
          >
            {{ isItemsEmpty ? "Aplicar" : "Cambiar" }} filtros
            <v-icon right>mdi-filter</v-icon>
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

            <template #item.action="{ item }">
              <div class="text-right">
                <v-btn
                  icon
                  variant="text"
                  size="x-small"
                  :color="item.active ? '' : 'error'"
                  :to="{
                    name: `${routeName}/show`,
                    params: { id: getEncodeId(item.id) },
                  }"
                >
                  <v-icon>mdi-eye</v-icon>
                  <v-tooltip activator="parent" location="left"
                    >Detalle</v-tooltip
                  >
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
import { ref, inject, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";

// Importaciones internas del proyecto
import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getHdrs, getErr, getRsp } from "@/utils/http";
import { getEncodeId } from "@/utils/coders";

// Componentes
import CardTitle from "@/components/CardTitle.vue";

// Estado y referencias
const alert = inject("alert");
const store = useStore();
const router = useRouter();
const route = useRoute();

// Estado reactivo
const isLoading = ref(false);
const items = ref([]);
const isItemsEmpty = computed(() => items.value.length === 0);
const headers = ref([]);
const search = ref("");
const active = ref(1);
const activeOptions = ref([]);
const filter = ref(0);
const filterOptions = ref([]);

// Constantes fijas
const routeName = "inventory";

// Cargar registros
const getItems = async () => {
  isLoading.value = true;
  items.value = [];

  try {
    // const endpoint = `${URL_API}/system/${routeName}?active=${active.value}&filter=${filter.value}`
    // const response = await axios.get(endpoint, getHdrs(store.getAuth?.token))
    // items.value = getRsp(response).data.items
    items.value = [
      {
        id: 1,
        active: true,
        key: 0,
        make: "FORD",
        model: "FOCUS",
        year: 2020,
        transmission: "AUTOMÁTICA",
        color: "ROJO",
        status: "DISPONIBLE",
      },
    ];
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

// Inicializar
onMounted(() => {
  headers.value = [
    { title: "#", key: "key", filterable: false, sortable: false, width: 60 },
    { title: "Marca", key: "make" },
    { title: "Modelo", key: "model" },
    { title: "Año", key: "year" },
    { title: "Transmisión", key: "transmission" },
    { title: "Color", key: "color" },
    { title: "Estado", key: "status" },
    { title: "", key: "action", filterable: false, sortable: false, width: 60 },
  ];

  activeOptions.value = [
    { id: 1, name: "ACTIVOS" },
    { id: 0, name: "INACTIVOS" },
  ];

  filterOptions.value = [{ id: 0, name: "TODOS" }];

  getItems();
});
</script>
