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
                    <v-autocomplete
                      label="Tipo"
                      v-model="item.vendor_type_id"
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
                      label="Días limite de pago"
                      v-model="item.payment_days"
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
            <v-card>
              <v-card-title>
                <v-row dense>
                  <v-col cols="11">
                    <CardTitle text="INFO. BANCARIA" sub />
                  </v-col>
                  <v-col cols="1" class="text-right" />
                </v-row>
              </v-card-title>
              <v-card-text>
                <template
                  v-for="(vendor_bank, i) in item.vendor_banks"
                  :key="i"
                >
                  <v-row dense v-if="vendor_bank.is_active">
                    <v-col cols="12" md="3">
                      <v-autocomplete
                        label="Banco"
                        v-model="vendor_bank.bank_id"
                        :items="banks"
                        :loading="banksLoading"
                        item-value="id"
                        item-title="name"
                        variant="outlined"
                        density="compact"
                        :rules="rules.required"
                      />
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-text-field
                        label="Titular"
                        v-model="vendor_bank.account_holder"
                        type="text"
                        variant="outlined"
                        density="compact"
                        maxlength="100"
                        counter
                        :rules="rules.textRequired"
                      />
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-text-field
                        label="CLABE"
                        v-model="vendor_bank.clabe_number"
                        type="text"
                        variant="outlined"
                        density="compact"
                        maxlength="18"
                        counter
                        :rules="rules.textRequired"
                      />
                    </v-col>
                    <v-col cols="12" md="2">
                      <v-text-field
                        label="Cuenta"
                        v-model="vendor_bank.account_number"
                        type="text"
                        variant="outlined"
                        density="compact"
                        maxlength="20"
                        counter
                        :rules="rules.textRequired"
                      />
                    </v-col>

                    <v-col cols="1" class="text-right pt-2">
                      <v-btn
                        icon
                        variant="text"
                        size="x-small"
                        color="error"
                        @click="bankRemove(i)"
                      >
                        <v-icon size="x-small">mdi-minus</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </template>
                <v-row dense>
                  <v-col cols="12">
                    <v-btn size="x-small" color="warning" @click="bankAdd()">
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
import { ref, inject, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";

import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getHdrs, getErr, getRsp } from "@/utils/http";
import { getDecodeId } from "@/utils/coders";
import { getRules } from "@/utils/validators";
import { getObj } from "@/utils/helpers";

import BtnBack from "@/components/BtnBack.vue";
import CardTitle from "@/components/CardTitle.vue";

const routeName = "vendors";

const alert = inject("alert");
const confirm = inject("confirm");
const store = useStore();
const router = useRouter();
const route = useRoute();

const itemId = ref(route.params.id ? getDecodeId(route.params.id) : null);
const isStoreMode = ref(!itemId.value);
const isLoading = ref(true);
const formRef = ref(null);
const item = ref(null);
const rules = getRules();
const types = ref([]);
const typesLoading = ref(true);
const banks = ref([]);
const banksLoading = ref(true);

const getCatalogs = async () => {
  let endpoint = null;
  let response = null;

  try {
    endpoint = `${URL_API}/vendor_types`;
    response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    types.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    typesLoading.value = false;
  }

  try {
    endpoint = `${URL_API}/banks`;
    response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    banks.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    banksLoading.value = false;
  }
};

const getItem = async () => {
  if (isStoreMode.value) {
    item.value = {
      id: null,
      is_active: 1,
      name: null,
      vendor_type_id: null,
      payment_days: null,
      vendor_banks: [],
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

const bankAdd = async () => {
  item.value.vendor_banks.push({
    id: null,
    is_active: 1,
    vendor_id: null,
    bank_id: null,
    account_holder: null,
    clabe_number: null,
    account_number: null,
  });
};

const bankRemove = async (i) => {
  if (item.value.vendor_banks[i].id === null) {
    item.value.vendor_banks.splice(i, 1);
  } else {
    item.value.vendor_banks[i].is_active = 0;
  }
};

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
        id: btoa(isStoreMode.value ? response.data.item.id : itemId.value),
      },
    });
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  getCatalogs();
  getItem();
});
</script>
