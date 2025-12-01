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
                      name: 'purchase_orders/vehicles',
                      params: { purchase_order_id: $route.params.id },
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

        <v-col cols="12">
          <v-card :loading="isLoading">
            <v-card-title>
              <v-row dense>
                <v-col cols="11">
                  <CardTitle
                    :text="`INVERSIONISTAS | ${getPercentFormat(
                      totalPercentages
                    )}`"
                    sub
                  />
                </v-col>
                <v-col cols="1" class="text-right">
                  <v-btn
                    v-if="item.is_active"
                    icon
                    variant="flat"
                    size="x-small"
                    color="warning"
                    :to="{
                      name: 'purchase_orders/investors',
                      params: { purchase_order_id: $route.params.id },
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
                    <th width="40">#</th>
                    <th>Nombre</th>
                    <th width="40">%</th>
                    <th width="40" />
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(purchaseOrderInvestor, i) in purchaseOrderInvestors"
                    :key="i"
                  >
                    <td>{{ i + 1 }}</td>
                    <td>
                      {{ purchaseOrderInvestor.investor.user.full_name }}
                    </td>
                    <td>{{ purchaseOrderInvestor.percentages }}</td>
                    <td class="text-right">
                      <v-btn
                        v-if="item.is_active"
                        icon
                        variant="text"
                        size="x-small"
                        color="error"
                        @click.prevent="
                          purchaseOrderInvestorRemove(purchaseOrderInvestor.id)
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
          v-model="purchaseOrderInvestorDlg"
          persistent
          scrim="black"
          max-width="1200"
        >
          <v-card
            :loading="purchaseOrderInvestorLdg"
            :disabled="purchaseOrderInvestorLdg"
            flat
          >
            <v-card-title>
              <v-row dense>
                <v-col cols="11">
                  <CardTitle text="INVERSIONISTA" subvalue />
                </v-col>
                <v-col cols="1" class="text-right">
                  <v-btn
                    icon
                    variant="text"
                    size="x-small"
                    @click="purchaseOrderInvestorDlg = false"
                  >
                    <v-icon>mdi-close</v-icon>
                    <v-tooltip activator="parent" location="left"
                      >Cerrar</v-tooltip
                    >
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-title>

            <v-card-text v-if="purchaseOrderInvestor">
              <v-form ref="purchaseOrderInvestorForm" @submit.prevent>
                <v-row dense>
                  <v-col cols="12" md="10">
                    <v-autocomplete
                      label="Nombre"
                      v-model="purchaseOrderInvestor.investor_id"
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
                      v-model="purchaseOrderInvestor.percentages"
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
                      @click.prevent="purchaseOrderInvestorAdd()"
                      :loading="purchaseOrderInvestorLdg"
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
import { ref, computed, inject, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";

import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getHdrs, getErr, getRsp } from "@/utils/http";
import { getDecodeId, getEncodeId } from "@/utils/coders";
import { getAmountFormat, getPercentFormat } from "@/utils/formatters";
import { getRules } from "@/utils/validators";

import BtnBack from "@/components/BtnBack.vue";
import CardTitle from "@/components/CardTitle.vue";
import DlgReg from "@/components/DlgReg.vue";
import VisVal from "@/components/VisVal.vue";
import VisDoc2 from "@/components/VisDoc2.vue";

const routeName = "purchase_orders";
const alert = inject("alert");
const confirm = inject("confirm");
const store = useStore();
const router = useRouter();
const route = useRoute();

const itemId = ref(getDecodeId(route.params.id));
const isLoading = ref(true);
const item = ref(null);
const regDialog = ref(false);
const vehicles = ref([]);

const purchaseOrderInvestors = ref([]);
const investors = ref([]);
const investorsLoading = ref(true);
const rules = getRules();

const totalPercentages = computed(() => {
  return purchaseOrderInvestors.value.reduce((total, investor) => {
    return total + (parseFloat(investor.percentages) || 0);
  }, 0);
});

const getVehicles = async () => {
  isLoading.value = true;
  vehicles.value = [];

  try {
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

const getPurchaseOrderInvestors = async () => {
  // const endpoint = `${URL_API}/purchase_orders/purchase_order_investors`;
  // const response = await axios.get(endpoint, {
  //   params: {
  //     purchase_order_id: itemId.value,
  //     is_active: 1,
  //   },
  //   ...getHdrs(store.getAuth?.token),
  // });
  // purchaseOrderInvestors.value = getRsp(response).data.items;
  purchaseOrderInvestors.value = [
    {
      id: 20,
      investor_id: 1,
      percentages: "50.00",
      investor: {
        user_id: 2,
        user: {
          name: "LORENA",
          paternal_surname: "MACIAS",
          maternal_surname: null,
          full_name: "LORENA MACIAS",
        },
      },
    },
    {
      id: 21,
      investor_id: 2,
      percentages: "50.00",
      investor: {
        user_id: 3,
        user: {
          name: "CARLOS",
          paternal_surname: "MACIAS",
          maternal_surname: null,
          full_name: "CARLOS MACIAS",
        },
      },
    },
  ];
};

const getInvestors = async () => {
  // const endpoint = `${URL_API}/investors?is_active=1&filter=0`;
  // const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
  // investors.value = getRsp(response).data.items;
  try {
    investors.value = [
      {
        id: 1,
        full_name: "LORENA MACIAS",
        user_id: 2,
      },
      {
        id: 2,
        full_name: "CARLOS MACIAS",
        user_id: 3,
      },
    ];
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    investorsLoading.value = false;
  }
};

const purchaseOrderInvestor = ref(null);
const purchaseOrderInvestorLdg = ref(false);
const purchaseOrderInvestorDlg = ref(false);
const purchaseOrderInvestorForm = ref(null);

const purchaseOrderInvestorAddDlg = () => {
  purchaseOrderInvestor.value = {
    id: null,
    purchase_order_id: itemId.value,
    investor_id: null,
    percentages: null,
  };
  purchaseOrderInvestorLdg.value = false;
  purchaseOrderInvestorDlg.value = true;
};

const purchaseOrderInvestorAdd = async () => {
  const { valid } = await purchaseOrderInvestorForm.value.validate();
  if (!valid) return;

  const confirmed = await confirm?.show(`¿Confirma agregar?`);
  if (!confirmed) return;

  purchaseOrderInvestorLdg.value = true;

  try {
    purchaseOrderInvestorDlg.value = false;
    getPurchaseOrderInvestors();

    // const endpoint = `${URL_API}/${routeName}/purchase_order_investors`;
    // const response = getRsp(
    //   await axios.post(
    //     endpoint,
    //     purchaseOrderInvestor.value,
    //     getHdrs(store.getAuth?.token)
    //   )
    // );

    // alert?.show("success", response.msg);
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    purchaseOrderInvestorLdg.value = false;
  }
};

const purchaseOrderInvestorRemove = async (id) => {
  const confirmed = await confirm?.show("¿Confirma eliminar el registro?");
  if (!confirmed) return;

  try {
    const index = purchaseOrderInvestors.value.findIndex(
      (item) => item.id === id
    );
    if (index > -1) {
      purchaseOrderInvestors.value.splice(index, 1);
    }

    alert?.show("success", "Registro eliminado correctamente");
    getPurchaseOrderInvestors();

    // const endpoint = `${URL_API}/${routeName}/purchase_order_investors/${id}`;
    // const response = getRsp(
    //   await axios.delete(endpoint, getHdrs(store.getAuth?.token))
    // );
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
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
  getPurchaseOrderInvestors();
  getInvestors();
});
</script>
