<template>
  <v-col cols="12">
    <v-card>
      <v-card-title>
        <v-row dense>
          <v-col cols="11">
            <CardTitle text="EMPRESAS" sub />
          </v-col>
          <v-col cols="1" class="text-right" />
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-row
          dense
          v-for="(investor_company, i) of item.investor_companies"
          :key="i"
        >
          <v-col cols="12" md="8">
            <VisVal
              label="Nombre"
              :value="investor_company.company.name"
            />
          </v-col>
          <v-col cols="12" md="4">
            <VisVal
              label="Porcentaje de Piso"
              :value="investor_company.floor_percentage"
            />
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