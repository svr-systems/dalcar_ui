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
            v-if="item.active"
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
        <v-col v-if="!item.active" cols="12">
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
                  <v-tooltip activator="parent" location="left"
                    >Reactivar</v-tooltip
                  >
                </v-btn>
              </v-col>
            </v-row>
          </v-alert>
        </v-col>

        <PurchaseOrdersGeneral :item="item" @show-reg-dialog="regDialog = true" />

        <Autos :item="item" />

        <Payments :item="item" />

        <v-col
          v-if="item.active && store.getAuth?.user?.role_id === 1"
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

// Componentes
import BtnBack from "@/components/BtnBack.vue";
import CardTitle from "@/components/CardTitle.vue";
import DlgReg from "@/components/DlgReg.vue";
import VisVal from "@/components/VisVal.vue";
import VisDoc from "@/components/VisDoc.vue";
import PurchaseOrdersGeneral from "@/components/PurchaseOrdersGeneral.vue";
import Autos from "@/components/Autos.vue";
import Payments from "@/components/Payments.vue";

// Constantes fijas
const routeName = "purchaseOrders";

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

// Obtener registro
const getItem = async () => {
  isLoading.value = true;
  try {
    // const endpoint = `${URL_API}/system/${routeName}/${itemId.value}`
    // const response = await axios.get(endpoint, getHdrs(store.getAuth?.token))
    // item.value = getRsp(response).data.item
    item.value = {
      id: 1,
      active: true,
      uiid: "OC-0001",
      date: "2024-08-20",
      provider: {
        name: "PROVEEDOR A",
      },
      amount: 50000,
      reference: "REF-002",
      account_state: "estado_cuenta.pdf",
      account_state_b64: "data:application/pdf;base64,JVBERi0xLjcK...",
      autos: [
        {
          brand: "FORD",
          model: "FOCUS",
          transmission: "MANUAL",
          year: "2022",
          color: "AZUL",
          vin: "VIN123456789",
          purchase_price: 25000,
          commission: 1000,
          iva: 1.16,
          invoice_amount: 26160,
        },
      ],
      payments: [
        {
          bank: {
            name: "BBVA",
          },
          holder: "TITULAR EJEMPLO",
          clabe: "123456789012345678",
          account: "1234567890",
          amount: 25000,
        },
      ],
      due_date: "01-09-2024",
    };
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
    // const endpoint = `${URL_API}/${routeName}/${itemId.value}`;
    // const response = getRsp(
    //   await axios.delete(endpoint, getHdrs(store.getAuth?.token))
    // );
    // alert?.show("red-darken-1", response.msg);
    router.push({ name: routeName });
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

// Reactivar
const restoreItem = async () => {
  const confirmed = await confirm?.show("¿Confirma activar el registro?");
  if (!confirmed) return;

  isLoading.value = true;
  try {
    // const endpoint = `${URL_API}/system/${routeName}/restore`;
    // const response = getRsp(
    //   await axios.post(
    //     endpoint,
    //     { id: itemId.value },
    //     getHdrs(store.getAuth?.token)
    //   )
    // );
    // item.value = response.data.item;
    // alert?.show("success", response.msg);
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

// Inicializar
onMounted(() => {
  getItem();
});
</script>
