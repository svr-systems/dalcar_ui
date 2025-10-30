<template>
  <v-col cols="12">
    <v-card>
      <v-card-title>
        <v-row dense>
          <v-col cols="11">
            <CardTitle text="VENTA" sub />
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-form ref="legacyVehicleSaleForm" @submit.prevent>
          <v-row dense>
            <v-col cols="12" md="6">
              <v-autocomplete
                label="Vendedor"
                v-model="legacyVehicleSale.seller_id"
                :items="sellers"
                item-value="id"
                item-title="name"
                variant="outlined"
                density="compact"
                autocomplete="off"
              />
            </v-col>

            <v-col cols="12" md="3">
              <InpDate
                label="Fecha"
                v-model="legacyVehicleSale.sale_date"
                :before="true"
              />
            </v-col>

            <v-col cols="12" md="3">
              <v-select
                label="Tipo de venta"
                v-model="legacyVehicleSale.sale_type_id"
                :items="saleTypes"
                item-value="id"
                item-title="name"
                variant="outlined"
                density="compact"
              />
            </v-col>

            <v-col cols="12" md="3">
              <v-select
                label="Financieras"
                v-model="legacyVehicleSale.financing_id"
                :items="financings"
                item-value="id"
                item-title="name"
                variant="outlined"
                density="compact"
              />
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field
                label="Plazos"
                v-model="legacyVehicleSale.terms"
                type="number"
                variant="outlined"
                density="compact"
                min="0"
                autocomplete="off"
              />
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field
                :label="'Precio de venta ' + getAmountFormat(legacyVehicleSale.sale_price)"
                v-model="legacyVehicleSale.sale_price"
                type="number"
                variant="outlined"
                density="compact"
                min="0"
                autocomplete="off"
              />
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field
                :label="'Comisión de apertura ' + getAmountFormat(legacyVehicleSale.opening_commission)"
                v-model="legacyVehicleSale.opening_commission"
                type="number"
                variant="outlined"
                density="compact"
                min="0"
                autocomplete="off"
              />
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field
                :label="'Seguro de auto ' + getAmountFormat(legacyVehicleSale.car_insurance)"
                v-model="legacyVehicleSale.car_insurance"
                type="number"
                variant="outlined"
                density="compact"
                min="0"
                autocomplete="off"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                :label="'Seguro de vida ' + getAmountFormat(legacyVehicleSale.life_insurance)"
                v-model="legacyVehicleSale.life_insurance"
                type="number"
                variant="outlined"
                density="compact"
                min="0"
                autocomplete="off"
              />
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field
                :label="'Sobre precio ' + getAmountFormat(legacyVehicleSale.over_price)"
                v-model="legacyVehicleSale.over_price"
                type="number"
                variant="outlined"
                density="compact"
                min="0"
                autocomplete="off"
              />
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field
                :label="'Precio de facturación ' + getAmountFormat(legacyVehicleSale.billing_price)"
                v-model="legacyVehicleSale.billing_price"
                type="number"
                variant="outlined"
                density="compact"
                min="0"
                autocomplete="off"
              />
            </v-col>

            <v-col cols="12" md="3">
              <v-file-input
                label="Corrida"
                v-model="legacyVehicleSale.corrida_file"
                variant="outlined"
                density="compact"
                prepend-icon=""
                show-size
                accept=".pdf,.doc,.docx,.xls,.xlsx"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-file-input
                label="Carta de autorización"
                v-model="legacyVehicleSale.authorization_letter"
                variant="outlined"
                density="compact"
                prepend-icon=""
                show-size
                accept=".pdf,.doc,.docx,.xls,.xlsx"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-col>

  <v-col cols="12">
    <div class="text-right">
      <v-btn
        icon
        variant="flat"
        size="x-small"
        color="success"
        @click.prevent="legacyVehicleSaleAdd()"
        :loading="legacyVehicleSaleLdg"
      >
        <v-icon>mdi-check</v-icon>
        <v-tooltip activator="parent" location="left">
          Continuar
        </v-tooltip>
      </v-btn>
    </div>
  </v-col>
</template>

<script setup>
import { ref } from "vue";

import { getAmountFormat, getDateTime } from "@/utils/formatters";

import CardTitle from "@/components/CardTitle.vue";
import InpDate from "@/components/InpDate.vue";

const currentDate = ref(getDateTime("-", "", "", false));

const sellers = ref([]);
const saleTypes = ref([]);
const financings = ref([]);

try {
  // const endpoint = `${URL_API}/sellers?is_active=1&filter=0`
  // const response = await axios.get(endpoint, getHdrs(store.getAuth?.token))
  // item.value = getRsp(response).data.item
  sellers.value = [
    { id: 1, name: "Juan Pérez" },
    { id: 2, name: "María García" },
    { id: 3, name: "Carlos López" },
    { id: 4, name: "Ana Rodríguez" },
    { id: 5, name: "Roberto Martínez" },
  ];
} catch (err) {
  alert?.show("red-darken-1", getErr(err));
}

try {
  // const endpoint = `${URL_API}/sale_types?is_active=1&filter=0`
  // const response = await axios.get(endpoint, getHdrs(store.getAuth?.token))
  // item.value = getRsp(response).data.item
  saleTypes.value = [
    { id: 1, name: "Contado" },
    { id: 2, name: "Normal" },
    { id: 3, name: "Leasing Financiero" },
    { id: 4, name: "Leasing Operativo" },
    { id: 5, name: "Renta con Opción a Compra" },
  ];
} catch (err) {
  alert?.show("red-darken-1", getErr(err));
}

try {
  // const endpoint = `${URL_API}/financings?is_active=1&filter=0`
  // const response = await axios.get(endpoint, getHdrs(store.getAuth?.token))
  // item.value = getRsp(response).data.item
  financings.value = [
    { id: 1, name: "Test" },
    { id: 2, name: "Santander México" },
    { id: 3, name: "Banamex" },
    { id: 4, name: "HSBC México" },
    { id: 5, name: "Scotiabank" },
    { id: 6, name: "Banco Azteca" },
    { id: 7, name: "Financiera Independencia" },
  ];
} catch (err) {
  alert?.show("red-darken-1", getErr(err));
}

const props = defineProps({
  legacyVehicleId: {
    type: String,
    required: true,
  },
  isActive: {
    type: Number,
    required: true,
  },
});

const legacyVehicleSale = ref({
  id: null,
  legacy_vehicle_id: props.legacyVehicleId,
  seller_id: 2,
  sale_date: currentDate.value,
  sale_type_id: 2,
  financing_id: 1,
  terms: 36,
  sale_price: 450000,
  opening_commission: 13500,
  car_insurance: 8500,
  life_insurance: 3200,
  over_price: 25000,
  billing_price: 475000,
  corrida_file: null,
  authorization_letter: null,
});

const legacyVehicleSaleForm = ref(null);
const legacyVehicleSaleLdg = ref(false);

const legacyVehicleSaleAdd = async () => {
  console.log("Saving sale:", legacyVehicleSale.value);
  alert("Venta guardada exitosamente");
};
</script>