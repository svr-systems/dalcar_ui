<template>
  <v-card :loading="isLoading">
    <v-card-title>
      <v-row dense>
        <v-col cols="10">
          <BtnBack :route="{ name: routeName }" />
          <CardTitle :text="route.meta.title" :icon="route.meta.icon" />
        </v-col>
        <v-col v-if="item" cols="2" class="text-right">
          <v-btn
            v-if="item.is_active"
            icon
            variant="flat"
            size="x-small"
            color="warning"
            :to="{
              name: `${routeName}/update`,
              params: { id: getEncodeId(itemId) },
            }"
          >
            <v-icon>mdi-pencil</v-icon>
            <v-tooltip activator="parent" location="left">Editar</v-tooltip>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-title>

    <v-card-text v-if="item">
      <v-row>
        <v-col v-if="!item.is_active" cols="12">
          <v-alert type="error" density="compact" class="rounded">
            <v-row dense>
              <v-col class="grow pt-2">El registro se encuentra inactivo</v-col>
              <v-col
                v-if="store.getAuth?.user?.role_id === 1"
                class="shrink text-right"
              >
                <v-btn
                  icon
                  variant="flat"
                  size="x-small"
                  color="success"
                  @click.prevent="restoreItem"
                >
                  <v-icon>mdi-delete-restore</v-icon>
                  <v-tooltip activator="parent" location="left">
                    Reactivar
                  </v-tooltip>
                </v-btn>
              </v-col>
            </v-row>
          </v-alert>
        </v-col>

        <v-col cols="12">
          <v-card>
            <v-card-title>
              <v-row dense>
                <v-col cols="11">
                  <CardTitle :text="`AUTO | ${item.uiid}`" sub />
                </v-col>
                <v-col cols="1" class="text-right" />
              </v-row>
            </v-card-title>

            <v-card-text>
              <v-row dense>
                <v-col cols="12" md="3">
                  <VisVal label="Fecha de compra" :value="item.purchase_date" />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal label="Proveedor" :value="item.vendor.name" />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal
                    label="Marca"
                    :value="
                      item.vehicle_version.vehicle_model.vehicle_brand.name
                    "
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal
                    label="Modelo"
                    :value="item.vehicle_version.vehicle_model.name"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal
                    label="Año"
                    :value="item.vehicle_version.model_year"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal label="Versión" :value="item.vehicle_version.name" />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal
                    label="Transmisión"
                    :value="item.vehicle_transmission.name"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal label="Color" :value="item.vehicle_color.name" />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal label="VIN" :value="item.vin" />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal label="Motor" :value="item.engine_number" />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal label="REPUVE" :value="item.repuve" />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal label="Clave vehicular" :value="item.vehicle_key" />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal
                    label="Compra"
                    :value="getAmountFormat(item.purchase_price)"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal
                    label="Comisión"
                    :value="getAmountFormat(item.commission_amount)"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal label="IVA" :value="item.vat_type.name" />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal
                    label="Monto factura"
                    :value="getAmountFormat(item.invoice_amount)"
                  />
                </v-col>

                <v-col cols="12" md="12">
                  <VisVal label="Observaciones" :value="item.notes" />
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
                  <VisVal label="Procedencia" :value="item.origin_type?.name" />
                </v-col>

                <v-col v-if="item.origin_type_id == 2" cols="12" md="3">
                  <VisVal label="Pedimento" :value="item.pediment_number" />
                </v-col>

                <v-col v-if="item.origin_type_id == 2" cols="12" md="3">
                  <VisVal label="Fecha" :value="item.pediment_date" />
                </v-col>

                <v-col v-if="item.origin_type_id == 2" cols="12" md="3">
                  <VisVal label="Aduana" :value="item.custom_office?.name" />
                </v-col>

                <v-col v-if="item.origin_type_id == 2" cols="12" md="12">
                  <VisVal label="Observaciones" :value="item.pediment_notes" />
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
                  <VisVal
                    label="Inversionista"
                    :value="legacy_vehicle_investor.investor?.user?.full_name"
                  />
                </v-col>

                <v-col cols="12" md="5">
                  <VisVal
                    label="Porcentaje %"
                    :value="legacy_vehicle_investor.percentages"
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
                  <VisVal
                    label="Tipo"
                    :value="legacy_vehicle_expense.expense_type?.name"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal
                    label="Observación"
                    :value="legacy_vehicle_expense.note"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal
                    label="Fecha"
                    :value="legacy_vehicle_expense.expense_date"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal
                    label="Monto"
                    :value="getAmountFormat(legacy_vehicle_expense.amount)"
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
                  <CardTitle text="FACTURAS" sub />
                </v-col>
                <v-col cols="1" class="text-right">
                  <v-btn
                    icon
                    variant="icon"
                    size="x-small"
                    color="success"
                    @click="legacyVehicleDocumentDlg()"
                  >
                    <v-icon>mdi-plus</v-icon>
                    <v-tooltip activator="parent" location="start">
                      Agregar
                    </v-tooltip>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-title>

            <v-card-text>
              <v-row
                dense
                v-for="(
                  legacy_vehicle_document_bill, i
                ) of item.legacy_vehicle_document_bills"
                :key="i"
              >
                <!-- <v-col cols="12" md="3">
                  <VisVal
                    label="Tipo"
                    :value="legacy_vehicle_document_bill.document_type?.name"
                  />
                </v-col> -->

                <v-col cols="12" md="3">
                  <VisVal
                    label="Fecha de recepción"
                    :value="legacy_vehicle_document_bill.received_at"
                  />
                </v-col>

                <v-col cols="12" md="8">
                  <VisDoc
                    label="Archivo"
                    :value="legacy_vehicle_document_bill.document_b64"
                  />
                </v-col>

                <v-col cols="12" md="1" class="text-right">
                  <v-btn icon variant="icon" size="x-small" color="error">
                    <v-icon size="x-small">mdi-minus</v-icon>
                    <v-tooltip activator="parent" location="start">
                      Eliminar
                    </v-tooltip>
                  </v-btn>
                </v-col>

                <v-col v-if="legacy_vehicle_document_bill.note" cols="12">
                  <VisVal
                    label="Observación"
                    :value="legacy_vehicle_document_bill.note"
                  />
                </v-col>
                <v-col cols="12">
                  <v-divider />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col
          v-if="item.is_active && store.getAuth?.user?.role_id === 1"
          cols="12"
        >
          <v-btn
            icon
            variant="flat"
            size="x-small"
            color="red-darken-1"
            @click.prevent="deleteItem"
          >
            <v-icon>mdi-minus-thick</v-icon>
            <v-tooltip activator="parent" location="right">Inactivar</v-tooltip>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>

    <DlgReg v-model="regDialog" :item="item" />

    <v-dialog
      v-model="legacy_vehicle_document_bill_dlg"
      persistent
      scrim="black"
      max-width="900"
    >
      <v-card
        :loading="legacy_vehicle_document_bill_ldg"
        :disabled="legacy_vehicle_document_bill_ldg"
        flat
      >
        <v-card-title>
          <v-row dense>
            <v-col cols="11">
              <CardTitle text="FACTURA" subvalue />
            </v-col>
            <v-col cols="1" class="text-right">
              <v-btn
                icon
                variant="text"
                size="x-small"
                @click="legacy_vehicle_document_bill_dlg = false"
              >
                <v-icon>mdi-close</v-icon>
                <v-tooltip activator="parent" location="left">Cerrar</v-tooltip>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>

        <v-card-text v-if="legacy_vehicle_document_bill">
          <v-form ref="legacy_vehicle_document_bill_form" @submit.prevent>
            <v-row dense>
              <v-col cols="3">
                <InpDate
                  label="Fecha de compra"
                  v-model="legacy_vehicle_document_bill.received_at"
                  :rules="rules.required"
                  :before="true"
                />
              </v-col>
              <v-col cols="9">
                <v-file-input
                  label="Archivo (PDF)"
                  v-model="legacy_vehicle_document_bill.document_doc"
                  variant="outlined"
                  density="compact"
                  prepend-icon=""
                  show-size
                  accept=".pdf"
                  :rules="rules.fileRequired"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Observación*"
                  v-model="legacy_vehicle_document_bill.note"
                  type="text"
                  variant="outlined"
                  density="compact"
                  maxlength="255"
                  counter
                  rows="1"
                  :rules="rules.textOptional"
                />
              </v-col>
              <v-col cols="12" class="text-right">
                <v-btn
                  icon
                  variant="flat"
                  size="x-small"
                  color="success"
                  @click.prevent="legacyVehicleDocumentAdd()"
                  :loading="legacy_vehicle_document_bill_ldg"
                >
                  <v-icon>mdi-check</v-icon>
                  <v-tooltip activator="parent" location="left">
                    Continuar
                  </v-tooltip>
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
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
import { getAmountFormat, getDateTime } from "@/utils/formatters";
import { getRules } from "@/utils/validators";
import { getFormData } from "@/utils/helpers";

// Componentes
import BtnBack from "@/components/BtnBack.vue";
import CardTitle from "@/components/CardTitle.vue";
import DlgReg from "@/components/DlgReg.vue";
import VisVal from "@/components/VisVal.vue";
import VisDoc from "@/components/VisDoc.vue";
import InpDate from "@/components/InpDate.vue";

// Constantes fijas
const routeName = "legacy_vehicles";
const currentDate = ref(getDateTime("-", "", "", false));

// Estado y referencias
const alert = inject("alert");
const confirm = inject("confirm");
const store = useStore();
const router = useRouter();
const route = useRoute();

// Estado reactivo
const itemId = ref(getDecodeId(route.params.id));
const isLoading = ref(true);
const item = ref(null);
const regDialog = ref(false);
const rules = getRules();
const legacy_vehicle_document_bill = ref(null);
const legacy_vehicle_document_bill_ldg = ref(false);
const legacy_vehicle_document_bill_dlg = ref(false);
const legacy_vehicle_document_bill_form = ref(null);

// Obtener registro
const getItem = async () => {
  isLoading.value = true;
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

// Inactivar
const deleteItem = async () => {
  const confirmed = await confirm?.show("¿Confirma inactivar el registro?");
  if (!confirmed) return;

  isLoading.value = true;
  try {
    const endpoint = `${URL_API}/${routeName}/${itemId.value}`;
    const response = getRsp(
      await axios.delete(endpoint, getHdrs(store.getAuth?.token))
    );
    alert?.show("red-darken-1", response.msg);
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
  alert?.show("red-darken-1", "Registro desactivado correctamente");
  router.push({ name: routeName });
  isLoading.value = false;
};

// Reactivar
const restoreItem = async () => {
  const confirmed = await confirm?.show("¿Confirma activar el registro?");
  if (!confirmed) return;

  isLoading.value = true;
  try {
    const endpoint = `${URL_API}/${routeName}/restore`;
    const response = getRsp(
      await axios.post(
        endpoint,
        { id: itemId.value },
        getHdrs(store.getAuth?.token)
      )
    );
    item.value = response.data.item;
    alert?.show("success", response.msg);
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
  alert?.show("red-darken-1", "Registro activado correctamente");
  isLoading.value = false;
};

const legacyVehicleDocumentDlg = async () => {
  legacy_vehicle_document_bill.value = {
    id: null,
    is_active: 1,
    legacy_vehicle_id: itemId.value,
    document_type_id: 1,
    is_scheduled: 0,
    scheduled_at: null,
    received_at: currentDate.value,
    document_path: null,
    document_doc: null,
    document_dlt: false,
    note: null,
  };
  legacy_vehicle_document_bill_ldg.value = false;
  legacy_vehicle_document_bill_dlg.value = true;
};

const legacyVehicleDocumentAdd = async () => {
  const { valid } = await legacy_vehicle_document_bill_form.value.validate();
  if (!valid) return;

  const confirmed = await confirm?.show(`¿Confirma agregar?`);
  if (!confirmed) return;

  legacy_vehicle_document_bill_ldg.value = true;

  try {
    const endpoint = `${URL_API}/legacy_vehicle_documents`;
    const response = getRsp(
      await axios.post(
        endpoint,
        getFormData(legacy_vehicle_document_bill.value),
        getHdrs(store.getAuth?.token, true)
      )
    );

    alert?.show("success", response.msg);
    legacy_vehicle_document_bill_dlg.value = false;
    getItem();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    legacy_vehicle_document_bill_ldg.value = false;
  }
};

// Inicializar
onMounted(() => {
  getItem();
});
</script>
