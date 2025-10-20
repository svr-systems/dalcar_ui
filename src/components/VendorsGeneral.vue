<template>
  <v-col cols="12">
    <v-card>
      <v-card-title>
        <v-row dense>
          <v-col cols="11">
            <CardTitle :text="'DATOS GENERALES | ' + item.uiid" sub />
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
              <v-tooltip activator="parent" location="left">Registro</v-tooltip>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>

      <v-card-text>
        <v-row dense>
          <v-col cols="12" md="6">
            <VisVal label="Nombre" :value="item.name" />
          </v-col>
          <v-col cols="12" md="3">
            <VisVal label="Tipo" :value="item.vendor_type.name" />
          </v-col>
          <v-col cols="12" md="3">
            <VisVal
              label="Días limite de pago"
              :value="item.payment_days"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script setup>
import { useStore } from "@/store";

import CardTitle from "@/components/CardTitle.vue";
import VisVal from "@/components/VisVal.vue";

const store = useStore();

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["show-reg-dialog"]);

const regDialog = () => {
  emit("show-reg-dialog");
};
</script>