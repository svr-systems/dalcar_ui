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
                    <InpDate
                      label="Fecha de compra"
                      v-model="item.purchase_date"
                      :rules="rules.required"
                      :before="true"
                    />
                  </v-col>

                  <v-col cols="12" md="3">
                    <v-autocomplete
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
                    <v-autocomplete
                      v-if="!isAddingNewBrand"
                      label="Marca"
                      v-model="
                        item.vehicle_version.vehicle_model.vehicle_brand_id
                      "
                      :items="vehicleBrands"
                      :loading="vehicleBrandsLoading"
                      item-value="id"
                      item-title="name"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                    />
                    <v-text-field
                      v-else
                      ref="newBrandInputRef"
                      label="Nueva Marca"
                      v-model="newBrandName"
                      variant="outlined"
                      density="compact"
                      :rules="rules.textRequired"
                      maxlength="50"
                      @keydown.enter.prevent="addNewBrand"
                    >
                      <template #append-inner>
                        <v-btn
                          icon
                          variant="text"
                          size="small"
                          color="error"
                          @click="cancelAddingNewBrand"
                        >
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                        <v-btn
                          icon
                          variant="text"
                          size="small"
                          color="success"
                          :loading="isSavingNewBrand"
                          @click="addNewBrand"
                        >
                          <v-icon>mdi-check</v-icon>
                        </v-btn>
                      </template>
                    </v-text-field>
                  </v-col>

                  <v-col cols="12" md="3">
                    <v-autocomplete
                      v-if="!isAddingNewModel"
                      label="Modelo"
                      v-model="item.vehicle_version.vehicle_model_id"
                      :items="vehicleModels"
                      :loading="vehicleModelsLoading"
                      item-value="id"
                      item-title="name"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                    />
                    <v-text-field
                      v-else
                      ref="newModelInputRef"
                      label="Nuevo Modelo"
                      v-model="newModelName"
                      variant="outlined"
                      density="compact"
                      :rules="rules.textRequired"
                      maxlength="50"
                      @keydown.enter.prevent="addNewModel"
                    >
                      <template #append-inner>
                        <v-btn
                          icon
                          variant="text"
                          size="small"
                          color="error"
                          @click="cancelAddingNewModel"
                        >
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                        <v-btn
                          icon
                          variant="text"
                          size="small"
                          color="success"
                          :loading="isSavingNewModel"
                          @click="addNewModel"
                        >
                          <v-icon>mdi-check</v-icon>
                        </v-btn>
                      </template>
                    </v-text-field>
                  </v-col>

                  <v-col cols="12" md="3">
                    <InpYear
                      label="Año"
                      v-model="item.vehicle_version.model_year"
                      :rules="rules.yearRequired"
                      :maxYear="currentYear"
                      :minYear="currentYear - 40"
                    />
                  </v-col>

                  <v-col cols="12" md="3">
                    <v-autocomplete
                      v-if="!isAddingNewVersion"
                      label="Versión"
                      v-model="item.vehicle_version_id"
                      :items="vehicleVersions"
                      :loading="vehicleVersionsLoading"
                      item-value="id"
                      item-title="name"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                    />
                    <v-text-field
                      v-else
                      ref="newVersionInputRef"
                      label="Nueva Versión"
                      v-model="newVersionName"
                      variant="outlined"
                      density="compact"
                      :rules="rules.textRequired"
                      maxlength="50"
                      @keydown.enter.prevent="addNewVersion"
                    >
                      <template #append-inner>
                        <v-btn
                          icon
                          variant="text"
                          size="small"
                          color="error"
                          @click="cancelAddingNewVersion"
                        >
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                        <v-btn
                          icon
                          variant="text"
                          size="small"
                          color="success"
                          :loading="isSavingNewVersion"
                          @click="addNewVersion"
                        >
                          <v-icon>mdi-check</v-icon>
                        </v-btn>
                      </template>
                    </v-text-field>
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
                      v-if="!isAddingNewColor"
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
                    <v-text-field
                      v-else
                      ref="newColorInputRef"
                      label="Nuevo Color"
                      v-model="newColorName"
                      variant="outlined"
                      density="compact"
                      :rules="rules.textRequired"
                      maxlength="50"
                      @keydown.enter.prevent="addNewColor"
                    >
                      <template #append-inner>
                        <v-btn
                          icon
                          variant="text"
                          size="small"
                          color="error"
                          @click="cancelAddingNewColor"
                        >
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                        <v-btn
                          icon
                          variant="text"
                          size="small"
                          color="success"
                          :loading="isSavingNewColor"
                          @click="addNewColor"
                        >
                          <v-icon>mdi-check</v-icon>
                        </v-btn>
                      </template>
                    </v-text-field>
                  </v-col>

                  <v-col cols="12" md="3">
                    <v-text-field
                      label="VIN"
                      v-model="item.vin"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="17"
                      counter
                      :rules="rules.textRequired"
                    />
                  </v-col>

                  <v-col cols="12" md="3">
                    <v-text-field
                      label="Motor*"
                      v-model="item.engine_number"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="30"
                      counter
                      :rules="rules.textOptional"
                    />
                  </v-col>

                  <v-col cols="12" md="3">
                    <v-text-field
                      label="REPUVE*"
                      v-model="item.repuve"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="25"
                      counter
                      :rules="rules.textOptional"
                    />
                  </v-col>

                  <v-col cols="12" md="3">
                    <v-text-field
                      label="Clave vehicular*"
                      v-model="item.vehicle_key"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="20"
                      counter
                      :rules="rules.textOptional"
                    />
                  </v-col>

                  <v-col cols="12" md="3">
                    <v-text-field
                      :label="'Compra ' + getAmountFormat(item.purchase_price)"
                      v-model="item.purchase_price"
                      type="number"
                      variant="outlined"
                      density="compact"
                      counter
                      min="0"
                      :rules="rules.required"
                    />
                  </v-col>

                  <v-col cols="12" md="3">
                    <v-text-field
                      :label="
                        'Comisión ' + getAmountFormat(item.commission_amount)
                      "
                      v-model="item.commission_amount"
                      type="number"
                      variant="outlined"
                      density="compact"
                      counter
                      min="0"
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
                      :label="
                        'Monto factura ' + getAmountFormat(item.invoice_amount)
                      "
                      v-model="item.invoice_amount"
                      type="number"
                      variant="outlined"
                      density="compact"
                      counter
                      min="0"
                      :rules="rules.required"
                    />
                  </v-col>

                  <v-col cols="12" md="12">
                    <v-text-field
                      label="Observaciones*"
                      v-model="item.notes"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="255"
                      counter
                      :rules="rules.textOptional"
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
                    <CardTitle text="PROCEDENCIA" sub />
                  </v-col>
                  <v-col cols="1" class="text-right" />
                </v-row>
              </v-card-title>

              <v-card-text>
                <v-row dense>
                  <v-col cols="12" md="3">
                    <v-select
                      label="Procedencia"
                      v-model="item.origin_type_id"
                      :items="originTypes"
                      item-value="id"
                      item-title="name"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                    />
                  </v-col>

                  <v-col v-if="item.origin_type_id == 2" cols="12" md="3">
                    <v-text-field
                      label="Pedimento"
                      v-model="item.pediment_number"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="30"
                      counter
                      :rules="rules.textRequired"
                    />
                  </v-col>

                  <v-col v-if="item.origin_type_id == 2" cols="12" md="3">
                    <InpDate
                      label="Fecha"
                      v-model="item.pediment_date"
                      :rules="rules.required"
                      :before="true"
                    />
                  </v-col>

                  <v-col v-if="item.origin_type_id == 2" cols="12" md="3">
                    <v-autocomplete
                      label="Aduana"
                      v-model="item.custom_office_id"
                      :items="customsOffices"
                      :loading="customsOfficesLoading"
                      item-value="id"
                      item-title="name"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                    />
                  </v-col>

                  <v-col v-if="item.origin_type_id == 2" cols="12" md="12">
                    <v-text-field
                      label="Observaciones*"
                      v-model="item.pediment_notes"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="255"
                      counter
                      :rules="rules.textOptional"
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
                  <v-col cols="12" md="7">
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

                  <v-col cols="12" md="4">
                    <v-text-field
                      label="Porcentaje %"
                      v-model="legacy_vehicle_investor.percentages"
                      type="number"
                      variant="outlined"
                      density="compact"
                      counter
                      min="0"
                      :rules="rules.required"
                    />
                  </v-col>

                  <v-col cols="12" md="1" class="text-center pt-2">
                    <v-btn
                      v-if="i !== 0"
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
                <v-row
                  dense
                  v-for="(
                    legacy_vehicle_expense, i
                  ) of item.legacy_vehicle_expenses"
                  :key="i"
                >
                  <v-col cols="12" md="3">
                    <v-autocomplete
                      label="Tipo"
                      v-model="legacy_vehicle_expense.expense_type_id"
                      :items="expenseTypes"
                      :loading="expenseTypesLoading"
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
                      v-model="legacy_vehicle_expense.note"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="50"
                      counter
                      :rules="rules.textRequired"
                    />
                  </v-col>

                  <v-col cols="12" md="3">
                    <InpDate
                      label="Fecha"
                      v-model="legacy_vehicle_expense.expense_date"
                      :rules="rules.required"
                      :before="true"
                    />
                  </v-col>

                  <v-col cols="12" md="2">
                    <v-text-field
                      :label="
                        'Monto ' +
                        getAmountFormat(legacy_vehicle_expense.amount)
                      "
                      v-model="legacy_vehicle_expense.amount"
                      type="number"
                      variant="outlined"
                      density="compact"
                      counter
                      min="0"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="1" class="text-center pt-2">
                    <v-btn
                      v-if="i !== 0"
                      icon
                      size="x-small"
                      color="error"
                      @click="legacyVehicleExpenseRemove(i)"
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
                      @click="legacyVehicleExpenseAdd()"
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
                <v-tooltip activator="parent" location="left">
                  Continuar
                </v-tooltip>
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
import { ref, inject, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";

// Importaciones internas del proyecto
import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getHdrs, getErr, getRsp } from "@/utils/http";
import { getDecodeId, getEncodeId } from "@/utils/coders";
import { getRules } from "@/utils/validators";
import { getCurrentYear, getObj } from "@/utils/helpers";
import { getDateTime, getAmountFormat } from "@/utils/formatters";

// Componentes
import BtnBack from "@/components/BtnBack.vue";
import CardTitle from "@/components/CardTitle.vue";
import InpDate from "@/components/InpDate.vue";
import InpYear from "@/components/InpYear.vue";

// Constantes fijas
const routeName = "legacy_vehicles";
const currentDate = ref(getDateTime("-", "", "", false));
const currentYear = ref(getCurrentYear());

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
const vehicleModelsLoading = ref(false);
const vehicleVersions = ref([]);
const vehicleVersionsLoading = ref(false);
const vatTypes = ref([]);
const vatTypesLoading = ref(true);
const vendorTypes = ref([]);
const vendorTypesLoading = ref(true);
const vehicleColors = ref([]);
const vehicleColorsLoading = ref(true);
const expenseTypes = ref([]);
const expenseTypesLoading = ref(true);
const customsOffices = ref([]);
const customsOfficesLoading = ref(true);
const originTypes = ref([]);
const originTypesLoading = ref(true);

const isAddingNewBrand = ref(false);
const isAddingNewModel = ref(false);
const isAddingNewVersion = ref(false);
const isAddingNewColor = ref(false);
const newBrandName = ref("");
const newModelName = ref("");
const newVersionName = ref("");
const newColorName = ref("");
const newBrandInputRef = ref(null);
const newModelInputRef = ref(null);
const newVersionInputRef = ref(null);
const newColorInputRef = ref(null);
const isSavingNewBrand = ref(false);
const isSavingNewModel = ref(false);
const isSavingNewVersion = ref(false);
const isSavingNewColor = ref(false);

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
    endpoint = `${URL_API}/vehicle_transmissions?is_active=1&filter=0`;
    response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    vehicleTransmissions.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    vehicleTransmissionsLoading.value = false;
  }

  try {
    endpoint = `${URL_API}/vehicle_brands?is_active=1&filter=0`;
    response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    vehicleBrands.value = getRsp(response).data.items;
    vehicleBrands.value.push({ id: 0, name: "OTRO" });
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    vehicleBrandsLoading.value = false;
  }

  try {
    endpoint = `${URL_API}/vat_types?is_active=1&filter=0`;
    response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    vatTypes.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    vatTypesLoading.value = false;
  }

  try {
    endpoint = `${URL_API}/vendors?is_active=1&filter=0`;
    response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    vendorTypes.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    vendorTypesLoading.value = false;
  }

  try {
    endpoint = `${URL_API}/vehicle_colors?is_active=1&filter=0`;
    response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    vehicleColors.value = getRsp(response).data.items;
    vehicleColors.value.push({ id: 0, name: "OTRO" });
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    vehicleColorsLoading.value = false;
  }

  try {
    endpoint = `${URL_API}/expense_types?is_active=1&filter=0`;
    response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    expenseTypes.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    expenseTypesLoading.value = false;
  }

  try {
    endpoint = `${URL_API}/origin_types`;
    response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    originTypes.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    originTypesLoading.value = false;
  }

  try {
    endpoint = `${URL_API}/customs_offices?is_active=1&filter=0`;
    response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    customsOffices.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    customsOfficesLoading.value = false;
  }
};

const getVehicleModels = async (brandId) => {
  if (!brandId) {
    vehicleModels.value = [];
    return;
  }

  vehicleModelsLoading.value = true;

  try {
    const endpoint = `${URL_API}/vehicle_models?is_active=1&vehicle_brand_id=${brandId}`;
    const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    const models = getRsp(response).data.items;
    models.push({ id: 0, name: "OTRO" });
    vehicleModels.value = models;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    vehicleModelsLoading.value = false;
  }
};

const getVehicleVersions = async (modelId, year) => {
  if (!modelId || !year) {
    vehicleVersions.value = [];
    return;
  }
  vehicleVersionsLoading.value = true;
  try {
    const endpoint = `${URL_API}/vehicle_versions?is_active=1&vehicle_model_id=${modelId}&model_year=${year}`;
    const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    const versions = getRsp(response).data.items;
    versions.push({ id: 0, name: "OTRO" });
    vehicleVersions.value = versions;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    vehicleVersionsLoading.value = false;
  }
};

const getItem = async () => {
  if (isStoreMode.value) {
    item.value = {
      branch_id: 1,
      purchase_date: currentDate.value,
      vendor_id: null,
      vehicle_version_id: null,
      vehicle_version: {
        vehicle_model_id: null,
        vehicle_model: {
          vehicle_brand_id: null,
        },
        model_year: null,
      },
      vehicle_transmission_id: null,
      vehicle_color_id: null,
      vin: null,
      engine_number: null,
      repuve: null,
      vehicle_key: null,
      purchase_price: null,
      commission_amount: null,
      vat_type_id: null,
      invoice_amount: null,
      notes: null,
      origin_type_id: null,
      pediment_number: null,
      pediment_date: null,
      custom_office_id: null,
      pediment_notes: null,
      legacy_vehicle_investors: [],
      legacy_vehicle_expenses: [],
    };
    legacyVehicleInvestorsAdd();
    legacyVehicleExpenseAdd();
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

const addNewBrand = async () => {
  if (!newBrandName.value || newBrandName.value.trim() === "") {
    alert?.show(
      "red-darken-1",
      "Por favor, ingresa el nombre de la nueva marca."
    );
    return;
  }

  const confirmed = await confirm?.show(
    `¿Confirma agregar la nueva marca "${newBrandName.value}"?`
  );
  if (!confirmed) return;

  isSavingNewBrand.value = true;
  try {
    const payload = {
      name: newBrandName.value.trim(),
    };
    const endpoint = `${URL_API}/vehicle_brands`;
    const response = await axios.post(
      endpoint,
      payload,
      getHdrs(store.getAuth?.token)
    );
    const newBrandId = getRsp(response).data.item.id;
    alert?.show("green-darken-1", "Nueva marca agregada con éxito.");

    const getEndpoint = `${URL_API}/vehicle_brands/${newBrandId}`;
    const getResponse = await axios.get(
      getEndpoint,
      getHdrs(store.getAuth?.token)
    );
    const newBrand = getRsp(getResponse).data.item;

    const otroOption = vehicleBrands.value.pop();
    vehicleBrands.value = [...vehicleBrands.value, newBrand, otroOption];
    item.value.vehicle_version.vehicle_model.vehicle_brand_id = newBrand.id;

    newBrandName.value = "";
    isAddingNewBrand.value = false;
    newBrandInputRef.value?.resetValidation();

    await getVehicleModels(newBrand.id);
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isSavingNewBrand.value = false;
  }
};

const addNewModel = async () => {
  if (!newModelName.value || newModelName.value.trim() === "") {
    alert?.show(
      "red-darken-1",
      "Por favor, ingresa el nombre del nuevo modelo."
    );
    return;
  }

  const confirmed = await confirm?.show(
    `¿Confirma agregar el nuevo modelo "${newModelName.value}"?`
  );
  if (!confirmed) return;

  isSavingNewModel.value = true;
  try {
    const payload = {
      name: newModelName.value.trim(),
      vehicle_brand_id:
        item.value.vehicle_version.vehicle_model.vehicle_brand_id,
    };
    const endpoint = `${URL_API}/vehicle_models`;
    const response = await axios.post(
      endpoint,
      payload,
      getHdrs(store.getAuth?.token)
    );
    const newModelId = getRsp(response).data.item.id;

    alert?.show("green-darken-1", "Nuevo modelo agregado con éxito.");

    const getEndpoint = `${URL_API}/vehicle_models/${newModelId}`;
    const getResponse = await axios.get(
      getEndpoint,
      getHdrs(store.getAuth?.token)
    );
    const newModel = getRsp(getResponse).data.item;

    const otroOption = vehicleModels.value.pop();
    vehicleModels.value = [...vehicleModels.value, newModel, otroOption];
    item.value.vehicle_version.vehicle_model_id = newModel.id;

    newModelName.value = "";
    isAddingNewModel.value = false;
    newModelInputRef.value?.resetValidation();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isSavingNewModel.value = false;
  }
};

const addNewVersion = async () => {
  if (!newVersionName.value || newVersionName.value.trim() === "") {
    alert?.show(
      "red-darken-1",
      "Por favor, ingresa el nombre de la nueva versión."
    );
    return;
  }

  const confirmed = await confirm?.show(
    `¿Confirma agregar la nueva versión "${newVersionName.value}"?`
  );
  if (!confirmed) return;

  isSavingNewVersion.value = true;
  try {
    const payload = {
      name: newVersionName.value.trim(),
      vehicle_model_id: item.value.vehicle_version.vehicle_model_id,
      model_year: item.value.vehicle_version.model_year,
    };
    const endpoint = `${URL_API}/vehicle_versions`;
    const response = await axios.post(
      endpoint,
      payload,
      getHdrs(store.getAuth?.token)
    );
    const newVersionId = getRsp(response).data.item.id;

    alert?.show("green-darken-1", "Nueva versión agregada con éxito.");

    const getEndpoint = `${URL_API}/vehicle_versions/${newVersionId}`;
    const getResponse = await axios.get(
      getEndpoint,
      getHdrs(store.getAuth?.token)
    );
    const newVersion = getRsp(getResponse).data.item;

    const otroOption = vehicleVersions.value.pop();
    vehicleVersions.value = [...vehicleVersions.value, newVersion, otroOption];
    item.value.vehicle_version_id = newVersion.id;

    newVersionName.value = "";
    isAddingNewVersion.value = false;
    newVersionInputRef.value?.resetValidation();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isSavingNewVersion.value = false;
  }
};

const addNewColor = async () => {
  if (!newColorName.value || newColorName.value.trim() === "") {
    alert?.show(
      "red-darken-1",
      "Por favor, ingresa el nombre del nuevo color."
    );
    return;
  }

  const confirmed = await confirm?.show(
    `¿Confirma agregar el nuevo color "${newColorName.value}"?`
  );
  if (!confirmed) return;

  isSavingNewColor.value = true;
  try {
    const payload = {
      name: newColorName.value.trim(),
    };
    const endpoint = `${URL_API}/vehicle_colors`;
    const response = await axios.post(
      endpoint,
      payload,
      getHdrs(store.getAuth?.token)
    );
    const newColorId = getRsp(response).data.item.id;

    alert?.show("green-darken-1", "Nuevo color agregado con éxito.");

    const getEndpoint = `${URL_API}/vehicle_colors/${newColorId}`;
    const getResponse = await axios.get(
      getEndpoint,
      getHdrs(store.getAuth?.token)
    );
    const newColor = getRsp(getResponse).data.item;

    const otroOption = vehicleColors.value.pop();
    vehicleColors.value = [...vehicleColors.value, newColor, otroOption];
    item.value.vehicle_color_id = newColor.id;

    newColorName.value = "";
    isAddingNewColor.value = false;
    newColorInputRef.value?.resetValidation();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isSavingNewColor.value = false;
  }
};

const cancelAddingNewBrand = () => {
  isAddingNewBrand.value = false;
  newBrandName.value = "";
  newBrandInputRef.value?.resetValidation();
  item.value.vehicle_version.vehicle_model.vehicle_brand_id = null;
};

const cancelAddingNewModel = () => {
  isAddingNewModel.value = false;
  newModelName.value = "";
  newModelInputRef.value?.resetValidation();
  item.value.vehicle_version.vehicle_model_id = null;
};

const cancelAddingNewVersion = () => {
  isAddingNewVersion.value = false;
  newVersionName.value = "";
  newVersionInputRef.value?.resetValidation();
  item.value.vehicle_version_id = null;
};

const cancelAddingNewColor = () => {
  isAddingNewColor.value = false;
  newColorName.value = "";
  newColorInputRef.value?.resetValidation();
  item.value.vehicle_color_id = null;
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

  isLoading.value = true;
  const payload = getObj(item.value, isStoreMode.value);

  try {
    const endpoint = `${URL_API}/${routeName}${
      !isStoreMode.value ? `/${payload.id}` : ""
    }`;
    const response = getRsp(
      await axios.post(endpoint, payload, getHdrs(store.getAuth?.token))
    );

    alert?.show("success", response.msg);

    router.push({
      name: `${routeName}/show`,
      params: {
        id: getEncodeId(
          isStoreMode.value ? response.data.item.id : itemId.value
        ),
      },
    });
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

const legacyVehicleInvestorsAdd = () => {
  item.value.legacy_vehicle_investors.push({
    id: null,
    is_active: 1,
    investor_id: null,
    percentages: null,
    amount: null,
  });
};

const legacyVehicleInvestorsRemove = (i) => {
  if (item.value.legacy_vehicle_investors[i].id === null) {
    item.value.legacy_vehicle_investors.splice(i, 1);
  } else {
    item.value.legacy_vehicle_investors[i].is_active = 0;
  }
};

const legacyVehicleExpenseAdd = () => {
  item.value.legacy_vehicle_expenses.push({
    id: null,
    is_active: 1,
    expense_type_id: null,
    note: null,
    expense_date: null,
    amount: null,
  });
};

const legacyVehicleExpenseRemove = (i) => {
  if (item.value.legacy_vehicle_expenses[i].id === null) {
    item.value.legacy_vehicle_expenses.splice(i, 1);
  } else {
    item.value.legacy_vehicle_expenses[i].is_active = 0;
  }
};

// Cambios de marca
watch(
  () => item.value?.vehicle_version?.vehicle_model?.vehicle_brand_id,
  (newBrandId, oldBrandId) => {
    if (!item.value) return;

    const isEditMode = !isStoreMode.value;
    const isFirstRunInEdit = isEditMode && oldBrandId === undefined;

    if (isFirstRunInEdit) {
      if (newBrandId) getVehicleModels(newBrandId);
      return;
    }

    if (newBrandId === oldBrandId) return;

    if (newBrandId === 0) {
      isAddingNewBrand.value = true;
      newBrandName.value = "";
      vehicleModels.value = [];
      item.value.vehicle_version.vehicle_model_id = null;
      return;
    }

    if (newBrandId) {
      isAddingNewBrand.value = false;
      newBrandName.value = "";
      newBrandInputRef.value?.resetValidation();
      item.value.vehicle_version.vehicle_model_id = null;
      getVehicleModels(newBrandId);
    } else {
      isAddingNewBrand.value = false;
      newBrandName.value = "";
      vehicleModels.value = [];
      item.value.vehicle_version.vehicle_model_id = null;
    }
  }
);

watch(
  () => [
    item.value?.vehicle_version?.vehicle_model_id,
    item.value?.vehicle_version?.model_year,
  ],
  ([newModelId, newYear], [oldModelId, oldYear]) => {
    if (!item.value) return;

    const isEditMode = !isStoreMode.value;
    const isFirstRunInEdit =
      isEditMode && oldModelId === undefined && oldYear === undefined;

    if (isFirstRunInEdit) {
      if (newModelId && newYear) getVehicleVersions(newModelId, newYear);
      return;
    }

    if (newModelId === oldModelId && newYear === oldYear) return;

    if (newModelId === 0) {
      isAddingNewModel.value = true;
      item.value.vehicle_version_id = null;
    } else if (newModelId) {
      isAddingNewModel.value = false;
      newModelName.value = "";
      newModelInputRef.value?.resetValidation();

      if (isStoreMode.value) {
        item.value.vehicle_version_id = null;
      }

      getVehicleVersions(newModelId, newYear);
    } else {
      isAddingNewModel.value = false;
      newModelName.value = "";
      if (isStoreMode.value) {
        item.value.vehicle_version_id = null;
      }
    }
  }
);

// Cambios de versión
watch(
  () => item.value?.vehicle_version_id,
  (newVersionId) => {
    if (!item.value) return;
    if (newVersionId === 0) {
      isAddingNewVersion.value = true;
    } else {
      isAddingNewVersion.value = false;
      newVersionName.value = "";
      newVersionInputRef.value?.resetValidation();
    }
  }
);

// Cambios de color
watch(
  () => item.value?.vehicle_color_id,
  (newColorId) => {
    if (!item.value) return;
    if (newColorId === 0) {
      isAddingNewColor.value = true;
    } else {
      isAddingNewColor.value = false;
      newColorName.value = "";
      newColorInputRef.value?.resetValidation();
    }
  }
);

// Inicialización
onMounted(() => {
  getCatalogs();
  getItem();
});
</script>