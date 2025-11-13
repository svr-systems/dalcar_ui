<template>
  <v-col cols="12">
    <v-card>
      <v-card-title>
        <v-row dense>
          <v-col cols="11">
            <CardTitle text="DOCUMENTOS" sub />
          </v-col>
          <v-col cols="1" class="text-right">
            <v-btn
              v-if="isActive"
              icon
              variant="text"
              size="x-small"
              color="success"
              @click="legacyVehicleDocumentAddDlg()"
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
              <th width="40">Archivo</th>
              <th width="40" />
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(legacyVehicleDocument, i) in legacyVehicleDocuments"
              :key="i"
            >
              <td>{{ i + 1 }}</td>
              <td>
                {{ legacyVehicleDocument.document_type.name }}
              </td>
              <td>
                {{ legacyVehicleDocument.note }}
              </td>
              <td class="d-flex justify-space-between">
                <VisDoc2 :value="legacyVehicleDocument.document_b64" />
                <VisDoc :value="legacyVehicleDocument.document_b64" />
              </td>
              <td class="text-right">
                <v-btn
                  v-if="isActive"
                  icon
                  variant="text"
                  size="x-small"
                  color="error"
                  @click.prevent="
                    legacyVehicleDocumentRemove(legacyVehicleDocument.id)
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

    <v-dialog
      v-model="legacyVehicleDocumentDlg"
      persistent
      scrim="black"
      max-width="1200"
    >
      <v-card
        :loading="legacyVehicleDocumentLdg"
        :disabled="legacyVehicleDocumentLdg"
        flat
      >
        <v-card-title>
          <v-row dense>
            <v-col cols="11">
              <CardTitle text="DOCUMENTO" subvalue />
            </v-col>
            <v-col cols="1" class="text-right">
              <v-btn
                icon
                variant="text"
                size="x-small"
                @click="legacyVehicleDocumentDlg = false"
              >
                <v-icon>mdi-close</v-icon>
                <v-tooltip activator="parent" location="left">Cerrar</v-tooltip>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>

        <v-card-text v-if="legacyVehicleDocument">
          <v-form ref="legacyVehicleDocumentForm" @submit.prevent>
            <v-row dense>
              <v-col cols="12" md="6">
                <v-autocomplete
                  v-if="!isAddingNewDocumentType"
                  label="Tipo"
                  v-model="legacyVehicleDocument.document_type_id"
                  :items="documentTypes"
                  :loading="documentTypesLoading"
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
                  label="Nuevo tipo"
                  v-model="newDocumentTypeName"
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

              <v-col cols="12" md="6">
                <v-file-input
                  label="Archivo (PDF)"
                  v-model="legacyVehicleDocument.document_doc"
                  variant="outlined"
                  density="compact"
                  prepend-icon=""
                  show-size
                  accept=".pdf"
                  :rules="rules.fileRequired"
                />
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Observaciones"
                  v-model="legacyVehicleDocument.note"
                  type="text"
                  variant="outlined"
                  density="compact"
                  maxlength="50"
                  counter
                  :rules="rules.textRequired"
                  autocomplete="off"
                />
              </v-col>

              <v-col cols="12" class="text-right">
                <v-btn
                  icon
                  size="x-small"
                  color="success"
                  @click.prevent="legacyVehicleDocumentAdd()"
                  :loading="legacyVehicleDocumentLdg"
                  :disabled="isAddingNewDocumentType"
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
  </v-col>
</template>

<script setup>
import { ref, inject, onMounted, watch } from "vue";
import axios from "axios";

import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getHdrs, getErr, getRsp } from "@/utils/http";
import { getFormData } from "@/utils/helpers";
import { getRules } from "@/utils/validators";

import CardTitle from "@/components/CardTitle.vue";
import VisDoc from "@/components/VisDoc.vue";
import VisDoc2 from "@/components/VisDoc2.vue";

const alert = inject("alert");
const confirm = inject("confirm");
const store = useStore();

const routeName = "legacy_vehicles";

const legacyVehicleDocuments = ref([]);
const documentTypes = ref([]);
const documentTypesLoading = ref(true);
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

const getDocumentTypes = async () => {
  documentTypes.value = [
    { "id": 2, "is_active": 1, "name": "DOC 2", "key": 0 },
    { "id": 1, "is_active": 1, "name": "DOCUMENT EDITED", "key": 1 },
    { "id": 11, "is_active": 1, "name": "FACTURA ORIGEN", "key": 2 },
    { "id": 10, "is_active": 1, "name": "TARJETA DE CIRCULACION", "key": 3 },
    { "id": 3, "is_active": 1, "name": "TEST", "key": 4 },
    { "id": 4, "is_active": 1, "name": "TEST 2", "key": 5 },
    { "id": 6, "is_active": 1, "name": "TEST 4", "key": 6 },
    { "id": 7, "is_active": 1, "name": "TEST 5", "key": 7 },
    { "id": 8, "is_active": 1, "name": "TEST 6", "key": 8 },
    { "id": 9, "is_active": 1, "name": "TEST 7", "key": 9 },
    { "id": 5, "is_active": 1, "name": "TEST3", "key": 10 }
  ];
  documentTypes.value.push({ id: 0, name: "OTRO" });
  documentTypesLoading.value = false;
};

const getLegacyVehicleDocuments = async () => {
  isLoading.value = true;
  legacyVehicleDocuments.value = [
    {
      id: 1,
      document_type: { id: 2, name: "DOC 2" },
      note: "Documento de prueba 1",
      document_b64: "data:application/pdf;base64,dummy1"
    },
    {
      id: 2,
      document_type: { id: 1, name: "DOCUMENT EDITED" },
      note: "Documento de prueba 2",
      document_b64: "data:application/pdf;base64,dummy2"
    },
    {
      id: 3,
      document_type: { id: 11, name: "FACTURA ORIGEN" },
      note: "Factura origen",
      document_b64: "data:application/pdf;base64,dummy3"
    },
    {
      id: 4,
      document_type: { id: 10, name: "TARJETA DE CIRCULACION" },
      note: "Tarjeta de circulación",
      document_b64: "data:application/pdf;base64,dummy4"
    },
    {
      id: 5,
      document_type: { id: 3, name: "TEST" },
      note: "Documento test",
      document_b64: "data:application/pdf;base64,dummy5"
    }
  ];
  isLoading.value = false;
};

const legacyVehicleDocument = ref(null);
const legacyVehicleDocumentLdg = ref(false);
const legacyVehicleDocumentDlg = ref(false);
const legacyVehicleDocumentForm = ref(null);

const isAddingNewDocumentType = ref(false);
const newDocumentTypeName = ref("");
const newDocumentTypeInputRef = ref(null);
const isSavingNewDocumentType = ref(false);

watch(
  () => legacyVehicleDocument.value?.document_type_id,
  (newDocumentTypeId) => {
    if (!legacyVehicleDocument.value) return;

    if (newDocumentTypeId === 0) {
      isAddingNewDocumentType.value = true;
    } else {
      isAddingNewDocumentType.value = false;
      newDocumentTypeName.value = "";
      newDocumentTypeInputRef.value?.resetValidation();
    }
  }
);

const addNewDocumentType = async () => {
  if (!newDocumentTypeName.value || newDocumentTypeName.value.trim() === "") {
    alert?.show("red-darken-1", "Por favor, ingresa el nombre del nuevo tipo");
    return;
  }

  const confirmed = await confirm?.show(
    `¿Confirma agregar el nuevo tipo "${newDocumentTypeName.value}"?`
  );
  if (!confirmed) return;

  isSavingNewDocumentType.value = true;
  const newId = Math.max(...documentTypes.value.map(d => d.id)) + 1;
  const newDocumentType = {
    id: newId,
    is_active: 1,
    name: newDocumentTypeName.value.trim(),
    key: documentTypes.value.length - 1
  };

  const otroOption = documentTypes.value.pop();
  documentTypes.value = [...documentTypes.value, newDocumentType, otroOption];
  legacyVehicleDocument.value.document_type_id = newDocumentType.id;

  alert?.show("green-darken-1", "Nuevo tipo agregado con éxito");

  newDocumentTypeName.value = "";
  isAddingNewDocumentType.value = false;
  newDocumentTypeInputRef.value?.resetValidation();
  isSavingNewDocumentType.value = false;
};

const cancelAddingNewDocumentType = () => {
  isAddingNewDocumentType.value = false;
  newDocumentTypeName.value = "";
  newDocumentTypeInputRef.value?.resetValidation();
  legacyVehicleDocument.value.document_type_id = null;
};

const legacyVehicleDocumentAddDlg = () => {
  isAddingNewDocumentType.value = false;
  newDocumentTypeName.value = "";
  legacyVehicleDocument.value = {
    id: null,
    is_active: 1,
    legacy_vehicle_id: props.legacyVehicleId,
    document_type_id: null,
    document_path: null,
    document_doc: null,
    document_dlt: false,
    note: null,
  };
  legacyVehicleDocumentLdg.value = false;
  legacyVehicleDocumentDlg.value = true;
};

const legacyVehicleDocumentAdd = async () => {
  const { valid } = await legacyVehicleDocumentForm.value.validate();
  if (!valid) return;

  const confirmed = await confirm?.show(`¿Confirma agregar?`);
  if (!confirmed) return;

  legacyVehicleDocumentLdg.value = true;

  const newId = legacyVehicleDocuments.value.length > 0 ? Math.max(...legacyVehicleDocuments.value.map(d => d.id)) + 1 : 1;
  const newDoc = {
    id: newId,
    document_type: documentTypes.value.find(dt => dt.id === legacyVehicleDocument.value.document_type_id),
    note: legacyVehicleDocument.value.note,
    document_b64: "data:application/pdf;base64,dummy" // dummy for now
  };
  legacyVehicleDocuments.value.push(newDoc);

  alert?.show("success", "Documento agregado");
  legacyVehicleDocumentDlg.value = false;
  legacyVehicleDocumentLdg.value = false;
};

const legacyVehicleDocumentRemove = async (id) => {
  const confirmed = await confirm?.show("¿Confirma eliminar el registro?");
  if (!confirmed) return;

  legacyVehicleDocuments.value = legacyVehicleDocuments.value.filter(doc => doc.id !== id);
  alert?.show("success", "Documento eliminado");
};

onMounted(() => {
  getDocumentTypes();
  getLegacyVehicleDocuments();
});
</script>