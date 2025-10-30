<template>
  <v-col cols="12">
    <v-card :loading="isLoading">
      <v-card-title>
        <v-row dense>
          <v-col cols="11">
            <CardTitle :text="`PAGOS | ${getAmountFormat(totalPayments)}`" sub />
          </v-col>
          <v-col cols="1" class="text-right">
            <v-btn
              v-if="isActive"
              icon
              variant="text"
              size="x-small"
              color="success"
              @click="legacyVehiclePaymentAddDlg()"
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
              <th>Tipo</th>
              <th>Observaciones</th>
              <th>Fecha</th>
              <th>Monto</th>
              <th width="40" />
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(legacyVehiclePayment, i) in legacyVehiclePayments"
              :key="i"
            >
              <td>{{ i + 1 }}</td>
              <td>
                {{ legacyVehiclePayment.payment_type.name }}
              </td>
              <td>
                {{ legacyVehiclePayment.notes }}
              </td>
              <td>
                {{ legacyVehiclePayment.payment_date }}
              </td>
              <td>{{ getAmountFormat(legacyVehiclePayment.amount) }}</td>
              <td class="text-right">
                <v-btn
                  v-if="isActive"
                  icon
                  variant="text"
                  size="x-small"
                  color="error"
                  @click.prevent="
                    legacyVehiclePaymentRemove(legacyVehiclePayment.id)
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
  </v-col>

  <v-dialog
    v-model="legacyVehiclePaymentDlg"
    persistent
    scrim="black"
    max-width="1200"
  >
    <v-card
      :loading="legacyVehiclePaymentLdg"
      :disabled="legacyVehiclePaymentLdg"
      flat
    >
      <v-card-title>
        <v-row dense>
          <v-col cols="11">
            <CardTitle text="PAGO" subvalue />
          </v-col>
          <v-col cols="1" class="text-right">
            <v-btn
              icon
              variant="text"
              size="x-small"
              @click="legacyVehiclePaymentDlg = false"
            >
              <v-icon>mdi-close</v-icon>
              <v-tooltip activator="parent" location="left">Cerrar</v-tooltip>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>

      <v-card-text v-if="legacyVehiclePayment">
        <v-form ref="legacyVehiclePaymentForm" @submit.prevent>
          <v-row dense>
            <v-col cols="12" md="3">
              <v-select
                label="Tipo de pago"
                v-model="legacyVehiclePayment.payment_type_id"
                :items="paymentTypes"
                :loading="paymentTypesLoading"
                item-value="id"
                item-title="name"
                variant="outlined"
                density="compact"
                :rules="rules.required"
              />
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field
                label="Observaciones"
                v-model="legacyVehiclePayment.notes"
                type="text"
                variant="outlined"
                density="compact"
                maxlength="100"
                :rules="rules.textRequired"
                autocomplete="off"
              />
            </v-col>

            <v-col cols="12" md="3">
              <InpDate
                label="Fecha"
                v-model="legacyVehiclePayment.payment_date"
                :rules="rules.required"
                :before="true"
              />
            </v-col>

            <v-col cols="12" md="2">
              <v-text-field
                :label="'Monto ' + getAmountFormat(legacyVehiclePayment.amount)"
                v-model="legacyVehiclePayment.amount"
                type="number"
                variant="outlined"
                density="compact"
                min="0"
                :rules="rules.required"
                autocomplete="off"
              />
            </v-col>

            <v-col cols="12" class="text-right">
              <v-btn
                icon
                size="x-small"
                color="success"
                @click.prevent="legacyVehiclePaymentAdd()"
                :loading="legacyVehiclePaymentLdg"
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
</template>

<script setup>
import { ref, inject, onMounted, computed } from "vue";
import axios from "axios";

import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getHdrs, getErr, getRsp } from "@/utils/http";
import { getAmountFormat, getDateTime } from "@/utils/formatters";
import { getRules } from "@/utils/validators";
import { getFormData } from "@/utils/helpers";

import CardTitle from "@/components/CardTitle.vue";
import VisDoc from "@/components/VisDoc.vue";
import VisDoc2 from "@/components/VisDoc2.vue";
import InpDate from "@/components/InpDate.vue";

const alert = inject("alert");
const confirm = inject("confirm");
const store = useStore();

const routeName = "legacy_vehicles";
const currentDate = ref(getDateTime("-", "", "", false));

const legacyVehiclePayments = ref([]);
const clients = ref([]);
const clientsLoading = ref(true);
const paymentTypes = ref([]);
const paymentTypesLoading = ref(true);
const paymentMethods = ref([]);
const paymentMethodsLoading = ref(true);
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

const getClients = async () => {
  try {
    // const endpoint = `${URL_API}/clients?is_active=1&filter=0`;
    // const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    // item.value = getRsp(response).data.item;
    clients.value = [
      { id: 1, name: "Carlos Rodríguez" },
      { id: 2, name: "María López" },
      { id: 3, name: "Juan Martínez" },
      { id: 4, name: "Ana García" },
      { id: 5, name: "Roberto Sánchez" },
    ];
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    clientsLoading.value = false;
  }
};

const getPaymentTypes = async () => {
  try {
    // const endpoint = `${URL_API}/payment_types?is_active=1&filter=0`;
    // const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    // item.value = getRsp(response).data.item;
    paymentTypes.value = [
      { id: 1, name: "Normal" },
      { id: 2, name: "Inicial" },
      { id: 3, name: "Mensual" },
      { id: 4, name: "Extraordinario" },
      { id: 5, name: "Final" },
    ];
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    paymentTypesLoading.value = false;
  }
};

const getPaymentMethods = async () => {
  try {
    // const endpoint = `${URL_API}/payment_methods?is_active=1&filter=0`;
    // const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    // item.value = getRsp(response).data.item;
    paymentMethods.value = [
      { id: 1, name: "Transferencia bancaria" },
      { id: 2, name: "Efectivo" },
      { id: 3, name: "Cheque" },
      { id: 4, name: "Tarjeta de crédito" },
      { id: 5, name: "Tarjeta de débito" },
    ];
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    paymentMethodsLoading.value = false;
  }
};

const getLegacyVehiclePayments = async () => {
  let endpoint = null;
  let response = null;

  isLoading.value = true;
  try {
    // endpoint = `${URL_API}/${routeName}/legacy_vehicle_payments`;
    // response = await axios.get(endpoint, {
    //   params: {
    //     legacy_vehicle_id: props.legacyVehicleId,
    //     is_active: 1,
    //   },
    //   ...getHdrs(store.getAuth?.token),
    // });
    // legacyVehiclePayments.value = getRsp(response).data.items;
    legacyVehiclePayments.value = [
      {
        id: 1,
        payment_type: { name: "Normal" },
        notes: "Primer pago del cliente",
        payment_date: "2024-01-15",
        amount: 25000,
      },
      {
        id: 2,
        payment_type: { name: "Inicial" },
        notes: "Pago correspondiente al mes de enero",
        payment_date: "2024-02-15",
        amount: 15000,
      },
      {
        id: 3,
        payment_type: { name: "Mensual" },
        notes: "Pago adicional por anticipo",
        payment_date: "2024-03-01",
        amount: 10000,
      },
      {
        id: 4,
        payment_type: { name: "Extraordinario" },
        notes: "Pago final del contrato",
        payment_date: "2024-04-01",
        amount: 20000,
      },
    ];
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

const legacyVehiclePayment = ref(null);
const legacyVehiclePaymentLdg = ref(false);
const legacyVehiclePaymentDlg = ref(false);
const legacyVehiclePaymentForm = ref(null);

const legacyVehiclePaymentAddDlg = () => {
  legacyVehiclePayment.value = {
    id: null,
    legacy_vehicle_id: props.legacyVehicleId,
    client_id: null,
    payment_date: currentDate.value,
    payment_type_id: null,
    payment_method_id: null,
    amount: null,
    reference: null,
    notes: null,
    receipt_file: null,
  };
  legacyVehiclePaymentLdg.value = false;
  legacyVehiclePaymentDlg.value = true;
};

const legacyVehiclePaymentAdd = async () => {
  const { valid } = await legacyVehiclePaymentForm.value.validate();
  if (!valid) return;

  const confirmed = await confirm?.show(`¿Confirma agregar?`);
  if (!confirmed) return;

  legacyVehiclePaymentLdg.value = true;

  try {
    const endpoint = `${URL_API}/${routeName}/legacy_vehicle_payments`;
    const response = getRsp(
      await axios.post(
        endpoint,
        getFormData(legacyVehiclePayment.value),
        getHdrs(store.getAuth?.token, true)
      )
    );

    alert?.show("success", response.msg);
    legacyVehiclePaymentDlg.value = false;
    getLegacyVehiclePayments();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    legacyVehiclePaymentLdg.value = false;
  }
};

const legacyVehiclePaymentRemove = async (id) => {
  const confirmed = await confirm?.show("¿Confirma eliminar el registro?");
  if (!confirmed) return;

  isLoading.value = true;
  try {
    const endpoint = `${URL_API}/${routeName}/legacy_vehicle_payments/${id}`;
    const response = getRsp(
      await axios.delete(endpoint, getHdrs(store.getAuth?.token))
    );
    alert?.show("success", response.msg);
    getLegacyVehiclePayments();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

const totalPayments = computed(() => {
  return legacyVehiclePayments.value.reduce((total, payment) => {
    return total + (parseFloat(payment.amount) || 0);
  }, 0);
});

onMounted(() => {
  getClients();
  getPaymentTypes();
  getPaymentMethods();
  getLegacyVehiclePayments();
});
</script>