<template>
  <v-card :disabled="isLoading" :loading="isLoading">
    <v-card-title class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <CardTitle
          :text="`INVERSIONISTAS${totalPercentages ? ` | ${totalPercentages}%` : ''}`"
          sub
        />
      </div>

      <div>
        <v-btn
          v-if="vehicle && vehicle.is_active && totalPercentages < 100"
          icon
          variant="outlined"
          size="x-small"
          density="comfortable"
          color="warning"
          @click="formOpenDialog()"
        >
          <v-icon>mdi-plus</v-icon>
          <v-tooltip activator="parent" location="left"> Agregar </v-tooltip>
        </v-btn>
      </div>
    </v-card-title>

    <v-card-text>
      <v-row dense>
        <v-col cols="12">
          <v-table density="compact" striped="even">
            <thead class="font-weight-light text-caption text-medium-emphasis">
              <tr>
                <th>Inversionista</th>
                <th>Porcentaje %</th>
                <th>Monto</th>
                <th />
              </tr>
            </thead>

            <tbody>
              <tr v-for="(item, i) in items" :key="i">
                <td>
                  {{ item.investor.user.full_name }}
                </td>
                <td>
                  {{ Number(item.percentages || 0).toFixed(2) }}
                </td>
                <td>
                  {{ getAmountFormat(item.amount) }}
                </td>
                <td class="text-right">
                  <v-btn
                    icon
                    variant="text"
                    size="x-small"
                    density="comfortable"
                    @click="formOpenDialog(item.id)"
                  >
                    <v-icon>mdi-file-eye</v-icon>
                    <v-tooltip activator="parent" location="left">
                      Ver | Editar
                    </v-tooltip>
                  </v-btn>
                </td>
              </tr>

              <tr v-if="items.length === 0">
                <td colspan="4" class="text-center text-medium-emphasis">
                  Sin inversionistas registrados
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <v-dialog
    v-model="formIsDialogOpen"
    transition="dialog-bottom-transition"
    scrim="black"
    max-width="700"
  >
    <v-card :disabled="formIsLoading" :loading="formIsLoading">
      <v-card-title class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <CardTitle :text="formIsStoreMode ? 'AGREGAR' : 'EDITAR'" sub />
        </div>

        <v-btn
          icon
          variant="outlined"
          size="x-small"
          density="comfortable"
          @click="formIsDialogOpen = false"
        >
          <v-icon>mdi-close</v-icon>
          <v-tooltip activator="parent" location="left"> Cerrar </v-tooltip>
        </v-btn>
      </v-card-title>

      <v-card-text v-if="formItem">
        <v-form ref="formRef" @submit.prevent>
          <v-row dense>
            <v-col cols="12" md="9">
              <v-autocomplete
                v-model="formItem.investor_id"
                label="Inversionista"
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

            <v-col cols="12" md="3">
              <v-text-field
                v-model="formItem.percentages"
                label="Porcentaje %"
                type="number"
                variant="outlined"
                density="compact"
                min="0"
                max="100"
                :rules="rules.required"
                autocomplete="off"
              />
            </v-col>
          </v-row>

          <v-row dense>
            <v-col cols="12" class="d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <v-btn
                  v-if="formItem.id"
                  size="small"
                  color="error"
                  variant="outlined"
                  @click="formDelete(formItem.id)"
                >
                  Eliminar
                  <v-icon end>mdi-minus</v-icon>
                </v-btn>
              </div>

              <v-btn
                size="small"
                :color="formIsStoreMode ? 'success' : 'warning'"
                :loading="formIsLoading"
                :disabled="formIsLoading"
                @click="formSubmit"
              >
                {{ formIsStoreMode ? "Agregar" : "Guardar" }}
                <v-icon end>mdi-check</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { inject, ref, computed, onMounted } from "vue";
import axios from "axios";

import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getHdrs, getRsp, getErr } from "@/utils/http";
import { getRules } from "@/utils/validators";
import { getObj } from "@/utils/helpers";
import { getAmountFormat } from "@/utils/formatters";

import CardTitle from "@/components/CardTitle.vue";

const routeName = "vehicle_investors";

const props = defineProps({
  vehicle_id: {
    type: [String, Number],
    required: true,
  },
});

const emit = defineEmits(["closed"]);

const store = useStore();
const alert = inject("alert");
const confirm = inject("confirm");
const rules = getRules();

const isLoading = ref(true);
const items = ref([]);
const vehicle = ref(null);

const formIsDialogOpen = ref(false);
const formIsLoading = ref(false);
const formIsStoreMode = ref(false);
const formRef = ref(null);
const formItem = ref(null);

const investors = ref([]);
const investorsLoading = ref(true);

const totalPercentages = computed(() => {
  const total = items.value.reduce(
    (acc, cur) => acc + Number(cur.percentages || 0),
    0,
  );
  return total ? total.toFixed(2) : null;
});

const getItems = async () => {
  items.value = [];
  isLoading.value = true;

  try {
    const endpoint = `${URL_API}/vehicles/${props.vehicle_id}/${routeName}`;
    const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    const data = getRsp(response).data;

    vehicle.value = data.vehicle;
    items.value = data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

const getCatalogs = async () => {
  investors.value = [];
  investorsLoading.value = true;

  try {
    const endpoint = `${URL_API}/investors?is_active=1&filter=0`;
    const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    investors.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    investorsLoading.value = false;
  }
};

const formOpenDialog = async (id = null) => {
  formItem.value = null;
  formIsStoreMode.value = id == null;
  formIsDialogOpen.value = true;
  formIsLoading.value = true;

  if (formIsStoreMode.value) {
    formItem.value = {
      id: null,
      vehicle_id: props.vehicle_id,
      investor_id: null,
      percentages: null,
    };
    formIsLoading.value = false;
  } else {
    try {
      const endpoint = `${URL_API}/vehicles/${routeName}/${id}`;
      const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
      formItem.value = getRsp(response).data.item;
    } catch (err) {
      alert?.show("red-darken-1", getErr(err));
    } finally {
      formIsLoading.value = false;
    }
  }
};

const formSubmit = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) {
    alert?.show("red-darken-1", "Revisa los detalles señalados");
    return;
  }

  const confirmed = await confirm?.show(
    `¿Confirma ${formIsStoreMode.value ? "agregar" : "editar"} inversionista?`,
  );
  if (!confirmed) return;

  formIsLoading.value = true;
  const payload = getObj(formItem.value, formIsStoreMode.value);

  try {
    const endpoint = `${URL_API}/vehicles/${routeName}${
      !formIsStoreMode.value ? `/${payload.id}` : ""
    }`;
    const response = getRsp(
      await axios.post(endpoint, payload, getHdrs(store.getAuth?.token)),
    );

    alert?.show("success", response.msg);

    formIsDialogOpen.value = false;
    await getItems();

    emit("closed", { refresh: true });
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    formIsLoading.value = false;
  }
};

const formDelete = async (id) => {
  const confirmed = await confirm?.show("¿Confirma eliminar el inversionista?");
  if (!confirmed) return;

  isLoading.value = true;

  try {
    const endpoint = `${URL_API}/vehicles/${routeName}/${id}`;
    const response = getRsp(
      await axios.delete(endpoint, getHdrs(store.getAuth?.token)),
    );
    alert?.show("warning", response.msg);

    formIsDialogOpen.value = false;
    await getItems();

    emit("closed", { refresh: true });
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  getCatalogs();
  getItems();
});
</script>
