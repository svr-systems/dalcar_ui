<template>
  <v-card :disabled="isLoading">
    <v-card-title>
      <v-row dense>
        <v-col cols="10">
          <BtnBack :route="{ name: routeName }" />
          <CardTitle :text="route.meta.title" :icon="route.meta.icon" />
        </v-col>

        <v-col v-if="item" cols="2" class="text-right" />
      </v-row>
    </v-card-title>

    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title class="d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <CardTitle
                  :text="
                    'ORDEN DE COMPRA | ' +
                    (item?.purchase_order_vehicle.purchase_order_uiid || '')
                  "
                  sub
                />
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
                        item?.purchase_order_vehicle.invoice_amount,
                      )
                    "
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <VisVal
                    label="Comisión"
                    :value="
                      getAmountFormat(
                        item?.purchase_order_vehicle.commission_amount,
                      )
                    "
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <VisVal
                    label="Precio compra"
                    :value="
                      getAmountFormat(
                        item?.purchase_order_vehicle.purchase_price,
                      )
                    "
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <VisVal
                    label="IVA"
                    :value="item?.purchase_order_vehicle.vat_type.name"
                  />
                </v-col>
                <v-col
                  v-if="
                    item?.purchase_order_vehicle?.purchase_order?.statement_b64
                  "
                  cols="12"
                  md="3"
                >
                  <BtnFilePreview
                    label="Estado de cuenta"
                    :doc="
                      item?.purchase_order_vehicle?.purchase_order
                        ?.statement_b64
                    "
                    tooltip="Ver"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-card :loading="isLoading">
            <v-card-title class="d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <CardTitle :text="'DETALLE | ' + (item?.uiid || '')" sub />
              </div>

              <div class="d-flex align-center ga-1">
                <BtnRecordInfo
                  v-if="item && [1, 4].includes(store.getAuth?.user?.role_id)"
                  :item="item"
                />

                <Form
                  v-if="
                    [1].includes(store.getAuth?.user?.role_id) &&
                    item &&
                    item.is_active
                  "
                  :item="item"
                  @saved="getItem"
                />
              </div>
            </v-card-title>

            <v-card-text>
              <v-row dense>
                <v-col cols="12" md="3">
                  <VisVal
                    label="Marca"
                    :value="
                      item?.vehicle_version.vehicle_model.vehicle_brand.name
                    "
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal
                    label="Modelo"
                    :value="item?.vehicle_version.vehicle_model.name"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal
                    label="Año"
                    :value="item?.vehicle_version.model_year"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal label="Versión" :value="item?.vehicle_version.name" />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal label="Color" :value="item?.vehicle_color.name" />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal
                    label="Transmisión"
                    :value="item?.vehicle_transmission.name"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal label="VIN" :value="item?.vin" />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal label="Motor" :value="item?.engine_number" />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal label="REPUVE" :value="item?.repuve" />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal label="Clave vehicular" :value="item?.vehicle_key" />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal
                    label="Número de pasajeros"
                    :value="item?.passenger_capacity"
                  />
                </v-col>

                <v-col cols="12">
                  <VisVal label="Observaciones" :value="item?.notes" />
                </v-col>
              </v-row>

              <v-divider class="my-3" />

              <v-row dense>
                <v-col cols="12">
                  <CardTitle text="PROCEDENCIA" sub />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal
                    label="Procedencia"
                    :value="item?.origin_type?.name"
                  />
                </v-col>

                <v-col v-if="item?.origin_type_id > 1" cols="12" md="3">
                  <VisVal label="Pedimento" :value="item?.pediment_number" />
                </v-col>

                <v-col v-if="item?.origin_type_id > 1" cols="12" md="3">
                  <VisVal label="Fecha" :value="item?.pediment_date" />
                </v-col>

                <v-col v-if="item?.origin_type_id > 1" cols="12" md="3">
                  <VisVal label="Aduana" :value="item?.custom_office.name" />
                </v-col>

                <v-col v-if="item?.origin_type_id > 1" cols="12">
                  <VisVal label="Observaciones" :value="item?.pediment_notes" />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12">
          <v-tabs v-model="tab" density="compact" align-tabs="center">
            <v-tab v-for="tab in tabs" :key="tab.value" :value="tab.value">
              {{ tab.label }}
              <span v-if="item" :class="tab.count ? '' : 'text-warning'">
                ({{ tab.count }})
              </span>
              <v-progress-circular v-else :size="14" :width="1" indeterminate />
            </v-tab>
          </v-tabs>

          <v-tabs-window v-model="tab">
            <v-tabs-window-item :value="1">
              <VehicleInvestors
                :vehicle_id="itemId"
                @closed="(payload) => payload?.refresh && getItem()"
              />
            </v-tabs-window-item>

            <v-tabs-window-item :value="2">
              <VehicleExpenses
                :vehicle_id="itemId"
                @closed="(payload) => payload?.refresh && getItem()"
              />
            </v-tabs-window-item>

            <v-tabs-window-item :value="3">
              <VehicleInvoices
                :vehicle_id="itemId"
                @closed="(payload) => payload?.refresh && getItem()"
              />
            </v-tabs-window-item>

            <v-tabs-window-item :value="4">
              <VehicleDocuments
                :vehicle_id="itemId"
                @closed="(payload) => payload?.refresh && getItem()"
              />
            </v-tabs-window-item>
          </v-tabs-window>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, inject, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getHdrs, getErr, getRsp } from "@/utils/http";
import { getDecodeId } from "@/utils/coders";
import { getAmountFormat } from "@/utils/formatters";

import BtnBack from "@/components/BtnBack.vue";
import CardTitle from "@/components/CardTitle.vue";
import VisVal from "@/components/VisVal.vue";
import BtnRecordInfo from "@/components/BtnRecordInfo.vue";
import Form from "./Form.vue";
import BtnFilePreview from "@/components/BtnFilePreview.vue";
import VehicleInvestors from "./VehicleInvestors.vue";
import VehicleExpenses from "./VehicleExpenses.vue";
import VehicleInvoices from "./VehicleInvoices.vue";
import VehicleDocuments from "./VehicleDocuments.vue";

const routeName = "vehicles";

const alert = inject("alert");
const store = useStore();
const route = useRoute();

const itemId = ref(getDecodeId(route.params.id));
const isLoading = ref(true);
const item = ref(null);
const tab = ref(1);

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

onMounted(() => {
  getItem();
});
</script>
