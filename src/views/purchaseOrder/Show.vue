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

        <v-col cols="12">
          <v-card>
            <v-card-title>
              <v-row dense>
                <v-col cols="11">
                  <CardTitle :text="'DATOS GENERALES | ' + item.uiid" sub />
                </v-col>
                <v-col cols="1" class="text-right">
                  <v-btn
                    v-if="store.getAuth?.user?.role_id === 1"
                    icon
                    variant="flat"
                    size="x-small"
                    @click.prevent="regDialog = true"
                  >
                    <v-icon>mdi-clock-outline</v-icon>
                    <v-tooltip activator="parent" location="left"
                      >Registro</v-tooltip
                    >
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-text>
              <v-row dense>
                <v-col cols="12" md="4">
                  <VisVal label="Fecha" :value="item.date" />
                </v-col>
                <v-col cols="12" md="8">
                  <VisVal label="Proveedor" :value="item.provider.name" />
                </v-col>
                <v-col cols="12" md="4">
                  <VisVal label="Monto a Pagar" :value="item.amount" />
                </v-col>
                <v-col cols="12" md="4">
                  <VisVal label="Referencia" :value="item.reference" />
                </v-col>
                <v-col cols="12" md="4">
                  <VisDoc
                    v-if="item.account_state"
                    label="Estado de cuenta"
                    :value="item.account_state"
                    :url="item.account_state_b64"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12">
          <v-card>
            <v-card-title>
              <CardTitle text="AUTOS" sub />
            </v-card-title>
            <v-card-text>
              <v-row dense v-for="(auto, i) of item.autos" :key="i">
                <v-col cols="12" md="3">
                  <VisVal label="Marca" :value="auto.brand" />
                </v-col>
                <v-col cols="12" md="3">
                  <VisVal label="Modelo" :value="auto.model" />
                </v-col>
                <v-col cols="12" md="3">
                  <VisVal
                    label="Transmisión"
                    :value="auto.transmission || 'N/A'"
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <VisVal label="Año" :value="auto.year" />
                </v-col>
                <v-col cols="12" md="3">
                  <VisVal label="Color" :value="auto.color" />
                </v-col>
                <v-col cols="12" md="3">
                  <VisVal label="VIN" :value="auto.vin" />
                </v-col>
                <v-col cols="12" md="3">
                  <VisVal label="Precio Compra" :value="auto.purchase_price" />
                </v-col>
                <v-col cols="12" md="3">
                  <VisVal label="Comisión" :value="auto.commission || 'N/A'" />
                </v-col>
                <v-col cols="12" md="3">
                  <VisVal label="IVA" :value="auto.iva || 'N/A'" />
                </v-col>
                <v-col cols="12" md="3">
                  <VisVal label="Monto Factura" :value="auto.invoice_amount" />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12">
          <v-card>
            <v-card-title>
              <CardTitle text="PAGOS" sub />
            </v-card-title>
            <v-card-text>
              <v-table>
                <thead>
                  <tr>
                    <th class="text-left">Banco</th>
                    <th class="text-left">Titular</th>
                    <th class="text-left">Clabe</th>
                    <th class="text-left">Cuenta</th>
                    <th class="text-left">Monto</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(payment, i) in item.payments" :key="i">
                    <td>{{ payment.bank.name }}</td>
                    <td>{{ payment.holder }}</td>
                    <td>{{ payment.clabe }}</td>
                    <td>{{ payment.account }}</td>
                    <td>{{ payment.amount }}</td>
                  </tr>
                </tbody>
              </v-table>
              <v-row dense class="mt-4">
                <v-col cols="12" md="3">
                  <VisVal label="Fecha Límite de Pago" :value="item.due_date" />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

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
