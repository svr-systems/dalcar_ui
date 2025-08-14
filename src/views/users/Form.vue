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
                      :text="`GENERAL${
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
                  <v-col cols="12" md="3">
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
                      v-model="item.surname_p"
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
                      label="A. materno*"
                      v-model="item.surname_m"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="25"
                      counter
                      :rules="rules.textOptional"
                    />
                  </v-col>
                  <v-col cols="12" md="3" class="d-flex">
                    <v-file-input
                      label="Fotografía*"
                      v-model="item.avatar_doc"
                      variant="outlined"
                      density="compact"
                      prepend-icon=""
                      show-size
                      accept=".jpg,.jpeg,.png"
                      :rules="rules.imageOptional"
                      :disabled="item.avatar_dlt"
                    />
                    <div v-if="!isStoreMode && item.avatar && !item.avatar_doc">
                      <BtnDwd
                        :value="item.avatar_b64"
                        :disabled="item.avatar_dlt"
                      />
                      <v-btn
                        icon
                        variant="text"
                        size="small"
                        :color="item.avatar_dlt ? 'error' : undefined"
                        @click.prevent="item.avatar_dlt = !item.avatar_dlt"
                      >
                        <v-icon size="small">
                          mdi-delete{{ item.avatar_dlt ? "-off" : "" }}
                        </v-icon>
                        <v-tooltip activator="parent" location="bottom">
                          {{
                            item.avatar_dlt
                              ? "Revertir eliminación"
                              : "Eliminar"
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
                    <CardTitle text="CUENTA" sub />
                  </v-col>
                  <v-col cols="1" class="text-right" />
                </v-row>
              </v-card-title>
              <v-card-text>
                <v-row dense>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="E-mail"
                      v-model="item.email"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="65"
                      counter
                      :rules="rules.emailRequired"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-select
                      label="Rol"
                      v-model="item.role_id"
                      variant="outlined"
                      density="compact"
                      :items="roles"
                      item-title="name"
                      item-value="id"
                      :rules="rules.required"
                      :loading="rolesLoading"
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
import { getObj, getFormData } from "@/utils/helpers";
import { getUserObj } from "@/utils/objects";

// Componentes
import BtnBack from "@/components/BtnBack.vue";
import CardTitle from "@/components/CardTitle.vue";
import BtnDwd from "@/components/BtnDwd.vue";

// Constantes fijas
const routeName = "users";

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
const roles = ref([]);
const rolesLoading = ref(true);

// Obtener catálogos
const getCatalogs = async () => {
  let endpoint = null;
  let response = null;

  try {
    // endpoint = `${URL_API}/system/roles`;
    // response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    const response = {
      data: {
        msg: "Registros retornados correctamente",
        data: {
          items: [
            {
              id: 1,
              name: "ADMIN",
            },
            {
              id: 2,
              name: "USUARIO",
            },
            {
              id: 3,
              name: "CONTABILIDAD",
            },
            {
              id: 4,
              name: "VENTAS",
            },
          ],
        },
      },
    };
    roles.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    rolesLoading.value = false;
  }
};

// Obtener datos
const getItem = async () => {
  if (isStoreMode.value) {
    item.value = getUserObj();
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
              id: 2,
              active: 1,
              created_at: "2025-07-31 17:31:16",
              updated_at: "2025-08-06 20:57:17",
              created_by_id: 1,
              updated_by_id: 1,
              email_verified_at: null,
              name: "VENTAS",
              surname_p: "DALCAR",
              surname_m: null,
              email: "ventas@dalcar.mx",
              role_id: 2,
              avatar: "VZ8urxwznYXXQArArAMmGiNESxi0udCzzPUkqfltPGs.png",
              uiid: "U-0002",
              created_by: {
                email: "samuel@svr.mx",
              },
              updated_by: {
                email: "samuel@svr.mx",
              },
              full_name: "VENTAS DALCAR",
              role: {
                name: "USUARIO",
              },
              avatar_b64: {
                cnt: "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",
                ext: "png",
              },
              avatar_doc: null,
              avatar_dlt: false,
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
    //     getFormData(payload),
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
