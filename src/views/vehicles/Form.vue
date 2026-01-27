<template>
  <v-btn
    icon
    :variant="variant"
    :size="size"
    density="comfortable"
    @click="formOpenDialog"
  >
    <v-icon>mdi-pencil</v-icon>
    <v-tooltip activator="parent" location="left">
      {{ tooltip }}
    </v-tooltip>
  </v-btn>

  <v-dialog
    v-model="formIsDialogOpen"
    transition="dialog-bottom-transition"
    scrim="black"
    max-width="1100"
    persistent
  >
    <v-card :disabled="formIsLoading" :loading="formIsLoading">
      <v-card-title class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <CardTitle text="EDITAR VEHÍCULO" sub />
        </div>

        <v-btn
          icon
          variant="outlined"
          size="x-small"
          density="comfortable"
          @click="formIsDialogOpen = false"
        >
          <v-icon>mdi-close</v-icon>
          <v-tooltip activator="parent" location="left"> Cerrar </v-tooltip>
        </v-btn>
      </v-card-title>

      <v-card-text v-if="formItem">
        <v-form ref="formRef" @submit.prevent>
          <v-row dense>
            <v-col cols="12" md="3">
              <VisVal
                label="Marca"
                :value="
                  formItem.vehicle_version.vehicle_model.vehicle_brand.name
                "
                class="pb-4 ps-4"
              />
            </v-col>

            <v-col cols="12" md="3">
              <VisVal
                label="Modelo"
                :value="formItem.vehicle_version.vehicle_model.name"
                class="pb-4 ps-4"
              />
            </v-col>

            <v-col cols="12" md="3">
              <VisVal
                label="Año"
                :value="formItem.vehicle_version.model_year"
                class="pb-4 ps-4"
              />
            </v-col>

            <v-col cols="12" md="3">
              <VisVal
                label="Versión"
                :value="formItem.vehicle_version.name"
                class="pb-4 ps-4"
              />
            </v-col>

            <v-col cols="12" md="3">
              <v-select
                v-if="!isAddingNewColor"
                label="Color"
                v-model="formItem.vehicle_color_id"
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
                v-model="formItem.vehicle_transmission_id"
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
                label="VIN*"
                v-model="formItem.vin"
                type="text"
                variant="outlined"
                density="compact"
                maxlength="17"
                counter
                :rules="rules.textOptional"
                autocomplete="off"
              />
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field
                label="Motor*"
                v-model="formItem.engine_number"
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
                v-model="formItem.repuve"
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
                v-model="formItem.vehicle_key"
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
                v-model="formItem.passenger_capacity"
                type="number"
                variant="outlined"
                density="compact"
                :rules="rules.required"
                autocomplete="off"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                label="Observaciones*"
                v-model="formItem.notes"
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

          <v-divider class="my-3" />

          <v-row dense>
            <v-col cols="12">
              <CardTitle text="PROCEDENCIA" sub />
            </v-col>

            <v-col cols="12" md="3">
              <v-select
                label="Tipo"
                v-model="formItem.origin_type_id"
                :items="originTypes"
                :loading="originTypesLoading"
                item-value="id"
                item-title="name"
                variant="outlined"
                density="compact"
                :rules="rules.required"
              />
            </v-col>

            <v-col v-if="formItem.origin_type_id > 1" cols="12" md="3">
              <v-text-field
                label="Pedimento"
                v-model="formItem.pediment_number"
                type="text"
                variant="outlined"
                density="compact"
                maxlength="30"
                counter
                :rules="rules.textRequired"
                autocomplete="off"
              />
            </v-col>

            <v-col v-if="formItem.origin_type_id > 1" cols="12" md="3">
              <InpDate
                label="Fecha"
                v-model="formItem.pediment_date"
                :rules="rules.required"
                :before="true"
              />
            </v-col>

            <v-col v-if="formItem.origin_type_id > 1" cols="12" md="3">
              <v-autocomplete
                v-if="!isAddingNewCustomOffice"
                label="Aduana"
                v-model="formItem.custom_office_id"
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

            <v-col v-if="formItem.origin_type_id > 1" cols="12">
              <v-text-field
                label="Observaciones*"
                v-model="formItem.pediment_notes"
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

          <v-row dense>
            <v-col cols="12" class="d-flex align-center justify-end">
              <v-btn
                size="small"
                color="warning"
                :loading="formIsLoading"
                :disabled="formIsLoading"
                @click="formSubmit"
              >
                Guardar
                <v-icon end>mdi-check</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { inject, ref, onMounted, watch } from "vue";
import axios from "axios";

import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getHdrs, getRsp, getErr } from "@/utils/http";
import { getRules } from "@/utils/validators";
import { getObj } from "@/utils/helpers";

import CardTitle from "@/components/CardTitle.vue";
import VisVal from "@/components/VisVal.vue";
import InpDate from "@/components/InpDate.vue";

const routeName = "vehicles";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  tooltip: {
    type: String,
    default: "Editar",
  },
  variant: {
    type: String,
    default: "outlined",
  },
  size: {
    type: String,
    default: "x-small",
  },
});

const emit = defineEmits(["saved"]);

const store = useStore();
const rules = getRules();
const alert = inject("alert");
const confirm = inject("confirm");

const formIsDialogOpen = ref(false);
const formIsLoading = ref(false);
const formRef = ref(null);
const formItem = ref(null);

const vehicleColors = ref([]);
const vehicleColorsLoading = ref(false);

const vehicleTransmissions = ref([]);
const vehicleTransmissionsLoading = ref(false);

const originTypes = ref([]);
const originTypesLoading = ref(true);

const customsOffices = ref([]);
const customsOfficesLoading = ref(true);

// Flags "OTRO" + inputs
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

// --- Catálogos base ---
const getCatalogs = async () => {
  let endpoint = null;
  let response = null;

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

// --- Apertura del diálogo ---
const formOpenDialog = () => {
  formItem.value = props.item ? JSON.parse(JSON.stringify(props.item)) : null;

  if (formItem.value) {
    const brandId =
      formItem.value.vehicle_version.vehicle_model.vehicle_brand_id;
    getVehicleColors(brandId);
    getVehicleTransmissions(brandId);
  }

  formIsDialogOpen.value = true;
};

// --- Watchers para opción "OTRO" ---
watch(
  () => formItem.value?.vehicle_color_id,
  (newColorId) => {
    if (!formItem.value) return;
    if (newColorId === 0) {
      isAddingNewColor.value = true;
    } else {
      isAddingNewColor.value = false;
      newColorName.value = "";
      newColorInputRef.value?.resetValidation();
    }
  },
);

watch(
  () => formItem.value?.vehicle_transmission_id,
  (newTransmissionId) => {
    if (!formItem.value) return;
    if (newTransmissionId === 0) {
      isAddingNewTransmission.value = true;
      newTransmissionName.value = "";
    } else {
      isAddingNewTransmission.value = false;
      newTransmissionName.value = "";
      newTransmissionInputRef.value?.resetValidation();
    }
  },
);

watch(
  () => formItem.value?.custom_office_id,
  (newCustomOfficeId) => {
    if (!formItem.value) return;
    if (newCustomOfficeId === 0) {
      isAddingNewCustomOffice.value = true;
      newCustomOfficeName.value = "";
    } else {
      isAddingNewCustomOffice.value = false;
      newCustomOfficeName.value = "";
      newCustomOfficeInputRef.value?.resetValidation();
    }
  },
);

// --- Altas de catálogo inline ---
const addNewColor = async () => {
  if (!newColorName.value || newColorName.value.trim() === "") {
    alert?.show(
      "red-darken-1",
      "Por favor, ingresa el nombre del nuevo color.",
    );
    return;
  }

  const brandId =
    formItem.value?.vehicle_version?.vehicle_model?.vehicle_brand_id;

  if (!brandId) {
    alert?.show(
      "red-darken-1",
      "Debes seleccionar una Marca de Vehículo antes de agregar un nuevo color.",
    );
    return;
  }

  const confirmed = await confirm?.show(
    `¿Confirma agregar el nuevo color "${newColorName.value}"?`,
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
      getHdrs(store.getAuth?.token),
    );
    const newColorId = getRsp(response).data.item.id;

    alert?.show("green-darken-1", "Nuevo color agregado con éxito.");

    const getEndpoint = `${URL_API}/vehicle_colors/${newColorId}`;
    const getResponse = await axios.get(
      getEndpoint,
      getHdrs(store.getAuth?.token),
    );
    const newColor = getRsp(getResponse).data.item;

    const otroOption = vehicleColors.value.pop();
    vehicleColors.value = [...vehicleColors.value, newColor, otroOption];
    formItem.value.vehicle_color_id = newColor.id;

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
  if (formItem.value) {
    formItem.value.vehicle_color_id = null;
  }
};

const addNewTransmission = async () => {
  if (!newTransmissionName.value || newTransmissionName.value.trim() === "") {
    alert?.show(
      "red-darken-1",
      "Por favor, ingresa el nombre de la nueva transmisión.",
    );
    return;
  }

  const brandId =
    formItem.value?.vehicle_version?.vehicle_model?.vehicle_brand_id;

  if (!brandId) {
    alert?.show(
      "red-darken-1",
      "Debes seleccionar una Marca de Vehículo antes de agregar una nueva transmisión.",
    );
    return;
  }

  const confirmed = await confirm?.show(
    `¿Confirma agregar la nueva transmisión "${newTransmissionName.value}"?`,
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
      getHdrs(store.getAuth?.token),
    );
    const newTransmissionId = getRsp(response).data.item.id;

    alert?.show("green-darken-1", "Nueva transmisión agregada con éxito.");

    const getEndpoint = `${URL_API}/vehicle_transmissions/${newTransmissionId}`;
    const getResponse = await axios.get(
      getEndpoint,
      getHdrs(store.getAuth?.token),
    );
    const newTransmission = getRsp(getResponse).data.item;

    const otroOption = vehicleTransmissions.value.pop();
    vehicleTransmissions.value = [
      ...vehicleTransmissions.value,
      newTransmission,
      otroOption,
    ];
    formItem.value.vehicle_transmission_id = newTransmission.id;

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
  if (formItem.value) {
    formItem.value.vehicle_transmission_id = null;
  }
};

const addNewCustomOffice = async () => {
  if (!newCustomOfficeName.value || newCustomOfficeName.value.trim() === "") {
    alert?.show(
      "red-darken-1",
      "Por favor, ingresa el nombre de la nueva aduana.",
    );
    return;
  }

  const confirmed = await confirm?.show(
    `¿Confirma agregar la nueva aduana "${newCustomOfficeName.value}"?`,
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
      getHdrs(store.getAuth?.token),
    );
    const newCustomOfficeId = getRsp(response).data.item.id;

    alert?.show("green-darken-1", "Nueva aduana agregada con éxito.");

    const getEndpoint = `${URL_API}/custom_offices/${newCustomOfficeId}`;
    const getResponse = await axios.get(
      getEndpoint,
      getHdrs(store.getAuth?.token),
    );
    const newCustomOffice = getRsp(getResponse).data.item;

    const otroOption = customsOffices.value.pop();
    customsOffices.value = [
      ...customsOffices.value,
      newCustomOffice,
      otroOption,
    ];
    formItem.value.custom_office_id = newCustomOffice.id;

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
  if (formItem.value) {
    formItem.value.custom_office_id = null;
  }
};

// --- Submit ---
const formSubmit = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) {
    alert?.show("red-darken-1", "Revisa los detalles señalados");
    return;
  }

  const confirmed = await confirm?.show("¿Confirma guardar los cambios?");
  if (!confirmed) return;

  formIsLoading.value = true;
  const payload = getObj(formItem.value);

  try {
    const endpoint = `${URL_API}/${routeName}/${payload.id}`;
    const response = getRsp(
      await axios.post(endpoint, payload, getHdrs(store.getAuth?.token)),
    );

    alert?.show("success", response.msg);

    formIsDialogOpen.value = false;

    emit("saved", { item: payload });
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    formIsLoading.value = false;
  }
};

onMounted(() => {
  getCatalogs();
});
</script>
