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
                  <v-tooltip activator="parent" location="left">
                    Reactivar
                  </v-tooltip>
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
                  <CardTitle :text="'AUTO | ' + item.uiid" sub />
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
                    <v-tooltip activator="parent" location="left">
                      Registro
                    </v-tooltip>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-title>

            <v-card-text>
              <v-row dense>
                <v-col cols="12" md="3">
                  <VisVal label="Fecha de compra" :value="item.adquisition" />
                </v-col>
                <v-col cols="12" md="3">
                  <VisVal label="Proveedor" :value="item.provider" />
                </v-col>
                <v-col cols="12" md="3">
                  <VisVal label="Marca" :value="item.brand" />
                </v-col>
                <v-col cols="12" md="3">
                  <VisVal label="Modelo" :value="item.model" />
                </v-col>
                <v-col cols="12" md="3">
                  <VisVal label="Transmisión" :value="item.transmission" />
                </v-col>
                <v-col cols="12" md="3">
                  <VisVal label="Año" :value="item.year" />
                </v-col>
                <v-col cols="12" md="3">
                  <VisVal label="Color" :value="item.color" />
                </v-col>
                <v-col cols="12" md="3">
                  <VisVal label="VIN" :value="item.vin" />
                </v-col>
                <v-col cols="12" md="3">
                  <VisVal label="Precio compra" :value="item.purchase" />
                </v-col>
                <v-col cols="12" md="3">
                  <VisVal label="Comisión" :value="item.commission" />
                </v-col>
                <v-col cols="12" md="3">
                  <VisVal label="IVA" :value="item.tax" />
                </v-col>
                <v-col cols="12" md="3">
                  <VisVal label="Monto factura" :value="item.invoice" />
                </v-col>
                <v-col cols="12" md="3">
                  <VisVal label="Precio de venta" :value="item.sales" />
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
                  <VisVal
                    label="Inversionista"
                    :value="car_investor.investor.name"
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <VisVal
                    label="Porcentaje %"
                    :value="car_investor.percentage"
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
                  <CardTitle text="GASTOS" sub />
                </v-col>
                <v-col cols="1" class="text-right" />
              </v-row>
            </v-card-title>
            <v-card-text>
              <v-row dense v-for="(overhead, i) of item.overheads" :key="i">
                <v-col cols="12" md="3">
                  <VisVal label="Tipo" :value="overhead.overhead_type.name" />
                </v-col>
                <v-col cols="12" md="3">
                  <VisVal label="Observación" :value="overhead.observation" />
                </v-col>
                <v-col cols="12" md="3">
                  <VisVal label="Fecha" :value="overhead.date" />
                </v-col>
                <v-col cols="12" md="3">
                  <VisVal label="Monto" :value="overhead.amount" />
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

// Constantes fijas
const routeName = "legacy_vehicles";

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
            uiid: "AM-0001",
            name: "PROVEEDOR PRUEBA",
            type_id: 1,
            type: {
              name: "TIPO 1",
            },
            days: "3",
            provider_banks: [
              {
                bank_id: 1,
                bank: {
                  name: "BBVA",
                },
                clabe: "123456789012345678",
                account: "093456789012345678",
              },
            ],

            adquisition: "2025-01-10",
            provider: "PROVEEDOR TEST",
            brand: "VW",
            model: "VENTO",
            transmission: "MANUAL",
            year: "2017",
            color: "BLANCO",
            vin: "XXYYZZWW12345",
            purchase: "$140,000.00",
            commission: "$2,000.00",
            tax: "IVA",
            invoice: "$180,000.00",
            sales: "$180,000.00",
            car_investors: [
              {
                investor: {
                  name: "LORENA MACIAS",
                },
                percentage: "50%",
              },
              {
                investor: {
                  name: "CARLOS MACIAS",
                },
                percentage: "50%",
              },
            ],
            overheads: [
              {
                overhead_type: {
                  name: "HOJALATERIA",
                },
                observation: "PUERTA DERECHA",
                date: "2025-01-15",
                amount: "$1,000.00",
              },
            ],
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
};

// Inactivar
const deleteItem = async () => {
  const confirmed = await confirm?.show("¿Confirma inactivar el registro?");
  if (!confirmed) return;

  isLoading.value = true;
  // try {
  //   const endpoint = `${URL_API}/system/${routeName}/${itemId.value}`;
  //   const response = getRsp(
  //     await axios.delete(endpoint, getHdrs(store.getAuth?.token))
  //   );
  //   alert?.show("red-darken-1", response.msg);
  // } catch (err) {
  //   alert?.show("red-darken-1", getErr(err));
  // } finally {
  //   isLoading.value = false;
  // }
  alert?.show("red-darken-1", "Registro desactivado correctamente");
  router.push({ name: routeName });
  isLoading.value = false;
};

// Reactivar
const restoreItem = async () => {
  const confirmed = await confirm?.show("¿Confirma activar el registro?");
  if (!confirmed) return;

  isLoading.value = true;
  // try {
  //   const endpoint = `${URL_API}/system/${routeName}/restore`;
  //   const response = getRsp(
  //     await axios.post(
  //       endpoint,
  //       { id: itemId.value },
  //       getHdrs(store.getAuth?.token)
  //     )
  //   );
  //   item.value = response.data.item;
  //   alert?.show("success", response.msg);
  // } catch (err) {
  //   alert?.show("red-darken-1", getErr(err));
  // } finally {
  //   isLoading.value = false;
  // }
  alert?.show("red-darken-1", "Registro activado correctamente");
  isLoading.value = false;
};

// Inicializar
onMounted(() => {
  getItem();
});
</script>
