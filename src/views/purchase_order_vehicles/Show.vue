<template>
  <v-card :loading="isLoading">
    <v-card-title>
      <v-row dense>
        <v-col cols="11">
          <BtnBack
            :route="{
              name: routeName,
              params: {
                purchase_order_id: getEncodeId(purchaseOrderId),
              },
            }"
          />
          <CardTitle :text="route.meta.title" :icon="route.meta.icon" />
        </v-col>
        <v-col v-if="item" cols="1" class="text-right">
          <v-btn
            v-if="item.is_active"
            icon
            variant="flat"
            size="x-small"
            color="warning"
            :to="{
              name: `${routeName}/update`,
              params: {
                purchase_order_id: getEncodeId(purchaseOrderId),
                id: getEncodeId(itemId),
              },
            }"
          >
            <v-icon>mdi-pencil</v-icon>
            <v-tooltip activator="parent" location="left">Editar</v-tooltip>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-title>

    <v-card-text v-if="item">
      <v-row>
        <v-col v-if="!item.is_active" cols="12">
          <v-alert type="error" density="compact" class="rounded">
            <v-row dense>
              <v-col class="grow pt-2">El registro se encuentra inactivo</v-col>
              <v-col
                v-if="store.getAuth?.user?.role_id === 1"
                class="shrink text-right"
              >
                <v-btn
                  icon
                  variant="flat"
                  size="x-small"
                  color="success"
                  @click.prevent="restoreItem"
                >
                  <v-icon>mdi-delete-restore</v-icon>
                  <v-tooltip activator="parent" location="left">
                    Reactivar
                  </v-tooltip>
                </v-btn>
              </v-col>
            </v-row>
          </v-alert>
        </v-col>

        <v-col cols="12">
          <v-card>
            <v-card-title>
              <v-row dense>
                <v-col cols="11">
                  <CardTitle :text="`AUTO | ${item?.vehicle.uiid}`" sub />
                </v-col>
                <v-col cols="1" class="text-right">
                  <v-btn
                    v-if="store.getAuth?.user?.role_id === 1"
                    icon
                    variant="flat"
                    size="x-small"
                    @click.prevent="regDialog = true"
                  >
                    <v-icon>mdi-clock-outline</v-icon>
                    <v-tooltip activator="parent" location="left">
                      Registro
                    </v-tooltip>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-title>

            <v-card-text>
              <v-row dense>
                <v-col cols="12" md="3">
                  <VisVal
                    label="Marca"
                    :value="
                      item.vehicle.vehicle_version.vehicle_model.vehicle_brand
                        .name
                    "
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal
                    label="Modelo"
                    :value="item.vehicle.vehicle_version.vehicle_model.name"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal
                    label="Año"
                    :value="item.vehicle.vehicle_version.model_year"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal
                    label="Versión"
                    :value="item.vehicle.vehicle_version.name"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal
                    label="Color"
                    :value="item.vehicle.vehicle_color.name"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal
                    label="Transmisión"
                    :value="item.vehicle.vehicle_transmission.name"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal label="Transmisión" :value="item.vehicle.vin" />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal label="Motor" :value="item.vehicle.engine_number" />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal label="REPUVE" :value="item.vehicle.repuve" />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal
                    label="Clave vehicular"
                    :value="item.vehicle.vehicle_key"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal
                    label="Número de pasajeros"
                    :value="item.vehicle.passenger_capacity"
                  />
                </v-col>

                <v-col cols="12">
                  <VisVal label="Observaciones" :value="item.vehicle.notes" />
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
                  <CardTitle text="PROCEDENCIA" sub />
                </v-col>
                <v-col cols="1" class="text-right" />
              </v-row>
            </v-card-title>

            <v-card-text>
              <v-row dense>
                <v-col cols="12" md="3">
                  <VisVal
                    label="Procedencia"
                    :value="item.vehicle.origin_type.name"
                  />
                </v-col>

                <v-col v-if="item.vehicle.origin_type_id > 1" cols="12" md="3">
                  <VisVal
                    label="Pedimento"
                    :value="item.vehicle.pediment_number"
                  />
                </v-col>

                <v-col v-if="item.vehicle.origin_type_id > 1" cols="12" md="3">
                  <VisVal label="Fecha" :value="item.vehicle.pediment_date" />
                </v-col>

                <v-col v-if="item.vehicle.origin_type_id > 1" cols="12" md="3">
                  <VisVal
                    label="Aduana"
                    :value="item.vehicle.custom_office.name"
                  />
                </v-col>

                <v-col v-if="item.vehicle.origin_type_id > 1" cols="12">
                  <VisVal
                    label="Observaciones"
                    :value="item.vehicle.pediment_notes"
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
                  <CardTitle text="PAGO" sub />
                </v-col>
                <v-col cols="1" class="text-right" />
              </v-row>
            </v-card-title>

            <v-card-text>
              <v-row dense>
                <v-col cols="12" md="3">
                  <VisVal
                    label="Monto factura "
                    :value="getAmountFormat(item.invoice_amount)"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal
                    label="Comisión"
                    :value="getAmountFormat(item.commission_amount)"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal
                    label="Precio Compra"
                    :value="getAmountFormat(item.purchase_price)"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal label="IVA" :value="item.vat_type.name" />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col
          v-if="item.is_active && store.getAuth?.user?.role_id === 1"
          cols="12"
        >
          <v-btn
            icon
            variant="flat"
            size="x-small"
            color="red-darken-1"
            @click.prevent="deleteItem"
          >
            <v-icon>mdi-minus-thick</v-icon>
            <v-tooltip activator="parent" location="right">Inactivar</v-tooltip>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>

    <DlgReg v-model="regDialog" :item="item" />
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
import { getAmountFormat } from "@/utils/formatters";

import BtnBack from "@/components/BtnBack.vue";
import CardTitle from "@/components/CardTitle.vue";
import DlgReg from "@/components/DlgReg.vue";
import VisVal from "@/components/VisVal.vue";

const routeName = "purchase_order_vehicles";

const alert = inject("alert");
const confirm = inject("confirm");
const store = useStore();
const router = useRouter();
const route = useRoute();

const purchaseOrderId = ref(getDecodeId(route.params.purchase_order_id));
const itemId = ref(getDecodeId(route.params.id));
const isLoading = ref(true);
const item = ref(null);
const regDialog = ref(false);

const getItem = async () => {
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
  const confirmed = await confirm?.show("¿Confirma inactivar el registro?");
  if (!confirmed) return;

  isLoading.value = true;
  try {
    const endpoint = `${URL_API}/${routeName}/${itemId.value}`;
    const response = getRsp(
      await axios.delete(endpoint, getHdrs(store.getAuth?.token))
    );
    alert?.show("success", response.msg);
    router.push({
      name: routeName,
      params: { purchase_order_id: purchaseOrderId.value },
    });
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
    const endpoint = `${URL_API}/${routeName}/${itemId.value}/restore`;
    const response = getRsp(
      await axios.post(
        endpoint,
        { id: itemId.value },
        getHdrs(store.getAuth?.token)
      )
    );
    item.value.is_active = 1;
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
