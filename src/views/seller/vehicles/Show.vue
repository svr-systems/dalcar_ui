<template>
  <v-card :disabled="isLoading" :loading="isLoading">
    <v-card-title class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <BtnBack :route="{ name: routeName }" />
        <CardTitle :text="route.meta.title" :icon="route.meta.icon" />
      </div>

      <div class="d-flex align-center ga-1">
        <VehicleReservation
          v-if="item"
          :vehicle_id="item.id"
          :has_reservation="item.has_seller_reservation"
          @saved="getItem"
        />
      </div>
    </v-card-title>

    <v-card-text v-if="item">
      <v-row dense>
        <v-col cols="12">
          <v-card>
            <v-card-title class="d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <CardTitle :text="`DETALLE | ${item.uiid || ''}`" sub />
              </div>

              <div class="d-flex align-center ga-1" />
            </v-card-title>

            <v-card-text>
              <v-row dense>
                <v-col cols="12" md="3">
                  <VisVal label="Marca" :value="item.vehicle_brand_name" />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal label="Modelo" :value="item.vehicle_model_name" />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal
                    label="Año"
                    :value="item.vehicle_version_model_year"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal label="Versión" :value="item.vehicle_version_name" />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal label="Color" :value="item.vehicle_color_name" />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal
                    label="Transmisión"
                    :value="item.vehicle_transmission_name"
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

                <v-col cols="12" md="3">
                  <VisVal
                    label="Precio de venta"
                    :value="getAmountFormat(item.sale_price)"
                    class="text-success"
                  />
                </v-col>

                <v-col cols="12">
                  <VisVal label="Observaciones" :value="item.notes" />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { inject, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getErr, getHdrs, getRsp } from "@/utils/http";
import { getDecodeId } from "@/utils/coders";
import { getAmountFormat } from "@/utils/formatters";

import BtnBack from "@/components/BtnBack.vue";
import CardTitle from "@/components/CardTitle.vue";
import VisVal from "@/components/VisVal.vue";
import VehicleReservation from "./VehicleReservation.vue";

const routeName = "seller/vehicles";

const alert = inject("alert");
const store = useStore();
const route = useRoute();

const itemId = ref(getDecodeId(route.params.id));
const isLoading = ref(true);
const item = ref(null);

const getItem = async () => {
  isLoading.value = true;
  item.value = null;

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
