<template>
  <v-col cols="12">
    <v-card>
      <v-card-title>
        <v-row dense>
          <v-col cols="11">
            <CardTitle text="ADQUISICIÓN" sub />
          </v-col>
          <v-col cols="1" class="text-right">
            <v-btn
              v-if="isActive"
              icon
              variant="text"
              size="x-small"
              color="success"
              @click="legacyVehicleTradeAddDlg()"
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
              <th>Proveedor</th>
              <th>Monto Factura</th>
              <th>Comisión</th>
              <th>Precio Compra</th>
              <th>Precio Venta</th>
              <th>IVA</th>
              <th>Observaciones</th>
              <th width="40" />
            </tr>
          </thead>
          <tbody>
            <tr v-for="(legacyVehicleTrade, i) in legacyVehicleTrades" :key="i">
              <td>{{ i + 1 }}</td>
              <td>
                {{
                  legacyVehicleTrade.vendor
                    ? legacyVehicleTrade.vendor.name
                    : "-"
                }}
              </td>
              <td>
                {{
                  legacyVehicleTrade.invoice_amount
                    ? getAmountFormat(legacyVehicleTrade.invoice_amount)
                    : "-"
                }}
              </td>
              <td>
                {{
                  legacyVehicleTrade.commission_amount
                    ? getAmountFormat(legacyVehicleTrade.commission_amount)
                    : "-"
                }}
              </td>
              <td>
                {{
                  legacyVehicleTrade.purchase_price
                    ? getAmountFormat(legacyVehicleTrade.purchase_price)
                    : "-"
                }}
              </td>
              <td>
                {{
                  legacyVehicleTrade.sale_price
                    ? getAmountFormat(legacyVehicleTrade.sale_price)
                    : "-"
                }}
              </td>
              <td>{{ legacyVehicleTrade.vat_type.name }}</td>
              <td>{{ legacyVehicleTrade.note }}</td>
              <td class="text-right">
                <v-btn
                  v-if="isActive && legacyVehicleTrades.length - 1 == i"
                  icon
                  variant="text"
                  size="x-small"
                  color="error"
                  @click.prevent="
                    legacyVehicleTradeRemove(legacyVehicleTrade.id)
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
      v-model="legacyVehicleTradeDlg"
      persistent
      scrim="black"
      max-width="1200"
    >
      <v-card
        :loading="legacyVehicleTradeLdg"
        :disabled="legacyVehicleTradeLdg"
        flat
      >
        <v-card-title>
          <v-row dense>
            <v-col cols="11">
              <CardTitle text="ADQUISICIÓN" subvalue />
            </v-col>
            <v-col cols="1" class="text-right">
              <v-btn
                icon
                variant="text"
                size="x-small"
                @click="legacyVehicleTradeDlg = false"
              >
                <v-icon>mdi-close</v-icon>
                <v-tooltip activator="parent" location="left">Cerrar</v-tooltip>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>

        <v-card-text v-if="legacyVehicleTrade">
          <v-form ref="legacyVehicleTradeForm" @submit.prevent>
            <v-row dense>
              <v-col v-if="legacyVehicleTrade.is_purchase" cols="12">
                <v-autocomplete
                  label="Proveedor"
                  v-model="legacyVehicleTrade.vendor_id"
                  :items="vendors"
                  :loading="vendorsLoading"
                  item-value="id"
                  item-title="name"
                  variant="outlined"
                  density="compact"
                  :rules="rules.required"
                  autocomplete="off"
                />
              </v-col>

              <v-col v-if="legacyVehicleTrade.is_purchase" cols="12" md="3">
                <v-text-field
                  :label="
                    'Monto factura ' +
                    getAmountFormat(legacyVehicleTrade.invoice_amount)
                  "
                  v-model="legacyVehicleTrade.invoice_amount"
                  type="number"
                  variant="outlined"
                  density="compact"
                  min="0"
                  :rules="rules.required"
                  autocomplete="off"
                  @update:modelValue="updatePurchasePrice()"
                />
              </v-col>

              <v-col v-if="legacyVehicleTrade.is_purchase" cols="12" md="3">
                <v-text-field
                  :label="
                    'Comisión ' +
                    getAmountFormat(legacyVehicleTrade.commission_amount)
                  "
                  v-model="legacyVehicleTrade.commission_amount"
                  type="number"
                  variant="outlined"
                  density="compact"
                  min="0"
                  :rules="rules.required"
                  autocomplete="off"
                  @update:modelValue="updatePurchasePrice()"
                />
              </v-col>

              <v-col v-if="legacyVehicleTrade.is_purchase" cols="12" md="3">
                <v-text-field
                  :label="
                    'Precio Compra ' +
                    getAmountFormat(legacyVehicleTrade.purchase_price)
                  "
                  v-model="legacyVehicleTrade.purchase_price"
                  type="number"
                  variant="outlined"
                  density="compact"
                  min="0"
                  :rules="rules.required"
                  autocomplete="off"
                />
              </v-col>
              <v-col v-else cols="12" md="3">
                <v-text-field
                  :label="
                    'Precio Venta ' +
                    getAmountFormat(legacyVehicleTrade.sale_price)
                  "
                  v-model="legacyVehicleTrade.sale_price"
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
                  v-model="legacyVehicleTrade.vat_type_id"
                  :items="vatTypes"
                  :loading="vatTypesLoading"
                  item-value="id"
                  item-title="name"
                  variant="outlined"
                  density="compact"
                  :rules="rules.required"
                />
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Observaciones*"
                  v-model="legacyVehicleTrade.note"
                  type="text"
                  variant="outlined"
                  density="compact"
                  maxlength="255"
                  counter
                  :rules="rules.textOptional"
                  autocomplete="off"
                />
              </v-col>

              <v-col cols="12" class="text-right">
                <v-btn
                  icon
                  size="x-small"
                  color="success"
                  @click.prevent="legacyVehicleTradeAdd()"
                  :loading="legacyVehicleTradeLdg"
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
import { getAmountFormat } from "@/utils/formatters";
import { getRules } from "@/utils/validators";

import CardTitle from "@/components/CardTitle.vue";

const alert = inject("alert");
const confirm = inject("confirm");
const store = useStore();

const routeName = "legacy_vehicles";

const legacyVehicleTrades = ref([]);
const vendors = ref([]);
const vendorsLoading = ref(true);
const vatTypes = ref([]);
const vatTypesLoading = ref(true);
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

const getVendors = async () => {
  try {
    const endpoint = `${URL_API}/vendors?is_active=1&filter=0`;
    const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    vendors.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    vendorsLoading.value = false;
  }
};

const getVatTypes = async () => {
  try {
    const endpoint = `${URL_API}/vat_types?is_active=1&filter=0`;
    const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    vatTypes.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    vatTypesLoading.value = false;
  }
};

const getLegacyVehicleTrades = async () => {
  let endpoint = null;
  let response = null;

  isLoading.value = true;
  try {
    endpoint = `${URL_API}/${routeName}/legacy_vehicles_trades`;
    response = await axios.get(endpoint, {
      params: {
        legacy_vehicle_id: props.legacyVehicleId,
        is_active: 1,
      },
      ...getHdrs(store.getAuth?.token),
    });
    legacyVehicleTrades.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

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
    legacy_vehicle_id: props.legacyVehicleId,
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
    getLegacyVehicleTrades();
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
    getLegacyVehicleTrades();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

const updatePurchasePrice = () => {
  const invoice = Number(legacyVehicleTrade.value.invoice_amount || 0);
  const commission = Number(legacyVehicleTrade.value.commission_amount || 0);

  const total = invoice + commission;
  legacyVehicleTrade.value.purchase_price = total.toFixed(2);
};

onMounted(() => {
  getVendors();
  getVatTypes();
  getLegacyVehicleTrades();
});
</script>
