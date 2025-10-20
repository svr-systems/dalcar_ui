<template>
  <v-col cols="12">
    <v-card>
      <v-card-title>
        <v-row dense>
          <v-col cols="11">
            <CardTitle :text="'GENERAL | ' + item.uiid" sub />
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
          <v-col cols="12" md="3">
            <VisVal label="Nombre" :value="item.name" />
          </v-col>
          <v-col cols="12" md="3">
            <VisVal label="A. paterno" :value="item.surname_p" />
          </v-col>
          <v-col cols="12" md="3">
            <VisVal label="A. materno" :value="item.surname_m" />
          </v-col>
          <v-col cols="12" md="3">
            <VisDoc label="Fotografía" :value="item.avatar_b64" img />
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