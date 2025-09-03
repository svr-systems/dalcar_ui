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
                      :text="`AUTO${isStoreMode ? '' : ' | ' + (item.uiid || '')}`"
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
                      v-model="item.issued_at"
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
                    <v-select
                      v-if="!isAddingNewBrand"
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
                    <v-text-field
                      v-else
                      ref="newBrandInputRef"
                      label="Nueva Marca"
                      v-model="newBrandName"
                      variant="outlined"
                      density="compact"
                      :rules="rules.textRequired"
                      maxlength="50"
                      @keydown.enter.prevent="addNewBrandAndModel"
                    >
                      <template #append-inner>
                        <v-btn
                          icon
                          variant="text"
                          size="small"
                          color="success"
                          :loading="isSavingNewBrand"
                          @click="addNewBrandAndModel"
                        >
                          <v-icon>mdi-check</v-icon>
                        </v-btn>
                      </template>
                    </v-text-field>
                  </v-col>

                  <v-col cols="12" md="3">
                    <v-select
                      v-if="!isAddingNewModel"
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
                    <InpYear
                      label="Año"
                      v-model="item.plan_year"
                      :rules="rules.yearRequired"
                      :maxYear="currentYear"
                      :minYear="currentYear - 40"
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
                  v-for="(legacy_vehicle_investor, i) of item.legacy_vehicle_investors"
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
                    <v-btn size="x-small" color="warning" @click="legacyVehicleInvestorsAdd()">
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
                    <InpDate
                      label="Fecha"
                      v-model="overhead.date"
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
                    <v-btn size="x-small" color="warning" @click="overheadAdd()">
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
                <v-tooltip activator="parent" location="left">Continuar</v-tooltip>
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
import { getDecodeId } from "@/utils/coders";
import { getRules } from "@/utils/validators";
import { getAmountFormat } from "@/utils/formatters";
import { getCurrentYear } from "@/utils/helpers";
import { getDateTime } from "@/utils/formatters";

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
const vatTypes = ref([]);
const vatTypesLoading = ref(true);
const vendorTypes = ref([]);
const vendorTypesLoading = ref(true);
const vehicleColors = ref([]);
const vehicleColorsLoading = ref(true);
const isAddingNewBrand = ref(false);
const isAddingNewModel = ref(false);
const isAddingNewColor = ref(false);
const newBrandName = ref("");
const newModelName = ref("");
const newColorName = ref("");
const newBrandInputRef = ref(null);
const newModelInputRef = ref(null);
const newColorInputRef = ref(null);
const isSavingNewBrand = ref(false);
const isSavingNewModel = ref(false);
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
    // Agrega opción OTRO
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

const getItem = async () => {
  if (isStoreMode.value) {
    item.value = {
      branch_id: 1,
      issued_at: currentDate.value,
      vendor_id: null,
      vehicle_brand_id: null,
      vehicle_model_id: null,
      vehicle_transmission_id: null,
      plan_year: currentYear.value,
      vehicle_color_id: null,
      vin: null,
      purchase: null,
      commission: null,
      vat_type_id: null,
      invoice: null,
      legacy_vehicle_investors: [],
      overheads: [],
    };
    legacyVehicleInvestorsAdd();
    overheadAdd();
    isLoading.value = false;
  } else {
    try {
      const endpoint = `${URL_API}/${routeName}/${itemId.value}`;
      const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
      item.value = getRsp(response).data.item;

      if (item.value?.vehicle_brand_id) {
        await getVehicleModels(item.value.vehicle_brand_id);
      }
    } catch (err) {
      alert?.show("red-darken-1", getErr(err));
    } finally {
      isLoading.value = false;
    }
  }
};

const addNewBrandAndModel = async () => {
  if (!newBrandName.value || newBrandName.value.trim() === "") {
    alert?.show("red-darken-1", "Por favor, ingresa el nombre de la nueva marca.");
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
      vehicle_models: [{ name: "OTRO" }],
    };
    const endpoint = `${URL_API}/vehicle_brands`;
    const response = await axios.post(endpoint, payload, getHdrs(store.getAuth?.token));
    // Obtener el ID del nuevo registro desde la respuesta del POST
    const newBrandId = getRsp(response).data.item.id;

    alert?.show("green-darken-1", "Nueva marca agregada con éxito.");

    // Realizar una SEGUNDA LLAMADA a la API para obtener el registro completo
    const getEndpoint = `${URL_API}/vehicle_brands/${newBrandId}`;
    const getResponse = await axios.get(getEndpoint, getHdrs(store.getAuth?.token));
    const newBrand = getRsp(getResponse).data.item; // Obtener el objeto completo

    // Elimina la opción "OTRO" de la lista para poder reordenarla
    const otroOption = vehicleBrands.value.pop();
    // Crea una nueva referencia al arreglo para asegurar la reactividad
    vehicleBrands.value = [...vehicleBrands.value, newBrand, otroOption];

    // Selecciona la nueva marca
    item.value.vehicle_brand_id = newBrand.id;

    // Reset UI
    newBrandName.value = "";
    isAddingNewBrand.value = false;
    newBrandInputRef.value?.resetValidation();

    // Cargar modelos de la marca recién creada
    await getVehicleModels(newBrand.id);
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isSavingNewBrand.value = false;
  }
};

const addNewModel = async () => {
  if (!newModelName.value || newModelName.value.trim() === "") {
    alert?.show("red-darken-1", "Por favor, ingresa el nombre del nuevo modelo.");
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
      vehicle_brand_id: item.value.vehicle_brand_id,
    };
    const endpoint = `${URL_API}/vehicle_models`;
    const response = await axios.post(endpoint, payload, getHdrs(store.getAuth?.token));
    // Obtener el ID del nuevo registro desde la respuesta del POST
    const newModelId = getRsp(response).data.item.id;

    alert?.show("green-darken-1", "Nuevo modelo agregado con éxito.");

    // Realizar una SEGUNDA LLAMADA a la API para obtener el registro completo
    const getEndpoint = `${URL_API}/vehicle_models/${newModelId}`;
    const getResponse = await axios.get(getEndpoint, getHdrs(store.getAuth?.token));
    const newModel = getRsp(getResponse).data.item; // Obtener el objeto completo

    // Elimina la opción "OTRO" de la lista para poder reordenarla
    const otroOption = vehicleModels.value.pop();
    // Crea una nueva referencia al arreglo para asegurar la reactividad
    vehicleModels.value = [...vehicleModels.value, newModel, otroOption];

    // Selecciona el modelo recién creado
    item.value.vehicle_model_id = newModel.id;

    // Reset UI
    newModelName.value = "";
    isAddingNewModel.value = false;
    newModelInputRef.value?.resetValidation();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isSavingNewModel.value = false;
  }
};

const addNewColor = async () => {
  if (!newColorName.value || newColorName.value.trim() === "") {
    alert?.show("red-darken-1", "Por favor, ingresa el nombre del nuevo color.");
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
    const response = await axios.post(endpoint, payload, getHdrs(store.getAuth?.token));
    // Obtener el ID del nuevo registro desde la respuesta del POST
    const newColorId = getRsp(response).data.item.id;

    alert?.show("green-darken-1", "Nuevo color agregado con éxito.");

    // Realizar una SEGUNDA LLAMADA a la API para obtener el registro completo
    const getEndpoint = `${URL_API}/vehicle_colors/${newColorId}`;
    const getResponse = await axios.get(getEndpoint, getHdrs(store.getAuth?.token));
    const newColor = getRsp(getResponse).data.item; // Obtener el objeto completo

    // Elimina la opción "OTRO" de la lista para poder reordenarla
    const otroOption = vehicleColors.value.pop();
    // Crea una nueva referencia al arreglo para asegurar la reactividad
    vehicleColors.value = [...vehicleColors.value, newColor, otroOption];

    // Selecciona el color recién creado
    item.value.vehicle_color_id = newColor.id;

    // Reset UI
    newColorName.value = "";
    isAddingNewColor.value = false;
    newColorInputRef.value?.resetValidation();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isSavingNewColor.value = false;
  }
};

const handleAction = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) {
    alert?.show("red-darken-1", "Revisa los detalles señalados");
    return;
  }

  // Agregar o editar
  const confirmed = await confirm?.show(
    `¿Confirma ${isStoreMode.value ? "agregar" : "editar"} registro?`
  );
  if (!confirmed) return;

  // isLoading.value = true;
  // const payload = getObj(item.value, isStoreMode.value);

  // try {
  //   // const endpoint = `${URL_API}/${routeName}${
  //   //   !isStoreMode.value ? `/${payload.id}` : ""
  //   // }`;
  //   // const response = getRsp(
  //   //   await axios.post(
  //   //     endpoint,
  //   //     getFormData(payload),
  //   //     getHdrs(store.getAuth?.token, true)
  //   //   )
  //   // );

  //   // alert?.show("success", response.msg);

  //   // router.push({
  //   //   name: `${routeName}/show`,
  //   //   params: {
  //   //     id: getEncodeId(isStoreMode.value ? response.data.item.id : itemId.value),
  //   //   },
  //   // });

  //   alert?.show("success", "Registro agregado correctamente");

  //   router.push({
  //     name: `${routeName}`,
  //   });
  // } catch (err) {
  //   alert?.show("red-darken-1", getErr(err));
  // } finally {
  //   isLoading.value = false;
  // }
};

const legacyVehicleInvestorsAdd = () => {
  item.value.legacy_vehicle_investors.push({
    id: null,
    is_active: 1,
    investor_id: null,
    percentage: null,
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

const overheadAdd = () => {
  item.value.overheads.push({
    id: null,
    overhead_type_id: null,
    observation: null,
    date: null,
    amount: null,
  });
};

// Cambios de marca
watch(
  () => item.value?.vehicle_brand_id,
  (newBrandId) => {
    if (!item.value) return;
    if (newBrandId === 0) {
      // Seleccionó "OTRO"
      isAddingNewBrand.value = true;
      item.value.vehicle_model_id = null; // limpiar modelo
    } else if (newBrandId) {
      isAddingNewBrand.value = false;
      newBrandName.value = "";
      newBrandInputRef.value?.resetValidation();
      item.value.vehicle_model_id = null;
      getVehicleModels(newBrandId);
    } else {
      // Limpieza si se borra
      isAddingNewBrand.value = false;
      newBrandName.value = "";
      vehicleModels.value = [];
    }
  }
);

// Cambios de modelo
watch(
  () => item.value?.vehicle_model_id,
  (newModelId) => {
    if (!item.value) return;
    if (newModelId === 0) {
      isAddingNewModel.value = true; // mostrar input de modelo
    } else {
      isAddingNewModel.value = false;
      newModelName.value = "";
      newModelInputRef.value?.resetValidation();
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