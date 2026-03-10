<template>
  <v-card :disabled="isLoading" :loading="isLoading">
    <v-card-title class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <BtnBack :route="{ name: routeName }" />
        <CardTitle :text="route.meta.title" :icon="route.meta.icon" />
      </div>

      <div class="d-flex align-center ga-1" />
    </v-card-title>

    <v-card-text v-if="item">
      <v-row dense>
        <v-col cols="12">
          <v-alert
            :type="
              item.is_approved === null
                ? 'warning'
                : item.is_approved
                  ? 'success'
                  : 'error'
            "
            density="compact"
            class="rounded"
          >
            Solicitud
            {{
              item.is_approved === null
                ? "pendiente de respuesta"
                : item.is_approved
                  ? "aprobada"
                  : "rechazada"
            }}
          </v-alert>
        </v-col>

        <v-col cols="12">
          <v-card>
            <v-card-title class="d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <CardTitle text="AUTO" sub />
              </div>

              <div class="d-flex align-center ga-1" />
            </v-card-title>

            <v-card-text v-if="item.vehicle">
              <v-row dense>
                <v-col cols="12" md="3">
                  <VisVal label="UIID" :value="item.vehicle.uiid" />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal label="VIN" :value="item.vehicle.vin" />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal
                    label="Marca"
                    :value="
                      item.vehicle.vehicle_version?.vehicle_model?.vehicle_brand
                        ?.name
                    "
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal
                    label="Modelo"
                    :value="item.vehicle.vehicle_version?.vehicle_model?.name"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal
                    label="Año"
                    :value="item.vehicle.vehicle_version?.model_year"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal
                    label="Versión"
                    :value="item.vehicle.vehicle_version?.name"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal
                    label="Color"
                    :value="item.vehicle.vehicle_color?.name"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal
                    label="Transmisión"
                    :value="item.vehicle.vehicle_transmission?.name"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal
                    label="Precio de venta"
                    :value="getAmountFormat(item.vehicle.sale_price)"
                    class="text-success"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12">
          <v-card>
            <v-card-title class="d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <CardTitle text="VENDEDOR" sub />
              </div>

              <div class="d-flex align-center ga-1" />
            </v-card-title>

            <v-card-text>
              <v-row dense>
                <v-col cols="12" md="6">
                  <VisVal label="Nombre" :value="item.seller_user?.full_name" />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12">
          <v-card>
            <v-card-title class="d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <CardTitle text="CLIENTE" sub />
              </div>

              <div class="d-flex align-center ga-1" />
            </v-card-title>

            <v-card-text>
              <v-row dense>
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

                <v-col v-if="item.customer_ine_b64" cols="12" md="4">
                  <BtnFilePreview
                    label="INE"
                    :doc="item.customer_ine_b64"
                    tooltip="Ver"
                  />
                </v-col>

                <v-col v-else cols="12" md="4">
                  <VisVal label="INE" value="No disponible" />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12">
          <v-card>
            <v-card-title class="d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <CardTitle text="APARTADO" sub />
              </div>

              <div class="d-flex align-center ga-1" />
            </v-card-title>

            <v-card-text>
              <v-row dense>
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
                  v-if="
                    item.is_finance &&
                    item.is_preapproved &&
                    item.preapproval_b64
                  "
                  cols="12"
                  md="4"
                >
                  <BtnFilePreview
                    label="Archivo preaprobado"
                    :doc="item.preapproval_b64"
                    tooltip="Ver"
                  />
                </v-col>

                <v-col
                  v-else-if="item.is_finance && item.is_preapproved"
                  cols="12"
                  md="4"
                >
                  <VisVal label="Archivo preaprobado" value="No disponible" />
                </v-col>

                <v-col cols="12" md="4">
                  <VisVal
                    label="¿Auto a cuenta?"
                    :value="item.has_trade_in"
                    bool
                  />
                </v-col>
              </v-row>

              <v-row v-if="item.has_trade_in" dense class="mt-1">
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
              </v-row>

              <v-row dense class="mt-1">
                <v-col cols="12">
                  <VisVal label="Observaciones" :value="item.notes" />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12">
          <v-card>
            <v-card-title class="d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <CardTitle text="RESPUESTA" sub />
              </div>

              <div
                v-if="item.is_approved === null"
                class="d-flex align-center ga-2"
              >
                <v-btn
                  size="small"
                  color="error"
                  :loading="isLoading"
                  @click="openResponseDialog(false)"
                >
                  Rechazar
                  <v-icon end>mdi-close</v-icon>
                </v-btn>

                <v-btn
                  size="small"
                  color="success"
                  :loading="isLoading"
                  @click="openResponseDialog(true)"
                >
                  Aprobar
                  <v-icon end>mdi-check</v-icon>
                </v-btn>
              </div>

              <div v-else class="d-flex align-center ga-1" />
            </v-card-title>

            <v-card-text v-if="item.is_approved !== null">
              <v-row dense>
                <v-col cols="12" md="4">
                  <VisVal
                    label="Estatus"
                    :value="item.is_approved ? 'Aprobado' : 'Rechazado'"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <VisVal label="Fecha respuesta" :value="item.response_at" />
                </v-col>

                <v-col v-if="item.is_approved" cols="12" md="4">
                  <VisVal label="Vence el" :value="item.expires_at" />
                </v-col>

                <v-col cols="12" md="6">
                  <VisVal
                    label="Respondido por"
                    :value="item.response_by?.email"
                  />
                </v-col>

                <v-col cols="12">
                  <VisVal label="Respuesta" :value="item.response_note" />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>

    <v-dialog
      v-model="responseDialog"
      transition="dialog-bottom-transition"
      scrim="black"
      max-width="600"
    >
      <v-card :disabled="isLoading" :loading="isLoading">
        <v-card-title class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <CardTitle
              :text="
                response?.is_approved ? 'Aprobar apartado' : 'Rechazar apartado'
              "
              sub
            />
          </div>

          <div class="d-flex align-center">
            <v-btn
              icon
              variant="outlined"
              size="x-small"
              density="comfortable"
              @click="responseDialog = false"
            >
              <v-icon>mdi-close</v-icon>
              <v-tooltip activator="parent" location="left">Cerrar</v-tooltip>
            </v-btn>
          </div>
        </v-card-title>

        <v-card-text>
          <v-form ref="responseFormRef" @submit.prevent>
            <v-row dense>
              <v-col v-if="response?.is_approved" cols="12">
                <InpDate
                  v-model="response.expires_at"
                  label="Vence el"
                  :rules="rules.required"
                  after
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="response.response_note"
                  label="Respuesta*"
                  variant="outlined"
                  density="compact"
                  rows="3"
                  auto-grow
                  :rules="response?.is_approved ? [] : rules.textRequired"
                />
              </v-col>

              <v-col cols="12">
                <div class="text-right">
                  <v-btn
                    size="small"
                    :color="response?.is_approved ? 'success' : 'error'"
                    :loading="isLoading"
                    :disabled="isLoading"
                    @click="handleResponse"
                  >
                    {{ response?.is_approved ? "Aprobar" : "Rechazar" }}
                    <v-icon end>
                      {{ response?.is_approved ? "mdi-check" : "mdi-close" }}
                    </v-icon>
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { inject, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getErr, getHdrs, getRsp } from "@/utils/http";
import { getDecodeId } from "@/utils/coders";
import { getAmountFormat } from "@/utils/formatters";
import { getRules } from "@/utils/validators";

import BtnBack from "@/components/BtnBack.vue";
import BtnFilePreview from "@/components/BtnFilePreview.vue";
import CardTitle from "@/components/CardTitle.vue";
import InpDate from "@/components/InpDate.vue";
import VisVal from "@/components/VisVal.vue";

const routeName = "vehicle_reservations";

const alert = inject("alert");
const confirm = inject("confirm");
const store = useStore();
const route = useRoute();
const rules = getRules();

const itemId = ref(getDecodeId(route.params.id));
const isLoading = ref(true);
const item = ref(null);

const responseDialog = ref(false);
const responseFormRef = ref(null);
const response = ref(null);

const getItem = async () => {
  isLoading.value = true;
  item.value = null;

  try {
    const endpoint = `${URL_API}/${routeName}/${itemId.value}`;
    const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    item.value = getRsp(response).data.item;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

const openResponseDialog = (is_approved) => {
  response.value = {
    is_approved,
    expires_at: is_approved ? item.value.suggested_expires_at : null,
    response_note: null,
  };
  responseDialog.value = true;
};

const handleResponse = async () => {
  const { valid } = await responseFormRef.value.validate();

  if (!valid) {
    alert?.show("red-darken-1", "Revisa los detalles señalados");
    return;
  }

  const confirmed = await confirm?.show(
    `¿Confirma ${response.value.is_approved ? "aprobar" : "rechazar"} la solicitud?`,
  );
  if (!confirmed) return;

  isLoading.value = true;

  try {
    const endpoint = `${URL_API}/${routeName}/${itemId.value}/response`;
    const response_api = getRsp(
      await axios.patch(
        endpoint,
        response.value,
        getHdrs(store.getAuth?.token),
      ),
    );

    item.value = response_api.data.item;
    responseDialog.value = false;
    alert?.show("success", response_api.msg);
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  getItem();
});
</script>
