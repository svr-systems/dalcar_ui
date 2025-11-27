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
            v-if="item.is_active"
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
        <v-col v-if="!item.is_active" cols="12">
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
                  <VisVal label="Fecha de compra" :value="item.order_date" />
                </v-col>

                <v-col cols="12" md="4">
                  <VisVal
                    label="Total a pagar"
                    :value="getAmountFormat(item.total_amount)"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <VisVal label="Proveedor" :value="item.vendor.name" />
                </v-col>

                <v-col cols="12" md="4">
                  <VisVal
                    label="Fecha limite de pago"
                    :value="item.due_date"
                    :class="
                      item.days_remaining < 1
                        ? 'text-red'
                        : item.days_remaining < 3
                        ? 'text-orange'
                        : ''
                    "
                  />
                </v-col>

                <v-col v-if="item.reference" cols="12" md="4">
                  <VisVal label="Referencia" :value="item.reference" />
                </v-col>

                <v-col v-if="item.statement_path" cols="12" md="4">
                  <VisDoc2
                    label="Estado de cuenta"
                    :value="item.statement_b64"
                  />
                </v-col>

                <v-col cols="12">
                  <VisVal label="Observaciones" :value="item.note" />
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
                  <CardTitle :text="'AUTOS'" sub />
                </v-col>
                <v-col cols="1" class="text-right">
                  <v-btn
                    v-if="item.is_active"
                    icon
                    variant="flat"
                    size="x-small"
                    color="warning"
                    :to="{
                      name: 'vehicles',
                    }"
                  >
                    <v-icon>mdi-pencil</v-icon>
                    <v-tooltip activator="parent" location="left"
                      >Editar</v-tooltip
                    >
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-title>

            <v-card-text>
              <v-table density="compact" striped="even">
                <thead>
                  <tr>
                    <th width="60">#</th>
                    <th>Fecha de compra</th>
                    <th>Marca</th>
                    <th>Modelo</th>
                    <th>Año</th>
                    <th>Versión</th>
                    <th>Color</th>
                    <th>VIN</th>
                    <th>UUID</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(vehicle, i) in vehicles" :key="i">
                    <td>{{ i + 1 }}</td>
                    <td>{{ vehicle.purchase_date }}</td>
                    <td>
                      {{
                        vehicle.vehicle_version.vehicle_model.vehicle_brand.name
                      }}
                    </td>
                    <td>{{ vehicle.vehicle_version.vehicle_model.name }}</td>
                    <td>{{ vehicle.vehicle_version.model_year }}</td>
                    <td>{{ vehicle.vehicle_version.name }}</td>
                    <td>{{ vehicle.vehicle_color.name }}</td>
                    <td>{{ vehicle.vin }}</td>
                    <td>{{ vehicle.uiid }}</td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col
          v-if="item.is_active && store.getAuth?.user?.role_id === 1"
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
// Importaciones externas
import { ref, computed, inject, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";

// Importaciones internas
import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getHdrs, getErr, getRsp } from "@/utils/http";
import { getDecodeId, getEncodeId } from "@/utils/coders";
import { getAmountFormat } from "@/utils/formatters";

import BtnBack from "@/components/BtnBack.vue";
import CardTitle from "@/components/CardTitle.vue";
import DlgReg from "@/components/DlgReg.vue";
import VisVal from "@/components/VisVal.vue";
import VisDoc2 from "@/components/VisDoc2.vue";

// Constantes
const routeName = "purchase_orders";
const alert = inject("alert");
const confirm = inject("confirm");
const store = useStore();
const router = useRouter();
const route = useRoute();

// Estado
const itemId = ref(getDecodeId(route.params.id));
const isLoading = ref(true);
const item = ref(null);
const regDialog = ref(false);
const vehicles = ref([]);

// Cargar vehículos
const getVehicles = async () => {
  isLoading.value = true;
  vehicles.value = [];

  try {
    // const endpoint = `${URL_API}/purchase_orders/${itemId.value}/vehicles?is_active=${isActive.value}&filter=${filter.value}`;
    // const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    // vehicles.value = getRsp(response).data.items;
    vehicles.value = [
      {
        id: 24,
        is_active: 1,
        purchase_date: "2025-10-08",
        vin: "213123123",
        key: 0,
        uiid: "AH-0024",
        vehicle_version: {
          name: "V1.0",
          model_year: 2025,
          vehicle_model: {
            name: "ILX",
            vehicle_brand: {
              name: "ACURA",
            },
          },
        },
        vehicle_color: {
          name: "COLOR TEST",
        },
      },
      {
        id: 20,
        is_active: 1,
        purchase_date: "2025-10-06",
        vin: "32434234234",
        key: 1,
        uiid: "AH-0020",
        vehicle_version: {
          name: "XYZ",
          model_year: 2022,
          vehicle_model: {
            name: "X1",
            vehicle_brand: {
              name: "BMW",
            },
          },
        },
        vehicle_color: {
          name: "TEST COLOR 10",
        },
      },
      {
        id: 14,
        is_active: 1,
        purchase_date: "2025-10-01",
        vin: "454675689708",
        key: 2,
        uiid: "AH-0014",
        vehicle_version: {
          name: "XYZ",
          model_year: 2022,
          vehicle_model: {
            name: "X1",
            vehicle_brand: {
              name: "BMW",
            },
          },
        },
        vehicle_color: {
          name: "TEST COLOR 10",
        },
      },
      {
        id: 15,
        is_active: 1,
        purchase_date: "2025-10-01",
        vin: "9176429293",
        key: 3,
        uiid: "AH-0015",
        vehicle_version: {
          name: "V1.0",
          model_year: 2025,
          vehicle_model: {
            name: "ILX",
            vehicle_brand: {
              name: "ACURA",
            },
          },
        },
        vehicle_color: {
          name: "COLOR TEST",
        },
      },
      {
        id: 16,
        is_active: 1,
        purchase_date: "2025-10-01",
        vin: "45355634563456346",
        key: 4,
        uiid: "AH-0016",
        vehicle_version: {
          name: "STD",
          model_year: 2025,
          vehicle_model: {
            name: "A3",
            vehicle_brand: {
              name: "TESTE_EDITED",
            },
          },
        },
        vehicle_color: {
          name: "GRIS",
        },
      },
      {
        id: 7,
        is_active: 1,
        purchase_date: "2025-09-09",
        vin: "1234567890",
        key: 5,
        uiid: "AH-0007",
        vehicle_version: {
          name: "V1.0",
          model_year: 2025,
          vehicle_model: {
            name: "ILX",
            vehicle_brand: {
              name: "ACURA",
            },
          },
        },
        vehicle_color: {
          name: "COLOR TEST",
        },
      },
      {
        id: 13,
        is_active: 1,
        purchase_date: "2025-09-08",
        vin: "12345678975",
        key: 6,
        uiid: "AH-0013",
        vehicle_version: {
          name: "STD",
          model_year: 2025,
          vehicle_model: {
            name: "A3",
            vehicle_brand: {
              name: "TESTE_EDITED",
            },
          },
        },
        vehicle_color: {
          name: "GRIS",
        },
      },
      {
        id: 23,
        is_active: 1,
        purchase_date: "2025-06-25",
        vin: "VSSBE75F7LR070609",
        key: 7,
        uiid: "AH-0023",
        vehicle_version: {
          name: "2.0 CUPRA DCT, HATCHBACK, 2.0L, TURBO, 290 HP",
          model_year: 2020,
          vehicle_model: {
            name: "LEON",
            vehicle_brand: {
              name: "SEAT",
            },
          },
        },
        vehicle_color: {
          name: "AZUL MISTERIO",
        },
      },
      {
        id: 21,
        is_active: 1,
        purchase_date: "2025-06-23",
        vin: "MEX5P2609NT032320",
        key: 8,
        uiid: "AH-0021",
        vehicle_version: {
          name: "COMFORTLINE PLUS PAQUETE JOIN",
          model_year: 2022,
          vehicle_model: {
            name: "VENTO",
            vehicle_brand: {
              name: "VOLKSWAGEN",
            },
          },
        },
        vehicle_color: {
          name: "CARBON STEEL GREY METALIZADO",
        },
      },
      {
        id: 19,
        is_active: 1,
        purchase_date: "2025-05-01",
        vin: "123456789P",
        key: 9,
        uiid: "AH-0019",
        vehicle_version: {
          name: "TURBO",
          model_year: 2017,
          vehicle_model: {
            name: "500",
            vehicle_brand: {
              name: "FIAT",
            },
          },
        },
        vehicle_color: {
          name: "CEREZA",
        },
      },
      {
        id: 22,
        is_active: 1,
        purchase_date: "2025-03-24",
        vin: "VSSCB6KJ5MR189843",
        key: 10,
        uiid: "AH-0022",
        vehicle_version: {
          name: "XCELLENCE 1.6 PANT. SYSTEM",
          model_year: 2021,
          vehicle_model: {
            name: "IBIZA",
            vehicle_brand: {
              name: "SEAT",
            },
          },
        },
        vehicle_color: {
          name: "BLANCO NEVADA",
        },
      },
      {
        id: 12,
        is_active: 1,
        purchase_date: "2025-01-01",
        vin: "WWWWW",
        key: 11,
        uiid: "AH-0012",
        vehicle_version: {
          name: "V1.0",
          model_year: 2025,
          vehicle_model: {
            name: "ILX",
            vehicle_brand: {
              name: "ACURA",
            },
          },
        },
        vehicle_color: {
          name: "COLOR TEST",
        },
      },
      {
        id: 17,
        is_active: 1,
        purchase_date: "2024-06-13",
        vin: "3GB3C9CG6JG351238",
        key: 12,
        uiid: "AH-0017",
        vehicle_version: {
          name: "CHASIS CABINA",
          model_year: 2018,
          vehicle_model: {
            name: "SILVERADO 3500",
            vehicle_brand: {
              name: "CHEVROLET",
            },
          },
        },
        vehicle_color: {
          name: "BLANCO",
        },
      },
      {
        id: 4,
        is_active: 1,
        purchase_date: "0205-09-24",
        vin: "1",
        key: 13,
        uiid: "AH-0004",
        vehicle_version: {
          name: "V1.0",
          model_year: 2025,
          vehicle_model: {
            name: "ILX",
            vehicle_brand: {
              name: "ACURA",
            },
          },
        },
        vehicle_color: {
          name: "COLOR TEST",
        },
      },
    ];
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

const getItem = async () => {
  isLoading.value = true;
  try {
    const endpoint = `${URL_API}/${routeName}/${itemId.value}`;
    const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    item.value = getRsp(response).data.item;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

const deleteItem = async () => {
  const confirmed = await confirm?.show("¿Confirma inactivar el registro?");
  if (!confirmed) return;

  isLoading.value = true;

  try {
    const endpoint = `${URL_API}/${routeName}/${itemId.value}`;
    const response = getRsp(
      await axios.delete(endpoint, getHdrs(store.getAuth?.token))
    );
    alert?.show("red-darken-1", response.msg);
    router.push({ name: routeName });
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

const restoreItem = async () => {
  const confirmed = await confirm?.show("¿Confirma activar el registro?");
  if (!confirmed) return;

  isLoading.value = true;
  try {
    const endpoint = `${URL_API}/${routeName}/restore`;
    const response = getRsp(
      await axios.post(
        endpoint,
        { id: itemId.value },
        getHdrs(store.getAuth?.token)
      )
    );
    item.value = response.data.item;
    alert?.show("success", response.msg);
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  getItem();
  getVehicles();
});
</script>
