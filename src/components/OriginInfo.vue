<template>
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
            <VisVal label="Procedencia" :value="item.origin_type?.name" />
          </v-col>

          <v-col v-if="item.origin_type_id > 1" cols="12" md="3">
            <VisVal label="Pedimento" :value="item.pediment_number" />
          </v-col>

          <v-col v-if="item.origin_type_id > 1" cols="12" md="3">
            <VisVal label="Fecha" :value="item.pediment_date" />
          </v-col>

          <v-col v-if="item.origin_type_id > 1" cols="12" md="3">
            <VisVal label="Aduana" :value="item.custom_office?.name" />
          </v-col>

          <v-col v-if="item.origin_type_id > 1" cols="12" md="12">
            <VisVal label="Observaciones" :value="item.pediment_notes" />
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