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
                      label="Fecha de adquisición"
                      v-model="item.purchase_date"
                      :rules="rules.required"
                      :before="true"
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
                      autocomplete="off"
                    />
                    <v-text-field
                      v-else
                      ref="newBrandInputRef"
                      label="Nueva Marca"
                      v-model="newBrandName"
                      variant="outlined"
                      density="compact"
                      :rules="rules.textRequired"
                      autocomplete="off"
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
                      autocomplete="off"
                    />
                    <v-text-field
                      v-else
                      ref="newModelInputRef"
                      label="Nuevo Modelo"
                      v-model="newModelName"
                      variant="outlined"
                      density="compact"
                      :rules="rules.textRequired"
                      autocomplete="off"
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
                      autocomplete="off"
                    />
                    <v-text-field
                      v-else
                      ref="newVersionInputRef"
                      label="Nueva Versión"
                      v-model="newVersionName"
                      variant="outlined"
                      density="compact"
                      :rules="rules.textRequired"
                      autocomplete="off"
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
                      autocomplete="off"
                    />
                    <v-text-field
                      v-else
                      ref="newColorInputRef"
                      label="Nuevo Color"
                      v-model="newColorName"
                      variant="outlined"
                      density="compact"
                      :rules="rules.textRequired"
                      autocomplete="off"
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
                    <v-select
                      v-if="!isAddingNewTransmission"
                      label="Transmisión"
                      v-model="item.vehicle_transmission_id"
                      :items="vehicleTransmissions"
                      :loading="vehicleTransmissionsLoading"
                      item-value="id"
                      item-title="name"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                      autocomplete="off"
                    />
                    <v-text-field
                      v-else
                      ref="newTransmissionInputRef"
                      label="Nueva Transmisión"
                      v-model="newTransmissionName"
                      variant="outlined"
                      density="compact"
                      :rules="rules.textRequired"
                      autocomplete="off"
                      maxlength="50"
                      @keydown.enter.prevent="addNewTransmission"
                    >
                      <template #append-inner>
                        <v-btn
                          icon
                          variant="text"
                          size="small"
                          color="error"
                          @click="cancelAddingNewTransmission"
                        >
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                        <v-btn
                          icon
                          variant="text"
                          size="small"
                          color="success"
                          :loading="isSavingNewTransmission"
                          @click="addNewTransmission"
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
                      autocomplete="off"
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
                      autocomplete="off"
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
                      autocomplete="off"
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
                      autocomplete="off"
                    />
                  </v-col>

                  <v-col cols="12" md="3">
                    <v-text-field
                      label="Número de pasajeros"
                      v-model="item.passenger_capacity"
                      type="number"
                      variant="outlined"
                      density="compact"
                      maxlength="70"
                      counter
                      :rules="rules.required"
                      autocomplete="off"
                    />
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      label="Observaciones*"
                      v-model="item.notes"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="255"
                      counter
                      :rules="rules.textOptional"
                      autocomplete="off"
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

                  <v-col v-if="item.origin_type_id > 1" cols="12" md="3">
                    <v-text-field
                      label="Pedimento"
                      v-model="item.pediment_number"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="30"
                      counter
                      :rules="rules.textRequired"
                      autocomplete="off"
                    />
                  </v-col>

                  <v-col v-if="item.origin_type_id > 1" cols="12" md="3">
                    <InpDate
                      label="Fecha"
                      v-model="item.pediment_date"
                      :rules="rules.required"
                      :before="true"
                    />
                  </v-col>

                  <v-col v-if="item.origin_type_id > 1" cols="12" md="3">
                    <v-autocomplete
                      v-if="!isAddingNewCustomOffice"
                      label="Aduana"
                      v-model="item.custom_office_id"
                      :items="customsOffices"
                      :loading="customsOfficesLoading"
                      item-value="id"
                      item-title="name"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                      autocomplete="off"
                    />
                    <v-text-field
                      v-else
                      ref="newCustomOfficeInputRef"
                      label="Nueva Aduana"
                      v-model="newCustomOfficeName"
                      variant="outlined"
                      density="compact"
                      :rules="rules.textRequired"
                      autocomplete="off"
                      maxlength="50"
                      @keydown.enter.prevent="addNewCustomOffice"
                    >
                      <template #append-inner>
                        <v-btn
                          icon
                          variant="text"
                          size="small"
                          color="error"
                          @click="cancelAddingNewCustomOffice"
                        >
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                        <v-btn
                          icon
                          variant="text"
                          size="small"
                          color="success"
                          :loading="isSavingNewCustomOffice"
                          @click="addNewCustomOffice"
                        >
                          <v-icon>mdi-check</v-icon>
                        </v-btn>
                      </template>
                    </v-text-field>
                  </v-col>

                  <v-col v-if="item.origin_type_id > 1" cols="12">
                    <v-text-field
                      label="Observaciones*"
                      v-model="item.pediment_notes"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="255"
                      counter
                      :rules="rules.textOptional"
                      autocomplete="off"
                    />
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
import { ref, inject, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";

import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getHdrs, getErr, getRsp } from "@/utils/http";
import { getDecodeId, getEncodeId } from "@/utils/coders";
import { getRules } from "@/utils/validators";
import { getCurrentYear, getObj } from "@/utils/helpers";
import { getDateTime, getAmountFormat } from "@/utils/formatters";

import BtnBack from "@/components/BtnBack.vue";
import CardTitle from "@/components/CardTitle.vue";
import InpDate from "@/components/InpDate.vue";
import InpYear from "@/components/InpYear.vue";

const routeName = "legacy_vehicles";
const currentDate = ref(getDateTime("-", "", "", false));
const currentYear = ref(getCurrentYear());

const alert = inject("alert");
const confirm = inject("confirm");
const store = useStore();
const router = useRouter();
const route = useRoute();

const itemId = ref(route.params.id ? getDecodeId(route.params.id) : null);
const isStoreMode = ref(!itemId.value);
const isLoading = ref(true);
const formRef = ref(null);
const item = ref(null);
const rules = getRules();

const vehicleBrands = ref([]);
const vehicleBrandsLoading = ref(true);
const vehicleModels = ref([]);
const vehicleModelsLoading = ref(false);
const vehicleVersions = ref([]);
const vehicleVersionsLoading = ref(false);
const vehicleColors = ref([]);
const vehicleColorsLoading = ref(false);
const vehicleTransmissions = ref([]);
const vehicleTransmissionsLoading = ref(false);
const originTypes = ref([]);
const originTypesLoading = ref(true);
const customsOffices = ref([]);
const customsOfficesLoading = ref(true);

const isAddingNewBrand = ref(false);
const newBrandName = ref("");
const newBrandInputRef = ref(null);
const isSavingNewBrand = ref(false);

const isAddingNewModel = ref(false);
const newModelName = ref("");
const newModelInputRef = ref(null);
const isSavingNewModel = ref(false);

const isAddingNewVersion = ref(false);
const newVersionName = ref("");
const newVersionInputRef = ref(null);
const isSavingNewVersion = ref(false);

const isAddingNewColor = ref(false);
const newColorName = ref("");
const newColorInputRef = ref(null);
const isSavingNewColor = ref(false);

const isAddingNewTransmission = ref(false);
const newTransmissionName = ref("");
const newTransmissionInputRef = ref(null);
const isSavingNewTransmission = ref(false);

const isAddingNewCustomOffice = ref(false);
const newCustomOfficeName = ref("");
const newCustomOfficeInputRef = ref(null);
const isSavingNewCustomOffice = ref(false);

const getCatalogs = async () => {
  let endpoint = null;
  let response = null;

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

  vehicleTransmissionsLoading.value = false;

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
    endpoint = `${URL_API}/custom_offices?is_active=1&filter=0`;
    response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    customsOffices.value = getRsp(response).data.items;
    customsOffices.value.push({ id: 0, name: "OTRO" });
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

const getVehicleColors = async (brandId) => {
  if (!brandId) {
    vehicleColors.value = [];
    return;
  }

  vehicleColorsLoading.value = true;

  try {
    const endpoint = `${URL_API}/vehicle_colors?is_active=1&vehicle_brand_id=${brandId}`;
    const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    const colors = getRsp(response).data.items;
    colors.push({ id: 0, name: "OTRO" });
    vehicleColors.value = colors;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    vehicleColorsLoading.value = false;
  }
};

const getVehicleTransmissions = async (brandId) => {
  if (!brandId) {
    vehicleTransmissions.value = [];
    return;
  }

  vehicleTransmissionsLoading.value = true;

  try {
    const endpoint = `${URL_API}/vehicle_transmissions?is_active=1&filter=0&vehicle_brand_id=${brandId}`;
    const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    const transmissions = getRsp(response).data.items;

    transmissions.push({ id: 0, name: "OTRO" });
    vehicleTransmissions.value = transmissions;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    vehicleTransmissionsLoading.value = false;
  }
};

const getItem = async () => {
  if (isStoreMode.value) {
    item.value = {
      branch_id: 1,
      purchase_date: currentDate.value,
      vehicle_version_id: null,
      vehicle_version: {
        vehicle_model_id: null,
        vehicle_model: {
          vehicle_brand_id: null,
        },
        model_year: null,
      },
      vehicle_color_id: null,
      vehicle_transmission_id: null,
      vin: null,
      engine_number: null,
      repuve: null,
      vehicle_key: null,
      notes: null,
      origin_type_id: null,
      pediment_number: null,
      pediment_date: null,
      custom_office_id: null,
      pediment_notes: null,
      passenger_capacity: null,
    };
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

// vehicle_brand_id
watch(
  () => item.value?.vehicle_version?.vehicle_model?.vehicle_brand_id,
  (newBrandId, oldBrandId) => {
    if (!item.value) return;

    const isEditMode = !isStoreMode.value;
    const isFirstRunInEdit = isEditMode && oldBrandId === undefined;

    if (isFirstRunInEdit) {
      if (newBrandId) {
        getVehicleModels(newBrandId);
        getVehicleColors(newBrandId);
        getVehicleTransmissions(newBrandId);
      }
      return;
    }

    if (newBrandId === oldBrandId) return;

    if (newBrandId === 0) {
      isAddingNewBrand.value = true;
      newBrandName.value = "";
      vehicleModels.value = [];
      vehicleColors.value = [];
      vehicleTransmissions.value = [];
      item.value.vehicle_version.vehicle_model_id = null;
      item.value.vehicle_color_id = null;
      item.value.vehicle_transmission_id = null;
      return;
    }

    if (newBrandId) {
      isAddingNewBrand.value = false;
      newBrandName.value = "";
      newBrandInputRef.value?.resetValidation();
      item.value.vehicle_version.vehicle_model_id = null;
      item.value.vehicle_color_id = null;
      item.value.vehicle_transmission_id = null;
      getVehicleModels(newBrandId);
      getVehicleColors(newBrandId);
      getVehicleTransmissions(newBrandId);
    } else {
      isAddingNewBrand.value = false;
      newBrandName.value = "";
      vehicleModels.value = [];
      vehicleColors.value = [];
      vehicleTransmissions.value = [];
      item.value.vehicle_version.vehicle_model_id = null;
      item.value.vehicle_color_id = null;
      item.value.vehicle_transmission_id = null;
    }
  }
);

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
    await getVehicleColors(newBrand.id);
    await getVehicleTransmissions(newBrand.id);
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isSavingNewBrand.value = false;
  }
};

const cancelAddingNewBrand = () => {
  isAddingNewBrand.value = false;
  newBrandName.value = "";
  newBrandInputRef.value?.resetValidation();
  item.value.vehicle_version.vehicle_model.vehicle_brand_id = null;
};

// vehicle_model_id
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

const cancelAddingNewModel = () => {
  isAddingNewModel.value = false;
  newModelName.value = "";
  newModelInputRef.value?.resetValidation();
  item.value.vehicle_version.vehicle_model_id = null;
};

// vehicle_version_id
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

const cancelAddingNewVersion = () => {
  isAddingNewVersion.value = false;
  newVersionName.value = "";
  newVersionInputRef.value?.resetValidation();
  item.value.vehicle_version_id = null;
};

// vehicle_color_id
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

const addNewColor = async () => {
  if (!newColorName.value || newColorName.value.trim() === "") {
    alert?.show(
      "red-darken-1",
      "Por favor, ingresa el nombre del nuevo color."
    );
    return;
  }

  const brandId = item.value?.vehicle_version?.vehicle_model?.vehicle_brand_id;

  if (!brandId) {
    alert?.show(
      "red-darken-1",
      "Debes seleccionar una Marca de Vehículo antes de agregar un nuevo color."
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
      vehicle_brand_id: brandId,
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

const cancelAddingNewColor = () => {
  isAddingNewColor.value = false;
  newColorName.value = "";
  newColorInputRef.value?.resetValidation();
  item.value.vehicle_color_id = null;
};

// vehicle_transmission_id
watch(
  () => item.value?.vehicle_transmission_id,
  (newTransmissionId) => {
    if (!item.value) return;
    if (newTransmissionId === 0) {
      isAddingNewTransmission.value = true;
      newTransmissionName.value = "";
    } else {
      isAddingNewTransmission.value = false;
      newTransmissionName.value = "";
      newTransmissionInputRef.value?.resetValidation();
    }
  }
);

const addNewTransmission = async () => {
  if (!newTransmissionName.value || newTransmissionName.value.trim() === "") {
    alert?.show(
      "red-darken-1",
      "Por favor, ingresa el nombre de la nueva transmisión."
    );
    return;
  }

  const brandId = item.value?.vehicle_version?.vehicle_model?.vehicle_brand_id;

  if (!brandId) {
    alert?.show(
      "red-darken-1",
      "Debes seleccionar una Marca de Vehículo antes de agregar una nueva transmisión."
    );
    return;
  }

  const confirmed = await confirm?.show(
    `¿Confirma agregar la nueva transmisión "${newTransmissionName.value}"?`
  );
  if (!confirmed) return;

  isSavingNewTransmission.value = true;
  try {
    const payload = {
      name: newTransmissionName.value.trim(),
      vehicle_brand_id: brandId,
    };
    const endpoint = `${URL_API}/vehicle_transmissions`;
    const response = await axios.post(
      endpoint,
      payload,
      getHdrs(store.getAuth?.token)
    );
    const newTransmissionId = getRsp(response).data.item.id;

    alert?.show("green-darken-1", "Nueva transmisión agregada con éxito.");

    const getEndpoint = `${URL_API}/vehicle_transmissions/${newTransmissionId}`;
    const getResponse = await axios.get(
      getEndpoint,
      getHdrs(store.getAuth?.token)
    );
    const newTransmission = getRsp(getResponse).data.item;

    const otroOption = vehicleTransmissions.value.pop();
    vehicleTransmissions.value = [
      ...vehicleTransmissions.value,
      newTransmission,
      otroOption,
    ];
    item.value.vehicle_transmission_id = newTransmission.id;

    newTransmissionName.value = "";
    isAddingNewTransmission.value = false;
    newTransmissionInputRef.value?.resetValidation();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isSavingNewTransmission.value = false;
  }
};

const cancelAddingNewTransmission = () => {
  isAddingNewTransmission.value = false;
  newTransmissionName.value = "";
  newTransmissionInputRef.value?.resetValidation();
  item.value.vehicle_transmission_id = null;
};

// custom_office_id
watch(
  () => item.value?.custom_office_id,
  (newCustomOfficeId) => {
    if (!item.value) return;
    if (newCustomOfficeId === 0) {
      isAddingNewCustomOffice.value = true;
      newCustomOfficeName.value = "";
    } else {
      isAddingNewCustomOffice.value = false;
      newCustomOfficeName.value = "";
      newCustomOfficeInputRef.value?.resetValidation();
    }
  }
);

const addNewCustomOffice = async () => {
  if (!newCustomOfficeName.value || newCustomOfficeName.value.trim() === "") {
    alert?.show(
      "red-darken-1",
      "Por favor, ingresa el nombre de la nueva aduana."
    );
    return;
  }

  const confirmed = await confirm?.show(
    `¿Confirma agregar la nueva aduana "${newCustomOfficeName.value}"?`
  );
  if (!confirmed) return;

  isSavingNewCustomOffice.value = true;
  try {
    const payload = {
      name: newCustomOfficeName.value.trim(),
    };
    const endpoint = `${URL_API}/custom_offices`;
    const response = await axios.post(
      endpoint,
      payload,
      getHdrs(store.getAuth?.token)
    );
    const newCustomOfficeId = getRsp(response).data.item.id;

    alert?.show("green-darken-1", "Nueva aduana agregada con éxito.");

    const getEndpoint = `${URL_API}/custom_offices/${newCustomOfficeId}`;
    const getResponse = await axios.get(
      getEndpoint,
      getHdrs(store.getAuth?.token)
    );
    const newCustomOffice = getRsp(getResponse).data.item;

    const otroOption = customsOffices.value.pop();
    customsOffices.value = [
      ...customsOffices.value,
      newCustomOffice,
      otroOption,
    ];
    item.value.custom_office_id = newCustomOffice.id;

    newCustomOfficeName.value = "";
    isAddingNewCustomOffice.value = false;
    newCustomOfficeInputRef.value?.resetValidation();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isSavingNewCustomOffice.value = false;
  }
};

const cancelAddingNewCustomOffice = () => {
  isAddingNewCustomOffice.value = false;
  newCustomOfficeName.value = "";
  newCustomOfficeInputRef.value?.resetValidation();
  item.value.custom_office_id = null;
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

// Inicialización
onMounted(() => {
  getCatalogs();
  getItem();
});
</script>
