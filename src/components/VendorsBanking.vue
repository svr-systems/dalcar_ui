<template>
  <v-col cols="12">
    <v-card>
      <v-card-title>
        <v-row dense>
          <v-col cols="11">
            <CardTitle text="INFO. BANCARIA" sub />
          </v-col>
          <v-col cols="1" class="text-right" />
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-row dense v-for="(vendor_bank, i) of item.vendor_banks" :key="i">
          <v-col cols="12" md="4">
            <VisVal label="Banco" :value="vendor_bank.bank.name" />
          </v-col>
          <v-col cols="12" md="4">
            <VisVal label="Titular" :value="vendor_bank.account_holder" />
          </v-col>
          <v-col cols="12" md="4">
            <VisVal label="CLABE" :value="vendor_bank.clabe_number" />
          </v-col>
          <v-col cols="12" md="4">
            <VisVal label="Cuenta" :value="vendor_bank.account_number" />
          </v-col>
          <v-col cols="12" md="4">
            <VisVal label="Convenio CIE*" :value="vendor_bank.cie_code" />
          </v-col>
          <v-col cols="12" md="4">
            <VisVal
              label="¿Para comisiones?"
              :value="vendor_bank.is_commission"
              bool
            />
          </v-col>
          <v-col v-if="item.vendor_banks.length > 1" cols="12">
            <v-divider />
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
