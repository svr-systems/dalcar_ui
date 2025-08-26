<template>
  <v-card elevation="24" :disabled="isLoading" :loading="isLoading">
    <v-card-title>
      <v-row dense>
        <v-col cols="10">
          <BtnBack
            :route="{ name: routeName + (!isStoreMode ? '/show' : '') }"
          />
          <CardTitle :text="$route.meta.title" :icon="$route.meta.icon" />
        </v-col>
        <v-col cols="2" class="text-right" />
      </v-row>
    </v-card-title>

    <v-card-text v-if="item">
      <v-form ref="formRef" @submit.prevent>
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-title>
                <CardTitle text="Datos Generales" sub />
              </v-card-title>
              <v-card-text>
                <v-row dense>
                  <v-col cols="12" md="4">
                    <v-text-field
                      label="Fecha"
                      v-model="item.date"
                      type="date"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="8">
                    <v-autocomplete
                      label="Proveedor"
                      v-model="item.provider_id"
                      :items="providers"
                      item-value="id"
                      item-title="name"
                      :loading="providersLoading"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      label="Monto a Pagar"
                      v-model="item.amount"
                      type="number"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      label="Referencia"
                      v-model="item.reference"
                      type="text"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                    class="d-flex align-center"
                    style="gap: 8px"
                  >
                    <v-file-input
                      v-model="item.account_state_doc"
                      label="Estado de cuenta"
                      variant="outlined"
                      density="compact"
                      prepend-icon=""
                      show-size
                      accept=".pdf"
                      :rules="rules.required"
                      :disabled="item.account_state_dlt"
                      class="flex-grow-1"
                    >
                      <template v-slot:append>
                        <div
                          v-if="
                            !isStoreMode &&
                            item.account_state &&
                            !item.account_state_doc
                          "
                          class="d-flex"
                        >
                          <BtnDwd
                            :value="item.account_state_b64"
                            :disabled="item.account_state_dlt"
                          />
                        </div>
                      </template>
                    </v-file-input>
                    <v-btn
                      v-if="
                        !isStoreMode &&
                        item.account_state &&
                        !item.account_state_doc
                      "
                      icon
                      variant="text"
                      size="small"
                      :color="item.account_state_dlt ? 'error' : 'default'"
                      @click="item.account_state_dlt = !item.account_state_dlt"
                      class="ml-1"
                      style="margin-top: -20px"
                    >
                      <v-icon size="small">
                        {{
                          item.account_state_dlt
                            ? "mdi-close-circle"
                            : "mdi-delete"
                        }}
                      </v-icon>
                      <v-tooltip activator="parent" location="bottom">
                        {{
                          item.account_state_dlt
                            ? "Revertir eliminación"
                            : "Eliminar"
                        }}
                      </v-tooltip>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12">
            <v-card>
              <v-card-title>
                <CardTitle text="Autos" sub />
              </v-card-title>
              <v-card-text>
                <v-row dense v-for="(auto, i) in item.autos" :key="i">
                  <v-col cols="12" md="3">
                    <v-autocomplete
                      label="Marca"
                      v-model="auto.brand"
                      :items="brands"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-autocomplete
                      label="Modelo"
                      v-model="auto.model"
                      :items="models"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-autocomplete
                      label="Transmisión*"
                      v-model="auto.transmission"
                      :items="transmissions"
                      variant="outlined"
                      density="compact"
                      :rules="rules.textOptional"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-autocomplete
                      label="Año"
                      type="number"
                      v-model="auto.year"
                      :items="years"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-autocomplete
                      label="Color"
                      v-model="auto.color"
                      :items="colors"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="VIN"
                      v-model="auto.vin"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="Precio Compra"
                      type="number"
                      v-model="auto.purchase_price"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="Comisión*"
                      type="number"
                      v-model="auto.commission"
                      variant="outlined"
                      density="compact"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="IVA*"
                      type="number"
                      v-model="auto.iva"
                      variant="outlined"
                      density="compact"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="Monto Factura"
                      type="number"
                      v-model="auto.invoice_amount"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-btn size="x-small" color="warning" @click="autoAdd()">
                      Agregar
                      <v-icon size="x-small" end>mdi-plus</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12">
            <v-card>
              <v-card-title>
                <CardTitle text="Pagos" sub />
              </v-card-title>
              <v-card-text>
                <v-table>
                  <thead>
                    <tr>
                      <th class="text-left">Banco</th>
                      <th class="text-left">Titular</th>
                      <th class="text-left">CLABE</th>
                      <th class="text-left">Cuenta</th>
                      <th class="text-left">Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(payment, i) in item.payments" :key="i">
                      <td>
                        {{ getBankName(payment.bank_id) }}
                      </td>
                      <td>{{ payment.holder }}</td>
                      <td>{{ payment.clabe }}</td>
                      <td>{{ payment.account }}</td>
                      <td>
                        <v-text-field
                          v-model="payment.amount"
                          type="number"
                          variant="outlined"
                          density="compact"
                          hide-details
                          class="mt-4"
                        />
                      </td>
                    </tr>
                  </tbody>
                </v-table>
                <v-row dense class="mt-4">
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="Fecha Límite de Pago"
                      v-model="item.due_date"
                      type="date"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" class="text-right">
            <v-btn
              icon
              variant="flat"
              size="x-small"
              :color="isStoreMode ? 'success' : 'warning'"
              @click.prevent="handleAction"
              :loading="isLoading"
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
import { getDecodeId } from "@/utils/coders";
import { getRules } from "@/utils/validators";
import { getObj, getFormData } from "@/utils/helpers";
import { getUserObj } from "@/utils/objects";

// Componentes
import BtnBack from "@/components/BtnBack.vue";
import CardTitle from "@/components/CardTitle.vue";
import BtnDwd from "@/components/BtnDwd.vue";

// Estado y referencias
const alert = inject("alert");
const confirm = inject("confirm");
const store = useStore();
const router = useRouter();
const route = useRoute();

// Estado reactivo
const itemId = ref(route.params.id ? getDecodeId(route.params.id) : null);
const isStoreMode = ref(!itemId.value);
const isLoading = ref(true);
const formRef = ref(null);
const item = ref(null);
const rules = getRules();

// Datos simulados para los autocompletes
const providers = ref([]);
const providersLoading = ref(true);
const banks = ref([]);
const banksLoading = ref(true);

const brands = ref([]);
const models = ref([]);
const transmissions = ref([]);
const years = ref([]);
const colors = ref([]);

// Constantes fijas
const routeName = "purchaseOrders";

// Función para obtener el nombre del banco a partir de su ID
const getBankName = (bankId) => {
  const bank = banks.value.find((b) => b.id === bankId);
  return bank ? bank.name : "N/A";
};

// Obtener catálogos
const getCatalogs = async () => {
  try {
    // Simular llamada a la API y hardcodeo de datos
    const providersData = [
      { id: 1, name: "Proveedor A" },
      { id: 2, name: "Proveedor B" },
      { id: 3, name: "Proveedor C" },
    ];
    providers.value = providersData;
    providersLoading.value = false;

    const banksData = [
      { id: 1, name: "BBVA" },
      { id: 2, name: "Banamex" },
      { id: 3, name: "Santander" },
      { id: 4, name: "Banorte" },
    ];
    banks.value = banksData;
    banksLoading.value = false;

    // Lógica para hardcodeo de los campos de autos
    brands.value = ["Toyota", "Ford", "Nissan", "Chevrolet", "Honda"];
    models.value = ["Corolla", "Focus", "Versa", "Malibu", "Civic"];
    transmissions.value = ["Automática", "Manual"];
    years.value = ["2020", "2021", "2022", "2023", "2024", "2025"];
    colors.value = ["Negro", "Blanco", "Rojo", "Azul", "Plata"];
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  }
};

const autoAdd = () => {
  item.value.autos.push({
    id: null,
    brand: null,
    model: null,
    transmission: null,
    year: null,
    color: null,
    vin: null,
    purchase_price: null,
    commission: null,
    iva: null,
    invoice_amount: null,
  });
};

// Obtener datos
const getItem = async () => {
  try {
    if (isStoreMode.value) {
      item.value = {
        id: null,
        active: true,
        folio: null,
        date: null,
        amount: null,
        status: null,
        provider_id: null,
        reference: null,
        account_state_doc: null,
        account_state_dlt: false,
        account_state: null,
        account_state_b64: null,
        autos: [],
        payments: [],
        due_date: null,
      };
      autoAdd();
    } else {
      // Simular llamada a la API y hardcodeo de datos de edición
      const response = {
        data: {
          msg: "Registro retornado correctamente",
          data: {
            item: {
              id: 1,
              date: "2024-08-20",
              amount: 50000.0,
              provider_id: 2,
              reference: "REF-002",
              account_state: "https://ejemplo.com/estado_cuenta_001.pdf",
              account_state_doc: new File(["cédula content"], "cédula.pdf", {
                type: "application/pdf",
                lastModified: new Date().getTime(),
              }),
              account_state_dlt: false,
              account_state_b64: "data:application/pdf;base64,JVBERi0xLjcK...",
              autos: [
                {
                  id: 1,
                  brand: "Ford",
                  model: "Focus",
                  transmission: "Manual",
                  year: "2022",
                  color: "Azul",
                  vin: "VIN123456789",
                  purchase_price: 25000,
                  commission: 10000,
                  iva: 1.16,
                  invoice_amount: 26160,
                },
              ],
              payments: [
                {
                  id: 1,
                  bank_id: 1,
                  holder: "Titular Ejemplo",
                  clabe: "123456789012345678",
                  account: "1234567890",
                  amount: 25000,
                },
              ],
              due_date: "2024-09-01",
            },
          },
        },
      };
      item.value = getRsp(response).data.item;
    }
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

const handleAction = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) {
    alert?.show("red-darken-1", "Revisa los detalles señalados");
    return;
  }

  const confirmed = await confirm?.show(
    `¿Confirma ${isStoreMode.value ? "agregar" : "editar"} registro?`
  );
  if (!confirmed) return;

  isLoading.value = true;
  let payload = getObj(item.value, isStoreMode.value);

  if (!isStoreMode.value && payload.account_state_dlt) {
    payload.account_state = "delete";
    delete payload.account_state_doc;
  } else if (payload.account_state_doc) {
    payload.account_state = payload.account_state_doc;
    delete payload.account_state_dlt;
  } else {
    delete payload.account_state_doc;
    delete payload.account_state_dlt;
  }

  try {
    // const endpoint = `${URL_API}/system/${routeName}${
    //   !isStoreMode.value ? `/${payload.id}` : ""
    // }`;
    // const response = getRsp(
    //   await axios.post(
    //     endpoint,
    //     getFormData(payload),
    //     getHdrs(store.getAuth?.token, true)
    //   )
    // );
    // alert?.show("success", response.msg);
    // router.push({
    //   name: `${routeName}/show`,
    //   params: {
    //     id: btoa(isStoreMode.value ? response.data.item.id : itemId.value),
    //   },
    // });
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  getCatalogs();
  getItem();
});
</script>
