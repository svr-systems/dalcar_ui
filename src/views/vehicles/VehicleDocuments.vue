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
                <th>Fecha de registro</th>
                <th>Fecha de calendarización</th>
                <th>Observación</th>
                <th>Archivo</th>
                <th />
              </tr>
            </thead>

            <tbody>
              <tr v-for="(item, i) in items" :key="i">
                <td>{{ item.document_type?.name }}</td>
                <td>{{ item.registered_date }}</td>
                <td>{{ item.scheduled_date }}</td>
                <td>{{ item.note }}</td>
                <td>
                  <BtnFilePreview
                    v-if="item.document_b64"
                    :doc="item.document_b64"
                    tooltip="Archivo"
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

              <tr v-if="items.length === 0">
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
          <CardTitle text="DOCUMENTO" sub />
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
                v-if="!isAddingNewDocumentType"
                v-model="formItem.document_type_id"
                label="Tipo"
                :items="DocumentTypes"
                :loading="DocumentTypesLoading"
                item-value="id"
                item-title="name"
                variant="outlined"
                density="compact"
                :rules="rules.required"
                autocomplete="off"
              />

              <v-text-field
                v-else
                ref="newDocumentTypeInputRef"
                v-model="newDocumentTypeName"
                label="Nuevo tipo"
                variant="outlined"
                density="compact"
                :rules="rules.textRequired"
                autocomplete="off"
                maxlength="50"
                @keydown.enter.prevent="addNewDocumentType"
              >
                <template #append-inner>
                  <v-btn
                    icon
                    variant="text"
                    size="small"
                    color="error"
                    @click="cancelAddingNewDocumentType"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>

                  <v-btn
                    icon
                    variant="text"
                    size="small"
                    color="success"
                    :loading="isSavingNewDocumentType"
                    @click="addNewDocumentType"
                  >
                    <v-icon>mdi-check</v-icon>
                  </v-btn>
                </template>
              </v-text-field>
            </v-col>

            <v-col cols="12" md="12">
              <InpDate
                v-model="formItem.registered_date"
                label="Fecha de registro*"
                :before="true"
                :clearable="true"
              />
            </v-col>

            <v-col cols="12" md="12">
              <InpDate
                v-model="formItem.scheduled_date"
                label="Fecha de calendarización*"
                :after="true"
                :clearable="true"
              />
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

            <v-col
              v-if="formItem.registered_date"
              :cols="formItem.document_doc ? '11' : '12'"
            >
              <v-file-input
                v-model="formItem.document_doc"
                label="Archivo"
                variant="outlined"
                density="compact"
                prepend-icon=""
                show-size
                accept=".pdf,.png,.jpg,.jpeg"
                :rules="rules.fileRequired"
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
import { inject, onMounted, ref, watch } from "vue";
import axios from "axios";
import { useStore } from "@/store";

import { URL_API } from "@/utils/config";
import { getErr, getHdrs, getRsp } from "@/utils/http";
import { getObj, getFormData, b64ToFile } from "@/utils/helpers";
import { getRules } from "@/utils/validators";

import CardTitle from "@/components/CardTitle.vue";
import InpDate from "@/components/InpDate.vue";
import BtnFilePreview from "@/components/BtnFilePreview.vue";

const routeName = "vehicle_documents";

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

const DocumentTypes = ref([]);
const DocumentTypesLoading = ref(true);

const isAddingNewDocumentType = ref(false);
const isSavingNewDocumentType = ref(false);
const newDocumentTypeName = ref("");
const newDocumentTypeInputRef = ref(null);

const endpoints = {
  DocumentTypesIndex: () => `${URL_API}/document_types?is_active=1`,
  DocumentTypesStore: () => `${URL_API}/document_types`,
  DocumentTypesShow: (id) => `${URL_API}/document_types/${id}`,

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
    document_type_id: null,
    registered_date: null,
    scheduled_date: null,
    note: null,
    document_path: null,
    document_doc: null,
  };
};

const getDocumentTypes = async () => {
  DocumentTypesLoading.value = true;

  try {
    const response = await axios.get(
      endpoints.DocumentTypesIndex(),
      getHdrs(store.getAuth?.token),
    );

    DocumentTypes.value = getRsp(response).data.items || [];
    DocumentTypes.value.push({ id: 0, name: "*OTRO" });
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    DocumentTypesLoading.value = false;
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
    `¿Confirma ${formIsStoreMode.value ? "agregar" : "editar"} documento?`,
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
  const confirmed = await confirm?.show("¿Confirma eliminar documento?");
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
  () => formItem.value?.document_type_id,
  (document_type_id) => {
    if (!formItem.value) return;

    if (document_type_id === 0) {
      isAddingNewDocumentType.value = true;
      return;
    }

    isAddingNewDocumentType.value = false;
    newDocumentTypeName.value = "";
    newDocumentTypeInputRef.value?.resetValidation();
  },
);

const cancelAddingNewDocumentType = () => {
  isAddingNewDocumentType.value = false;
  isSavingNewDocumentType.value = false;
  newDocumentTypeName.value = "";
  newDocumentTypeInputRef.value?.resetValidation();

  if (formItem.value) {
    formItem.value.document_type_id = null;
  }
};

const addNewDocumentType = async () => {
  const name = (newDocumentTypeName.value || "").trim();
  if (!name) {
    alert?.show("red-darken-1", "Por favor, ingresa el nombre del nuevo tipo");
    return;
  }

  const confirmed = await confirm?.show(
    `¿Confirma agregar el nuevo tipo "${name}"?`,
  );
  if (!confirmed) return;

  isSavingNewDocumentType.value = true;

  try {
    const response = await axios.post(
      endpoints.DocumentTypesStore(),
      { name },
      getHdrs(store.getAuth?.token),
    );

    const new_id = getRsp(response).data.item.id;

    const getResponse = await axios.get(
      endpoints.DocumentTypesShow(new_id),
      getHdrs(store.getAuth?.token),
    );

    const new_item = getRsp(getResponse).data.item;

    const other = DocumentTypes.value.pop();
    DocumentTypes.value = [...DocumentTypes.value, new_item, other];

    formItem.value.document_type_id = new_item.id;

    newDocumentTypeName.value = "";
    isAddingNewDocumentType.value = false;
    newDocumentTypeInputRef.value?.resetValidation();

    alert?.show("green-darken-1", "Nuevo tipo agregado con éxito");
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isSavingNewDocumentType.value = false;
  }
};

onMounted(() => {
  getDocumentTypes();
  getItems();
});
</script>
