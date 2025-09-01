<template>
  <v-card elevation="24" :disabled="isLoading" :loading="isLoading">
    <v-card-title>
      <v-row dense>
        <v-col cols="10">
          <BtnBack
            :route="{
              name: routeName + (!isStoreMode ? '/show' : ''),
            }"
          />
          <CardTitle :text="$route.meta.title" :icon="$route.meta.icon" />
        </v-col>
        <v-col cols="2" class="text-right" />
      </v-row>
    </v-card-title>

    <v-card-text v-if="item">
      <v-form ref="formRef" @submit.prevent>
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-title>
                <v-row dense>
                  <v-col cols="11">
                    <CardTitle
                      :text="`AUTO${
                        isStoreMode ? '' : ' | ' + (item.uiid || '')
                      }`"
                      sub
                    />
                  </v-col>
                  <v-col cols="1" class="text-right" />
                </v-row>
              </v-card-title>
              <v-card-text>
                <v-row dense>
                  <v-col cols="12" md="3">
                    <v-date-input
                      label="Fecha de compra"
                      v-model="item.adquisition"
                      variant="outlined"
                      density="compact"
                      counter
                      :rules="rules.textRequired"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-select
                      label="Proveedor"
                      v-model="item.vendor_id"
                      :items="vendorTypes"
                      :loading="vendorTypesLoading"
                      item-value="id"
                      item-title="name"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-select
                      label="Marca"
                      v-model="item.vehicle_brand_id"
                      :items="vehicleBrands"
                      :loading="vehicleBrandsLoading"
                      item-value="id"
                      item-title="name"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-select
                      label="Modelo"
                      v-model="item.vehicle_model_id"
                      :items="vehicleModels"
                      :loading="vehicleModelsLoading"
                      item-value="id"
                      item-title="name"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-select
                      label="Transmisión"
                      v-model="item.vehicle_transmission_id"
                      :items="vehicleTransmissions"
                      :loading="vehicleTransmissionsLoading"
                      item-value="id"
                      item-title="name"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-select
                      label="Año"
                      v-model="item.year"
                      :items="years"
                      variant="outlined"
                      density="compact"
                      :rules="rules.yearRequired"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-select
                      label="Color"
                      v-model="item.vehicle_color_id"
                      :items="vehicleColors"
                      :loading="vehicleColorsLoading"
                      item-value="id"
                      item-title="name"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="VIN"
                      v-model="item.vin"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="50"
                      counter
                      :rules="rules.textRequired"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="Precio compra"
                      v-model="item.purchase"
                      type="number"
                      variant="outlined"
                      density="compact"
                      counter
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="Comisión"
                      v-model="item.commission"
                      type="number"
                      variant="outlined"
                      density="compact"
                      counter
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-select
                      label="IVA"
                      v-model="item.vat_type_id"
                      :items="vatTypes"
                      :loading="vatTypesLoading"
                      item-value="id"
                      item-title="name"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="Monto factura"
                      v-model="item.invoice"
                      type="number"
                      variant="outlined"
                      density="compact"
                      counter
                      :rules="rules.required"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12">
            <v-card>
              <v-card-title>
                <v-row dense>
                  <v-col cols="11">
                    <CardTitle text="INVERSIONISTAS" sub />
                  </v-col>
                  <v-col cols="1" class="text-right" />
                </v-row>
              </v-card-title>
              <v-card-text>
                <v-row
                  dense
                  v-for="(
                    legacy_vehicle_investor, i
                  ) of item.legacy_vehicle_investors"
                  :key="i"
                >
                  <v-col cols="12" md="6">
                    <v-autocomplete
                      label="Inversionista"
                      v-model="legacy_vehicle_investor.investor_id"
                      :items="investors"
                      :loading="investorsLoading"
                      item-value="id"
                      item-title="full_name"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="Porcentaje %"
                      v-model="legacy_vehicle_investor.percentage"
                      type="number"
                      variant="outlined"
                      density="compact"
                      counter
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="2">
                    {{ getAmountFormat(legacy_vehicle_investor.amount) }}
                  </v-col>
                  <v-col cols="12" md="1" class="text-center pt-2">
                    <v-btn
                      v-if="i != 0"
                      icon
                      size="x-small"
                      color="error"
                      @click="legacyVehicleInvestorsRemove(i)"
                    >
                      <v-icon size="x-small">mdi-minus</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="12">
                    <v-btn
                      size="x-small"
                      color="warning"
                      @click="legacyVehicleInvestorsAdd()"
                    >
                      Agregar
                      <v-icon size="x-small" end>mdi-plus</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12">
            <v-card>
              <v-card-title>
                <v-row dense>
                  <v-col cols="11">
                    <CardTitle text="GASTOS" sub />
                  </v-col>
                  <v-col cols="1" class="text-right" />
                </v-row>
              </v-card-title>
              <v-card-text>
                <v-row dense v-for="(overhead, i) of item.overheads" :key="i">
                  <v-col cols="12" md="3">
                    <v-autocomplete
                      label="Tipo"
                      v-model="overhead.overhead_type_id"
                      :items="overheadTypes"
                      :loading="overheadTypesLoading"
                      item-value="id"
                      item-title="name"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="Observación"
                      v-model="overhead.observation"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="50"
                      counter
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="Fecha"
                      v-model="overhead.date"
                      type="date"
                      variant="outlined"
                      density="compact"
                      counter
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="Monto"
                      v-model="overhead.amount"
                      type="number"
                      variant="outlined"
                      density="compact"
                      counter
                      :rules="rules.required"
                    />
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="12">
                    <v-btn
                      size="x-small"
                      color="warning"
                      @click="overheadAdd()"
                    >
                      Agregar
                      <v-icon size="x-small" end>mdi-plus</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12">
            <div class="text-right">
              <v-btn
                icon
                variant="flat"
                size="x-small"
                :color="isStoreMode ? 'success' : 'warning'"
                @click.prevent="handleAction"
                :loading="isLoading"
              >
                <v-icon>mdi-check</v-icon>
                <v-tooltip activator="parent" location="left"
                  >Continuar</v-tooltip
                >
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
// Importaciones de librerías externas
import { ref, inject, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";

// Importaciones internas del proyecto
import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getHdrs, getErr, getRsp } from "@/utils/http";
import { getDecodeId, getEncodeId } from "@/utils/coders";
import { getRules } from "@/utils/validators";
import { getObj } from "@/utils/helpers";
import { getAmountFormat } from "@/utils/formatters";

// Componentes
import BtnBack from "@/components/BtnBack.vue";
import CardTitle from "@/components/CardTitle.vue";

// Constantes fijas
const routeName = "legacy_vehicles";

// Estado y referencias
const alert = inject("alert");
const confirm = inject("confirm");
const store = useStore();
const router = useRouter();
const route = useRoute();

// Estado reactivo
const itemId = ref(route.params.id ? getDecodeId(route.params.id) : null);
const isStoreMode = ref(!itemId.value);
const isLoading = ref(true);
const formRef = ref(null);
const item = ref(null);
const rules = getRules();
const investors = ref([]);
const investorsLoading = ref(true);
const vehicleTransmissions = ref([]);
const vehicleTransmissionsLoading = ref(true);
const vehicleBrands = ref([]);
const vehicleBrandsLoading = ref(true);
const vehicleModels = ref([]);
const vehicleModelsLoading = ref(true);
const vatTypes = ref([]);
const vatTypesLoading = ref(true);
const vendorTypes = ref([]);
const vendorTypesLoading = ref(true);
const vehicleColors = ref([]);
const vehicleColorsLoading = ref(true);
const years = ref([]);

// Obtener catálogos
const getCatalogs = async () => {
  let endpoint = null;
  let response = null;

  try {
    endpoint = `${URL_API}/investors?is_active=1&filter=0`;
    response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    investors.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    investorsLoading.value = false;
  }

  try {
    endpoint = `${URL_API}/vehicle_transmissions`;
    response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    vehicleTransmissions.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    vehicleTransmissionsLoading.value = false;
  }

  try {
    endpoint = `${URL_API}/vehicle_brands`;
    response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    vehicleBrands.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    vehicleBrandsLoading.value = false;
  }
  
  try {
    endpoint = `${URL_API}/vehicle_models`;
    response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    vehicleModels.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    vehicleModelsLoading.value = false;
  }

  try {
    endpoint = `${URL_API}/vat_types`;
    response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    vatTypes.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    vatTypesLoading.value = false;
  }

  try {
    endpoint = `${URL_API}/vendor_types`;
    response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    vendorTypes.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    vendorTypesLoading.value = false;
  }

  try {
    endpoint = `${URL_API}/vehicle_colors`;
    response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    vehicleColors.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    vehicleColorsLoading.value = false;
  }
};

const getYears = () => {
  const currentYear = new Date().getFullYear();
  const startYear = 1980;
  const yearList = [];
  for (let year = currentYear; year >= startYear; year--) {
    yearList.push(year);
  }
  years.value = yearList;
};

const getItem = async () => {
  if (isStoreMode.value) {
    item.value = {
      branch_id: 1,
      purchase_date: null,
      vendor_id: null,
      vehicle_brand_id: null,
      vehicle_model_id: null,
      vehicle_transmission_id: null,
      model_year: null,
      vehicle_color_id: null,
      vin: null,
      purchase_price: null,
      commission_amount: null,
      vat_type_id: null,
      invoice_amount: null,
      legacy_vehicle_investors: [],
      legacy_vehicle_expenses: [],
    };
    legacyVehicleInvestorsAdd();
    isLoading.value = false;
  } else {
    try {
      const endpoint = `${URL_API}/${routeName}/${itemId.value}`;
      const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
      item.value = getRsp(response).data.item;
    } catch (err) {
      alert?.show("red-darken-1", getErr(err));
    } finally {
      isLoading.value = false;
    }
  }
};

const handleAction = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) {
    alert?.show("red-darken-1", "Revisa los detalles señalados");
    return;
  }

  const confirmed = await confirm?.show(
    `¿Confirma ${isStoreMode.value ? "agregar" : "editar"} registro?`
  );
  if (!confirmed) return;
};

const legacyVehicleInvestorsAdd = async () => {
  item.value.legacy_vehicle_investors.push({
    id: null,
    is_active: 1,
    investor_id: null,
    percentage: null,
    amount: null,
  });
};

const legacyVehicleInvestorsRemove = async (i) => {
  if (item.value.legacy_vehicle_investors[i].id === null) {
    item.value.legacy_vehicle_investors.splice(i, 1);
  } else {
    item.value.legacy_vehicle_investors[i].is_active = 0;
  }
};

// Inicialización
onMounted(() => {
  getCatalogs();
  getItem();
  getYears();
});
</script>