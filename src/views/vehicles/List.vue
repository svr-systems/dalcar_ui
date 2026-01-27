<template>
  <v-card elevation="24" :disabled="isLoading" :loading="isLoading">
    <v-card-title class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <CardTitle :text="route.meta.title" :icon="route.meta.icon" />
      </div>

      <div />
    </v-card-title>

    <v-card-text>
      <v-row dense>
        <v-col cols="12" md="9" class="pb-0">
          <v-row dense>
            <v-col cols="12" md="3" class="pb-0">
              <v-select
                v-model="filter"
                label="Filtro"
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
            v-model="search"
            label="Buscar"
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
            <v-icon end>mdi-filter</v-icon>
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

            <template #item.purchase_price="{ item }">
              {{ getAmountFormat(item.purchase_price) }}
            </template>

            <template #item.action="{ item }">
              <div class="text-right">
                <v-btn
                  icon
                  variant="text"
                  size="x-small"
                  :to="{
                    name: `${routeName}/show`,
                    params: { id: getEncodeId(item.id) },
                  }"
                >
                  <v-icon>mdi-eye</v-icon>
                  <v-tooltip activator="parent" location="left">
                    Detalle
                  </v-tooltip>
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
import { ref, computed, inject, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getHdrs, getErr, getRsp } from "@/utils/http";
import { getAmountFormat } from "@/utils/formatters";
import { getEncodeId } from "@/utils/coders";

import CardTitle from "@/components/CardTitle.vue";

const routeName = "vehicles";

const alert = inject("alert");
const store = useStore();
const route = useRoute();

const isLoading = ref(false);
const items = ref([]);
const search = ref("");
const filter = ref(0);

const isItemsEmpty = computed(() => items.value.length === 0);

const filterOptions = [{ id: 0, name: "TODOS" }];

const headers = [
  { title: "#", key: "key", filterable: false, sortable: false, width: 60 },
  { title: "Fecha de compra", key: "order_date" },
  { title: "Marca", key: "vehicle_version.vehicle_model.vehicle_brand.name" },
  { title: "Modelo", key: "vehicle_version.vehicle_model.name" },
  { title: "Año", key: "vehicle_version.model_year" },
  { title: "Versión", key: "vehicle_version.name" },
  { title: "Color", key: "vehicle_color.name" },
  { title: "VIN", key: "vin" },
  { title: "UUID", key: "uiid" },
  { title: "Precio compra", key: "purchase_price" },
  { title: "", key: "action", filterable: false, sortable: false, width: 60 },
];

const getItems = async () => {
  isLoading.value = true;
  items.value = [];

  try {
    const endpoint = `${URL_API}/${routeName}?filter=${filter.value}`;
    const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    items.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  getItems();
});
</script>
