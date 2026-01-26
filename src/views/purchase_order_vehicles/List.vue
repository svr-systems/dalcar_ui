<template>
  <v-card elevation="24" :disabled="isLoading">
    <v-card-title>
      <v-row dense>
        <v-col cols="10">
          <BtnBack
            :route="{
              name: 'purchase_orders/show',
              params: {
                id: getEncodeId(purchaseOrderId),
              },
            }"
          />
          <CardTitle :text="route.meta.title" :icon="route.meta.icon" />
        </v-col>
        <v-col cols="2" class="text-right">
          <v-btn
            icon
            variant="flat"
            size="x-small"
            color="success"
            :to="{
              name: `${routeName}/store`,
              params: { purchase_order_id: getEncodeId(purchaseOrderId) },
            }"
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
            <v-col
              v-if="store.getAuth?.user?.role_id === 1"
              cols="12"
              md="3"
              class="pb-0"
            >
              <v-select
                v-model="isActive"
                label="Mostrar"
                variant="outlined"
                density="compact"
                :items="isActiveOptions"
                item-title="name"
                item-value="id"
                :disabled="!isItemsEmpty"
              />
            </v-col>
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

            <template #item.invoice_amount="{ item }">
              {{ getAmountFormat(item.invoice_amount) }}
            </template>

            <template #item.commission_amount="{ item }">
              {{ getAmountFormat(item.commission_amount) }}
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
                  :color="item.is_active ? '' : 'red-darken-3'"
                  :to="{
                    name: `${routeName}/show`,
                    params: {
                      purchase_order_id: getEncodeId(purchaseOrderId),
                      id: getEncodeId(item.id),
                    },
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
import { getDecodeId, getEncodeId } from "@/utils/coders";
import { getAmountFormat } from "@/utils/formatters";

import CardTitle from "@/components/CardTitle.vue";
import BtnBack from "@/components/BtnBack.vue";

const routeName = "purchase_order_vehicles";
const alert = inject("alert");
const store = useStore();
const route = useRoute();

const purchaseOrderId = ref(getDecodeId(route.params.purchase_order_id));
const isLoading = ref(false);
const items = ref([]);
const search = ref("");
const isActive = ref(1);
const filter = ref(0);

const isItemsEmpty = computed(() => items.value.length === 0);

const isActiveOptions = [
  { id: 1, name: "ACTIVOS" },
  { id: 0, name: "INACTIVOS" },
];
const filterOptions = [{ id: 0, name: "TODOS" }];

const headers = [
  { title: "#", key: "key", filterable: false, sortable: false, width: 60 },
  {
    title: "Marca",
    key: "vehicle.vehicle_version.vehicle_model.vehicle_brand.name",
  },
  { title: "Modelo", key: "vehicle.vehicle_version.vehicle_model.name" },
  { title: "Año", key: "vehicle.vehicle_version.model_year" },
  { title: "Versión", key: "vehicle.vehicle_version.name" },
  { title: "Color", key: "vehicle.vehicle_color.name" },
  { title: "VIN", key: "vehicle.vin" },
  { title: "Monto de factura", key: "invoice_amount" },
  { title: "Comisión", key: "commission_amount" },
  { title: "Precio compra", key: "purchase_price" },
  { title: "", key: "action", filterable: false, sortable: false, width: 60 },
];

const getItems = async () => {
  isLoading.value = true;
  items.value = [];

  try {
    const endpoint = `${URL_API}/${routeName}?purchase_order_id=${purchaseOrderId.value}&is_active=${isActive.value}&filter=${filter.value}`;
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
