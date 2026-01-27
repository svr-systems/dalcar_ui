<template>
  <v-card :disabled="isLoading" :loading="isLoading">
    <v-card-title class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <CardTitle text="COMPROBANTES" sub />
      </div>

      <div>
        <v-btn
          v-if="
            purchaseOrder &&
            purchaseOrder.is_active &&
            !purchaseOrder.paid_at &&
            !total_amount_pending
          "
          icon
          variant="outlined"
          size="x-small"
          density="comfortable"
          color="warning"
          @click="formOpenDialog"
        >
          <v-icon>mdi-upload</v-icon>
          <v-tooltip activator="parent" location="left"> Cargar </v-tooltip>
        </v-btn>
      </div>
    </v-card-title>

    <v-card-text>
      <v-row dense>
        <v-col cols="12">
          <v-table density="compact" striped="even">
            <thead class="font-weight-light text-caption text-medium-emphasis">
              <tr>
                <th>Observación</th>
                <th />
              </tr>
            </thead>

            <tbody>
              <tr v-for="(item, i) in items" :key="i">
                <td>{{ item.note }}</td>
                <td class="text-right">
                  <BtnFilePreview :doc="item.file_b64" tooltip="Ver" />
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
    persistent
  >
    <v-card :disabled="formIsLoading" :loading="formIsLoading">
      <v-card-title class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <CardTitle text="COMPROBANTES" sub />
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

      <v-card-text>
        <v-form ref="formRef" @submit.prevent>
          <v-row
            v-for="(purchaseOrderReceipt, i) in purchaseOrderReceipts"
            :key="i"
            dense
          >
            <v-col cols="12" md="6">
              <v-text-field
                :label="`${i + 1}. Observación`"
                v-model="purchaseOrderReceipt.note"
                type="text"
                variant="outlined"
                density="compact"
                maxlength="255"
                counter
                :rules="rules.textOptional"
                autocomplete="off"
              />
            </v-col>

            <v-col cols="12" md="5">
              <v-file-input
                label="Archivo"
                v-model="purchaseOrderReceipt.file_doc"
                variant="outlined"
                density="compact"
                prepend-icon=""
                show-size
                accept=".pdf,.png,.jpg,.jpeg"
                :rules="rules.fileRequired"
              />
            </v-col>

            <v-col
              cols="12"
              md="1"
              class="py-3 d-flex align-start justify-end ga-1"
            >
              <BtnFilePreview
                :file="purchaseOrderReceipt.file_doc"
                tooltip="Ver"
                variant="outlined"
              />

              <v-btn
                icon
                variant="outlined"
                size="x-small"
                density="comfortable"
                color="error"
                @click="formRemoveReceipt(i)"
              >
                <v-icon>mdi-minus</v-icon>
                <v-tooltip activator="parent" location="left">
                  Eliminar
                </v-tooltip>
              </v-btn>
            </v-col>
          </v-row>

          <v-row dense>
            <v-col cols="12" class="d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <v-btn
                  size="small"
                  color="warning"
                  variant="outlined"
                  @click="formAddReceipt()"
                >
                  Agregar
                  <v-icon end>mdi-plus</v-icon>
                </v-btn>
              </div>

              <v-btn
                size="small"
                color="success"
                :loading="formIsLoading"
                :disabled="formIsLoading || purchaseOrderReceipts.length === 0"
                @click="formSubmit"
              >
                Cargar
                <v-icon end>mdi-upload</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { inject, ref, onMounted } from "vue";
import axios from "axios";

import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getHdrs, getRsp, getErr } from "@/utils/http";
import { getAmountFormat } from "@/utils/formatters";
import { getRules } from "@/utils/validators";
import { extractMultipleNestedProps, getFormData } from "@/utils/helpers";

import CardTitle from "@/components/CardTitle.vue";
import BtnFilePreview from "@/components/BtnFilePreview.vue";

const routeName = "purchase_order_receipts";

const props = defineProps({
  purchase_order_id: {
    type: [String, Number],
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

const isLoading = ref(true);
const purchaseOrder = ref(null);
const items = ref([]);

const formIsDialogOpen = ref(false);
const formIsLoading = ref(false);
const formRef = ref(null);
const purchaseOrderReceipts = ref([]);

const getItems = async () => {
  items.value = [];
  isLoading.value = true;

  try {
    const endpoint = `${URL_API}/purchase_orders/${props.purchase_order_id}/${routeName}`;
    const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    const data = getRsp(response).data;

    purchaseOrder.value = data.purchase_order;
    items.value = data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

const formOpenDialog = () => {
  formIsDialogOpen.value = true;
  formIsLoading.value = true;
  purchaseOrderReceipts.value = [];

  for (const payment of purchaseOrder.value.purchase_order_payments) {
    formAddReceipt(payment);
  }

  formIsLoading.value = false;
};

const formAddReceipt = (data = null) => {
  purchaseOrderReceipts.value.push({
    id: null,
    purchase_order_id: purchaseOrder.value.id,
    file_doc: null,
    note: data ? `${data.bank.name} ${getAmountFormat(data.amount)}` : null,
  });
};

const formRemoveReceipt = (index) => {
  purchaseOrderReceipts.value.splice(index, 1);
};

const formSubmit = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  const confirmed = await confirm?.show("¿Confirma cargar los comprobantes?");
  if (!confirmed) return;

  formIsLoading.value = true;

  let payload = {
    purchase_order_id: purchaseOrder.value.id,
    purchase_order_receipts: purchaseOrderReceipts.value,
  };

  payload = extractMultipleNestedProps(
    payload,
    "purchase_order_receipts",
    "file_doc",
  );

  try {
    const endpoint = `${URL_API}/purchase_orders/${routeName}`;
    const response = getRsp(
      await axios.post(
        endpoint,
        getFormData(payload),
        getHdrs(store.getAuth?.token, true),
      ),
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

onMounted(() => {
  getItems();
});
</script>
