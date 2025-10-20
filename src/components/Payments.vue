<template>
  <v-col cols="12">
    <v-card>
      <v-card-title>
        <CardTitle text="PAGOS" sub />
      </v-card-title>
      <v-card-text>
        <v-table>
          <thead>
            <tr>
              <th class="text-left">Banco</th>
              <th class="text-left">Titular</th>
              <th class="text-left">Clabe</th>
              <th class="text-left">Cuenta</th>
              <th class="text-left">Monto</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(payment, i) in item.payments" :key="i">
              <td>{{ payment.bank.name }}</td>
              <td>{{ payment.holder }}</td>
              <td>{{ payment.clabe }}</td>
              <td>{{ payment.account }}</td>
              <td>{{ payment.amount }}</td>
            </tr>
          </tbody>
        </v-table>
        <v-row dense class="mt-4">
          <v-col cols="12" md="3">
            <VisVal label="Fecha Límite de Pago" :value="item.due_date" />
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