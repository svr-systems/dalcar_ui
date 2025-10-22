<template>
  <v-col cols="12">
    <v-card :loading="isLoading">
      <v-card-title>
        <v-row dense>
          <v-col cols="11">
            <CardTitle :text="`INVERSIONISTAS | ${getPercentFormat(totalPercentages)}`" sub />
          </v-col>
          <v-col cols="1" class="text-right">
            <v-btn
              v-if="isActive"
              icon
              variant="text"
              size="x-small"
              color="success"
              @click="legacyVehicleInvestorAddDlg()"
            >
              <v-icon>mdi-plus</v-icon>
              <v-tooltip activator="parent" location="start">
                Agregar
              </v-tooltip>
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
              v-for="(legacyVehicleInvestor, i) in legacyVehicleInvestors"
              :key="i"
            >
              <td>{{ i + 1 }}</td>
              <td>
                {{ legacyVehicleInvestor.investor.user.full_name }}
              </td>
              <td>{{ legacyVehicleInvestor.percentages }}</td>
              <td class="text-right">
                <v-btn
                  v-if="isActive"
                  icon
                  variant="text"
                  size="x-small"
                  color="error"
                  @click.prevent="
                    legacyVehicleInvestorRemove(legacyVehicleInvestor.id)
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
    v-model="legacyVehicleInvestorDlg"
    persistent
    scrim="black"
    max-width="1200"
  >
    <v-card
      :loading="legacyVehicleInvestorLdg"
      :disabled="legacyVehicleInvestorLdg"
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
              @click="legacyVehicleInvestorDlg = false"
            >
              <v-icon>mdi-close</v-icon>
              <v-tooltip activator="parent" location="left">Cerrar</v-tooltip>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>

      <v-card-text v-if="legacyVehicleInvestor">
        <v-form ref="legacyVehicleInvestorForm" @submit.prevent>
          <v-row dense>
            <v-col cols="12" md="10">
              <v-autocomplete
                label="Nombre"
                v-model="legacyVehicleInvestor.investor_id"
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
                v-model="legacyVehicleInvestor.percentages"
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
                @click.prevent="legacyVehicleInvestorAdd()"
                :loading="legacyVehicleInvestorLdg"
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
</template>

<script setup>
import { ref, inject, onMounted, computed } from "vue";
import axios from "axios";

import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getHdrs, getErr, getRsp } from "@/utils/http";
import { getPercentFormat } from "@/utils/formatters";
import { getRules } from "@/utils/validators";

const totalPercentages = computed(() => {
  return legacyVehicleInvestors.value.reduce((total, investor) => {
    return total + (parseFloat(investor.percentages) || 0);
  }, 0);
});

import CardTitle from "@/components/CardTitle.vue";

const alert = inject("alert");
const confirm = inject("confirm");
const store = useStore();

const routeName = "legacy_vehicles";

const legacyVehicleInvestors = ref([]);
const investors = ref([]);
const investorsLoading = ref(true);
const rules = getRules();

const isLoading = ref(true);
const props = defineProps({
  legacyVehicleId: {
    type: String,
    required: true,
  },
  isActive: {
    type: Number,
    required: true,
  },
});

const getInvestors = async () => {
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

const getLegacyVehicleInvestors = async () => {
  let endpoint = null;
  let response = null;

  isLoading.value = true;
  try {
    const endpoint = `${URL_API}/${routeName}/legacy_vehicle_investors`;
    const response = await axios.get(endpoint, {
      params: {
        legacy_vehicle_id: props.legacyVehicleId,
        is_active: 1,
      },
      ...getHdrs(store.getAuth?.token),
    });
    legacyVehicleInvestors.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  }finally {
    isLoading.value = false;
  }
};

const legacyVehicleInvestor = ref(null);
const legacyVehicleInvestorLdg = ref(false);
const legacyVehicleInvestorDlg = ref(false);
const legacyVehicleInvestorForm = ref(null);

const legacyVehicleInvestorAddDlg = () => {
  legacyVehicleInvestor.value = {
    id: null,
    legacy_vehicle_id: props.legacyVehicleId,
    investor_id: null,
    percentages: null,
    amount: null,
  };
  legacyVehicleInvestorLdg.value = false;
  legacyVehicleInvestorDlg.value = true;
};

const legacyVehicleInvestorAdd = async () => {
  const { valid } = await legacyVehicleInvestorForm.value.validate();
  if (!valid) return;

  const confirmed = await confirm?.show(`¿Confirma agregar?`);
  if (!confirmed) return;

  legacyVehicleInvestorLdg.value = true;

  try {
    const endpoint = `${URL_API}/${routeName}/legacy_vehicle_investors`;
    const response = getRsp(
      await axios.post(
        endpoint,
        legacyVehicleInvestor.value,
        getHdrs(store.getAuth?.token)
      )
    );

    alert?.show("success", response.msg);
    legacyVehicleInvestorDlg.value = false;
    getLegacyVehicleInvestors();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    legacyVehicleInvestorLdg.value = false;
  }
};

const legacyVehicleInvestorRemove = async (id) => {
  const confirmed = await confirm?.show("¿Confirma eliminar el registro?");
  if (!confirmed) return;

  try {
    const endpoint = `${URL_API}/${routeName}/legacy_vehicle_investors/${id}`;
    const response = getRsp(
      await axios.delete(endpoint, getHdrs(store.getAuth?.token))
    );
    alert?.show("success", response.msg);
    getLegacyVehicleInvestors();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  }
};

onMounted(() => {
  getInvestors();
  getLegacyVehicleInvestors();
});
</script>