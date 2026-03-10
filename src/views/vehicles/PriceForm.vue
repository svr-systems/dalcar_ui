<template>
  <v-btn
    icon
    :variant="variant"
    :size="size"
    density="comfortable"
    @click="formOpenDialog"
  >
    <v-icon>mdi-currency-usd</v-icon>
    <v-tooltip activator="parent" location="left">
      {{ tooltip }}
    </v-tooltip>
  </v-btn>

  <v-dialog
    v-model="formIsDialogOpen"
    transition="dialog-bottom-transition"
    scrim="black"
    max-width="400"
    persistent
  >
    <v-card :disabled="formIsLoading" :loading="formIsLoading">
      <v-card-title class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <CardTitle text="EDITAR" sub />
        </div>

        <v-btn
          icon
          variant="outlined"
          size="x-small"
          density="comfortable"
          @click="formIsDialogOpen = false"
        >
          <v-icon>mdi-close</v-icon>
          <v-tooltip activator="parent" location="left"> Cerrar </v-tooltip>
        </v-btn>
      </v-card-title>

      <v-card-text v-if="formItem">
        <v-form ref="formRef" @submit.prevent>
          <v-row dense>
            <v-col cols="12">
              <VisVal
                label="Precio compra"
                :value="
                  getAmountFormat(
                    formItem?.purchase_order_vehicle?.purchase_price,
                  )
                "
                class="pb-4 ps-4"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                :label="'Precio Venta ' + getAmountFormat(formItem.sale_price)"
                v-model="formItem.sale_price"
                type="number"
                variant="outlined"
                density="compact"
                min="0"
                autocomplete="off"
              />
            </v-col>
          </v-row>

          <v-row dense>
            <v-col cols="12" class="d-flex align-center justify-end">
              <v-btn
                size="small"
                color="warning"
                :loading="formIsLoading"
                :disabled="formIsLoading"
                @click="formSubmit"
              >
                Guardar
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
import { inject, ref } from "vue";
import axios from "axios";

import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getHdrs, getRsp, getErr } from "@/utils/http";
import { getRules } from "@/utils/validators";
import { getObj } from "@/utils/helpers";
import { getAmountFormat } from "@/utils/formatters";

import CardTitle from "@/components/CardTitle.vue";
import VisVal from "@/components/VisVal.vue";

const routeName = "vehicles";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  tooltip: {
    type: String,
    default: "Editar",
  },
  variant: {
    type: String,
    default: "outlined",
  },
  size: {
    type: String,
    default: "x-small",
  },
});

const emit = defineEmits(["saved"]);

const store = useStore();
const rules = getRules();
const alert = inject("alert");
const confirm = inject("confirm");

const formIsDialogOpen = ref(false);
const formIsLoading = ref(false);
const formRef = ref(null);
const formItem = ref(null);

// --- Apertura del diálogo ---
const formOpenDialog = () => {
  formItem.value = props.item ? JSON.parse(JSON.stringify(props.item)) : null;
  formIsDialogOpen.value = true;
};

// --- Submit ---
const formSubmit = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) {
    alert?.show("red-darken-1", "Revisa los detalles señalados");
    return;
  }

  const confirmed = await confirm?.show("¿Confirma guardar los cambios?");
  if (!confirmed) return;

  formIsLoading.value = true;
  const payload = getObj(formItem.value);

  try {
    const endpoint = `${URL_API}/${routeName}/${payload.id}/sale_price`;
    const response = getRsp(
      await axios.patch(endpoint, payload, getHdrs(store.getAuth?.token)),
    );

    alert?.show("success", response.msg);

    formIsDialogOpen.value = false;

    emit("saved", { item: payload });
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    formIsLoading.value = false;
  }
};
</script>
