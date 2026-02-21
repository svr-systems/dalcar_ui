<template>
  <v-card :disabled="isLoading" :loading="isLoading">
    <v-card-title class="d-flex align-center justify-space-between">
      <div class="d-flex align-center"></div>

      <v-btn
        icon
        variant="outlined"
        size="x-small"
        density="comfortable"
        color="warning"
        @click="formOpenDialog()"
      >
        <v-icon>mdi-plus</v-icon>
        <v-tooltip activator="parent" location="left">Agregar</v-tooltip>
      </v-btn>
    </v-card-title>

    <v-card-text>
      <v-row dense>
        <v-col cols="12">
          <v-table density="compact" striped="even">
            <thead class="font-weight-light text-caption text-medium-emphasis">
              <tr>
                <th>Tipo</th>
                <th>Observación</th>
                <th>Fecha</th>
                <th>Monto</th>
                <th>Evidencia</th>
                <th />
              </tr>
            </thead>

            <tbody>
              <tr v-for="(item, i) in items" :key="i">
                <td>{{ item.expense_type?.name }}</td>
                <td>{{ item.note }}</td>
                <td>{{ item.expense_date }}</td>
                <td>{{ getAmountFormat(item.amount) }}</td>
                <td>
                  <BtnFilePreview
                    v-if="item.document_b64"
                    :doc="item.document_b64"
                    tooltip="Evidencia"
                  />
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
                    <v-tooltip activator="parent" location="left"
                      >Ver | Editar</v-tooltip
                    >
                  </v-btn>
                </td>
              </tr>

              <tr v-if="items.length > 0">
                <td />
                <td />
                <td />
                <td>
                  <span class="text-subtitle-1 font-weight-bold">
                    {{ total ? getAmountFormat(total) : "" }}
                  </span>
                </td>
                <td />
                <td />
              </tr>
              <tr v-else>
                <td colspan="6" class="text-center text-medium-emphasis">
                  <small><i>Sin registros</i></small>
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
    max-width="500"
  >
    <v-card :disabled="formIsLoading" :loading="formIsLoading">
      <v-card-title class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <CardTitle text="GASTO" sub />
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
              <v-autocomplete
                v-if="!isAddingNewExpenseType"
                v-model="formItem.expense_type_id"
                label="Tipo"
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
                v-model="newExpenseTypeName"
                label="Nuevo tipo"
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

            <v-col cols="12">
              <v-text-field
                v-model="formItem.note"
                label="Observaciones*"
                type="text"
                variant="outlined"
                density="compact"
                maxlength="255"
                counter
                :rules="rules.textOptional"
                autocomplete="off"
              />
            </v-col>

            <v-col cols="12" md="6">
              <InpDate
                v-model="formItem.expense_date"
                label="Fecha"
                :rules="rules.required"
                :before="true"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="formItem.amount"
                :label="`Monto ${getAmountFormat(formItem.amount)}`"
                type="number"
                variant="outlined"
                density="compact"
                min="0"
                :rules="rules.required"
                autocomplete="off"
              />
            </v-col>

            <v-col :cols="formItem.document_doc ? '11' : '12'">
              <v-file-input
                v-model="formItem.document_doc"
                label="Evidencia*"
                variant="outlined"
                density="compact"
                prepend-icon=""
                show-size
                accept=".pdf,.png,.jpg,.jpeg"
                :rules="rules.fileOptional"
              />
            </v-col>

            <v-col
              v-if="formItem.document_doc"
              cols="1"
              class="py-3 d-flex align-start justify-end ga-1"
            >
              <BtnFilePreview
                :file="formItem.document_doc"
                tooltip="Ver"
                variant="outlined"
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
                {{ formIsStoreMode ? "Agregar" : "Editar" }}
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
import { computed, inject, onMounted, ref, watch } from "vue";
import axios from "axios";
import { useStore } from "@/store";

import { URL_API } from "@/utils/config";
import { getErr, getHdrs, getRsp } from "@/utils/http";
import { getObj, getFormData, b64ToFile } from "@/utils/helpers";
import { getAmountFormat } from "@/utils/formatters";
import { getRules } from "@/utils/validators";

import CardTitle from "@/components/CardTitle.vue";
import InpDate from "@/components/InpDate.vue";
import BtnFilePreview from "@/components/BtnFilePreview.vue";

const routeName = "vehicle_expenses";

const props = defineProps({
  vehicle_id: { type: [String, Number], required: true },
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

const expenseTypes = ref([]);
const expenseTypesLoading = ref(true);

const isAddingNewExpenseType = ref(false);
const isSavingNewExpenseType = ref(false);
const newExpenseTypeName = ref("");
const newExpenseTypeInputRef = ref(null);

const total = computed(() => {
  const total = items.value.reduce(
    (acc, cur) => acc + Number(cur.amount || 0),
    0,
  );
  return total ? total.toFixed(2) : null;
});

const endpoints = {
  expenseTypesIndex: () => `${URL_API}/expense_types?is_active=1`,
  expenseTypesStore: () => `${URL_API}/expense_types`,
  expenseTypesShow: (id) => `${URL_API}/expense_types/${id}`,

  vehicleExpensesIndex: () =>
    `${URL_API}/vehicles/${props.vehicle_id}/${routeName}`,
  vehicleExpensesShow: (id) => `${URL_API}/vehicles/${routeName}/${id}`,
  vehicleExpensesStoreUpdate: (id = null) =>
    `${URL_API}/vehicles/${routeName}${id ? `/${id}` : ""}`,
  vehicleExpensesDestroy: (id) => `${URL_API}/vehicles/${routeName}/${id}`,
};

const setFormDefault = () => {
  formItem.value = {
    id: null,
    vehicle_id: props.vehicle_id,
    expense_type_id: null,
    note: null,
    expense_date: null,
    amount: null,
    document_path: null,
    document_doc: null,
  };
};

const getExpenseTypes = async () => {
  expenseTypesLoading.value = true;

  try {
    const response = await axios.get(
      endpoints.expenseTypesIndex(),
      getHdrs(store.getAuth?.token),
    );

    expenseTypes.value = getRsp(response).data.items || [];
    expenseTypes.value.push({ id: 0, name: "*OTRO" });
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    expenseTypesLoading.value = false;
  }
};

const getItems = async () => {
  items.value = [];
  isLoading.value = true;

  try {
    const response = await axios.get(
      endpoints.vehicleExpensesIndex(),
      getHdrs(store.getAuth?.token),
    );

    const data = getRsp(response).data;
    vehicle.value = data.vehicle || null;
    items.value = data.items || [];
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

const formOpenDialog = async (id = null) => {
  formItem.value = null;
  formIsStoreMode.value = id == null;

  formIsDialogOpen.value = true;
  formIsLoading.value = true;

  if (formIsStoreMode.value) {
    setFormDefault();
    formIsLoading.value = false;
    return;
  }

  try {
    const response = await axios.get(
      endpoints.vehicleExpensesShow(id),
      getHdrs(store.getAuth?.token),
    );

    formItem.value = getRsp(response).data.item;
    formItem.value.document_doc = b64ToFile(formItem.value.document_b64);
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    formIsLoading.value = false;
  }
};

const formSubmit = async () => {
  const { valid } = await formRef.value?.validate();
  if (!valid) {
    alert?.show("red-darken-1", "Revisa los detalles señalados");
    return;
  }

  const confirmed = await confirm?.show(
    `¿Confirma ${formIsStoreMode.value ? "agregar" : "editar"} gasto?`,
  );
  if (!confirmed) return;

  formIsLoading.value = true;

  try {
    const payload = getObj(formItem.value, formIsStoreMode.value);

    const response = getRsp(
      await axios.post(
        endpoints.vehicleExpensesStoreUpdate(
          formIsStoreMode.value ? null : payload.id,
        ),
        getFormData(payload),
        getHdrs(store.getAuth?.token, true),
      ),
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
  const confirmed = await confirm?.show("¿Confirma eliminar gasto?");
  if (!confirmed) return;

  isLoading.value = true;

  try {
    const response = getRsp(
      await axios.delete(
        endpoints.vehicleExpensesDestroy(id),
        getHdrs(store.getAuth?.token),
      ),
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

watch(
  () => formItem.value?.expense_type_id,
  (expense_type_id) => {
    if (!formItem.value) return;

    if (expense_type_id === 0) {
      isAddingNewExpenseType.value = true;
      return;
    }

    isAddingNewExpenseType.value = false;
    newExpenseTypeName.value = "";
    newExpenseTypeInputRef.value?.resetValidation();
  },
);

const cancelAddingNewExpenseType = () => {
  isAddingNewExpenseType.value = false;
  isSavingNewExpenseType.value = false;
  newExpenseTypeName.value = "";
  newExpenseTypeInputRef.value?.resetValidation();

  if (formItem.value) {
    formItem.value.expense_type_id = null;
  }
};

const addNewExpenseType = async () => {
  const name = (newExpenseTypeName.value || "").trim();
  if (!name) {
    alert?.show("red-darken-1", "Por favor, ingresa el nombre del nuevo tipo");
    return;
  }

  const confirmed = await confirm?.show(
    `¿Confirma agregar el nuevo tipo "${name}"?`,
  );
  if (!confirmed) return;

  isSavingNewExpenseType.value = true;

  try {
    const response = await axios.post(
      endpoints.expenseTypesStore(),
      { name },
      getHdrs(store.getAuth?.token),
    );

    const new_id = getRsp(response).data.item.id;

    const getResponse = await axios.get(
      endpoints.expenseTypesShow(new_id),
      getHdrs(store.getAuth?.token),
    );

    const new_item = getRsp(getResponse).data.item;

    const other = expenseTypes.value.pop();
    expenseTypes.value = [...expenseTypes.value, new_item, other];

    formItem.value.expense_type_id = new_item.id;

    newExpenseTypeName.value = "";
    isAddingNewExpenseType.value = false;
    newExpenseTypeInputRef.value?.resetValidation();

    alert?.show("green-darken-1", "Nuevo tipo agregado con éxito");
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isSavingNewExpenseType.value = false;
  }
};

onMounted(() => {
  getExpenseTypes();
  getItems();
});
</script>
