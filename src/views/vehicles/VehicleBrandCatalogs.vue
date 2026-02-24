<template>
  <v-card
    elevation="24"
    :disabled="vehicleBrandsIsLoading"
    :loading="vehicleBrandsIsLoading"
  >
    <v-card-title class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <BtnBack
          :route="{
            name: 'vehicles',
          }"
        />
        <CardTitle :text="route.meta.title" :icon="route.meta.icon" />
      </div>
    </v-card-title>

    <v-card-text>
      <v-row dense>
        <v-col cols="12" md="9" class="pb-0" />

        <v-col cols="12" md="3" class="pb-0">
          <v-text-field
            v-model="vehicleBrandsSearch"
            label="Buscar"
            type="text"
            variant="outlined"
            density="compact"
            append-inner-icon="mdi-magnify"
            :disabled="vehicleBrands.length === 0"
          />
        </v-col>

        <v-col cols="12">
          <v-data-table
            :items="vehicleBrands"
            :search="vehicleBrandsSearch"
            :headers="headers"
            :loading="vehicleBrandsIsLoading"
            :items-per-page="15"
            density="compact"
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
                  @click="getVehicleBrand(item.id)"
                >
                  <v-icon>mdi-eye</v-icon>
                  <v-tooltip activator="parent" location="left">Ver</v-tooltip>
                </v-btn>
              </div>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card-text>

    <v-dialog
      v-model="isDialogOpen"
      transition="dialog-bottom-transition"
      scrim="black"
      max-width="800"
    >
      <v-card :disabled="isDialogLoading" :loading="isDialogLoading">
        <v-card-title class="d-flex align-center justify-space-between">
          <div class="d-flex align-center" />

          <v-btn
            icon
            variant="outlined"
            size="x-small"
            density="comfortable"
            @click="isDialogOpen = false"
          >
            <v-icon>mdi-close</v-icon>
            <v-tooltip activator="parent" location="left">Cerrar</v-tooltip>
          </v-btn>
        </v-card-title>

        <v-card-text v-if="vehicleBrand">
          <v-row>
            <v-col cols="12">
              <span class="font-weight-light text-subtitle-1">
                {{ vehicleBrand?.name }}
              </span>

              <v-btn
                icon
                variant="text"
                size="x-small"
                @click="formOpenDialog('Marca', 'vehicle_brands', vehicleBrand)"
              >
                <v-icon>mdi-pencil</v-icon>
                <v-tooltip activator="parent" location="left"
                  >Detalle</v-tooltip
                >
              </v-btn>
            </v-col>

            <v-col cols="12">
              <v-tabs v-model="tab" density="compact" align-tabs="center">
                <v-tab v-for="t in catalogTabs" :key="t.value" :value="t.value">
                  {{ t.label }}
                </v-tab>
              </v-tabs>

              <v-tabs-window v-model="tab" class="pt-2">
                <v-tabs-window-item
                  v-for="t in catalogTabs"
                  :key="t.value"
                  :value="t.value"
                >
                  <v-row dense>
                    <v-col cols="12">
                      <v-text-field
                        v-model="t.search.value"
                        label="Buscar"
                        type="text"
                        variant="outlined"
                        density="compact"
                        append-inner-icon="mdi-magnify"
                        :disabled="(t.items?.length || 0) === 0"
                      />
                    </v-col>

                    <v-col cols="12">
                      <v-data-table
                        :items="t.items"
                        :search="t.search.value"
                        :headers="headers"
                        :loading="isDialogLoading"
                        :items-per-page="15"
                        density="compact"
                      >
                        <template #item.key="{ index }">
                          <b>{{ index + 1 }}</b>
                        </template>

                        <template #item.action="{ item }">
                          <div class="text-right">
                            <v-btn
                              icon
                              variant="text"
                              size="x-small"
                              @click="formOpenDialog('Marca', t.catalog, item)"
                            >
                              <v-icon>mdi-pencil</v-icon>
                              <v-tooltip activator="parent" location="left">
                                Editar
                              </v-tooltip>
                            </v-btn>
                          </div>
                        </template>
                      </v-data-table>
                    </v-col>
                  </v-row>
                </v-tabs-window-item>
              </v-tabs-window>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="formIsDialogOpen"
      transition="dialog-bottom-transition"
      scrim="black"
      max-width="500"
    >
      <v-card :disabled="formIsLoading" :loading="formIsLoading">
        <v-card-title class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <CardTitle :text="formItem?.title" sub />
          </div>

          <v-btn
            icon
            variant="outlined"
            size="x-small"
            density="comfortable"
            @click="formIsDialogOpen = false"
          >
            <v-icon>mdi-close</v-icon>
            <v-tooltip activator="parent" location="left">Cerrar</v-tooltip>
          </v-btn>
        </v-card-title>

        <v-card-text v-if="formItem">
          <v-form ref="formRef" @submit.prevent>
            <v-row dense>
              <v-col cols="12">
                <v-text-field
                  v-model="formItem.name"
                  label="Nombre"
                  type="text"
                  variant="outlined"
                  density="compact"
                  maxlength="60"
                  counter
                  :rules="rules.textRequired"
                  autocomplete="off"
                />
              </v-col>
            </v-row>

            <v-row dense>
              <v-col
                cols="12"
                class="d-flex align-center justify-space-between"
              >
                <div class="d-flex align-center">
                  <v-btn
                    v-if="formItem.id"
                    size="small"
                    color="error"
                    variant="outlined"
                    @click="formDelete"
                  >
                    Eliminar
                    <v-icon end>mdi-minus</v-icon>
                  </v-btn>
                </div>

                <v-btn
                  size="small"
                  color="warning"
                  :loading="formIsLoading"
                  :disabled="formIsLoading"
                  @click="formSubmit"
                >
                  Editar
                  <v-icon end>mdi-check</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref, inject, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getHdrs, getErr, getRsp } from "@/utils/http";
import { getRules } from "@/utils/validators";
import { getObj } from "@/utils/helpers";

import CardTitle from "@/components/CardTitle.vue";
import BtnBack from "@/components/BtnBack.vue";

const alert = inject("alert");
const confirm = inject("confirm");
const rules = getRules();
const store = useStore();
const route = useRoute();

const headers = [
  { title: "#", key: "key", filterable: false, sortable: false, width: 60 },
  { title: "Nombre", key: "name" },
  { title: "", key: "action", filterable: false, sortable: false, width: 60 },
];

const vehicleBrandsIsLoading = ref(false);
const vehicleBrands = ref([]);
const vehicleBrandsSearch = ref("");

const vehicleBrand = ref(null);
const isDialogOpen = ref(false);
const isDialogLoading = ref(false);

const tab = ref(1);

const formItem = ref(null);
const formIsDialogOpen = ref(false);
const formIsLoading = ref(false);
const formRef = ref(null);

const catalogTabs = [
  {
    value: 1,
    label: "Modelos",
    catalog: "vehicle_models",
    search: ref(""),
    get items() {
      return vehicleBrand.value?.vehicle_models || [];
    },
  },
  {
    value: 2,
    label: "Colores",
    catalog: "vehicle_colors",
    search: ref(""),
    get items() {
      return vehicleBrand.value?.vehicle_colors || [];
    },
  },
  {
    value: 3,
    label: "Transmisiones",
    catalog: "vehicle_transmissions",
    search: ref(""),
    get items() {
      return vehicleBrand.value?.vehicle_transmissions || [];
    },
  },
];

const getVehicleBrands = async () => {
  vehicleBrandsIsLoading.value = true;
  vehicleBrands.value = [];

  try {
    const endpoint = `${URL_API}/vehicle_brands?is_active=1`;
    const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    vehicleBrands.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    vehicleBrandsIsLoading.value = false;
  }
};

const getVehicleBrand = async (id) => {
  vehicleBrand.value = null;
  isDialogOpen.value = true;
  isDialogLoading.value = true;

  try {
    const endpoint = `${URL_API}/vehicle_brands/${id}/catalogs`;
    const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    vehicleBrand.value = getRsp(response).data.item;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isDialogLoading.value = false;
  }
};

const formOpenDialog = (title, catalog, item) => {
  formItem.value = item;
  formItem.value.title = title;
  formItem.value.catalog = catalog;

  formIsDialogOpen.value = true;
  formIsLoading.value = false;
};

const formSubmit = async () => {
  const { valid } = await formRef.value?.validate();
  if (!valid) return;

  const confirmed = await confirm?.show(`¿Confirma editar registro?`);
  if (!confirmed) return;

  formIsLoading.value = true;

  try {
    const payload = getObj(formItem.value, false);
    const endpoint = `${URL_API}/${formItem.value.catalog}/${formItem.value.id}`;

    const response = getRsp(
      await axios.post(endpoint, payload, getHdrs(store.getAuth?.token)),
    );

    alert?.show("success", response.msg);

    formIsDialogOpen.value = false;

    if (formItem.value.catalog === "vehicle_brands") {
      await getVehicleBrands();
      return;
    }

    await getVehicleBrand(formItem.value.vehicle_brand_id);
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    formIsLoading.value = false;
  }
};

const formDelete = async () => {
  const confirmed = await confirm?.show(`¿Confirma inactivar el registro?`);
  if (!confirmed) return;

  formIsLoading.value = true;

  try {
    const endpoint = `${URL_API}/${formItem.value.catalog}/${formItem.value.id}`;

    const response = getRsp(
      await axios.delete(endpoint, getHdrs(store.getAuth?.token)),
    );

    alert?.show("orange-darken-1", response.msg);

    isDialogOpen.value = false;
    formIsDialogOpen.value = false;

    if (formItem.value.catalog === "vehicle_brands") {
      await getVehicleBrands();
      return;
    }

    await getVehicleBrand(formItem.value.vehicle_brand_id);
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    formIsLoading.value = false;
  }
};

onMounted(() => {
  getVehicleBrands();
});
</script>
