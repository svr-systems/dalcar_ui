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

            <template #item.is_approved="{ item }">
              <v-icon
                size="small"
                :color="
                  item.is_approved === null
                    ? 'warning'
                    : item.is_approved
                      ? 'success'
                      : 'red-darken-1'
                "
              >
                mdi-circle
              </v-icon>
            </template>

            <template #item.reservation_amount="{ item }">
              {{ getAmountFormat(item.reservation_amount) }}
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
import { getEncodeId } from "@/utils/coders";
import { getAmountFormat } from "@/utils/formatters";

import CardTitle from "@/components/CardTitle.vue";

const routeName = "vehicle_reservations";

const alert = inject("alert");
const store = useStore();
const route = useRoute();

const isLoading = ref(false);
const items = ref([]);
const search = ref("");
const filter = ref(1);

const isItemsEmpty = computed(() => items.value.length === 0);

const filterOptions = [
  { id: 1, name: "PENDIENTES" },
  { id: 2, name: "APROBADOS" },
  { id: 3, name: "RECHAZADOS" },
];

const headers = [
  { title: "#", key: "key", filterable: false, sortable: false, width: 60 },
  {
    title: "",
    key: "is_approved",
    filterable: false,
    sortable: false,
    width: 60,
  },
  { title: "Auto", key: "vehicle_uiid" },
  { title: "Marca", key: "vehicle_brand_name" },
  { title: "Modelo", key: "vehicle_model_name" },
  { title: "Año", key: "vehicle_version_model_year" },
  { title: "Color", key: "vehicle_color_name" },
  { title: "Vendedor", key: "seller_user_full_name" },
  { title: "Cliente", key: "customer_full_name" },
  { title: "Método pago", key: "payment_method_name" },
  { title: "Financiera", key: "financier_name" },
  { title: "Monto", key: "reservation_amount" },
  { title: "Creado", key: "created_at" },
  { title: "Vence", key: "expires_at" },
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
