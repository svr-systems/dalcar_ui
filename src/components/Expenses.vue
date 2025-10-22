<template>
  <v-col cols="12">
    <v-card :loading="isLoading">
      <v-card-title>
        <v-row dense>
          <v-col cols="11">
            <CardTitle :text="`GASTOS | ${getAmountFormat(totalExpenses)}`" sub />
          </v-col>
          <v-col cols="1" class="text-right">
            <v-btn
              v-if="isActive"
              icon
              variant="text"
              size="x-small"
              color="success"
              @click="legacyVehicleExpenseAddDlg()"
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
              <th>Tipo</th>
              <th>Observaciones</th>
              <th>Fecha</th>
              <th>Monto</th>
              <th width="40" />
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(legacyVehicleExpense, i) in legacyVehicleExpenses"
              :key="i"
            >
              <td>{{ i + 1 }}</td>
              <td>
                {{ legacyVehicleExpense.expense_type.name }}
              </td>
              <td>
                {{ legacyVehicleExpense.note }}
              </td>
              <td>
                {{ legacyVehicleExpense.expense_date }}
              </td>
              <td>{{ getAmountFormat(legacyVehicleExpense.amount) }}</td>
              <td class="text-right">
                <v-btn
                  v-if="isActive"
                  icon
                  variant="text"
                  size="x-small"
                  color="error"
                  @click.prevent="
                    legacyVehicleExpenseRemove(legacyVehicleExpense.id)
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
    v-model="legacyVehicleExpenseDlg"
    persistent
    scrim="black"
    max-width="1200"
  >
    <v-card
      :loading="legacyVehicleExpenseLdg"
      :disabled="legacyVehicleExpenseLdg"
      flat
    >
      <v-card-title>
        <v-row dense>
          <v-col cols="11">
            <CardTitle text="GASTO" subvalue />
          </v-col>
          <v-col cols="1" class="text-right">
            <v-btn
              icon
              variant="text"
              size="x-small"
              @click="legacyVehicleExpenseDlg = false"
            >
              <v-icon>mdi-close</v-icon>
              <v-tooltip activator="parent" location="left">Cerrar</v-tooltip>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>

      <v-card-text v-if="legacyVehicleExpense">
        <v-form ref="legacyVehicleExpenseForm" @submit.prevent>
          <v-row dense>
            <v-col cols="12" md="3">
              <v-autocomplete
                v-if="!isAddingNewExpenseType"
                label="Tipo"
                v-model="legacyVehicleExpense.expense_type_id"
                :items="expenseTypes"
                :loading="expenseTypesLoading"
                item-value="id"
                item-title="name"
                variant="outlined"
                density="compact"
                :rules="rules.required"
                autocomplete="off"
              />
              <v-text-field
                v-else
                ref="newExpenseTypeInputRef"
                label="Nuevo tipo"
                v-model="newExpenseTypeName"
                variant="outlined"
                density="compact"
                :rules="rules.textRequired"
                autocomplete="off"
                maxlength="50"
                @keydown.enter.prevent="addNewExpenseType"
              >
                <template #append-inner>
                  <v-btn
                    icon
                    variant="text"
                    size="small"
                    color="error"
                    @click="cancelAddingNewExpenseType"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    variant="text"
                    size="small"
                    color="success"
                    :loading="isSavingNewExpenseType"
                    @click="addNewExpenseType"
                  >
                    <v-icon>mdi-check</v-icon>
                  </v-btn>
                </template>
              </v-text-field>
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field
                label="Observaciones"
                v-model="legacyVehicleExpense.note"
                type="text"
                variant="outlined"
                density="compact"
                maxlength="50"
                counter
                :rules="rules.textRequired"
                autocomplete="off"
              />
            </v-col>

            <v-col cols="12" md="3">
              <InpDate
                label="Fecha"
                v-model="legacyVehicleExpense.expense_date"
                :rules="rules.required"
                :before="true"
              />
            </v-col>

            <v-col cols="12" md="2">
              <v-text-field
                :label="
                  'Monto ' + getAmountFormat(legacyVehicleExpense.amount)
                "
                v-model="legacyVehicleExpense.amount"
                type="number"
                variant="outlined"
                density="compact"
                counter
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
                @click.prevent="legacyVehicleExpenseAdd()"
                :loading="legacyVehicleExpenseLdg"
                :disabled="isAddingNewExpenseType"
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
import { ref, inject, onMounted, watch, computed } from "vue";
import axios from "axios";

import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getHdrs, getErr, getRsp } from "@/utils/http";
import { getAmountFormat, getDateTime } from "@/utils/formatters";
import { getRules } from "@/utils/validators";

import CardTitle from "@/components/CardTitle.vue";
import InpDate from "@/components/InpDate.vue";

const alert = inject("alert");
const confirm = inject("confirm");
const store = useStore();

const routeName = "legacy_vehicles";
const currentDate = ref(getDateTime("-", "", "", false));

const legacyVehicleExpenses = ref([]);
const expenseTypes = ref([]);
const expenseTypesLoading = ref(true);
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

const getExpenseTypes = async () => {
  try {
    const endpoint = `${URL_API}/expense_types?is_active=1&filter=0`;
    const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    expenseTypes.value = getRsp(response).data.items;
    expenseTypes.value.push({ id: 0, name: "OTRO" });
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    expenseTypesLoading.value = false;
  }
};

const getLegacyVehicleExpenses = async () => {
  let endpoint = null;
  let response = null;

  isLoading.value = true;
  try {
    endpoint = `${URL_API}/${routeName}/legacy_vehicle_expenses`;
    response = await axios.get(endpoint, {
      params: {
        legacy_vehicle_id: props.legacyVehicleId,
        is_active: 1,
      },
      ...getHdrs(store.getAuth?.token),
    });
    legacyVehicleExpenses.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

const legacyVehicleExpense = ref(null);
const legacyVehicleExpenseLdg = ref(false);
const legacyVehicleExpenseDlg = ref(false);
const legacyVehicleExpenseForm = ref(null);

const isAddingNewExpenseType = ref(false);
const newExpenseTypeName = ref("");
const newExpenseTypeInputRef = ref(null);
const isSavingNewExpenseType = ref(false);

watch(
  () => legacyVehicleExpense.value?.expense_type_id,
  (newExpenseTypeId) => {
    if (!legacyVehicleExpense.value) return;

    if (newExpenseTypeId === 0) {
      isAddingNewExpenseType.value = true;
    } else {
      isAddingNewExpenseType.value = false;
      newExpenseTypeName.value = "";
      newExpenseTypeInputRef.value?.resetValidation();
    }
  }
);

const addNewExpenseType = async () => {
  if (!newExpenseTypeName.value || newExpenseTypeName.value.trim() === "") {
    alert?.show("red-darken-1", "Por favor, ingresa el nombre del nuevo tipo");
    return;
  }

  const confirmed = await confirm?.show(
    `¿Confirma agregar el nuevo tipo "${newExpenseTypeName.value}"?`
  );
  if (!confirmed) return;

  isSavingNewExpenseType.value = true;
  try {
    const payload = {
      name: newExpenseTypeName.value.trim(),
    };
    const endpoint = `${URL_API}/expense_types`;
    const response = await axios.post(
      endpoint,
      payload,
      getHdrs(store.getAuth?.token)
    );
    const newExpenseTypeId = getRsp(response).data.item.id;

    alert?.show("green-darken-1", "Nuevo tipo agregado con éxito");

    const getEndpoint = `${URL_API}/expense_types/${newExpenseTypeId}`;
    const getResponse = await axios.get(
      getEndpoint,
      getHdrs(store.getAuth?.token)
    );
    const newExpenseType = getRsp(getResponse).data.item;

    const otroOption = expenseTypes.value.pop();
    expenseTypes.value = [...expenseTypes.value, newExpenseType, otroOption];
    legacyVehicleExpense.value.expense_type_id = newExpenseType.id;

    newExpenseTypeName.value = "";
    isAddingNewExpenseType.value = false;
    newExpenseTypeInputRef.value?.resetValidation();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isSavingNewExpenseType.value = false;
  }
};

const cancelAddingNewExpenseType = () => {
  isAddingNewExpenseType.value = false;
  newExpenseTypeName.value = "";
  newExpenseTypeInputRef.value?.resetValidation();
  legacyVehicleExpense.value.expense_type_id = null;
};

const legacyVehicleExpenseAddDlg = () => {
  isAddingNewExpenseType.value = false;
  newExpenseTypeName.value = "";
  legacyVehicleExpense.value = {
    id: null,
    legacy_vehicle_id: props.legacyVehicleId,
    expense_type_id: null,
    note: null,
    expense_date: currentDate.value,
    amount: null,
  };
  legacyVehicleExpenseLdg.value = false;
  legacyVehicleExpenseDlg.value = true;
};

const legacyVehicleExpenseAdd = async () => {
  const { valid } = await legacyVehicleExpenseForm.value.validate();
  if (!valid) return;

  const confirmed = await confirm?.show(`¿Confirma agregar?`);
  if (!confirmed) return;

  legacyVehicleExpenseLdg.value = true;

  try {
    const endpoint = `${URL_API}/${routeName}/legacy_vehicle_expenses`;
    const response = getRsp(
      await axios.post(
        endpoint,
        legacyVehicleExpense.value,
        getHdrs(store.getAuth?.token)
      )
    );

    alert?.show("success", response.msg);
    legacyVehicleExpenseDlg.value = false;
    getLegacyVehicleExpenses();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    legacyVehicleExpenseLdg.value = false;
  }
};

const legacyVehicleExpenseRemove = async (id) => {
  const confirmed = await confirm?.show("¿Confirma eliminar el registro?");
  if (!confirmed) return;

  isLoading.value = true;
  try {
    const endpoint = `${URL_API}/${routeName}/legacy_vehicle_expenses/${id}`;
    const response = getRsp(
      await axios.delete(endpoint, getHdrs(store.getAuth?.token))
    );
    alert?.show("success", response.msg);
    getLegacyVehicleExpenses();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

const totalExpenses = computed(() => {
  return legacyVehicleExpenses.value.reduce((total, expense) => {
    return total + (parseFloat(expense.amount) || 0);
  }, 0);
});

onMounted(() => {
  getExpenseTypes();
  getLegacyVehicleExpenses();
});
</script>