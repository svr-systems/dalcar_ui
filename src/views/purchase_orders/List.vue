<template>
  <v-card elevation="24" :disabled="isLoading" :loading="isLoading">
    <v-card-title>
      <v-row dense>
        <v-col cols="10">
          <CardTitle :text="route.meta.title" :icon="route.meta.icon" />
        </v-col>

        <v-col cols="2" class="text-right">
          <v-btn
            v-if="store.getAuth?.user?.role_id === 1"
            icon
            variant="flat"
            size="x-small"
            color="success"
            :to="{ name: `${routeName}/store` }"
          >
            <v-icon>mdi-plus</v-icon>
            <v-tooltip activator="parent" location="bottom">
              Agregar
            </v-tooltip>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-title>

    <v-card-text>
      <v-row dense>
        <!-- Filtros -->
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
                v-model="paymentFilter"
                label="Filtro"
                variant="outlined"
                density="compact"
                :items="paymentFilterOptions"
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

        <!-- Tabla -->
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

            <template #item.total_amount="{ item }">
              {{ getAmountFormat(item.total_amount) }}
            </template>

            <template #item.days_remaining="{ item }">
              <span
                v-if="item.days_remaining != null"
                :class="
                  item.days_remaining < 1
                    ? 'text-red'
                    : item.days_remaining < 3
                      ? 'text-orange'
                      : ''
                "
              >
                {{ item.days_remaining }}
              </span>
              <span v-else>-</span>
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
import { getEncodeId } from "@/utils/coders";
import { getAmountFormat } from "@/utils/formatters";
import CardTitle from "@/components/CardTitle.vue";

const routeName = "purchase_orders";

const alert = inject("alert");
const store = useStore();
const route = useRoute();

const isLoading = ref(false);
const items = ref([]);
const search = ref("");
const isActive = ref(1);
const paymentFilter = ref(1);

const isItemsEmpty = computed(() => items.value.length === 0);

const isActiveOptions = [
  { id: 1, name: "ACTIVOS" },
  { id: 0, name: "ELIMINADOS" },
];

const paymentFilterOptions = [
  { id: 1, name: "PENDIENTES" },
  { id: 2, name: "PAGADAS" },
];

const headers = [
  { title: "#", key: "key", filterable: false, sortable: false, width: 60 },
  { title: "UUID", key: "uiid" },
  { title: "F. de compra", key: "order_date" },
  { title: "Total a pagar", key: "total_amount" },
  { title: "Proveedor", key: "vendor.name" },
  { title: "F. límite de pago", key: "due_date" },
  { title: "Venc. días", key: "days_remaining" },
  { title: "F. de pago", key: "paid_at" },
  { title: "", key: "action", filterable: false, sortable: false, width: 60 },
];

const getItems = async () => {
  isLoading.value = true;
  items.value = [];

  try {
    const endpoint = `${URL_API}/${routeName}?is_active=${isActive.value}&filter=${paymentFilter.value}`;
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
