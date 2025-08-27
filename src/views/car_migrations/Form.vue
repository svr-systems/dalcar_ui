<template>
  <v-card elevation="24" :disabled="isLoading" :loading="isLoading">
    <v-card-title>
      <v-row dense>
        <v-col cols="10">
          <BtnBack
            :route="{
              name: routeName + (!isStoreMode ? '/show' : ''),
            }"
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
                <v-row dense>
                  <v-col cols="11">
                    <CardTitle
                      :text="`AUTO${
                        isStoreMode ? '' : ' | ' + (item.uiid || '')
                      }`"
                      sub
                    />
                  </v-col>
                  <v-col cols="1" class="text-right" />
                </v-row>
              </v-card-title>
              <v-card-text>
                <v-row dense>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="Fecha de compra"
                      v-model="item.adquisition"
                      type="date"
                      variant="outlined"
                      density="compact"
                      counter
                      :rules="rules.textRequired"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="Proveedor"
                      v-model="item.provider"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="50"
                      counter
                      :rules="rules.textRequired"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="Marca"
                      v-model="item.brand"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="50"
                      counter
                      :rules="rules.textRequired"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="Modelo"
                      v-model="item.model"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="50"
                      counter
                      :rules="rules.textRequired"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="Transmisión"
                      v-model="item.transmission"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="50"
                      counter
                      :rules="rules.textRequired"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="Año"
                      v-model="item.year"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="50"
                      counter
                      :rules="rules.textRequired"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="Color"
                      v-model="item.color"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="50"
                      counter
                      :rules="rules.textRequired"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="VIN"
                      v-model="item.vin"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="50"
                      counter
                      :rules="rules.textRequired"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="Precio compra"
                      v-model="item.purchase"
                      type="number"
                      variant="outlined"
                      density="compact"
                      counter
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="Comisión"
                      v-model="item.commission"
                      type="number"
                      variant="outlined"
                      density="compact"
                      counter
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="IVA"
                      v-model="item.tax"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="50"
                      counter
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="Monto factura"
                      v-model="item.invoice"
                      type="number"
                      variant="outlined"
                      density="compact"
                      counter
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="Precio de venta"
                      v-model="item.sales"
                      type="number"
                      variant="outlined"
                      density="compact"
                      counter
                      :rules="rules.required"
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
                    <CardTitle text="INVERSIONISTAS" sub />
                  </v-col>
                  <v-col cols="1" class="text-right" />
                </v-row>
              </v-card-title>
              <v-card-text>
                <v-row
                  dense
                  v-for="(car_investor, i) of item.car_investors"
                  :key="i"
                >
                  <v-col cols="12" md="9">
                    <v-autocomplete
                      label="Inversionista"
                      v-model="car_investor.investor_id"
                      :items="investors"
                      :loading="investorsLoading"
                      item-value="id"
                      item-title="name"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="Porcentaje %"
                      v-model="car_investor.percentage"
                      type="number"
                      variant="outlined"
                      density="compact"
                      counter
                      :rules="rules.required"
                    />
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="12">
                    <v-btn
                      size="x-small"
                      color="warning"
                      @click="carInvestorAdd()"
                    >
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
                <v-row dense>
                  <v-col cols="11">
                    <CardTitle text="GASTOS" sub />
                  </v-col>
                  <v-col cols="1" class="text-right" />
                </v-row>
              </v-card-title>
              <v-card-text>
                <v-row dense v-for="(overhead, i) of item.overheads" :key="i">
                  <v-col cols="12" md="3">
                    <v-autocomplete
                      label="Tipo"
                      v-model="overhead.overhead_type_id"
                      :items="overheadTypes"
                      :loading="overheadTypesLoading"
                      item-value="id"
                      item-title="name"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="Observación"
                      v-model="overhead.observation"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="50"
                      counter
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="Fecha"
                      v-model="overhead.date"
                      type="date"
                      variant="outlined"
                      density="compact"
                      counter
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="Monto"
                      v-model="overhead.amount"
                      type="number"
                      variant="outlined"
                      density="compact"
                      counter
                      :rules="rules.required"
                    />
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="12">
                    <v-btn
                      size="x-small"
                      color="warning"
                      @click="overheadAdd()"
                    >
                      Agregar
                      <v-icon size="x-small" end>mdi-plus</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12">
            <div class="text-right">
              <v-btn
                icon
                variant="flat"
                size="x-small"
                :color="isStoreMode ? 'success' : 'warning'"
                @click.prevent="handleAction"
                :loading="isLoading"
              >
                <v-icon>mdi-check</v-icon>
                <v-tooltip activator="parent" location="left"
                  >Continuar</v-tooltip
                >
              </v-btn>
            </div>
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
import { getDecodeId, getEncodeId } from "@/utils/coders";
import { getRules } from "@/utils/validators";
import { getObj, getFormData } from "@/utils/helpers";

// Componentes
import BtnBack from "@/components/BtnBack.vue";
import CardTitle from "@/components/CardTitle.vue";

// Constantes fijas
const routeName = "car_migrations";

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
const investors = ref([]);
const investorsLoading = ref(true);
const overheadTypes = ref([]);
const overheadTypesLoading = ref(true);

// Obtener catálogos
const getCatalogs = async () => {
  let endpoint = null;
  let response = null;

  try {
    // endpoint = `${URL_API}/system/fiscal_regimes`;
    // response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    const response = {
      data: {
        msg: "Registros retornados correctamente",
        data: {
          items: [
            {
              id: 1,
              name: "LORENA MACIAS",
            },
            {
              id: 2,
              name: "CARLOS MACIAS",
            },
            {
              id: 3,
              name: "DANIEL MACIAS",
            },
          ],
        },
      },
    };
    investors.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    investorsLoading.value = false;
  }

  try {
    // endpoint = `${URL_API}/system/fiscal_regimes`;
    // response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    const response = {
      data: {
        msg: "Registros retornados correctamente",
        data: {
          items: [
            {
              id: 1,
              name: "HOJALATERIA",
            },
            {
              id: 2,
              name: "MECANICA",
            },
            {
              id: 3,
              name: "OTROS",
            },
          ],
        },
      },
    };
    overheadTypes.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    overheadTypesLoading.value = false;
  }
};

// Obtener datos
const getItem = async () => {
  if (isStoreMode.value) {
    item.value = {
      id: 1,
      active: true,
      adquisition: null,
      provider: null,
      brand: null,
      model: null,
      transmission: null,
      year: null,
      color: null,
      vin: null,
      purchase: null,
      commission: null,
      tax: null,
      invoice: null,
      sales: null,
      car_investors: [],
      overheads: [],
    };
    carInvestorAdd();
    overheadAdd();
    isLoading.value = false;
  } else {
    try {
      // const endpoint = `${URL_API}/system/${routeName}/${itemId.value}`;
      // const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
      const response = {
        data: {
          msg: "Registro retornado correctamente",
          data: {
            item: {
              id: 1,
              active: 1,
              created_at: "2025-07-31 17:31:16",
              updated_at: "2025-08-06 20:57:17",
              created_by_id: 1,
              updated_by_id: 1,
              created_by: {
                email: "samuel@svr.mx",
              },
              updated_by: {
                email: "samuel@svr.mx",
              },
              uiid: "E-0001",
              name: "DALCAR AUTOMOTRIZ",
              logo: null,
              logo_doc: null,
              logo_dlt: false,
              logo_b64: null,
              fiscal_name: "DALCAR AUTOMOTRIZ",
              fiscal_code: "XYZ112233AB1",
              fiscal_zip: "00000",
              fiscal_regime_id: 1,
              fiscal_regime: {
                name: "REGIMEN GENERAL DE LEY PERSONAS MORALES | 601",
              },
              fiscal_street: null,
              fiscal_exterior: null,
              fiscal_interior: null,
              fiscal_neighborhood: null,
              fiscal_town_id: null,
              fiscal_town: {
                name: "CELAYA",
                state_id: null,
                state: {
                  name: "GUANAJUATO",
                },
              },
              fiscal_fiel_cer: null,
              fiscal_fiel_cer_doc: null,
              fiscal_fiel_cer_dlt: false,
              fiscal_fiel_cer_b64: null,
              fiscal_fiel_key: null,
              fiscal_fiel_key_doc: null,
              fiscal_fiel_key_dlt: false,
              fiscal_fiel_key_b64: null,
              fiscal_fiel_pass: null,
              fiscal_csd_cer: null,
              fiscal_csd_cer_doc: null,
              fiscal_csd_cer_dlt: false,
              fiscal_csd_cer_b64: null,
              fiscal_csd_key: null,
              fiscal_csd_key_doc: null,
              fiscal_csd_key_dlt: false,
              fiscal_csd_key_b64: null,
              fiscal_csd_pass: null,
            },
          },
        },
      };
      item.value = getRsp(response).data.item;
    } catch (err) {
      alert?.show("red-darken-1", getErr(err));
    } finally {
      isLoading.value = false;
    }
  }
};

// Agregar o editar
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
  const payload = getObj(item.value, isStoreMode.value);

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
    //     id: getEncodeId(isStoreMode.value ? response.data.item.id : itemId.value),
    //   },
    // });

    alert?.show("success", "Registro agregado correctamente");

    router.push({
      name: `${routeName}`,
    });
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

const carInvestorAdd = async () => {
  item.value.car_investors.push({
    id: null,
    investor_id: null,
    percentage: null,
  });
};

const overheadAdd = async () => {
  item.value.overheads.push({
    id: null,
    overhead_type_id: null,
    observation: null,
    date: null,
    amount: null,
  });
};

// Inicialización
onMounted(() => {
  getCatalogs();
  getItem();
});
</script>
