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
                      :text="`DETALLE ${
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
                  <v-col cols="12" md="4">
                    <InpDate
                      label="Fecha de compra"
                      v-model="item.order_date"
                      :rules="rules.required"
                      :before="true"
                    />
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-text-field
                      :label="
                        'Total a pagar ' + getAmountFormat(item.total_amount)
                      "
                      v-model="item.total_amount"
                      type="number"
                      variant="outlined"
                      density="compact"
                      min="0"
                      :rules="rules.required"
                      autocomplete="off"
                    />
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-autocomplete
                      label="Proveedor"
                      v-model="item.vendor_id"
                      :items="vendors"
                      :loading="vendorsLoading"
                      item-value="id"
                      item-title="name"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                      autocomplete="off"
                      :disabled="
                        item.total_amount == null || item.order_date == null
                      "
                      @update:modelValue="getVendor"
                    />
                  </v-col>
                </v-row>

                <v-row v-if="vendor" dense>
                  <v-col cols="12" md="4">
                    <VisVal
                      label="Fecha limite de pago"
                      :value="item.due_date"
                    />
                  </v-col>

                  <v-col v-if="vendor.requires_reference" cols="12" md="4">
                    <v-text-field
                      label="Referencia"
                      v-model="item.reference"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="40"
                      counter
                      autocomplete="off"
                      :rules="rules.required"
                    />
                  </v-col>

                  <v-col
                    v-if="vendor.requires_statement"
                    cols="12"
                    md="4"
                    class="d-flex"
                  >
                    <v-file-input
                      label="Estado de cuenta"
                      v-model="item.statement_doc"
                      variant="outlined"
                      density="compact"
                      prepend-icon=""
                      show-size
                      accept=".pdf,.jpg,.jpeg,.png"
                      :rules="rules.fileRequired"
                      :disabled="item.statement_dlt"
                    />
                    <div
                      v-if="
                        !isStoreMode &&
                        item.statement_path &&
                        !item.statement_doc
                      "
                    >
                      <BtnDwd
                        :value="item.statement_b64"
                        :disabled="item.statement_dlt"
                      />
                      <v-btn
                        icon
                        variant="text"
                        size="small"
                        :color="item.statement_dlt ? 'error' : undefined"
                        @click.prevent="
                          item.statement_dlt = !item.statement_dlt
                        "
                      >
                        <v-icon size="small">
                          mdi-delete{{ item.statement_dlt ? "-off" : "" }}
                        </v-icon>
                        <v-tooltip activator="parent" location="bottom">
                          {{
                            item.statement_dlt
                              ? "Revertir eliminación"
                              : "Eliminar"
                          }}
                        </v-tooltip>
                      </v-btn>
                    </div>
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      label="Observaciones*"
                      v-model="item.note"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="255"
                      counter
                      :rules="rules.textOptional"
                      autocomplete="off"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col v-if="vendor && !vendor.uses_payment_link" cols="12">
            <v-card>
              <v-card-title>
                <v-row dense>
                  <v-col cols="11">
                    <CardTitle text="PAGOS" sub />
                  </v-col>
                  <v-col cols="1" class="text-right" />
                </v-row>
              </v-card-title>

              <v-card-text>
                <v-row
                  v-for="(
                    purchase_order_payment, i
                  ) in item.purchase_order_payments"
                  :key="i"
                  dense
                >
                  <v-col cols="12" md="2">
                    <VisVal
                      label="Banco"
                      :value="purchase_order_payment.bank.name"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <VisVal
                      label="Titular"
                      :value="purchase_order_payment.account_holder"
                    />
                  </v-col>
                  <v-col cols="12" md="2">
                    <VisVal
                      label="CLABE"
                      :value="purchase_order_payment.clabe_number"
                    />
                  </v-col>
                  <v-col cols="12" md="2">
                    <VisVal
                      label="Cuenta"
                      :value="purchase_order_payment.account_number"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      :label="
                        'Monto a pagar ' +
                        getAmountFormat(purchase_order_payment.amount)
                      "
                      v-model="purchase_order_payment.amount"
                      type="number"
                      variant="outlined"
                      density="compact"
                      min="0"
                      :max="item.total_amount"
                      :rules="rules.required"
                      autocomplete="off"
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
                :disabled="
                  vendor == null ||
                  (!vendor.uses_payment_link &&
                    item.purchase_order_payments.length == 0)
                "
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
import { getDecodeId, getEncodeId } from "@/utils/coders";
import { getRules } from "@/utils/validators";
import { getObj, getFormData } from "@/utils/helpers";
import { getAmountFormat } from "@/utils/formatters";

import BtnBack from "@/components/BtnBack.vue";
import CardTitle from "@/components/CardTitle.vue";
import InpDate from "@/components/InpDate.vue";
import VisVal from "@/components/VisVal.vue";
import BtnDwd from "@/components/BtnDwd.vue";

const routeName = "purchase_orders";

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

const vendors = ref([]);
const vendorsLoading = ref(true);
const vendor = ref(null);

const banks = ref([]);
const banksLoading = ref(true);

const getCatalogs = async () => {
  let endpoint = null;
  let response = null;

  try {
    endpoint = `${URL_API}/vendors?is_active=1&filter=0`;
    response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    vendors.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    vendorsLoading.value = false;
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
      branch_id: 1,
      total_amount: null,
      order_date: null,
      vendor_id: null,
      due_date: null,
      reference: null,
      statement_path: null,
      statement_doc: null,
      statement_dlt: false,
      note: null,
      purchase_order_payments: [],
    };
    isLoading.value = false;
  } else {
    try {
      const endpoint = `${URL_API}/${routeName}/${itemId.value}`;
      const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
      item.value = getRsp(response).data.item;
      getVendor();
    } catch (err) {
      alert?.show("red-darken-1", getErr(err));
    } finally {
      isLoading.value = false;
    }
  }
};

const getVendor = async () => {
  isLoading.value = true;

  try {
    const endpoint = `${URL_API}/${routeName}/vendor`;
    const response = await axios.get(endpoint, {
      params: {
        id: item.value.vendor_id,
        order_date: item.value.order_date,
        total_amount: item.value.total_amount,
      },
      ...getHdrs(store.getAuth?.token),
    });
    vendor.value = getRsp(response).data.item.vendor;
    item.value.due_date = getRsp(response).data.item.due_date;
    item.value.purchase_order_payments =
      getRsp(response).data.item.purchase_order_payments;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

const handleAction = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) {
    alert?.show("red-darken-1", "BtnDwd los detalles señalados");
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
      await axios.post(
        endpoint,
        getFormData(payload),
        getHdrs(store.getAuth?.token, true)
      )
    );

    alert?.show("success", response.msg);

    // router.push({
    //   name: `${routeName}/show`,
    //   params: {
    //     id: getEncodeId(
    //       isStoreMode.value ? response.data.item.id : itemId.value
    //     ),
    //   },
    // });
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
