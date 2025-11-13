<template>
  <v-card elevation="24" :disabled="isLoading" :loading="isLoading">
    <v-card-title>
      <v-row dense>
        <v-col cols="10">
          <BtnBack
            :route="{
              name: routeName + (!isStoreMode ? '/show' : ''),
            }"
          />
          <CardTitle :text="$route.meta.title" :icon="$route.meta.icon" />
        </v-col>
        <v-col cols="2" class="text-right" />
      </v-row>
    </v-card-title>

    <v-card-text v-if="item">
      <v-form ref="formRef" @submit.prevent>
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-title>
                <v-row dense>
                  <v-col cols="11">
                    <CardTitle
                      :text="`DATOS GENERALES${
                        isStoreMode ? '' : ' | ' + (item.uiid || '')
                      }`"
                      sub
                    />
                  </v-col>
                  <v-col cols="1" class="text-right" />
                </v-row>
              </v-card-title>
              <v-card-text>
                <v-row dense>
                  <v-col cols="12" md="6">
                    <v-text-field
                      label="Nombre"
                      v-model="item.user.name"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="50"
                      counter
                      :rules="rules.textRequired"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="Apellido paterno"
                      v-model="item.user.paternal_surname"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="25"
                      counter
                      :rules="rules.textRequired"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="Apellido materno*"
                      v-model="item.user.maternal_surname"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="50"
                      counter
                      :rules="rules.textOptional"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      label="Tipo"
                      v-model="item.investor_type_id"
                      :items="investorTypes"
                      :loading="investorTypesLoading"
                      item-value="id"
                      item-title="name"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="Teléfono"
                      v-model="item.user.phone"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="10"
                      counter
                      :rules="rules.phoneRequired"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="E-mail"
                      v-model="item.user.email"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="65"
                      counter
                      :rules="rules.emailRequired"
                    />
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
                    <CardTitle text="EMPRESAS" sub />
                  </v-col>
                  <v-col cols="1" class="text-right" />
                </v-row>
              </v-card-title>
              <v-card-text>
                <v-row
                  dense
                  v-for="(investor_company, i) of item.investor_companies"
                  :key="i"
                >
                  <v-col cols="12" md="8">
                    <v-select
                      label="Nombre"
                      v-model="investor_company.company_id"
                      :items="companies"
                      :loading="companiesLoading"
                      item-value="id"
                      item-title="name"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="Porcentaje de Piso"
                      v-model="investor_company.floor_percentage"
                      type="number"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="1" class="text-center pt-2">
                    <v-btn
                      v-if="i != 0"
                      icon
                      size="x-small"
                      color="error"
                      @click="companyRemove(i)"
                    >
                      <v-icon size="x-small">mdi-minus</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row dense>
                  <v-col cols="12">
                    <v-btn size="x-small" color="warning" @click="companyAdd()">
                      Agregar
                      <v-icon size="x-small" end>mdi-plus</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12">
            <div class="text-right">
              <v-btn
                icon
                variant="flat"
                size="x-small"
                :color="isStoreMode ? 'success' : 'warning'"
                @click.prevent="handleAction"
                :loading="isLoading"
              >
                <v-icon>mdi-check</v-icon>
                <v-tooltip activator="parent" location="left">
                  Continuar
                </v-tooltip>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
// Importaciones de librerías externas
import { ref, inject, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";

// Importaciones internas del proyecto
import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getHdrs, getErr, getRsp } from "@/utils/http";
import { getDecodeId, getEncodeId } from "@/utils/coders";
import { getRules } from "@/utils/validators";
import { getObj } from "@/utils/helpers";
import { getUserObj } from "@/utils/objects";

// Componentes
import BtnBack from "@/components/BtnBack.vue";
import CardTitle from "@/components/CardTitle.vue";

// Estado y referencias
const alert = inject("alert");
const confirm = inject("confirm");
const store = useStore();
const router = useRouter();
const route = useRoute();

// Estado reactivo
const itemId = ref(route.params.id ? getDecodeId(route.params.id) : null);
const isStoreMode = ref(!itemId.value);
const isLoading = ref(true);
const formRef = ref(null);
const item = ref(null);
const rules = getRules();
const investorTypes = ref([]);
const investorTypesLoading = ref(true);
const companies = ref([]);
const companiesLoading = ref(true);

// Constantes fijas
const routeName = "investors";

// Obtener catálogos
const getCatalogs = async () => {
  let endpoint = null;
  let response = null;

  try {
    endpoint = `${URL_API}/investor_types`;
    response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    investorTypes.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    investorTypesLoading.value = false;
  }

  try {
    endpoint = `${URL_API}/companies?is_active=1&filter=0`;
    response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    companies.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    companiesLoading.value = false;
  }
};

// Obtener datos
const getItem = async () => {
  if (isStoreMode.value) {
    item.value = {
      id: null,
      user: getUserObj(),
      investor_type_id: null,
      investor_companies: [
        {
          id: null,
          is_active: 1,
          company_id: null,
          floor_percentage: null,
        },
      ],
    };
    isLoading.value = false;
  } else {
    try {
      const endpoint = `${URL_API}/${routeName}/${itemId.value}`;
      const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
      item.value = getRsp(response).data.item;
    } catch (err) {
      alert?.show("red-darken-1", getErr(err));
    } finally {
      isLoading.value = false;
    }
  }
};

const companyAdd = async () => {
  item.value.investor_companies.push({
    id: null,
    is_active: 1,
    company_id: null,
    floor_percentage: null,
  });
};

const companyRemove = async (i) => {
  if (item.value.investor_companies[i].id === null) {
    item.value.investor_companies.splice(i, 1);
  } else {
    item.value.investor_companies[i].is_active = 0;
  }
};

// Agregar o editar
const handleAction = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) {
    alert?.show("red-darken-1", "Revisa los detalles señalados");
    return;
  }

  const confirmed = await confirm?.show(
    `¿Confirma ${isStoreMode.value ? "agregar" : "editar"} registro?`
  );
  if (!confirmed) return;

  isLoading.value = true;
  const payload = getObj(item.value, isStoreMode.value);

  try {
    const endpoint = `${URL_API}/${routeName}${
      !isStoreMode.value ? `/${payload.id}` : ""
    }`;
    const response = getRsp(
      await axios.post(endpoint, payload, getHdrs(store.getAuth?.token))
    );

    alert?.show("success", response.msg);

    router.push({
      name: `${routeName}/show`,
      params: {
        id: getEncodeId(
          isStoreMode.value ? response.data.item.id : itemId.value
        ),
      },
    });
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

// Inicialización
onMounted(() => {
  getCatalogs();
  getItem();
});
</script>
