<template>
  <v-card :disabled="isLoading" :loading="isLoading">
    <v-card-title>
      <v-row dense>
        <v-col cols="10">
          <BtnBack :route="{ name: routeName }" />
          <CardTitle :text="route.meta.title" :icon="route.meta.icon" />
        </v-col>

        <v-col v-if="item" cols="2" class="text-right">
          <div class="d-flex align-center justify-end ga-2">
            <span
              :class="item.is_published ? 'text-success' : 'text-orange'"
              class="text-caption"
            >
              {{ item.is_published ? "Publicado" : "Oculto" }}
            </span>

            <v-switch
              v-model="item.is_published"
              color="success"
              base-color="orange"
              density="compact"
              hide-details
              inset
              :disabled="!canTogglePublished || isLoading"
              :loading="isLoading"
              @update:model-value="togglePublishedStatus"
            />
          </div>
        </v-col>
      </v-row>
    </v-card-title>

    <v-card-text>
      <v-row v-if="item">
        <v-col cols="12">
          <v-card>
            <v-card-title class="d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <CardTitle
                  :text="
                    'ORDEN DE COMPRA | ' +
                    (item.purchase_order_vehicle?.purchase_order_uiid || '')
                  "
                  sub
                />

                <v-btn
                  v-if="isAdmin"
                  icon
                  size="x-small"
                  density="comfortable"
                  :to="{
                    name: 'purchase_orders/show',
                    params: {
                      id: getEncodeId(
                        item.purchase_order_vehicle?.purchase_order_id,
                      ),
                    },
                  }"
                >
                  <v-icon>mdi-eye</v-icon>
                  <v-tooltip activator="parent" location="left">
                    Ver orden de compra
                  </v-tooltip>
                </v-btn>
              </div>

              <div class="d-flex align-center ga-1" />
            </v-card-title>

            <v-card-text>
              <v-row dense>
                <v-col cols="12" md="3">
                  <VisVal
                    label="Monto factura"
                    :value="
                      getAmountFormat(
                        item.purchase_order_vehicle?.invoice_amount,
                      )
                    "
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal
                    label="Comisión"
                    :value="
                      getAmountFormat(
                        item.purchase_order_vehicle?.commission_amount,
                      )
                    "
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal
                    label="Precio compra"
                    :value="
                      getAmountFormat(
                        item.purchase_order_vehicle?.purchase_price,
                      )
                    "
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal
                    label="IVA"
                    :value="item.purchase_order_vehicle?.vat_type?.name"
                  />
                </v-col>

                <v-col
                  v-if="
                    item.purchase_order_vehicle?.purchase_order?.statement_b64
                  "
                  cols="12"
                  md="3"
                >
                  <BtnFilePreview
                    label="Estado de cuenta"
                    :doc="
                      item.purchase_order_vehicle?.purchase_order?.statement_b64
                    "
                    tooltip="Ver"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12">
          <v-card :loading="isLoading">
            <v-card-title class="d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <CardTitle :text="'DETALLE | ' + (item.uiid || '')" sub />
              </div>

              <div class="d-flex align-center ga-1">
                <BtnRecordInfo v-if="isAdmin" :item="item" />

                <PriceForm
                  v-if="isAdmin && item.is_active"
                  :item="item"
                  @saved="getItem"
                />

                <Form
                  v-if="isAdmin && item.is_active"
                  :item="item"
                  @saved="getItem"
                />
              </div>
            </v-card-title>

            <v-card-text>
              <v-row dense>
                <v-col cols="12" md="3">
                  <VisVal
                    label="Precio venta"
                    :value="
                      item.sale_price
                        ? getAmountFormat(item.sale_price)
                        : 'PENDIENTE'
                    "
                    :class="item.sale_price ? '' : 'text-orange'"
                  />
                </v-col>
              </v-row>

              <v-divider class="my-3" />

              <v-row dense>
                <v-col cols="12" md="3">
                  <VisVal
                    label="Marca"
                    :value="
                      item.vehicle_version?.vehicle_model?.vehicle_brand?.name
                    "
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal
                    label="Modelo"
                    :value="item.vehicle_version?.vehicle_model?.name"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal
                    label="Año"
                    :value="item.vehicle_version?.model_year"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal label="Versión" :value="item.vehicle_version?.name" />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal label="Color" :value="item.vehicle_color?.name" />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal
                    label="Transmisión"
                    :value="item.vehicle_transmission?.name"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal label="VIN" :value="item.vin" />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal label="Motor" :value="item.engine_number" />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal label="REPUVE" :value="item.repuve" />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal label="Clave vehicular" :value="item.vehicle_key" />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal
                    label="Número de pasajeros"
                    :value="item.passenger_capacity"
                  />
                </v-col>

                <v-col cols="12">
                  <VisVal label="Observaciones" :value="item.notes" />
                </v-col>
              </v-row>

              <v-divider class="my-3" />

              <v-row dense>
                <v-col cols="12">
                  <CardTitle text="PROCEDENCIA" sub />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal label="Procedencia" :value="item.origin_type?.name" />
                </v-col>

                <v-col v-if="item.origin_type_id > 1" cols="12" md="3">
                  <VisVal label="Pedimento" :value="item.pediment_number" />
                </v-col>

                <v-col v-if="item.origin_type_id > 1" cols="12" md="3">
                  <VisVal label="Fecha" :value="item.pediment_date" />
                </v-col>

                <v-col v-if="item.origin_type_id > 1" cols="12" md="3">
                  <VisVal label="Aduana" :value="item.custom_office?.name" />
                </v-col>

                <v-col v-if="item.origin_type_id > 1" cols="12">
                  <VisVal label="Observaciones" :value="item.pediment_notes" />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12">
          <v-tabs v-model="tab" density="compact" align-tabs="center">
            <v-tab
              v-for="item_tab in tabs"
              :key="item_tab.value"
              :value="item_tab.value"
            >
              {{ item_tab.label }}
              <span :class="item_tab.count ? '' : 'text-warning'">
                ({{ item_tab.count }})
              </span>
            </v-tab>
          </v-tabs>

          <v-tabs-window v-model="tab">
            <v-tabs-window-item :value="1">
              <VehicleInvestors :vehicle_id="itemId" @closed="handleRefresh" />
            </v-tabs-window-item>

            <v-tabs-window-item :value="2">
              <VehicleExpenses :vehicle_id="itemId" @closed="handleRefresh" />
            </v-tabs-window-item>

            <v-tabs-window-item :value="3">
              <VehicleInvoices :vehicle_id="itemId" @closed="handleRefresh" />
            </v-tabs-window-item>

            <v-tabs-window-item :value="4">
              <VehicleDocuments :vehicle_id="itemId" @closed="handleRefresh" />
            </v-tabs-window-item>
          </v-tabs-window>
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
import { getDecodeId, getEncodeId } from "@/utils/coders";

import BtnBack from "@/components/BtnBack.vue";
import BtnFilePreview from "@/components/BtnFilePreview.vue";
import BtnRecordInfo from "@/components/BtnRecordInfo.vue";
import CardTitle from "@/components/CardTitle.vue";
import VisVal from "@/components/VisVal.vue";

import Form from "./Form.vue";
import PriceForm from "./PriceForm.vue";
import VehicleDocuments from "./VehicleDocuments.vue";
import VehicleExpenses from "./VehicleExpenses.vue";
import VehicleInvestors from "./VehicleInvestors.vue";
import VehicleInvoices from "./VehicleInvoices.vue";

const routeName = "vehicles";

const alert = inject("alert");
const store = useStore();
const route = useRoute();

const itemId = ref(getDecodeId(route.params.id));
const isLoading = ref(true);
const item = ref(null);
const tab = ref(1);

const isAdmin = computed(() => [1, 4].includes(store.getAuth?.user?.role_id));

const canTogglePublished = computed(() => {
  return (
    isAdmin.value &&
    item.value &&
    item.value.is_active &&
    Number(item.value.sale_price || 0) > 0
  );
});

const tabs = computed(() => [
  {
    value: 1,
    label: "INVERSIONISTAS",
    count: item.value?.total?.vehicle_investors ?? 0,
  },
  {
    value: 2,
    label: "GASTOS",
    count: item.value?.total?.vehicle_expenses ?? 0,
  },
  {
    value: 3,
    label: "FACTURAS",
    count: item.value?.total?.vehicle_invoices ?? 0,
  },
  {
    value: 4,
    label: "DOCUMENTOS",
    count: item.value?.total?.vehicle_documents ?? 0,
  },
]);

const getItem = async () => {
  item.value = null;
  isLoading.value = true;

  try {
    const endpoint = `${URL_API}/${routeName}/${itemId.value}`;
    const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    item.value = getRsp(response).data.item;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

const togglePublishedStatus = async () => {
  if (!item.value) return;

  const previous_value = !item.value.is_published;

  if (!canTogglePublished.value) {
    item.value.is_published = previous_value;
    return;
  }

  isLoading.value = true;

  try {
    const endpoint = `${URL_API}/${routeName}/${itemId.value}/published_status`;

    const response = getRsp(
      await axios.patch(endpoint, {}, getHdrs(store.getAuth?.token)),
    );

    item.value.is_published = response.data.item.is_published;

    alert?.show(
      response.data.item.is_published ? "success" : "warning",
      response.msg,
    );
  } catch (err) {
    item.value.is_published = previous_value;
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

const handleRefresh = (payload) => {
  if (payload?.refresh) {
    getItem();
  }
};

onMounted(() => {
  getItem();
});
</script>
