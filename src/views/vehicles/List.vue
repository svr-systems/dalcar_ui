<template>
  <v-card elevation="24" :disabled="isLoading">
    <v-card-title>
      <v-row dense>
        <v-col cols="10">
          <BtnBack
            :route="{
              name: 'purchase_orders/show',
              params: {
                id: getEncodeId($route.params.purchase_order_id),
              },
            }"
          />
          <CardTitle :text="route.meta.title" :icon="route.meta.icon" />
        </v-col>
        <v-col cols="2" class="text-right">
          <v-btn
            icon
            variant="flat"
            size="x-small"
            color="success"
            :to="{ name: `${routeName}/store`, params: { purchase_order_id: $route.params.purchase_order_id } }"
          >
            <v-icon>mdi-plus</v-icon>
            <v-tooltip activator="parent" location="bottom">Agregar</v-tooltip>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-title>

    <v-card-text>
      <v-row dense>
        <v-col cols="12" md="9" class="pb-0">
          <v-row dense>
            <v-col
              v-if="store.getAuth?.user?.role_id === 1"
              cols="12"
              md="3"
              class="pb-0"
            >
              <v-select
                v-model="isActive"
                label="Mostrar"
                variant="outlined"
                density="compact"
                :items="isActiveOptions"
                item-title="name"
                item-value="id"
                :disabled="!isItemsEmpty"
              />
            </v-col>
            <v-col cols="12" md="3" class="pb-0">
              <v-select
                v-model="filter"
                label="Filtro"
                variant="outlined"
                density="compact"
                :items="filterOptions"
                item-title="name"
                item-value="id"
                :disabled="!isItemsEmpty"
              />
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" md="3" class="pb-0">
          <v-text-field
            v-model="search"
            label="Buscar"
            type="text"
            variant="outlined"
            density="compact"
            append-inner-icon="mdi-magnify"
            :disabled="isItemsEmpty"
          />
        </v-col>

        <v-col cols="12">
          <v-btn
            block
            size="small"
            :color="isItemsEmpty ? 'info' : 'grey-darken-1'"
            :loading="isItemsEmpty && isLoading"
            @click.prevent="isItemsEmpty ? getItems() : (items = [])"
          >
            {{ isItemsEmpty ? "Aplicar" : "Cambiar" }} filtros
            <v-icon right>mdi-filter</v-icon>
          </v-btn>
        </v-col>

        <v-col cols="12">
          <v-data-table
            density="compact"
            :items="items"
            :headers="headers"
            :search="search"
            :items-per-page="15"
            :loading="isLoading"
          >
            <template #item.key="{ item }">
              <b>{{ item.key + 1 }}</b>
            </template>

            <template #item.action="{ item }">
              <div class="text-right">
                <v-btn
                  icon
                  variant="text"
                  size="x-small"
                  :color="item.is_active ? '' : 'red-darken-3'"
                  :to="{
                    name: `${routeName}/show`,
                    params: { purchase_order_id: $route.params.purchase_order_id, id: item.id },
                  }"
                >
                  <v-icon>mdi-eye</v-icon>
                  <v-tooltip activator="parent" location="left">
                    Detalle
                  </v-tooltip>
                </v-btn>
              </div>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
// Importaciones externas
import { ref, computed, inject, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

// Importaciones internas
import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getHdrs, getErr, getRsp } from "@/utils/http";
import { getEncodeId } from "@/utils/coders";
import CardTitle from "@/components/CardTitle.vue";
import BtnBack from "@/components/BtnBack.vue";
import { getAmountFormat } from "@/utils/formatters";

// Constantes
const routeName = "purchase_orders/vehicles";
const alert = inject("alert");
const store = useStore();
const route = useRoute();

// Estado
const isLoading = ref(false);
const items = ref([]);
const search = ref("");
const isActive = ref(1);
const filter = ref(0);

const isItemsEmpty = computed(() => items.value.length === 0);

// Opciones y headers
const isActiveOptions = [
  { id: 1, name: "ACTIVOS" },
  { id: 0, name: "INACTIVOS" },
];
const filterOptions = [{ id: 0, name: "TODOS" }];

const headers = [
  { title: "#", key: "key", filterable: false, sortable: false, width: 60 },
  { title: "Marca", key: "vehicle_version.vehicle_model.vehicle_brand.name" },
  { title: "Modelo", key: "vehicle_version.vehicle_model.name" },
  { title: "Año", key: "vehicle_version.model_year" },
  { title: "Versión", key: "vehicle_version.name" },
  { title: "Color", key: "vehicle_color.name" },
  { title: "VIN", key: "vin" },
  { title: "UUID", key: "uiid" },
  { title: "", key: "action", filterable: false, sortable: false, width: 60 },
];

// Cargar registros
const getItems = async () => {
  isLoading.value = true;
  items.value = [];

  try {
    // const endpoint = `${URL_API}/${routeName}?is_active=${isActive.value}&filter=${filter.value}`;
    // const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    // items.value = getRsp(response).data.items;
    items.value = [
      {
        "id": 24,
        "is_active": 1,
        "purchase_date": "2025-10-08",
        "vin": "213123123",
        "key": 0,
        "uiid": "AH-0024",
        "vehicle_version": {
          "name": "V1.0",
          "model_year": 2025,
          "vehicle_model": {
            "name": "ILX",
            "vehicle_brand": {
              "name": "ACURA"
            }
          }
        },
        "vehicle_color": {
          "name": "COLOR TEST"
        }
      },
      {
        "id": 20,
        "is_active": 1,
        "purchase_date": "2025-10-06",
        "vin": "32434234234",
        "key": 1,
        "uiid": "AH-0020",
        "vehicle_version": {
          "name": "XYZ",
          "model_year": 2022,
          "vehicle_model": {
            "name": "X1",
            "vehicle_brand": {
              "name": "BMW"
            }
          }
        },
        "vehicle_color": {
          "name": "TEST COLOR 10"
        }
      },
      {
        "id": 14,
        "is_active": 1,
        "purchase_date": "2025-10-01",
        "vin": "454675689708",
        "key": 2,
        "uiid": "AH-0014",
        "vehicle_version": {
          "name": "XYZ",
          "model_year": 2022,
          "vehicle_model": {
            "name": "X1",
            "vehicle_brand": {
              "name": "BMW"
            }
          }
        },
        "vehicle_color": {
          "name": "TEST COLOR 10"
        }
      },
      {
        "id": 15,
        "is_active": 1,
        "purchase_date": "2025-10-01",
        "vin": "9176429293",
        "key": 3,
        "uiid": "AH-0015",
        "vehicle_version": {
          "name": "V1.0",
          "model_year": 2025,
          "vehicle_model": {
            "name": "ILX",
            "vehicle_brand": {
              "name": "ACURA"
            }
          }
        },
        "vehicle_color": {
          "name": "COLOR TEST"
        }
      },
      {
        "id": 16,
        "is_active": 1,
        "purchase_date": "2025-10-01",
        "vin": "45355634563456346",
        "key": 4,
        "uiid": "AH-0016",
        "vehicle_version": {
          "name": "STD",
          "model_year": 2025,
          "vehicle_model": {
            "name": "A3",
            "vehicle_brand": {
              "name": "TESTE_EDITED"
            }
          }
        },
        "vehicle_color": {
          "name": "GRIS"
        }
      },
      {
        "id": 7,
        "is_active": 1,
        "purchase_date": "2025-09-09",
        "vin": "1234567890",
        "key": 5,
        "uiid": "AH-0007",
        "vehicle_version": {
          "name": "V1.0",
          "model_year": 2025,
          "vehicle_model": {
            "name": "ILX",
            "vehicle_brand": {
              "name": "ACURA"
            }
          }
        },
        "vehicle_color": {
          "name": "COLOR TEST"
        }
      },
      {
        "id": 13,
        "is_active": 1,
        "purchase_date": "2025-09-08",
        "vin": "12345678975",
        "key": 6,
        "uiid": "AH-0013",
        "vehicle_version": {
          "name": "STD",
          "model_year": 2025,
          "vehicle_model": {
            "name": "A3",
            "vehicle_brand": {
              "name": "TESTE_EDITED"
            }
          }
        },
        "vehicle_color": {
          "name": "GRIS"
        }
      },
      {
        "id": 23,
        "is_active": 1,
        "purchase_date": "2025-06-25",
        "vin": "VSSBE75F7LR070609",
        "key": 7,
        "uiid": "AH-0023",
        "vehicle_version": {
          "name": "2.0 CUPRA DCT, HATCHBACK, 2.0L, TURBO, 290 HP",
          "model_year": 2020,
          "vehicle_model": {
            "name": "LEON",
            "vehicle_brand": {
              "name": "SEAT"
            }
          }
        },
        "vehicle_color": {
          "name": "AZUL MISTERIO"
        }
      },
      {
        "id": 21,
        "is_active": 1,
        "purchase_date": "2025-06-23",
        "vin": "MEX5P2609NT032320",
        "key": 8,
        "uiid": "AH-0021",
        "vehicle_version": {
          "name": "COMFORTLINE PLUS PAQUETE JOIN",
          "model_year": 2022,
          "vehicle_model": {
            "name": "VENTO",
            "vehicle_brand": {
              "name": "VOLKSWAGEN"
            }
          }
        },
        "vehicle_color": {
          "name": "CARBON STEEL GREY METALIZADO"
        }
      },
      {
        "id": 19,
        "is_active": 1,
        "purchase_date": "2025-05-01",
        "vin": "123456789P",
        "key": 9,
        "uiid": "AH-0019",
        "vehicle_version": {
          "name": "TURBO",
          "model_year": 2017,
          "vehicle_model": {
            "name": "500",
            "vehicle_brand": {
              "name": "FIAT"
            }
          }
        },
        "vehicle_color": {
          "name": "CEREZA"
        }
      },
      {
        "id": 22,
        "is_active": 1,
        "purchase_date": "2025-03-24",
        "vin": "VSSCB6KJ5MR189843",
        "key": 10,
        "uiid": "AH-0022",
        "vehicle_version": {
          "name": "XCELLENCE 1.6 PANT. SYSTEM",
          "model_year": 2021,
          "vehicle_model": {
            "name": "IBIZA",
            "vehicle_brand": {
              "name": "SEAT"
            }
          }
        },
        "vehicle_color": {
          "name": "BLANCO NEVADA"
        }
      },
      {
        "id": 12,
        "is_active": 1,
        "purchase_date": "2025-01-01",
        "vin": "WWWWW",
        "key": 11,
        "uiid": "AH-0012",
        "vehicle_version": {
          "name": "V1.0",
          "model_year": 2025,
          "vehicle_model": {
            "name": "ILX",
            "vehicle_brand": {
              "name": "ACURA"
            }
          }
        },
        "vehicle_color": {
          "name": "COLOR TEST"
        }
      },
      {
        "id": 17,
        "is_active": 1,
        "purchase_date": "2024-06-13",
        "vin": "3GB3C9CG6JG351238",
        "key": 12,
        "uiid": "AH-0017",
        "vehicle_version": {
          "name": "CHASIS CABINA",
          "model_year": 2018,
          "vehicle_model": {
            "name": "SILVERADO 3500",
            "vehicle_brand": {
              "name": "CHEVROLET"
            }
          }
        },
        "vehicle_color": {
          "name": "BLANCO"
        }
      },
      {
        "id": 4,
        "is_active": 1,
        "purchase_date": "0205-09-24",
        "vin": "1",
        "key": 13,
        "uiid": "AH-0004",
        "vehicle_version": {
          "name": "V1.0",
          "model_year": 2025,
          "vehicle_model": {
            "name": "ILX",
            "vehicle_brand": {
              "name": "ACURA"
            }
          }
        },
        "vehicle_color": {
          "name": "COLOR TEST"
        }
      }
    ];
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

// Cargar datos al montar
onMounted(() => {
  getItems();
});
</script>
