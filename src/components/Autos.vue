<template>
  <v-col cols="12">
    <v-card>
      <v-card-title>
        <CardTitle text="AUTOS" sub />
      </v-card-title>
      <v-card-text>
        <v-row dense v-for="(auto, i) of item.autos" :key="i">
          <v-col cols="12" md="3">
            <VisVal label="Marca" :value="auto.brand" />
          </v-col>
          <v-col cols="12" md="3">
            <VisVal label="Modelo" :value="auto.model" />
          </v-col>
          <v-col cols="12" md="3">
            <VisVal
              label="Transmisión"
              :value="auto.transmission || 'N/A'"
            />
          </v-col>
          <v-col cols="12" md="3">
            <VisVal label="Año" :value="auto.year" />
          </v-col>
          <v-col cols="12" md="3">
            <VisVal label="Color" :value="auto.color" />
          </v-col>
          <v-col cols="12" md="3">
            <VisVal label="VIN" :value="auto.vin" />
          </v-col>
          <v-col cols="12" md="3">
            <VisVal label="Precio Compra" :value="auto.purchase_price" />
          </v-col>
          <v-col cols="12" md="3">
            <VisVal label="Comisión" :value="auto.commission || 'N/A'" />
          </v-col>
          <v-col cols="12" md="3">
            <VisVal label="IVA" :value="auto.iva || 'N/A'" />
          </v-col>
          <v-col cols="12" md="3">
            <VisVal label="Monto Factura" :value="auto.invoice_amount" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script setup>
import CardTitle from "@/components/CardTitle.vue";
import VisVal from "@/components/VisVal.vue";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});
</script>