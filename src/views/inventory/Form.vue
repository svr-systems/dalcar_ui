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
                  <v-col cols="12" md="9">
                    <v-text-field
                      label="Nombre comercial"
                      v-model="item.name"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="50"
                      counter
                      :rules="rules.textRequired"
                    />
                  </v-col>
                  <v-col cols="12" md="3" class="d-flex">
                    <v-file-input
                      label="Logo*"
                      v-model="item.logo_doc"
                      variant="outlined"
                      density="compact"
                      prepend-icon=""
                      show-size
                      accept=".jpg,.jpeg,.png"
                      :rules="rules.imageOptional"
                      :disabled="item.logo_dlt"
                    />
                    <div v-if="!isStoreMode && item.logo && !item.logo_doc">
                      <BtnDwd
                        :value="item.logo_b64"
                        :disabled="item.logo_dlt"
                      />
                      <v-btn
                        icon
                        variant="text"
                        size="small"
                        :color="item.logo_dlt ? 'error' : undefined"
                        @click.prevent="item.logo_dlt = !item.logo_dlt"
                      >
                        <v-icon size="small"
                          >mdi-delete{{ item.logo_dlt ? "-off" : "" }}</v-icon
                        >
                        <v-tooltip activator="parent" location="bottom">
                          {{
                            item.logo_dlt ? "Revertir eliminación" : "Eliminar"
                          }}
                        </v-tooltip>
                      </v-btn>
                    </div>
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
                    <CardTitle text="FISCAL" sub />
                  </v-col>
                  <v-col cols="1" class="text-right" />
                </v-row>
              </v-card-title>
              <v-card-text>
                <v-row dense>
                  <v-col cols="12" md="6">
                    <v-text-field
                      label="Nombre | Razón Social"
                      v-model="item.fiscal_name"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="65"
                      counter
                      :rules="rules.textRequired"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="RFC"
                      v-model="item.fiscal_code"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="13"
                      counter
                      :rules="rules.fiscalCodeRequired"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="Código postal"
                      v-model="item.fiscal_zip"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="5"
                      counter
                      :rules="rules.zipRequired"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-autocomplete
                      label="Regimen fiscal"
                      v-model="item.fiscal_regime_id"
                      :items="fiscalRegimes"
                      :loading="fiscalRegimesLoading"
                      item-value="id"
                      item-title="name"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      label="Dirección (calle | núm. exterior | núm. interior)*"
                      v-model="item.fiscal_address"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="100"
                      counter
                      :rules="rules.textOptional"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      label="Colonia*"
                      v-model="item.fiscal_neighborhood"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="75"
                      counter
                      :rules="rules.textOptional"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-autocomplete
                      label="Estado"
                      v-model="item.fiscal_town.state_id"
                      :items="states"
                      :loading="statesLoading"
                      item-value="id"
                      item-title="name"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-autocomplete
                      label="Municipio"
                      v-model="item.fiscal_town_id"
                      :items="towns"
                      :loading="townsLoading"
                      item-value="id"
                      item-title="name"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" class="pb-5">
                    <v-divider />
                  </v-col>
                  <v-col cols="12" md="4" class="d-flex">
                    <v-file-input
                      label="FIEL .cer*"
                      v-model="item.fiscal_fiel_cer_doc"
                      variant="outlined"
                      density="compact"
                      prepend-icon=""
                      show-size
                      accept=".cer"
                      :rules="rules.fileOptional"
                      :disabled="item.fiscal_fiel_cer_dlt"
                    />
                    <div
                      v-if="
                        !isStoreMode &&
                        item.fiscal_fiel_cer &&
                        !item.fiscal_fiel_cer_doc
                      "
                    >
                      <BtnDwd
                        :value="item.fiscal_fiel_cer_b64"
                        :disabled="item.fiscal_fiel_cer_dlt"
                      />
                      <v-btn
                        icon
                        variant="text"
                        size="small"
                        :color="item.fiscal_fiel_cer_dlt ? 'error' : undefined"
                        @click.prevent="
                          item.fiscal_fiel_cer_dlt = !item.fiscal_fiel_cer_dlt
                        "
                      >
                        <v-icon size="small"
                          >mdi-delete{{
                            item.fiscal_fiel_cer_dlt ? "-off" : ""
                          }}</v-icon
                        >
                        <v-tooltip activator="parent" location="bottom">
                          {{
                            item.fiscal_fiel_cer_dlt
                              ? "Revertir eliminación"
                              : "Eliminar"
                          }}
                        </v-tooltip>
                      </v-btn>
                    </div>
                  </v-col>
                  <v-col cols="12" md="4" class="d-flex">
                    <v-file-input
                      label=".key*"
                      v-model="item.fiscal_fiel_key_doc"
                      variant="outlined"
                      density="compact"
                      prepend-icon=""
                      show-size
                      accept=".cer"
                      :rules="rules.fileOptional"
                      :disabled="item.fiscal_fiel_key_dlt"
                    />
                    <div
                      v-if="
                        !isStoreMode &&
                        item.fiscal_fiel_key &&
                        !item.fiscal_fiel_key_doc
                      "
                    >
                      <BtnDwd
                        :value="item.fiscal_fiel_key_b64"
                        :disabled="item.fiscal_fiel_key_dlt"
                      />
                      <v-btn
                        icon
                        variant="text"
                        size="small"
                        :color="item.fiscal_fiel_key_dlt ? 'error' : undefined"
                        @click.prevent="
                          item.fiscal_fiel_key_dlt = !item.fiscal_fiel_key_dlt
                        "
                      >
                        <v-icon size="small"
                          >mdi-delete{{
                            item.fiscal_fiel_key_dlt ? "-off" : ""
                          }}</v-icon
                        >
                        <v-tooltip activator="parent" location="bottom">
                          {{
                            item.fiscal_fiel_key_dlt
                              ? "Revertir eliminación"
                              : "Eliminar"
                          }}
                        </v-tooltip>
                      </v-btn>
                    </div>
                  </v-col>
                  <v-col cols="12" md="4">
                    <InpPassword
                      label="Clave*"
                      v-model="item.fiscal_fiel_pass"
                      counter
                      :rules="rules.textOptional"
                      autocomplete="new-password"
                    />
                  </v-col>
                  <v-col cols="12" md="4" class="d-flex">
                    <v-file-input
                      label="CSD .cer*"
                      v-model="item.fiscal_csd_cer_doc"
                      variant="outlined"
                      density="compact"
                      prepend-icon=""
                      show-size
                      accept=".cer"
                      :rules="rules.fileOptional"
                      :disabled="item.fiscal_csd_cer_dlt"
                    />
                    <div
                      v-if="
                        !isStoreMode &&
                        item.fiscal_csd_cer &&
                        !item.fiscal_csd_cer_doc
                      "
                    >
                      <BtnDwd
                        :value="item.fiscal_csd_cer_b64"
                        :disabled="item.fiscal_csd_cer_dlt"
                      />
                      <v-btn
                        icon
                        variant="text"
                        size="small"
                        :color="item.fiscal_csd_cer_dlt ? 'error' : undefined"
                        @click.prevent="
                          item.fiscal_csd_cer_dlt = !item.fiscal_csd_cer_dlt
                        "
                      >
                        <v-icon size="small"
                          >mdi-delete{{
                            item.fiscal_csd_cer_dlt ? "-off" : ""
                          }}</v-icon
                        >
                        <v-tooltip activator="parent" location="bottom">
                          {{
                            item.fiscal_csd_cer_dlt
                              ? "Revertir eliminación"
                              : "Eliminar"
                          }}
                        </v-tooltip>
                      </v-btn>
                    </div>
                  </v-col>
                  <v-col cols="12" md="4" class="d-flex">
                    <v-file-input
                      label=".key*"
                      v-model="item.fiscal_csd_key_doc"
                      variant="outlined"
                      density="compact"
                      prepend-icon=""
                      show-size
                      accept=".key"
                      :rules="rules.fileOptional"
                      :disabled="item.fiscal_csd_key_dlt"
                    />
                    <div
                      v-if="
                        !isStoreMode &&
                        item.fiscal_csd_key &&
                        !item.fiscal_csd_key_doc
                      "
                    >
                      <BtnDwd
                        :value="item.fiscal_csd_key_b64"
                        :disabled="item.fiscal_csd_key_dlt"
                      />
                      <v-btn
                        icon
                        variant="text"
                        size="small"
                        :color="item.fiscal_csd_key_dlt ? 'error' : undefined"
                        @click.prevent="
                          item.fiscal_csd_key_dlt = !item.fiscal_csd_key_dlt
                        "
                      >
                        <v-icon size="small"
                          >mdi-delete{{
                            item.fiscal_csd_key_dlt ? "-off" : ""
                          }}</v-icon
                        >
                        <v-tooltip activator="parent" location="bottom">
                          {{
                            item.fiscal_csd_key_dlt
                              ? "Revertir eliminación"
                              : "Eliminar"
                          }}
                        </v-tooltip>
                      </v-btn>
                    </div>
                  </v-col>
                  <v-col cols="12" md="4">
                    <InpPassword
                      label="Clave*"
                      v-model="item.fiscal_csd_pass"
                      counter
                      :rules="rules.textOptional"
                      autocomplete="new-password"
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
                <v-tooltip activator="parent" location="left"
                  >Continuar</v-tooltip
                >
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
import { getDecodeId } from "@/utils/coders";
import { getRules } from "@/utils/validators";
import { getObj, getFormData } from "@/utils/helpers";
import { getUserObj } from "@/utils/objects";

// Componentes
import BtnBack from "@/components/BtnBack.vue";
import CardTitle from "@/components/CardTitle.vue";
import BtnDwd from "@/components/BtnDwd.vue";
import InpPassword from "@/components/InpPassword.vue";

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
const fiscalRegimes = ref([]);
const fiscalRegimesLoading = ref(true);
const states = ref([]);
const statesLoading = ref(true);
const towns = ref([]);
const townsLoading = ref(false);

// Constantes fijas
const routeName = "companies";

// Obtener catálogos
const getCatalogs = async () => {
  let endpoint = null;
  let response = null;

  try {
    endpoint = `${URL_API}/system/fiscal_regimes`;
    response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    fiscalRegimes.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    fiscalRegimesLoading.value = false;
  }

  try {
    endpoint = `${URL_API}/system/states`;
    response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    states.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    statesLoading.value = false;
  }
};

// Obtener datos
const getItem = async () => {
  if (isStoreMode.value) {
    item.value = {
      id: 1,
      active: true,
      name: null,
      logo: null,
      logo_doc: null,
      logo_dlt: false,
      fiscal_name: null,
      fiscal_code: null,
      fiscal_zip: null,
      fiscal_regime_id: null,
      fiscal_address: null,
      fiscal_neighborhood: null,
      fiscal_town: {
        state_id: null,
      },
      fiscal_town_id: null,
      fiscal_fiel_cer: null,
      fiscal_fiel_cer_doc: null,
      fiscal_fiel_cer_dlt: false,
      fiscal_fiel_key: null,
      fiscal_fiel_key_doc: null,
      fiscal_fiel_key_dlt: false,
      fiscal_fiel_pass: null,
      fiscal_csd_cer: null,
      fiscal_csd_cer_doc: null,
      fiscal_csd_cer_dlt: false,
      fiscal_csd_key: null,
      fiscal_csd_key_doc: null,
      fiscal_csd_key_dlt: false,
      fiscal_csd_pass: null,
    };
    isLoading.value = false;
  } else {
    try {
      const endpoint = `${URL_API}/system/${routeName}/${itemId.value}`;
      const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
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
    const endpoint = `${URL_API}/system/${routeName}${
      !isStoreMode.value ? `/${payload.id}` : ""
    }`;
    const response = getRsp(
      await axios.post(
        endpoint,
        getFormData(payload),
        getHdrs(store.getAuth?.token, true)
      )
    );

    alert?.show("success", response.msg);

    router.push({
      name: `${routeName}/show`,
      params: {
        id: btoa(isStoreMode.value ? response.data.item.id : itemId.value),
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
