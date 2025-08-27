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
                      v-model="item.name"
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
                      label="A. paterno"
                      v-model="item.p_surname"
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
                      label="A. materno"
                      v-model="item.m_surname"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="50"
                      counter
                      :rules="rules.textOptional"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-autocomplete
                      label="Tipo"
                      v-model="item.type_id"
                      :items="types"
                      :loading="typesLoading"
                      item-value="id"
                      item-title="name"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="Piso %"
                      v-model="item.percent"
                      type="number"
                      variant="outlined"
                      density="compact"
                      maxlength="2"
                      counter
                      :rules="rules.required"
                    />
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
const types = ref([]);
const typesLoading = ref(true);

// Constantes fijas
const routeName = "investors";

// Obtener catálogos
const getCatalogs = async () => {
  let endpoint = null;
  let response = null;

  try {
    // endpoint = `${URL_API}/system/fiscal_regimes`;
    // response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    const response = {
      data: {
        msg: "Registros retornados correctamente",
        data: {
          items: [
            {
              id: 1,
              name: "TIPO 1",
            },
          ],
        },
      },
    };
    types.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    typesLoading.value = false;
  }
};

// Obtener datos
const getItem = async () => {
  if (isStoreMode.value) {
    item.value = {
      id: 1,
      active: true,
      name: null,
      p_surname: null,
      m_surname: null,
      type_id: null,
      percent: null,
    };
    isLoading.value = false;
  } else {
    try {
      // const endpoint = `${URL_API}/system/${routeName}/${itemId.value}`;
      // const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
      const response = {
        data: {
          msg: "Registro retornado correctamente",
          data: {
            item: {
              id: 1,
              active: 1,
              created_at: "2025-07-31 17:31:16",
              updated_at: "2025-08-06 20:57:17",
              created_by_id: 1,
              updated_by_id: 1,
              created_by: {
                email: "samuel@svr.mx",
              },
              updated_by: {
                email: "samuel@svr.mx",
              },
              uiid: "I-0001",
              name: "INVERSIONISTA",
              p_surname: "PRUEBA",
              m_surname: null,
              type_id: 1,
              type: {
                name: "TIPO 1",
              },
              percent: "5",
            },
          },
        },
      };
      item.value = getRsp(response).data.item;
    } catch (err) {
      alert?.show("red-darken-1", getErr(err));
    } finally {
      isLoading.value = false;
    }
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
    // const endpoint = `${URL_API}/system/${routeName}${
    //   !isStoreMode.value ? `/${payload.id}` : ""
    // }`;
    // const response = getRsp(
    //   await axios.post(
    //     endpoint,
    //     payload,
    //     getHdrs(store.getAuth?.token, true)
    //   )
    // );

    // alert?.show("success", response.msg);

    // router.push({
    //   name: `${routeName}/show`,
    //   params: {
    //     id: getEncodeId(isStoreMode.value ? response.data.item.id : itemId.value),
    //   },
    // });

    alert?.show("success", "Registro agregado correctamente");

    router.push({
      name: `${routeName}`,
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
