<template>
  <v-col cols="12">
    <v-card>
      <v-card-title>
        <v-row dense>
          <v-col cols="11">
            <CardTitle :text="`AUTO | ${item.uiid}`" sub />
          </v-col>
          <v-col cols="1" class="text-right">
            <v-btn
              v-if="item.is_active"
              icon
              size="x-small"
              color="warning"
              :to="{
                name: `${routeName}/update`,
                params: { id: getEncodeId(itemId) },
              }"
            >
              <v-icon>mdi-pencil</v-icon>
              <v-tooltip activator="parent" location="left">
                Editar
              </v-tooltip>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>

      <v-card-text>
        <v-row dense>
          <v-col cols="12" md="3">
            <VisVal label="Fecha de compra" :value="item.purchase_date" />
          </v-col>

          <v-col cols="12" md="3">
            <VisVal
              label="Marca"
              :value="
                item.vehicle_version.vehicle_model.vehicle_brand.name
              "
            />
          </v-col>

          <v-col cols="12" md="3">
            <VisVal
              label="Modelo"
              :value="item.vehicle_version.vehicle_model.name"
            />
          </v-col>

          <v-col cols="12" md="3">
            <VisVal
              label="Año"
              :value="item.vehicle_version.model_year"
            />
          </v-col>

          <v-col cols="12" md="3">
            <VisVal label="Versión" :value="item.vehicle_version.name" />
          </v-col>

          <v-col cols="12" md="3">
            <VisVal label="Color" :value="item.vehicle_color.name" />
          </v-col>

          <v-col cols="12" md="3">
            <VisVal
              label="Transmisión"
              :value="item.vehicle_transmission.name"
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

          <v-col cols="12" md="12">
            <VisVal label="Observaciones" :value="item.notes" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script setup>
import { useRoute } from "vue-router";

import { getEncodeId } from "@/utils/coders";

import CardTitle from "@/components/CardTitle.vue";
import VisVal from "@/components/VisVal.vue";

const route = useRoute();
const routeName = "legacy_vehicles";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  itemId: {
    type: String,
    required: true,
  },
});
</script>