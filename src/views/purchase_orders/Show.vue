<template>
  <v-card :disabled="isLoading">
    <v-card-title>
      <v-row dense>
        <v-col cols="10">
          <BtnBack :route="{ name: routeName }" />
          <CardTitle :text="route.meta.title" :icon="route.meta.icon" />
        </v-col>

        <v-col v-if="item" cols="2" class="text-right" />
      </v-row>
    </v-card-title>

    <v-card-text>
      <v-row>
        <v-col v-if="item && !item.is_active" cols="12">
          <v-alert
            text="Registro eliminado"
            type="error"
            variant="tonal"
            density="compact"
          />
        </v-col>
        <v-col cols="12">
          <v-card :loading="isLoading">
            <v-card-title class="d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <CardTitle :text="'DETALLE | ' + (item?.uiid || '')" sub />
              </div>

              <div class="d-flex align-center ga-1">
                <v-btn
                  v-if="item && !item.is_active"
                  icon
                  variant="outlined"
                  size="x-small"
                  density="comfortable"
                  color="success"
                  @click.prevent="restoreItem"
                >
                  <v-icon>mdi-refresh</v-icon>
                  <v-tooltip activator="parent" location="left">
                    Activar
                  </v-tooltip>
                </v-btn>

                <v-btn
                  v-if="
                    item &&
                    item.is_active &&
                    !item.paid_at &&
                    store.getAuth?.user?.role_id === 1
                  "
                  icon
                  variant="outlined"
                  size="x-small"
                  density="comfortable"
                  @click.prevent="deleteItem"
                >
                  <v-icon>mdi-minus</v-icon>
                  <v-tooltip activator="parent" location="left">
                    Eliminar
                  </v-tooltip>
                </v-btn>

                <BtnRecordInfo
                  v-if="item && store.getAuth?.user?.role_id === 1"
                  :item="item"
                />

                <v-btn
                  v-if="item && item.is_active && !item.paid_at"
                  icon
                  variant="outlined"
                  size="x-small"
                  density="comfortable"
                  :to="{
                    name: `${routeName}/update`,
                    params: { id: getEncodeId(itemId) },
                  }"
                >
                  <v-icon>mdi-pencil</v-icon>
                  <v-tooltip activator="parent" location="left">
                    Editar
                  </v-tooltip>
                </v-btn>
              </div>
            </v-card-title>

            <v-card-text>
              <v-row dense>
                <v-col cols="12" md="4">
                  <VisVal label="Fecha de compra" :value="item?.order_date" />
                </v-col>

                <v-col cols="12" md="4">
                  <VisVal
                    label="Total a pagar"
                    :value="getAmountFormat(item?.total_amount)"
                  />
                </v-col>

                <v-col cols="12" md="4">
                  <VisVal label="Proveedor" :value="item?.vendor.name" />
                </v-col>

                <v-col cols="12" md="4">
                  <VisVal
                    label="Fecha límite de pago"
                    :value="item?.due_date"
                    :class="
                      item && !item.paid_at
                        ? item.days_remaining < 1
                          ? 'text-red'
                          : item.days_remaining < 3
                            ? 'text-orange'
                            : ''
                        : ''
                    "
                  />
                </v-col>

                <v-col v-if="item?.reference" cols="12" md="4">
                  <VisVal label="Referencia" :value="item?.reference" />
                </v-col>

                <v-col v-if="item?.statement_path" cols="12" md="4">
                  <BtnFilePreview
                    label="Estado de cuenta"
                    :doc="item?.statement_b64"
                    tooltip="Ver"
                  />
                </v-col>

                <v-col cols="12">
                  <VisVal label="Observaciones" :value="item?.note" />
                </v-col>
              </v-row>

              <v-divider class="my-3" />

              <v-row dense>
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

                    <tbody v-if="item">
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
                              purchase_order_payment.is_commission ? 'info' : ''
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
                          {{ getAmountFormat(purchase_order_payment.amount) }}
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
          <PurchaseOrderVehicles
            :purchase_order_id="itemId"
            :purchase_order_vehicles_amount="purchaseOrderVehiclesAmount"
            :total_amount_pending="isTotalAmountPending"
            @closed="handleChildClosed"
          />
        </v-col>

        <v-col cols="12">
          <PurchaseOrderReceipts
            :purchase_order_id="itemId"
            :total_amount_pending="isTotalAmountPending"
            @closed="handleChildClosed"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, inject, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";

import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getHdrs, getErr, getRsp } from "@/utils/http";
import { getDecodeId, getEncodeId } from "@/utils/coders";
import { getAmountFormat } from "@/utils/formatters";

import BtnBack from "@/components/BtnBack.vue";
import CardTitle from "@/components/CardTitle.vue";
import VisVal from "@/components/VisVal.vue";
import BtnFilePreview from "@/components/BtnFilePreview.vue";
import BtnRecordInfo from "@/components/BtnRecordInfo.vue";
import PurchaseOrderReceipts from "@/views/purchase_orders/purchaseOrderReceipts.vue";
import PurchaseOrderVehicles from "./PurchaseOrderVehicles.vue";

const routeName = "purchase_orders";

const alert = inject("alert");
const confirm = inject("confirm");
const store = useStore();
const router = useRouter();
const route = useRoute();

const itemId = ref(getDecodeId(route.params.id));
const isLoading = ref(true);
const item = ref(null);

const purchaseOrderVehiclesAmount = computed(
  () => item.value?.purchase_order_vehicles_amount ?? 0,
);

const isTotalAmountPending = computed(
  () => item.value?.total_amount_pending ?? true,
);

const handleChildClosed = (payload) => {
  if (payload?.refresh) {
    getItem();
  }
};

const getItem = async () => {
  item.value = null;
  isLoading.value = true;

  try {
    const endpoint = `${URL_API}/${routeName}/${itemId.value}`;
    const response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    item.value = getRsp(response).data.item;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

const deleteItem = async () => {
  const confirmed = await confirm?.show("¿Confirma eliminar el registro?");
  if (!confirmed) return;

  isLoading.value = true;

  try {
    const endpoint = `${URL_API}/${routeName}/${itemId.value}`;
    const response = getRsp(
      await axios.delete(endpoint, getHdrs(store.getAuth?.token)),
    );

    alert?.show("warning", response.msg);
    router.push({ name: routeName });
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

const restoreItem = async () => {
  const confirmed = await confirm?.show("¿Confirma activar el registro?");
  if (!confirmed) return;

  isLoading.value = true;

  try {
    const endpoint = `${URL_API}/${routeName}/restore`;
    const response = getRsp(
      await axios.post(
        endpoint,
        { id: itemId.value },
        getHdrs(store.getAuth?.token),
      ),
    );

    item.value = response.data.item;
    alert?.show("success", response.msg);
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  getItem();
});
</script>
