<template>
  <div>
    <v-btn
      size="small"
      :color="isStoreMode ? 'warning' : 'info'"
      @click="formOpenDialog"
    >
      {{ isStoreMode ? "Apartar" : "Ver apartado" }}
      <v-icon end>mdi-hand-coin</v-icon>
    </v-btn>

    <v-dialog
      v-model="formIsDialogOpen"
      transition="dialog-bottom-transition"
      scrim="black"
      max-width="900"
    >
      <v-card :disabled="formIsLoading" :loading="formIsLoading">
        <v-card-title class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <CardTitle
              :text="isStoreMode ? 'NUEVO APARTADO' : 'DETALLE DEL APARTADO'"
              sub
            />
          </div>

          <div class="d-flex align-center">
            <v-btn
              icon
              variant="outlined"
              size="x-small"
              density="comfortable"
              @click="formIsDialogOpen = false"
            >
              <v-icon>mdi-close</v-icon>
              <v-tooltip activator="parent" location="left">Cerrar</v-tooltip>
            </v-btn>
          </div>
        </v-card-title>

        <v-card-text v-if="item">
          <v-form v-if="isStoreMode" ref="formRef" @submit.prevent>
            <v-row dense>
              <v-col cols="12">
                <CardTitle text="CLIENTE" sub />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="item.customer_name"
                  label="Nombre"
                  variant="outlined"
                  density="compact"
                  maxlength="100"
                  counter
                  :rules="rules.textRequired"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="item.customer_last_name"
                  label="Apellidos"
                  variant="outlined"
                  density="compact"
                  maxlength="100"
                  counter
                  :rules="rules.textRequired"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="item.customer_email"
                  label="E-mail"
                  type="email"
                  variant="outlined"
                  density="compact"
                  maxlength="255"
                  counter
                  :rules="rules.emailRequired"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="item.customer_phone"
                  label="Teléfono*"
                  variant="outlined"
                  density="compact"
                  maxlength="10"
                  counter
                  :rules="rules.phoneOptional"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-file-input
                  v-model="item.customer_ine_doc"
                  label="INE"
                  variant="outlined"
                  density="compact"
                  prepend-icon=""
                  show-size
                  accept=".pdf,.png,.jpg,.jpeg"
                  :rules="rules.fileRequired"
                />
              </v-col>
            </v-row>

            <v-divider class="my-3" />

            <v-row dense>
              <v-col cols="12">
                <CardTitle text="APARTADO" sub />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model="item.reservation_days"
                  label="Días de apartado"
                  type="number"
                  variant="outlined"
                  density="compact"
                  :rules="rules.required"
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model="item.reservation_amount"
                  :label="`Monto de apartado ${getAmountFormat(item.reservation_amount)}`"
                  type="number"
                  variant="outlined"
                  density="compact"
                  :rules="rules.required"
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-select
                  v-model="item.payment_method_id"
                  label="Método de pago"
                  :items="paymentMethods"
                  :loading="paymentMethodsIsLoading"
                  item-title="name"
                  item-value="id"
                  variant="outlined"
                  density="compact"
                  :rules="rules.required"
                />
              </v-col>
            </v-row>

            <v-divider class="my-3" />

            <v-row dense>
              <v-col cols="12">
                <CardTitle text="FINANCIAMIENTO" sub />
              </v-col>

              <v-col cols="12" md="4">
                <v-switch
                  v-model="item.is_finance"
                  label="¿Financiamiento?"
                  color="info"
                  density="compact"
                  hide-details
                />
              </v-col>

              <v-col v-if="item.is_finance" cols="12" md="4">
                <v-select
                  v-model="item.financier_id"
                  label="Financiera"
                  :items="financiers"
                  :loading="financiersIsLoading"
                  item-title="name"
                  item-value="id"
                  variant="outlined"
                  density="compact"
                  :rules="rules.required"
                />
              </v-col>

              <v-col v-if="item.is_finance" cols="12" md="4">
                <v-switch
                  v-model="item.is_preapproved"
                  label="¿Preaprobado?"
                  color="info"
                  density="compact"
                  hide-details
                />
              </v-col>

              <v-col
                v-if="item.is_finance && item.is_preapproved"
                cols="12"
                md="6"
              >
                <v-file-input
                  v-model="item.preapproval_doc"
                  label="Archivo preaprobado"
                  variant="outlined"
                  density="compact"
                  prepend-icon=""
                  show-size
                  accept=".pdf,.png,.jpg,.jpeg"
                  :rules="rules.fileRequired"
                />
              </v-col>
            </v-row>

            <v-divider class="my-3" />

            <v-row dense>
              <v-col cols="12">
                <CardTitle text="AUTO A CUENTA" sub />
              </v-col>

              <v-col cols="12" md="4">
                <v-switch
                  v-model="item.has_trade_in"
                  label="¿Auto a cuenta?"
                  color="info"
                  density="compact"
                  hide-details
                />
              </v-col>

              <template v-if="item.has_trade_in">
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="item.trade_in_brand"
                    label="Marca"
                    variant="outlined"
                    density="compact"
                    maxlength="60"
                    counter
                    :rules="rules.textRequired"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="item.trade_in_model"
                    label="Modelo"
                    variant="outlined"
                    density="compact"
                    maxlength="60"
                    counter
                    :rules="rules.textRequired"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="item.trade_in_version"
                    label="Versión"
                    variant="outlined"
                    density="compact"
                    maxlength="60"
                    counter
                    :rules="rules.textRequired"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="item.trade_in_model_year"
                    label="Año"
                    type="number"
                    variant="outlined"
                    density="compact"
                    :rules="rules.textRequired"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="item.trade_in_color"
                    label="Color"
                    variant="outlined"
                    density="compact"
                    maxlength="40"
                    counter
                    :rules="rules.textRequired"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="item.trade_in_km"
                    label="Kilometraje"
                    type="number"
                    variant="outlined"
                    density="compact"
                    :rules="rules.textRequired"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="item.trade_in_invoice_type"
                    label="Tipo factura"
                    variant="outlined"
                    density="compact"
                    maxlength="40"
                    counter
                    :rules="rules.textRequired"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <v-switch
                    v-model="item.trade_in_is_refactored"
                    label="¿Refacturado?"
                    color="info"
                    density="compact"
                    hide-details
                  />
                </v-col>
              </template>
            </v-row>

            <v-divider class="my-3" />

            <v-row dense>
              <v-col cols="12">
                <v-textarea
                  v-model="item.notes"
                  label="Observaciones*"
                  variant="outlined"
                  density="compact"
                  rows="3"
                  auto-grow
                />
              </v-col>

              <v-col cols="12">
                <div class="text-right">
                  <v-btn
                    size="small"
                    color="warning"
                    :loading="formIsLoading"
                    :disabled="formIsLoading"
                    @click="handleSubmit"
                  >
                    Guardar
                    <v-icon end>mdi-check</v-icon>
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-form>

          <template v-else>
            <v-row dense>
              <v-col cols="12">
                <CardTitle text="CLIENTE" sub />
              </v-col>

              <v-col cols="12" md="6">
                <VisVal label="Nombre" :value="item.customer_name" />
              </v-col>

              <v-col cols="12" md="6">
                <VisVal label="Apellidos" :value="item.customer_last_name" />
              </v-col>

              <v-col cols="12" md="6">
                <VisVal label="E-mail" :value="item.customer_email" />
              </v-col>

              <v-col cols="12" md="6">
                <VisVal label="Teléfono" :value="item.customer_phone" />
              </v-col>

              <v-col cols="12" md="6">
                <BtnFilePreview
                  label="INE"
                  :doc="item.customer_ine_b64"
                  tooltip="Ver"
                />
              </v-col>
            </v-row>

            <v-divider class="my-3" />

            <v-row dense>
              <v-col cols="12">
                <CardTitle text="APARTADO" sub />
              </v-col>

              <v-col cols="12" md="4">
                <VisVal
                  label="Días de apartado"
                  :value="item.reservation_days"
                />
              </v-col>

              <v-col cols="12" md="4">
                <VisVal
                  label="Monto de apartado"
                  :value="getAmountFormat(item.reservation_amount)"
                />
              </v-col>

              <v-col cols="12" md="4">
                <VisVal
                  label="Método de pago"
                  :value="item.payment_method?.name"
                />
              </v-col>
            </v-row>

            <v-divider class="my-3" />

            <v-row dense>
              <v-col cols="12">
                <CardTitle text="FINANCIAMIENTO" sub />
              </v-col>

              <v-col cols="12" md="4">
                <VisVal
                  label="¿Financiamiento?"
                  :value="item.is_finance"
                  bool
                />
              </v-col>

              <v-col v-if="item.is_finance" cols="12" md="4">
                <VisVal label="Financiera" :value="item.financier?.name" />
              </v-col>

              <v-col v-if="item.is_finance" cols="12" md="4">
                <VisVal
                  label="¿Preaprobado?"
                  :value="item.is_preapproved"
                  bool
                />
              </v-col>

              <v-col
                v-if="item.is_finance && item.is_preapproved"
                cols="12"
                md="6"
              >
                <BtnFilePreview
                  label="Archivo preaprobado"
                  :doc="item.preapproval_b64"
                  tooltip="Ver"
                />
              </v-col>
            </v-row>

            <v-divider class="my-3" />

            <v-row dense>
              <v-col cols="12">
                <CardTitle text="AUTO A CUENTA" sub />
              </v-col>

              <v-col cols="12" md="4">
                <VisVal
                  label="¿Auto a cuenta?"
                  :value="item.has_trade_in"
                  bool
                />
              </v-col>

              <template v-if="item.has_trade_in">
                <v-col cols="12" md="4">
                  <VisVal label="Marca" :value="item.trade_in_brand" />
                </v-col>

                <v-col cols="12" md="4">
                  <VisVal label="Modelo" :value="item.trade_in_model" />
                </v-col>

                <v-col cols="12" md="4">
                  <VisVal label="Versión" :value="item.trade_in_version" />
                </v-col>

                <v-col cols="12" md="4">
                  <VisVal label="Año" :value="item.trade_in_model_year" />
                </v-col>

                <v-col cols="12" md="4">
                  <VisVal label="Color" :value="item.trade_in_color" />
                </v-col>

                <v-col cols="12" md="4">
                  <VisVal label="Kilometraje" :value="item.trade_in_km" />
                </v-col>

                <v-col cols="12" md="4">
                  <VisVal
                    label="Tipo factura"
                    :value="item.trade_in_invoice_type"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <VisVal
                    label="¿Refacturado?"
                    :value="item.trade_in_is_refactored"
                    bool
                  />
                </v-col>
              </template>
            </v-row>

            <v-divider class="my-3" />

            <v-row dense>
              <v-col cols="12" md="4">
                <VisVal
                  label="Estatus"
                  :value="
                    item.is_approved === null
                      ? 'Pendiente'
                      : item.is_approved
                        ? 'Aprobado'
                        : 'Rechazado'
                  "
                />
              </v-col>

              <v-col cols="12" md="4">
                <VisVal label="Fecha respuesta" :value="item.response_at" />
              </v-col>

              <v-col cols="12" md="4">
                <VisVal label="Vence el" :value="item.expires_at" />
              </v-col>

              <v-col cols="12">
                <VisVal label="Respuesta" :value="item.response_note" />
              </v-col>

              <v-col cols="12">
                <VisVal label="Observaciones" :value="item.notes" />
              </v-col>
            </v-row>
          </template>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { computed, inject, ref } from "vue";
import axios from "axios";

import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getErr, getHdrs, getRsp } from "@/utils/http";
import { getFormData } from "@/utils/helpers";
import { getRules } from "@/utils/validators";
import { getAmountFormat } from "@/utils/formatters";

import CardTitle from "@/components/CardTitle.vue";
import VisVal from "@/components/VisVal.vue";
import BtnFilePreview from "@/components/BtnFilePreview.vue";

const props = defineProps({
  vehicle_id: {
    type: Number,
    required: true,
  },
  has_reservation: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["saved"]);

const alert = inject("alert");
const confirm = inject("confirm");
const store = useStore();
const rules = getRules();

const formIsDialogOpen = ref(false);
const formIsLoading = ref(false);
const formRef = ref(null);

const item = ref(null);

const paymentMethods = ref([]);
const paymentMethodsIsLoading = ref(false);

const financiers = ref([]);
const financiersIsLoading = ref(false);

const isStoreMode = computed(() => !props.has_reservation);

const getItemObj = () => ({
  vehicle_id: props.vehicle_id,
  customer_name: null,
  customer_last_name: null,
  customer_email: null,
  customer_phone: null,
  customer_ine_doc: null,
  is_finance: false,
  financier_id: null,
  is_preapproved: false,
  preapproval_doc: null,
  reservation_days: "3",
  reservation_amount: "5000",
  payment_method_id: null,
  has_trade_in: false,
  trade_in_brand: null,
  trade_in_model: null,
  trade_in_version: null,
  trade_in_model_year: null,
  trade_in_color: null,
  trade_in_km: null,
  trade_in_invoice_type: null,
  trade_in_is_refactored: false,
  notes: null,
});

const getCatalogs = async () => {
  paymentMethodsIsLoading.value = true;
  financiersIsLoading.value = true;

  try {
    const paymentMethodsEndpoint = `${URL_API}/seller/payment_methods`;
    const paymentMethodsResponse = await axios.get(
      paymentMethodsEndpoint,
      getHdrs(store.getAuth?.token),
    );
    paymentMethods.value = getRsp(paymentMethodsResponse).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    paymentMethodsIsLoading.value = false;
  }

  try {
    const financiersEndpoint = `${URL_API}/seller/financiers?is_active=1`;
    const financiersResponse = await axios.get(
      financiersEndpoint,
      getHdrs(store.getAuth?.token),
    );
    financiers.value = getRsp(financiersResponse).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    financiersIsLoading.value = false;
  }
};

const getItem = async () => {
  formIsLoading.value = true;

  try {
    const endpoint = `${URL_API}/seller/vehicles/${props.vehicle_id}/reservation`;
    const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    item.value = getRsp(response).data.item;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    formIsLoading.value = false;
  }
};

const formOpenDialog = async () => {
  formIsDialogOpen.value = true;

  if (isStoreMode.value) {
    item.value = getItemObj();
    await getCatalogs();
    return;
  }

  await getItem();
};

const handleSubmit = async () => {
  const { valid } = await formRef.value.validate();

  if (!valid) {
    alert?.show("red-darken-1", "Revisa los detalles señalados");
    return;
  }

  const confirmed = await confirm?.show("¿Confirma registrar el apartado?");
  if (!confirmed) return;

  formIsLoading.value = true;

  try {
    const payload = getFormData(item.value);

    const endpoint = `${URL_API}/seller/vehicle_reservations`;
    const response = getRsp(
      await axios.post(endpoint, payload, getHdrs(store.getAuth?.token, true)),
    );

    alert?.show("success", response.msg);
    formIsDialogOpen.value = false;
    emit("saved");
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    formIsLoading.value = false;
  }
};
</script>
