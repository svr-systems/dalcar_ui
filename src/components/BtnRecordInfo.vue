<template>
  <v-btn
    icon
    :variant="variant"
    :size="size"
    :density="density"
    @click="isOpen = true"
  >
    <v-icon>mdi-clock-outline</v-icon>
    <v-tooltip activator="parent" location="left">
      {{ tooltip }}
    </v-tooltip>
  </v-btn>

  <v-dialog v-model="isOpen" persistent scrim="black" max-width="500">
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <CardTitle text="REGISTRO" sub />
        </div>

        <v-btn
          icon
          variant="outlined"
          size="x-small"
          density="comfortable"
          @click="isOpen = false"
        >
          <v-icon>mdi-close</v-icon>
          <v-tooltip activator="parent" location="left"> Cerrar </v-tooltip>
        </v-btn>
      </v-card-title>

      <v-card-text class="pt-0">
        <v-row dense>
          <v-col cols="6">
            <VisVal
              label="Creación"
              :value="item?.created_by?.email"
              :subvalue="item?.created_at"
            />
          </v-col>

          <v-col cols="6">
            <VisVal
              label="Últ. edición"
              :value="item?.updated_by?.email"
              :subvalue="item?.updated_at"
            />
          </v-col>

          <v-col v-if="item?.email_verified_at" cols="6">
            <VisVal label="Verif." :value="item?.email_verified_at" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from "vue";

import CardTitle from "@/components/CardTitle.vue";
import VisVal from "@/components/VisVal.vue";

const props = defineProps({
  item: {
    type: Object,
    default: null,
  },
  tooltip: {
    type: String,
    default: "Registro",
  },
  variant: {
    type: String,
    default: "outlined",
  },
  size: {
    type: String,
    default: "x-small",
  },
  density: {
    type: String,
    default: "comfortable",
  },
});

const isOpen = ref(false);
</script>
