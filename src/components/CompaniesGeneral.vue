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
              v-if="[1, 4].includes(store.getAuth?.user?.role_id)"
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
          <v-col cols="12" md="9">
            <VisVal label="Nombre comercial" :value="item.name" />
          </v-col>
          <v-col cols="12" md="3">
            <VisDoc label="Logo" :value="item.logo_b64" img />
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
import VisDoc from "@/components/VisDoc.vue";

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
