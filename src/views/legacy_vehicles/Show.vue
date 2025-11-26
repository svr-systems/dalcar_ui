<template>
  <v-card :loading="isLoading">
    <v-card-title>
      <v-row dense>
        <v-col cols="11">
          <BtnBack :route="{ name: routeName }" />
          <CardTitle :text="route.meta.title" :icon="route.meta.icon" />
        </v-col>
        <v-col v-if="item" cols="1" class="text-right">
          <v-btn
            v-if="item.is_active"
            icon
            size="x-small"
            color="warning"
            :to="{
              name: `${routeName}/update`,
              params: { id: getEncodeId(itemId) },
            }"
          >
            <v-icon>mdi-pencil</v-icon>
            <v-tooltip activator="parent" location="left"> Editar </v-tooltip>
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
          <v-sheet elevation="4">
            <v-row dense class="pa-3">
              <v-col cols="12">
                <v-tabs
                  v-model="tab"
                  color="white"
                  density="compact"
                  align-tabs="center"
                  show-arrows="false"
                >
                  <v-tab value="vehicle">AUTO</v-tab>
                  <v-tab value="acquisition">ADQUISICIÓN</v-tab>
                  <v-tab value="invoices">FACTURAS</v-tab>
                  <v-tab value="documents">DOCUMENTOS</v-tab>
                  <v-tab value="investors">INVERSIONISTAS</v-tab>
                  <v-tab value="expenses">GASTOS</v-tab>
                  <v-tab value="sale">VENTA</v-tab>
                  <v-tab value="clients">CLIENTES</v-tab>
                  <v-tab value="payments">PAGOS</v-tab>
                </v-tabs>
              </v-col>
            </v-row>

            <v-divider />

            <v-tabs-window v-model="tab">
              <v-tabs-window-item value="vehicle">
                <LegacyVehicleInfo :item="item" :itemId="itemId" />
              </v-tabs-window-item>
              <v-tabs-window-item value="acquisition">
                <Acquisitions
                  :legacy-vehicle-id="itemId"
                  :is-active="item.is_active"
                />
              </v-tabs-window-item>
              <v-tabs-window-item value="invoices">
                <Invoices
                  :legacy-vehicle-id="itemId"
                  :is-active="item.is_active"
                />
              </v-tabs-window-item>
              <v-tabs-window-item value="documents">
                <Documents
                  :legacy-vehicle-id="itemId"
                  :is-active="item.is_active"
                />
              </v-tabs-window-item>
              <v-tabs-window-item value="investors">
                <Investors
                  :legacy-vehicle-id="itemId"
                  :is-active="item.is_active"
                />
              </v-tabs-window-item>
              <v-tabs-window-item value="expenses">
                <Expenses
                  :legacy-vehicle-id="itemId"
                  :is-active="item.is_active"
                />
              </v-tabs-window-item>
              <v-tabs-window-item value="sale">
                <LegacyVehiclesSale
                  :legacy-vehicle-id="itemId"
                  :is-active="item.is_active"
                />
              </v-tabs-window-item>
              <v-tabs-window-item value="clients">
                <LegacyVehiclesClients
                  :legacy-vehicle-id="itemId"
                  :is-active="item.is_active"
                />
              </v-tabs-window-item>
              <v-tabs-window-item value="payments">
                <LegacyVehiclesPayments
                  :legacy-vehicle-id="itemId"
                  :is-active="item.is_active"
                />
              </v-tabs-window-item>
            </v-tabs-window>
          </v-sheet>
        </v-col>

        <v-col
          v-if="item.is_active && store.getAuth?.user?.role_id === 1"
          cols="12"
        >
          <v-btn
            icon
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
import { getAmountFormat, getDateTime } from "@/utils/formatters";
import { getRules } from "@/utils/validators";
import { getFormData, getObj } from "@/utils/helpers";

import BtnBack from "@/components/BtnBack.vue";
import CardTitle from "@/components/CardTitle.vue";
import DlgReg from "@/components/DlgReg.vue";
import VisVal from "@/components/VisVal.vue";
import VisDoc from "@/components/VisDoc.vue";
import VisDoc2 from "@/components/VisDoc2.vue";
import InpDate from "@/components/InpDate.vue";
import Investors from "@/components/Investors.vue";
import Expenses from "@/components/Expenses.vue";
import LegacyVehicleInfo from "@/components/LegacyVehicleInfo.vue";
import Acquisitions from "@/components/Acquisitions.vue";
import Invoices from "@/components/Invoices.vue";
import Documents from "@/components/Documents.vue";
import LegacyVehiclesSale from "@/components/LegacyVehiclesSale.vue";
import LegacyVehiclesClients from "@/components/LegacyVehiclesClients.vue";
import LegacyVehiclesPayments from "@/components/LegacyVehiclesPayments.vue";

const routeName = "legacy_vehicles";
const currentDate = ref(getDateTime("-", "", "", false));

const alert = inject("alert");
const confirm = inject("confirm");
const store = useStore();
const router = useRouter();
const route = useRoute();

const itemId = ref(getDecodeId(route.params.id));
const isLoading = ref(true);
const item = ref(null);
const regDialog = ref(false);
const tab = ref("vehicle");
const rules = getRules();

const getItem = async () => {
  let endpoint = null;
  let response = null;

  isLoading.value = true;
  try {
    endpoint = `${URL_API}/${routeName}/${itemId.value}`;
    response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    item.value = getRsp(response).data.item;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

const deleteItem = async () => {
  const confirmed = await confirm?.show("¿Confirma inactivar el registro?");
  if (!confirmed) return;

  isLoading.value = true;
  try {
    const endpoint = `${URL_API}/${routeName}/${itemId.value}`;
    const response = getRsp(
      await axios.delete(endpoint, getHdrs(store.getAuth?.token))
    );
    alert?.show("success", response.msg);
    router.push({ name: routeName });
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

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
};

// legacyVehicleTrade
const legacyVehicleTrade = ref(null);
const legacyVehicleTradeLdg = ref(false);
const legacyVehicleTradeDlg = ref(false);
const legacyVehicleTradeForm = ref(null);

const legacyVehicleTradeAddDlg = () => {
  let is_purchase = 1;
  if (legacyVehicleTrades.value.length > 0) {
    is_purchase =
      legacyVehicleTrades.value[legacyVehicleTrades.value.length - 1]
        .is_purchase == 1
        ? 0
        : 1;
  }

  legacyVehicleTrade.value = {
    id: null,
    legacy_vehicle_id: itemId.value,
    is_purchase: is_purchase,
    vendor_id: null,
    purchase_price: null,
    commission_amount: null,
    vat_type_id: null,
    invoice_amount: null,
    sale_price: null,
    note: null,
  };
  legacyVehicleTradeLdg.value = false;
  legacyVehicleTradeDlg.value = true;
};

const legacyVehicleTradeAdd = async () => {
  const { valid } = await legacyVehicleTradeForm.value.validate();
  if (!valid) return;

  const confirmed = await confirm?.show(`¿Confirma agregar?`);
  if (!confirmed) return;

  legacyVehicleTradeLdg.value = true;

  try {
    const endpoint = `${URL_API}/${routeName}/legacy_vehicles_trades`;
    const response = getRsp(
      await axios.post(
        endpoint,
        legacyVehicleTrade.value,
        getHdrs(store.getAuth?.token)
      )
    );

    alert?.show("success", response.msg);
    legacyVehicleTradeDlg.value = false;
    getItem();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    legacyVehicleTradeLdg.value = false;
  }
};

const legacyVehicleTradeRemove = async (id) => {
  const confirmed = await confirm?.show("¿Confirma eliminar el registro?");
  if (!confirmed) return;

  isLoading.value = true;
  try {
    const endpoint = `${URL_API}/${routeName}/legacy_vehicles_trades/${id}`;
    const response = getRsp(
      await axios.delete(endpoint, getHdrs(store.getAuth?.token))
    );
    alert?.show("success", response.msg);
    getItem();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

// legacyVehicleDocument
const legacyVehicleDocument = ref(null);
const legacyVehicleDocumentLdg = ref(false);
const legacyVehicleDocumentDlg = ref(false);
const legacyVehicleDocumentForm = ref(null);

const isAddingNewDocumentType = ref(false);
const newDocumentTypeName = ref("");
const newDocumentTypeInputRef = ref(null);
const isSavingNewDocumentType = ref(false);

watch(
  () => legacyVehicleDocument.value?.document_type_id,
  (newDocumentTypeId) => {
    if (!legacyVehicleDocument.value) return;

    if (newDocumentTypeId === 0) {
      isAddingNewDocumentType.value = true;
    } else {
      isAddingNewDocumentType.value = false;
      newDocumentTypeName.value = "";
      newDocumentTypeInputRef.value?.resetValidation();
    }
  }
);

const addNewDocumentType = async () => {
  if (!newDocumentTypeName.value || newDocumentTypeName.value.trim() === "") {
    alert?.show("red-darken-1", "Por favor, ingresa el nombre del nuevo tipo");
    return;
  }

  const confirmed = await confirm?.show(
    `¿Confirma agregar el nuevo tipo "${newDocumentTypeName.value}"?`
  );
  if (!confirmed) return;

  isSavingNewDocumentType.value = true;
  try {
    const payload = {
      name: newDocumentTypeName.value.trim(),
    };
    const endpoint = `${URL_API}/document_types`;
    const response = await axios.post(
      endpoint,
      payload,
      getHdrs(store.getAuth?.token)
    );
    const newDocumentTypeId = getRsp(response).data.item.id;

    alert?.show("green-darken-1", "Nuevo tipo agregado con éxito");

    const getEndpoint = `${URL_API}/document_types/${newDocumentTypeId}`;
    const getResponse = await axios.get(
      getEndpoint,
      getHdrs(store.getAuth?.token)
    );
    const newDocumentType = getRsp(getResponse).data.item;

    const otroOption = documentTypes.value.pop();
    documentTypes.value = [...documentTypes.value, newDocumentType, otroOption];
    legacyVehicleDocument.value.document_type_id = newDocumentType.id;

    newDocumentTypeName.value = "";
    isAddingNewDocumentType.value = false;
    newDocumentTypeInputRef.value?.resetValidation();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isSavingNewDocumentType.value = false;
  }
};

const cancelAddingNewDocumentType = () => {
  isAddingNewDocumentType.value = false;
  newDocumentTypeName.value = "";
  newDocumentTypeInputRef.value?.resetValidation();
  legacyVehicleDocument.value.document_type_id = null;
};

const legacyVehicleDocumentAddDlg = () => {
  isAddingNewDocumentType.value = false;
  newDocumentTypeName.value = "";
  legacyVehicleDocument.value = {
    id: null,
    is_active: 1,
    legacy_vehicle_id: itemId.value,
    document_type_id: null,
    document_path: null,
    document_doc: null,
    document_dlt: false,
    note: null,
  };
  legacyVehicleDocumentLdg.value = false;
  legacyVehicleDocumentDlg.value = true;
};

const legacyVehicleDocumentAdd = async () => {
  const { valid } = await legacyVehicleDocumentForm.value.validate();
  if (!valid) return;

  const confirmed = await confirm?.show(`¿Confirma agregar?`);
  if (!confirmed) return;

  legacyVehicleDocumentLdg.value = true;

  try {
    const endpoint = `${URL_API}/${routeName}/legacy_vehicle_documents`;
    const response = getRsp(
      await axios.post(
        endpoint,
        getFormData(legacyVehicleDocument.value),
        getHdrs(store.getAuth?.token, true)
      )
    );

    alert?.show("success", response.msg);
    legacyVehicleDocumentDlg.value = false;
    getItem();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    legacyVehicleDocumentLdg.value = false;
  }
};

const legacyVehicleDocumentRemove = async (id) => {
  const confirmed = await confirm?.show("¿Confirma eliminar el registro?");
  if (!confirmed) return;

  isLoading.value = true;
  try {
    const endpoint = `${URL_API}/${routeName}/legacy_vehicle_documents/${id}`;
    const response = getRsp(
      await axios.delete(endpoint, getHdrs(store.getAuth?.token))
    );
    alert?.show("success", response.msg);
    getItem();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

// legacyVehicleInvoice
const legacyVehicleInvoice = ref(null);
const legacyVehicleInvoiceLdg = ref(false);
const legacyVehicleInvoiceDlg = ref(false);
const legacyVehicleInvoiceForm = ref(null);

const legacyVehicleInvoiceAddDlg = () => {
  legacyVehicleInvoice.value = {
    id: null,
    is_active: 1,
    legacy_vehicle_id: itemId.value,
    document_path: null,
    document_doc: null,
    document_dlt: false,
    note: null,
  };
  legacyVehicleInvoiceLdg.value = false;
  legacyVehicleInvoiceDlg.value = true;
};

const legacyVehicleInvoiceAdd = async () => {
  const { valid } = await legacyVehicleInvoiceForm.value.validate();
  if (!valid) return;

  const confirmed = await confirm?.show(`¿Confirma agregar?`);
  if (!confirmed) return;

  legacyVehicleInvoiceLdg.value = true;

  try {
    const endpoint = `${URL_API}/${routeName}/legacy_vehicle_invoices`;
    const response = getRsp(
      await axios.post(
        endpoint,
        getFormData(legacyVehicleInvoice.value),
        getHdrs(store.getAuth?.token, true)
      )
    );

    alert?.show("success", response.msg);
    legacyVehicleInvoiceDlg.value = false;
    getItem();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    legacyVehicleInvoiceLdg.value = false;
  }
};

const legacyVehicleInvoiceRemove = async (id) => {
  const confirmed = await confirm?.show("¿Confirma eliminar el registro?");
  if (!confirmed) return;

  isLoading.value = true;
  try {
    const endpoint = `${URL_API}/${routeName}/legacy_vehicle_invoices/${id}`;
    const response = getRsp(
      await axios.delete(endpoint, getHdrs(store.getAuth?.token))
    );
    alert?.show("success", response.msg);
    getItem();
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
