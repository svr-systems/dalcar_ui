<template>
  <v-card elevation="24" :disabled="isLoading" :loading="isLoading">
    <v-card-title>
      <v-row dense>
        <v-col cols="10">
          <BtnBack
            :route="{
              name: routeName + (!isStoreMode ? '/show' : ''),
              params: !isStoreMode ? { id: route.params.id } : undefined,
            }"
          />
          <CardTitle :text="route.meta.title" :icon="route.meta.icon" />
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
                  <v-col cols="12" md="3">
                    <v-text-field
                      :label="
                        'Subtotal ' + getAmountFormat(item.subtotal_amount)
                      "
                      v-model="item.subtotal_amount"
                      type="number"
                      variant="outlined"
                      density="compact"
                      min="0"
                      :rules="rules.required"
                      autocomplete="off"
                      @update:modelValue="updateTotalAmount()"
                    />
                  </v-col>

                  <v-col cols="12" md="3">
                    <v-text-field
                      :label="
                        'Comisión ' + getAmountFormat(item.commission_amount)
                      "
                      v-model="item.commission_amount"
                      type="number"
                      variant="outlined"
                      density="compact"
                      min="0"
                      :rules="rules.required"
                      autocomplete="off"
                      @update:modelValue="updateTotalAmount()"
                    />
                  </v-col>

                  <v-col cols="12" md="3">
                    <v-text-field
                      :label="
                        'Garantía ' + getAmountFormat(item.warranty_amount)
                      "
                      v-model="item.warranty_amount"
                      type="number"
                      variant="outlined"
                      density="compact"
                      min="0"
                      :rules="rules.required"
                      autocomplete="off"
                      @update:modelValue="updateTotalAmount()"
                    />
                  </v-col>

                  <v-col cols="12" md="3" class="pt-0">
                    <div
                      class="text-caption font-weight-light text-medium-emphasis"
                    >
                      Total a pagar
                    </div>
                    <div class="text-body-1">
                      <b>{{ getAmountFormat(item.total_amount) }}</b>
                    </div>
                  </v-col>

                  <v-col cols="12" md="3">
                    <InpDate
                      label="Fecha de compra"
                      v-model="item.order_date"
                      :rules="rules.required"
                      :before="true"
                    />
                  </v-col>

                  <v-col cols="12" md="9">
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
                        !isStoreMode ||
                        item.subtotal_amount == null ||
                        item.commission_amount == null ||
                        item.warranty_amount == null ||
                        item.order_date == null
                      "
                      @update:modelValue="getVendor"
                    />
                  </v-col>
                </v-row>

                <v-row v-if="vendor" dense>
                  <v-col cols="12" md="3">
                    <InpDate
                      label="Fecha límite de pago"
                      v-model="item.due_date"
                      :rules="rules.required"
                      :after="true"
                    />
                  </v-col>

                  <v-col v-if="vendor.requires_reference" cols="12" md="3">
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
                    md="3"
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

                <v-divider class="my-3" />

                <!-- PAGOS POR CUENTA -->
                <v-row v-if="vendor && !vendor.uses_payment_link" dense>
                  <v-col cols="12">
                    <CardTitle text="PAGOS" sub />
                  </v-col>

                  <v-col cols="12">
                    <v-table density="compact" striped="even">
                      <thead
                        class="font-weight-light text-caption text-medium-emphasis"
                      >
                        <tr>
                          <th>Banco</th>
                          <th>Titular</th>
                          <th>CLABE</th>
                          <th>Cuenta</th>
                          <th>Convenio CIE</th>
                          <th>Comisión</th>
                          <th>Monto a pagar</th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr
                          v-for="(
                            purchase_order_payment, i
                          ) in item.purchase_order_payments"
                          :key="i"
                        >
                          <td>{{ purchase_order_payment.bank.name }}</td>
                          <td>{{ purchase_order_payment.account_holder }}</td>
                          <td>{{ purchase_order_payment.clabe_number }}</td>
                          <td>{{ purchase_order_payment.account_number }}</td>
                          <td>{{ purchase_order_payment.cie_code }}</td>
                          <td>
                            <v-icon
                              size="12"
                              :color="
                                purchase_order_payment.is_commission
                                  ? 'info'
                                  : ''
                              "
                            >
                              mdi-checkbox-blank-circle{{
                                purchase_order_payment.is_commission
                                  ? ""
                                  : "-outline"
                              }}
                            </v-icon>
                          </td>
                          <td>
                            <v-text-field
                              :label="
                                getAmountFormat(purchase_order_payment.amount)
                              "
                              v-model="purchase_order_payment.amount"
                              type="number"
                              variant="outlined"
                              density="compact"
                              hide-details
                              min="0"
                              :max="item.total_amount"
                              :rules="rules.required"
                              autocomplete="off"
                              class="py-2"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </v-table>
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
                :loading="isLoading"
                :disabled="
                  vendor == null ||
                  (!vendor.uses_payment_link &&
                    item.purchase_order_payments.length === 0)
                "
                @click.prevent="handleAction"
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

const getCatalogs = async () => {
  vendorsLoading.value = true;

  try {
    const endpoint = `${URL_API}/vendors?is_active=1&filter=0`;
    const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    vendors.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    vendorsLoading.value = false;
  }
};

const getItem = async () => {
  if (isStoreMode.value) {
    item.value = {
      branch_id: 1,
      subtotal_amount: null,
      commission_amount: null,
      warranty_amount: null,
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
    return;
  }

  try {
    const endpoint = `${URL_API}/${routeName}/${itemId.value}`;
    const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    item.value = getRsp(response).data.item;

    await getVendor();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

const getVendor = async () => {
  if (!item.value?.vendor_id) return;

  isLoading.value = true;

  try {
    const endpoint = `${URL_API}/${routeName}/vendor`;
    const response = await axios.get(endpoint, {
      params: {
        id: item.value.vendor_id,
        subtotal_amount: item.value.subtotal_amount,
        commission_amount: item.value.commission_amount,
        warranty_amount: item.value.warranty_amount,
        order_date: item.value.order_date,
      },
      ...getHdrs(store.getAuth?.token),
    });

    const data = getRsp(response).data;

    vendor.value = data.item.vendor;

    if (isStoreMode.value) {
      item.value.due_date = data.item.due_date;
      item.value.purchase_order_payments = data.item.purchase_order_payments;
    }
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

const handleAction = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) {
    alert?.show("red-darken-1", "Corrija los detalles señalados");
    return;
  }

  const confirmed = await confirm?.show(
    `¿Confirma ${isStoreMode.value ? "agregar" : "editar"} registro?`,
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
        getHdrs(store.getAuth?.token, true),
      ),
    );

    alert?.show("success", response.msg);

    router.push({
      name: `${routeName}/show`,
      params: {
        id: getEncodeId(
          isStoreMode.value ? response.data.item.id : itemId.value,
        ),
      },
    });
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

const updateTotalAmount = () => {
  if (!item.value) return;

  const subtotal_amount = Number(item.value.subtotal_amount || 0);
  const commission_amount = Number(item.value.commission_amount || 0);
  const warranty_amount = Number(item.value.warranty_amount || 0);

  const total_amount = subtotal_amount + commission_amount - warranty_amount;
  item.value.total_amount = total_amount.toFixed(2);
};

onMounted(() => {
  getCatalogs();
  getItem();
});
</script>
