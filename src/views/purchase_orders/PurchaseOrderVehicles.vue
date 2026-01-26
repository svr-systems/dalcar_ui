<template>
  <v-card :disabled="isLoading" :loading="isLoading">
    <v-card-title class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <CardTitle
          :text="`AUTOS${
            purchase_order_vehicles_amount
              ? ` | ${getAmountFormat(purchase_order_vehicles_amount)}`
              : ''
          }`"
          sub
        />
      </div>

      <div>
        <v-btn
          v-if="
            purchaseOrder && purchaseOrder.is_active && total_amount_pending
          "
          icon
          variant="outlined"
          size="x-small"
          density="comfortable"
          color="warning"
          @click="formOpenDialog()"
        >
          <v-icon>mdi-plus</v-icon>
          <v-tooltip activator="parent" location="left"> Agregar </v-tooltip>
        </v-btn>
      </div>
    </v-card-title>

    <v-card-text>
      <v-row dense>
        <v-col cols="12">
          <v-table density="compact" striped="even">
            <thead class="font-weight-light text-caption text-medium-emphasis">
              <tr>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Año</th>
                <th>Versión</th>
                <th>Color</th>
                <th>VIN</th>
                <th>Monto de factura</th>
                <th>Comisión</th>
                <th>Precio compra</th>
                <th />
              </tr>
            </thead>

            <tbody>
              <tr v-for="(vehicleItem, i) in vehicles" :key="i">
                <td>
                  {{
                    vehicleItem.vehicle.vehicle_version.vehicle_model
                      .vehicle_brand.name
                  }}
                </td>
                <td>
                  {{ vehicleItem.vehicle.vehicle_version.vehicle_model.name }}
                </td>
                <td>{{ vehicleItem.vehicle.vehicle_version.model_year }}</td>
                <td>{{ vehicleItem.vehicle.vehicle_version.name }}</td>
                <td>{{ vehicleItem.vehicle.vehicle_color.name }}</td>
                <td>{{ vehicleItem.vehicle.vin }}</td>
                <td>{{ getAmountFormat(vehicleItem.invoice_amount) }}</td>
                <td>{{ getAmountFormat(vehicleItem.commission_amount) }}</td>
                <td>{{ getAmountFormat(vehicleItem.purchase_price) }}</td>
                <td class="text-right">
                  <v-btn
                    v-if="!purchaseOrder.paid_at"
                    icon
                    variant="text"
                    size="x-small"
                    density="comfortable"
                    @click="formOpenDialog(vehicleItem.id)"
                  >
                    <v-icon>mdi-file-eye</v-icon>
                    <v-tooltip activator="parent" location="left">
                      Ver | Editar
                    </v-tooltip>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <v-dialog
    v-model="formIsDialogOpen"
    transition="dialog-bottom-transition"
    scrim="black"
    max-width="1000"
  >
    <v-card :disabled="formIsLoading" :loading="formIsLoading">
      <v-card-title class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <CardTitle text="AUTO" sub />
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
          <v-row>
            <v-col cols="12">
              <v-card>
                <v-card-title>
                  <v-row dense>
                    <v-col cols="11">
                      <CardTitle
                        :text="`DETALLE${
                          formIsStoreMode
                            ? ''
                            : ' | ' + (formItem.vehicle.uiid || '')
                        }`"
                        sub
                      />
                    </v-col>
                    <v-col cols="1" class="text-right" />
                  </v-row>
                </v-card-title>

                <v-card-text>
                  <v-row dense>
                    <!-- Marca -->
                    <v-col cols="12" md="3">
                      <v-autocomplete
                        v-if="!isAddingNewBrand"
                        label="Marca"
                        v-model="
                          formItem.vehicle.vehicle_version.vehicle_model
                            .vehicle_brand_id
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

                    <!-- Modelo -->
                    <v-col cols="12" md="3">
                      <v-autocomplete
                        v-if="!isAddingNewModel"
                        label="Modelo"
                        v-model="
                          formItem.vehicle.vehicle_version.vehicle_model_id
                        "
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

                    <!-- Año -->
                    <v-col cols="12" md="3">
                      <InpYear
                        label="Año"
                        v-model="formItem.vehicle.vehicle_version.model_year"
                        :rules="rules.yearRequired"
                        :maxYear="currentYear"
                        :minYear="currentYear - 40"
                      />
                    </v-col>

                    <!-- Versión -->
                    <v-col cols="12" md="3">
                      <v-autocomplete
                        v-if="!isAddingNewVersion"
                        label="Versión"
                        v-model="formItem.vehicle.vehicle_version_id"
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

                    <!-- Color -->
                    <v-col cols="12" md="3">
                      <v-select
                        v-if="!isAddingNewColor"
                        label="Color"
                        v-model="formItem.vehicle.vehicle_color_id"
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

                    <!-- Transmisión -->
                    <v-col cols="12" md="3">
                      <v-select
                        v-if="!isAddingNewTransmission"
                        label="Transmisión"
                        v-model="formItem.vehicle.vehicle_transmission_id"
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

                    <!-- Identificadores -->
                    <v-col cols="12" md="3">
                      <v-text-field
                        label="VIN*"
                        v-model="formItem.vehicle.vin"
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
                        v-model="formItem.vehicle.engine_number"
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
                        v-model="formItem.vehicle.repuve"
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
                        v-model="formItem.vehicle.vehicle_key"
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
                        v-model="formItem.vehicle.passenger_capacity"
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
                        v-model="formItem.vehicle.notes"
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

            <!-- Procedencia -->
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
                        v-model="formItem.vehicle.origin_type_id"
                        :items="originTypes"
                        item-value="id"
                        item-title="name"
                        variant="outlined"
                        density="compact"
                        :rules="rules.required"
                      />
                    </v-col>

                    <v-col
                      v-if="formItem.vehicle.origin_type_id > 1"
                      cols="12"
                      md="3"
                    >
                      <v-text-field
                        label="Pedimento"
                        v-model="formItem.vehicle.pediment_number"
                        type="text"
                        variant="outlined"
                        density="compact"
                        maxlength="30"
                        counter
                        :rules="rules.textRequired"
                        autocomplete="off"
                      />
                    </v-col>

                    <v-col
                      v-if="formItem.vehicle.origin_type_id > 1"
                      cols="12"
                      md="3"
                    >
                      <InpDate
                        label="Fecha"
                        v-model="formItem.vehicle.pediment_date"
                        :rules="rules.required"
                        :before="true"
                      />
                    </v-col>

                    <v-col
                      v-if="formItem.vehicle.origin_type_id > 1"
                      cols="12"
                      md="3"
                    >
                      <v-autocomplete
                        v-if="!isAddingNewCustomOffice"
                        label="Aduana"
                        v-model="formItem.vehicle.custom_office_id"
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

                    <v-col v-if="formItem.vehicle.origin_type_id > 1" cols="12">
                      <v-text-field
                        label="Observaciones*"
                        v-model="formItem.vehicle.pediment_notes"
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

            <!-- Pago -->
            <v-col cols="12">
              <v-card>
                <v-card-title>
                  <v-row dense>
                    <v-col cols="11">
                      <CardTitle text="PAGO" sub />
                    </v-col>
                    <v-col cols="1" class="text-right" />
                  </v-row>
                </v-card-title>

                <v-card-text>
                  <v-row dense>
                    <v-col cols="12" md="3">
                      <v-text-field
                        :label="
                          'Monto factura ' +
                          getAmountFormat(formItem.invoice_amount)
                        "
                        v-model="formItem.invoice_amount"
                        type="number"
                        variant="outlined"
                        density="compact"
                        min="0"
                        autocomplete="off"
                        @update:modelValue="updatePurchasePrice"
                      />
                    </v-col>

                    <v-col cols="12" md="3">
                      <v-text-field
                        :label="
                          'Comisión ' +
                          getAmountFormat(formItem.commission_amount)
                        "
                        v-model="formItem.commission_amount"
                        type="number"
                        variant="outlined"
                        density="compact"
                        min="0"
                        :rules="rules.required"
                        autocomplete="off"
                        @update:modelValue="updatePurchasePrice"
                      />
                    </v-col>

                    <v-col cols="12" md="3">
                      <v-text-field
                        :label="
                          'Precio Compra ' +
                          getAmountFormat(formItem.purchase_price)
                        "
                        v-model="formItem.purchase_price"
                        type="number"
                        variant="outlined"
                        density="compact"
                        min="0"
                        :rules="rules.required"
                        autocomplete="off"
                      />
                    </v-col>

                    <v-col cols="12" md="3">
                      <v-select
                        label="IVA"
                        v-model="formItem.vat_type_id"
                        :items="vatTypes"
                        :loading="vatTypesLoading"
                        item-value="id"
                        item-title="name"
                        variant="outlined"
                        density="compact"
                        :rules="rules.required"
                      />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-row dense>
            <v-col cols="12" class="d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <v-btn
                  v-if="formItem.id"
                  size="small"
                  color="error"
                  variant="outlined"
                  @click="formDelete(formItem.id)"
                >
                  Eliminar
                  <v-icon end>mdi-minus</v-icon>
                </v-btn>
              </div>

              <v-btn
                size="small"
                :color="formIsStoreMode ? 'success' : 'warning'"
                :loading="formIsLoading"
                :disabled="formIsLoading"
                @click="formSubmit"
              >
                Continuar
                <v-icon end>mdi-chevron-right</v-icon>
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
import { getAmountFormat } from "@/utils/formatters";
import { getRules } from "@/utils/validators";
import { getCurrentYear, getObj } from "@/utils/helpers";

import CardTitle from "@/components/CardTitle.vue";
import InpYear from "@/components/InpYear.vue";
import InpDate from "@/components/InpDate.vue";

const routeName = "purchase_order_vehicles";

const props = defineProps({
  purchase_order_id: {
    type: [String, Number],
    required: true,
  },
  purchase_order_vehicles_amount: {
    type: Number,
    required: true,
  },
  total_amount_pending: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["closed"]);

const store = useStore();
const rules = getRules();
const alert = inject("alert");
const confirm = inject("confirm");
const currentYear = ref(getCurrentYear());

// LISTA
const isLoading = ref(true);
const purchaseOrder = ref(null);
const vehicles = ref([]);

// FORM
const formIsDialogOpen = ref(false);
const formIsLoading = ref(false);
const formIsStoreMode = ref(false);
const formRef = ref(null);
const formItem = ref(null);

// CATÁLOGOS
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

const vatTypes = ref([]);
const vatTypesLoading = ref(true);

// FLAGS "OTRO" + inputs
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

// ---------- DATA PRINCIPAL ----------
const getItems = async () => {
  vehicles.value = [];
  isLoading.value = true;

  try {
    const endpoint = `${URL_API}/purchase_orders/${props.purchase_order_id}/${routeName}`;
    const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    const data = getRsp(response).data;

    purchaseOrder.value = data.purchase_order;
    vehicles.value = data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

// ---------- CATÁLOGOS ----------
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

  try {
    endpoint = `${URL_API}/vat_types?is_active=1&filter=0`;
    response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    vatTypes.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    vatTypesLoading.value = false;
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

// ---------- FORM ----------
const formOpenDialog = async (id = null) => {
  formItem.value = null;
  formIsStoreMode.value = id == null;
  formIsDialogOpen.value = true;
  formIsLoading.value = true;

  if (formIsStoreMode.value) {
    formItem.value = {
      id: null,
      purchase_order_id: purchaseOrder.value.id,
      vehicle_id: null,
      vehicle: {
        branch_id: 1,
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
        passenger_capacity: null,
        notes: null,
        origin_type_id: null,
        pediment_number: null,
        pediment_date: null,
        custom_office_id: null,
        pediment_notes: null,
      },
      purchase_price: null,
      commission_amount: null,
      vat_type_id: null,
      invoice_amount: null,
    };
    formIsLoading.value = false;
  } else {
    try {
      const endpoint = `${URL_API}/purchase_orders/${routeName}/${id}`;
      const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
      formItem.value = getRsp(response).data.item;
    } catch (err) {
      alert?.show("red-darken-1", getErr(err));
    } finally {
      formIsLoading.value = false;
    }
  }
};

// ---------- WATCHERS (dependencias de catálogos) ----------

// vehicle_brand_id
watch(
  () =>
    formItem.value?.vehicle.vehicle_version?.vehicle_model?.vehicle_brand_id,
  (newBrandId, oldBrandId) => {
    if (!formItem.value) return;

    const isEditMode = !formIsStoreMode.value;
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
      formItem.value.vehicle.vehicle_version.vehicle_model_id = null;
      formItem.value.vehicle.vehicle_color_id = null;
      formItem.value.vehicle.vehicle_transmission_id = null;
      return;
    }

    if (newBrandId) {
      isAddingNewBrand.value = false;
      newBrandName.value = "";
      newBrandInputRef.value?.resetValidation();
      formItem.value.vehicle.vehicle_version.vehicle_model_id = null;
      formItem.value.vehicle.vehicle_color_id = null;
      formItem.value.vehicle.vehicle_transmission_id = null;
      getVehicleModels(newBrandId);
      getVehicleColors(newBrandId);
      getVehicleTransmissions(newBrandId);
    } else {
      isAddingNewBrand.value = false;
      newBrandName.value = "";
      vehicleModels.value = [];
      vehicleColors.value = [];
      vehicleTransmissions.value = [];
      formItem.value.vehicle.vehicle_version.vehicle_model_id = null;
      formItem.value.vehicle.vehicle_color_id = null;
      formItem.value.vehicle.vehicle_transmission_id = null;
    }
  },
);

// vehicle_model_id + model_year
watch(
  () => [
    formItem.value?.vehicle.vehicle_version?.vehicle_model_id,
    formItem.value?.vehicle.vehicle_version?.model_year,
  ],
  ([newModelId, newYear], [oldModelId, oldYear]) => {
    if (!formItem.value) return;

    const isEditMode = !formIsStoreMode.value;
    const isFirstRunInEdit =
      isEditMode && oldModelId === undefined && oldYear === undefined;

    if (isFirstRunInEdit) {
      if (newModelId && newYear) getVehicleVersions(newModelId, newYear);
      return;
    }

    if (newModelId === oldModelId && newYear === oldYear) return;

    if (newModelId === 0) {
      isAddingNewModel.value = true;
      formItem.value.vehicle.vehicle_version_id = null;
    } else if (newModelId) {
      isAddingNewModel.value = false;
      newModelName.value = "";
      newModelInputRef.value?.resetValidation();

      if (formIsStoreMode.value) {
        formItem.value.vehicle.vehicle_version_id = null;
      }

      getVehicleVersions(newModelId, newYear);
    } else {
      isAddingNewModel.value = false;
      newModelName.value = "";
      if (formIsStoreMode.value) {
        formItem.value.vehicle.vehicle_version_id = null;
      }
    }
  },
);

// vehicle_version_id
watch(
  () => formItem.value?.vehicle.vehicle_version_id,
  (newVersionId) => {
    if (!formItem.value) return;
    if (newVersionId === 0) {
      isAddingNewVersion.value = true;
    } else {
      isAddingNewVersion.value = false;
      newVersionName.value = "";
      newVersionInputRef.value?.resetValidation();
    }
  },
);

// vehicle_color_id
watch(
  () => formItem.value?.vehicle.vehicle_color_id,
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

// vehicle_transmission_id
watch(
  () => formItem.value?.vehicle.vehicle_transmission_id,
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

// custom_office_id
watch(
  () => formItem.value?.vehicle.custom_office_id,
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

// ---------- ALTAS "OTRO" ----------
const addNewBrand = async () => {
  if (!newBrandName.value || newBrandName.value.trim() === "") {
    alert?.show(
      "red-darken-1",
      "Por favor, ingresa el nombre de la nueva marca.",
    );
    return;
  }

  const confirmed = await confirm?.show(
    `¿Confirma agregar la nueva marca "${newBrandName.value}"?`,
  );
  if (!confirmed) return;

  isSavingNewBrand.value = true;
  try {
    const payload = { name: newBrandName.value.trim() };
    const endpoint = `${URL_API}/vehicle_brands`;
    const response = await axios.post(
      endpoint,
      payload,
      getHdrs(store.getAuth?.token),
    );
    const newBrandId = getRsp(response).data.item.id;
    alert?.show("green-darken-1", "Nueva marca agregada con éxito.");

    const getEndpoint = `${URL_API}/vehicle_brands/${newBrandId}`;
    const getResponse = await axios.get(
      getEndpoint,
      getHdrs(store.getAuth?.token),
    );
    const newBrand = getRsp(getResponse).data.item;

    const otroOption = vehicleBrands.value.pop();
    vehicleBrands.value = [...vehicleBrands.value, newBrand, otroOption];
    formItem.value.vehicle.vehicle_version.vehicle_model.vehicle_brand_id =
      newBrand.id;

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
  if (formItem.value) {
    formItem.value.vehicle.vehicle_version.vehicle_model.vehicle_brand_id =
      null;
  }
};

const addNewModel = async () => {
  if (!newModelName.value || newModelName.value.trim() === "") {
    alert?.show(
      "red-darken-1",
      "Por favor, ingresa el nombre del nuevo modelo.",
    );
    return;
  }

  const confirmed = await confirm?.show(
    `¿Confirma agregar el nuevo modelo "${newModelName.value}"?`,
  );
  if (!confirmed) return;

  isSavingNewModel.value = true;
  try {
    const payload = {
      name: newModelName.value.trim(),
      vehicle_brand_id:
        formItem.value.vehicle.vehicle_version.vehicle_model.vehicle_brand_id,
    };
    const endpoint = `${URL_API}/vehicle_models`;
    const response = await axios.post(
      endpoint,
      payload,
      getHdrs(store.getAuth?.token),
    );
    const newModelId = getRsp(response).data.item.id;

    alert?.show("green-darken-1", "Nuevo modelo agregado con éxito.");

    const getEndpoint = `${URL_API}/vehicle_models/${newModelId}`;
    const getResponse = await axios.get(
      getEndpoint,
      getHdrs(store.getAuth?.token),
    );
    const newModel = getRsp(getResponse).data.item;

    const otroOption = vehicleModels.value.pop();
    vehicleModels.value = [...vehicleModels.value, newModel, otroOption];
    formItem.value.vehicle.vehicle_version.vehicle_model_id = newModel.id;

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
  if (formItem.value) {
    formItem.value.vehicle.vehicle_version.vehicle_model_id = null;
  }
};

const addNewVersion = async () => {
  if (!newVersionName.value || newVersionName.value.trim() === "") {
    alert?.show(
      "red-darken-1",
      "Por favor, ingresa el nombre de la nueva versión.",
    );
    return;
  }

  const confirmed = await confirm?.show(
    `¿Confirma agregar la nueva versión "${newVersionName.value}"?`,
  );
  if (!confirmed) return;

  isSavingNewVersion.value = true;
  try {
    const payload = {
      name: newVersionName.value.trim(),
      vehicle_model_id: formItem.value.vehicle.vehicle_version.vehicle_model_id,
      model_year: formItem.value.vehicle.vehicle_version.model_year,
    };
    const endpoint = `${URL_API}/vehicle_versions`;
    const response = await axios.post(
      endpoint,
      payload,
      getHdrs(store.getAuth?.token),
    );
    const newVersionId = getRsp(response).data.item.id;

    alert?.show("green-darken-1", "Nueva versión agregada con éxito.");

    const getEndpoint = `${URL_API}/vehicle_versions/${newVersionId}`;
    const getResponse = await axios.get(
      getEndpoint,
      getHdrs(store.getAuth?.token),
    );
    const newVersion = getRsp(getResponse).data.item;

    const otroOption = vehicleVersions.value.pop();
    vehicleVersions.value = [...vehicleVersions.value, newVersion, otroOption];
    formItem.value.vehicle.vehicle_version_id = newVersion.id;

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
  if (formItem.value) {
    formItem.value.vehicle.vehicle_version_id = null;
  }
};

const addNewColor = async () => {
  if (!newColorName.value || newColorName.value.trim() === "") {
    alert?.show(
      "red-darken-1",
      "Por favor, ingresa el nombre del nuevo color.",
    );
    return;
  }

  const brandId =
    formItem.value?.vehicle.vehicle_version?.vehicle_model?.vehicle_brand_id;

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
    formItem.value.vehicle.vehicle_color_id = newColor.id;

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
    formItem.value.vehicle.vehicle_color_id = null;
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
    formItem.value?.vehicle.vehicle_version?.vehicle_model?.vehicle_brand_id;

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
    formItem.value.vehicle.vehicle_transmission_id = newTransmission.id;

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
    formItem.value.vehicle.vehicle_transmission_id = null;
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
    formItem.value.vehicle.custom_office_id = newCustomOffice.id;

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
    formItem.value.vehicle.custom_office_id = null;
  }
};

// ---------- CÁLCULOS Y SUBMIT ----------
const updatePurchasePrice = () => {
  if (!formItem.value) return;

  const invoice = Number(formItem.value.invoice_amount || 0);
  const commission = Number(formItem.value.commission_amount || 0);

  const total = invoice + commission;
  formItem.value.purchase_price = total.toFixed(2);
};

const formSubmit = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) {
    alert?.show("red-darken-1", "Revisa los detalles señalados");
    return;
  }

  const confirmed = await confirm?.show(
    `¿Confirma ${formIsStoreMode.value ? "agregar" : "editar"} vehiculo?`,
  );
  if (!confirmed) return;

  formIsLoading.value = true;
  const payload = getObj(formItem.value, formIsStoreMode.value);

  try {
    const endpoint = `${URL_API}/purchase_orders/${routeName}${
      !formIsStoreMode.value ? `/${payload.id}` : ""
    }`;
    const response = getRsp(
      await axios.post(endpoint, payload, getHdrs(store.getAuth?.token)),
    );

    alert?.show("success", response.msg);

    formIsDialogOpen.value = false;
    await getItems();

    emit("closed", { refresh: true });
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    formIsLoading.value = false;
  }
};

const formDelete = async (id) => {
  const confirmed = await confirm?.show("¿Confirma eliminar el auto?");
  if (!confirmed) return;

  isLoading.value = true;
  try {
    const endpoint = `${URL_API}/purchase_orders/${routeName}/${id}`;
    const response = getRsp(
      await axios.delete(endpoint, getHdrs(store.getAuth?.token)),
    );
    alert?.show("warning", response.msg);
    formIsDialogOpen.value = false;
    await getItems();

    emit("closed", { refresh: true });
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  getCatalogs();
  getItems();
});
</script>
