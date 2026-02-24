<template>
  <v-card elevation="24" :disabled="isLoading" :loading="isLoading">
    <v-card-title class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <CardTitle :text="route.meta.title" :icon="route.meta.icon" />
      </div>
    </v-card-title>

    <v-card-text>
      <v-row dense>
        <v-col cols="12" md="4" class="pb-0">
          <v-select
            v-model="catalogKey"
            label="Catálogo"
            :items="catalogOptions"
            item-title="label"
            item-value="key"
            variant="outlined"
            density="compact"
            :disabled="isLoading"
          />
        </v-col>

        <v-col cols="12" md="4" class="pb-0" />

        <v-col cols="12" md="4" class="pb-0">
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
          <v-data-table
            density="compact"
            :items="items"
            :headers="headers"
            :search="search"
            :items-per-page="15"
            :loading="isLoading"
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
                  @click="formOpenDialog(item)"
                >
                  <v-icon>mdi-pencil</v-icon>
                  <v-tooltip activator="parent" location="left"
                    >Detalle</v-tooltip
                  >
                </v-btn>
              </div>
            </template>

            <template #no-data>
              <div class="text-medium-emphasis py-4">
                <small><i>Sin registros</i></small>
              </div>
            </template>
          </v-data-table>
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
          <CardTitle :text="formTitle" sub />
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
            <v-col cols="12" class="d-flex align-center justify-space-between">
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
</template>

<script setup>
import { computed, inject, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getErr, getHdrs, getRsp } from "@/utils/http";
import { getObj } from "@/utils/helpers";
import { getRules } from "@/utils/validators";

import CardTitle from "@/components/CardTitle.vue";

const alert = inject("alert");
const confirm = inject("confirm");
const rules = getRules();
const store = useStore();
const route = useRoute();

const isLoading = ref(false);
const items = ref([]);
const search = ref("");

const formItem = ref(null);
const formIsDialogOpen = ref(false);
const formIsLoading = ref(false);
const formRef = ref(null);

const catalogOptions = [
  { key: "custom_offices", label: "Aduanas" },
  { key: "invoice_types", label: "Tipos de factura" },
  { key: "document_types", label: "Tipos de documento" },
  { key: "expense_types", label: "Tipos de gasto" },
];

const catalogKey = ref(catalogOptions[0].key);

const catalogLabel = computed(() => {
  return (
    catalogOptions.find((x) => x.key === catalogKey.value)?.label || "Catálogo"
  );
});

const formTitle = computed(() =>
  `${catalogLabel.value} | DETALLE`.toUpperCase(),
);

const isItemsEmpty = computed(() => items.value.length === 0);

const endpoints = computed(() => ({
  index: () => `${URL_API}/${catalogKey.value}?is_active=1`,
  storeUpdate: (id) => `${URL_API}/${catalogKey.value}/${id}`,
  destroy: (id) => `${URL_API}/${catalogKey.value}/${id}`,
}));

const headers = computed(() => [
  { title: "#", key: "key", filterable: false, sortable: false, width: 60 },
  { title: "Nombre", key: "name" },
  { title: "", key: "action", filterable: false, sortable: false, width: 60 },
]);

const getItems = async () => {
  isLoading.value = true;
  items.value = [];

  try {
    const response = await axios.get(
      endpoints.value.index(),
      getHdrs(store.getAuth?.token),
    );

    items.value = getRsp(response).data.items || [];
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

const formOpenDialog = (item) => {
  formItem.value = item;
  formIsDialogOpen.value = true;
  formIsLoading.value = false;
};

const formSubmit = async () => {
  const { valid } = await formRef.value?.validate();
  if (!valid) return;

  const confirmed = await confirm?.show("¿Confirma editar registro?");
  if (!confirmed) return;

  formIsLoading.value = true;

  try {
    const payload = getObj(formItem.value, false);

    const response = getRsp(
      await axios.post(
        endpoints.value.storeUpdate(formItem.value.id),
        payload,
        getHdrs(store.getAuth?.token),
      ),
    );

    alert?.show("success", response.msg);
    formIsDialogOpen.value = false;

    await getItems();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    formIsLoading.value = false;
  }
};

const formDelete = async () => {
  const confirmed = await confirm?.show("¿Confirma inactivar el registro?");
  if (!confirmed) return;

  formIsLoading.value = true;

  try {
    const response = getRsp(
      await axios.delete(
        endpoints.value.destroy(formItem.value.id),
        getHdrs(store.getAuth?.token),
      ),
    );

    alert?.show("orange-darken-1", response.msg);
    formIsDialogOpen.value = false;

    await getItems();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    formIsLoading.value = false;
  }
};

watch(
  () => catalogKey.value,
  async () => {
    search.value = "";
    formIsDialogOpen.value = false;
    await getItems();
  },
);

onMounted(() => {
  getItems();
});
</script>
