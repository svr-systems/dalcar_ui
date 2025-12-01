<template>
  <v-card elevation="24" :disabled="isLoading" :loading="isLoading">
    <v-card-title>
      <v-row dense>
        <v-col cols="10">
          <BtnBack
            :route="{
              name: routeName,
              params: { purchase_order_id: $route.params.purchase_order_id },
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
                      :text="`INVERSIONISTA${
                        isStoreMode ? '' : ' | ' + (item.id || '')
                      }`"
                      sub
                    />
                  </v-col>
                  <v-col cols="1" class="text-right" />
                </v-row>
              </v-card-title>
              <v-card-text>
                <v-row dense>
                  <v-col cols="12" md="10">
                    <v-autocomplete
                      label="Nombre"
                      v-model="item.investor_id"
                      :items="investors"
                      :loading="investorsLoading"
                      item-value="id"
                      item-title="full_name"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                      autocomplete="off"
                    />
                  </v-col>

                  <v-col cols="12" md="2">
                    <v-text-field
                      label="Porcentaje %"
                      v-model="item.percentages"
                      type="number"
                      variant="outlined"
                      density="compact"
                      min="0"
                      :rules="rules.required"
                      autocomplete="off"
                    />
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
                <v-tooltip activator="parent" location="left">
                  Continuar
                </v-tooltip>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
// Importaciones externas
import { ref, inject, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";

// Importaciones internas
import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getHdrs, getErr, getRsp } from "@/utils/http";
import { getDecodeId, getEncodeId } from "@/utils/coders";
import { getRules } from "@/utils/validators";

// Componentes
import BtnBack from "@/components/BtnBack.vue";
import CardTitle from "@/components/CardTitle.vue";

// Estado y referencias
const alert = inject("alert");
const confirm = inject("confirm");
const store = useStore();
const router = useRouter();
const route = useRoute();

// Estado reactivo
const purchaseOrderId = ref(getDecodeId(route.params.purchase_order_id));
const itemId = ref(route.params.id ? getDecodeId(route.params.id) : null);
const isStoreMode = ref(!itemId.value);
const isLoading = ref(true);
const formRef = ref(null);
const item = ref(null);
const rules = getRules();
const investors = ref([]);
const investorsLoading = ref(true);

// Constantes fijas
const routeName = "purchase_orders/investors";

// Obtener inversionistas
const getInvestors = async () => {
  try {
    // const endpoint = `${URL_API}/investors?is_active=1&filter=0`;
    // const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    // investors.value = getRsp(response).data.items;
    investors.value = [
      {
        id: 1,
        full_name: "LORENA MACIAS",
      },
      {
        id: 2,
        full_name: "CARLOS MACIAS",
      },
      {
        id: 3,
        full_name: "DANIEL MACIAS",
      },
      {
        id: 4,
        full_name: "TEST PRUEBA EDIT",
      },
      {
        id: 5,
        full_name: "TEST PRUEBA DOS",
      },
    ];
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    investorsLoading.value = false;
  }
};

// Obtener datos
const getItem = async () => {
  if (isStoreMode.value) {
    item.value = {
      id: null,
      purchase_order_id: purchaseOrderId.value,
      investor_id: null,
      percentages: null,
      amount: null,
    };
    isLoading.value = false;
  } else {
    try {
      // const endpoint = `${URL_API}/purchase_orders/${purchaseOrderId.value}/purchase_order_investors/${itemId.value}`;
      // const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
      // item.value = getRsp(response).data.item;
      item.value = {
        id: 1,
        purchase_order_id: purchaseOrderId.value,
        investor_id: 1,
        percentages: "50.00",
        amount: "5000.00",
      };
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
  const payload = item.value;

  try {
    // const endpoint = `${URL_API}/purchase_orders/${purchaseOrderId.value}/purchase_order_investors${
    //   !isStoreMode.value ? `/${payload.id}` : ""
    // }`;
    // const response = getRsp(
    //   await axios.post(endpoint, payload, getHdrs(store.getAuth?.token))
    // );

    // alert?.show("success", response.msg);

    // router.push({
    //   name: routeName,
    //   params: {
    //     purchase_order_id: route.params.purchase_order_id,
    //   },
    // });
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

// Inicializar
onMounted(() => {
  getInvestors();
  getItem();
});
</script>