<template>
  <v-col cols="12">
    <v-card>
      <v-card-title>
        <v-row dense>
          <v-col cols="11">
            <CardTitle text="FACTURAS" sub />
          </v-col>
          <v-col cols="1" class="text-right">
            <v-btn
              v-if="isActive"
              icon
              variant="text"
              size="x-small"
              color="success"
              @click="legacyVehicleInvoiceAddDlg()"
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
        <v-table density="compact" striped="even">
          <thead>
            <tr>
              <th width="40">#</th>
              <th>Observaciones</th>
              <th width="40">Archivo</th>
              <th width="40" />
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(legacyVehicleInvoice, i) in legacyVehicleInvoices"
              :key="i"
            >
              <td>{{ i + 1 }}</td>
              <td>
                {{ legacyVehicleInvoice.note }}
              </td>
              <td class="d-flex justify-center align-center">
                <VisDoc2 :value="legacyVehicleInvoice.document_b64" />
                <VisDoc :value="legacyVehicleInvoice.document_b64" />
              </td>
              <td class="text-right">
                <v-btn
                  v-if="isActive"
                  icon
                  variant="text"
                  size="x-small"
                  color="error"
                  @click.prevent="
                    legacyVehicleInvoiceRemove(legacyVehicleInvoice.id)
                  "
                >
                  <v-icon>mdi-minus</v-icon>
                  <v-tooltip activator="parent" location="left">
                    Eliminar
                  </v-tooltip>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>

    <v-dialog
      v-model="legacyVehicleInvoiceDlg"
      persistent
      scrim="black"
      max-width="1200"
    >
      <v-card
        :loading="legacyVehicleInvoiceLdg"
        :disabled="legacyVehicleInvoiceLdg"
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
                @click="legacyVehicleInvoiceDlg = false"
              >
                <v-icon>mdi-close</v-icon>
                <v-tooltip activator="parent" location="left">Cerrar</v-tooltip>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>

        <v-card-text v-if="legacyVehicleInvoice">
          <v-form ref="legacyVehicleInvoiceForm" @submit.prevent>
            <v-row dense>
              <v-col cols="12" md="6">
                <v-file-input
                  label="Archivo (PDF)"
                  v-model="legacyVehicleInvoice.document_doc"
                  variant="outlined"
                  density="compact"
                  prepend-icon=""
                  show-size
                  accept=".pdf"
                  :rules="rules.fileRequired"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  label="Observaciones"
                  v-model="legacyVehicleInvoice.note"
                  type="text"
                  variant="outlined"
                  density="compact"
                  maxlength="50"
                  counter
                  :rules="rules.textRequired"
                  autocomplete="off"
                />
              </v-col>

              <v-col cols="12" class="text-right">
                <v-btn
                  icon
                  size="x-small"
                  color="success"
                  @click.prevent="legacyVehicleInvoiceAdd()"
                  :loading="legacyVehicleInvoiceLdg"
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
  </v-col>
</template>

<script setup>
import { ref, inject, onMounted } from "vue";
import axios from "axios";

import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getHdrs, getErr, getRsp } from "@/utils/http";
import { getFormData } from "@/utils/helpers";
import { getRules } from "@/utils/validators";

import CardTitle from "@/components/CardTitle.vue";
import VisDoc from "@/components/VisDoc.vue";
import VisDoc2 from "@/components/VisDoc2.vue";

const alert = inject("alert");
const confirm = inject("confirm");
const store = useStore();

const routeName = "legacy_vehicles";

const legacyVehicleInvoices = ref([]);
const rules = getRules();

const isLoading = ref(true);
const props = defineProps({
  legacyVehicleId: {
    type: String,
    required: true,
  },
  isActive: {
    type: Number,
    required: true,
  },
});

const getLegacyVehicleInvoices = async () => {
  let endpoint = null;
  let response = null;

  isLoading.value = true;
  try {
    endpoint = `${URL_API}/${routeName}/legacy_vehicle_invoices`;
    response = await axios.get(endpoint, {
      params: {
        legacy_vehicle_id: props.legacyVehicleId,
        is_active: 1,
      },
      ...getHdrs(store.getAuth?.token),
    });
    legacyVehicleInvoices.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

const legacyVehicleInvoice = ref(null);
const legacyVehicleInvoiceLdg = ref(false);
const legacyVehicleInvoiceDlg = ref(false);
const legacyVehicleInvoiceForm = ref(null);

const legacyVehicleInvoiceAddDlg = () => {
  legacyVehicleInvoice.value = {
    id: null,
    is_active: 1,
    legacy_vehicle_id: props.legacyVehicleId,
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
    getLegacyVehicleInvoices();
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
    getLegacyVehicleInvoices();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  getLegacyVehicleInvoices();
});
</script>