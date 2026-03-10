<template>
  <v-card elevation="24" :disabled="isLoading" :loading="isLoading">
    <v-card-title class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <CardTitle :text="route.meta.title" :icon="route.meta.icon" />
      </div>

      <div class="d-flex align-center ga-1" />
    </v-card-title>

    <v-card-text>
      <v-row dense>
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

            <template #item.has_seller_reservation="{ item }">
              <v-icon
                size="small"
                :color="item.has_seller_reservation ? 'info' : 'grey'"
              >
                mdi-circle
              </v-icon>
            </template>

            <template #item.sale_price="{ item }">
              {{ getAmountFormat(item.sale_price) }}
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
import { computed, inject, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getErr, getHdrs, getRsp } from "@/utils/http";
import { getAmountFormat } from "@/utils/formatters";
import { getEncodeId } from "@/utils/coders";

import CardTitle from "@/components/CardTitle.vue";

const routeName = "seller/vehicles";

const alert = inject("alert");
const store = useStore();
const route = useRoute();

const isLoading = ref(false);
const items = ref([]);
const search = ref("");

const isItemsEmpty = computed(() => items.value.length === 0);

const headers = [
  { title: "#", key: "key", filterable: false, sortable: false, width: 60 },
  { title: "Sucursal", key: "branch_name" },
  { title: "Marca", key: "vehicle_brand_name" },
  { title: "Modelo", key: "vehicle_model_name" },
  { title: "Año", key: "vehicle_version_model_year" },
  { title: "Versión", key: "vehicle_version_name" },
  { title: "Color", key: "vehicle_color_name" },
  { title: "Transmisión", key: "vehicle_transmission_name" },
  { title: "VIN", key: "vin" },
  { title: "UIID", key: "uiid" },
  {
    title: "Apartado",
    key: "has_seller_reservation",
    sortable: false,
    width: 90,
  },
  { title: "Precio venta", key: "sale_price" },
  { title: "", key: "action", filterable: false, sortable: false, width: 60 },
];

const getItems = async () => {
  isLoading.value = true;
  items.value = [];

  try {
    const endpoint = `${URL_API}/${routeName}`;
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
