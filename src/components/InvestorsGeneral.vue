<template>
  <v-col cols="12">
    <v-card>
      <v-card-title>
        <v-row dense>
          <v-col cols="11">
            <CardTitle :text="'DATOS GENERALES | ' + item.uiid" sub />
          </v-col>
          <v-col cols="1" class="text-right" />
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col cols="12" md="6">
            <VisVal label="Nombre" :value="item.name" />
          </v-col>
          <v-col cols="12" md="3">
            <VisVal
              label="Apellido paterno"
              :value="item.paternal_surname"
            />
          </v-col>
          <v-col cols="12" md="3">
            <VisVal
              label="Apellido materno"
              :value="item.maternal_surname"
            />
          </v-col>
          <v-col cols="12" md="6">
            <VisVal label="Tipo" :value="item.investor_type.name" />
          </v-col>
          <v-col cols="12" md="3">
            <VisVal label="Teléfono" :value="item.phone" />
          </v-col>
          <v-col cols="12" md="3">
            <VisVal label="E-mail" :value="item.email" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script setup>
import CardTitle from "@/components/CardTitle.vue";
import VisVal from "@/components/VisVal.vue";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});
</script>