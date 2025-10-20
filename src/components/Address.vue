<template>
  <v-col cols="12">
    <v-card>
      <v-card-title>
        <v-row dense>
          <v-col cols="11">
            <CardTitle text="DOMICILIO" sub />
          </v-col>
          <v-col cols="1" class="text-right" />
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col cols="12" md="8">
            <VisVal
              label="Dirección (calle | núm. exterior | núm. interior)"
              :value="item.address"
            />
          </v-col>
          <v-col cols="12" md="4">
            <VisVal label="Colonia" :value="item.address_neighborhood" />
          </v-col>
          <v-col cols="12" md="4">
            <VisVal label="Código postal" :value="item.address_zip" />
          </v-col>
          <v-col cols="12" md="4">
            <VisVal label="Estado" :value="item.address_town.state.name" />
          </v-col>
          <v-col cols="12" md="4">
            <VisVal label="Municipio" :value="item.address_town.name" />
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