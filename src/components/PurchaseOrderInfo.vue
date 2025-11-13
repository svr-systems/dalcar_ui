<template>
  <PurchaseOrdersGeneral :item="item" @show-reg-dialog="$emit('show-reg-dialog')" />
  <Autos :item="item" />
  <Payments :item="item" />
</template>

<script setup>
import PurchaseOrdersGeneral from "@/components/PurchaseOrdersGeneral.vue";
import Autos from "@/components/Autos.vue";
import Payments from "@/components/Payments.vue";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  itemId: {
    type: String,
    required: true,
  },
});

defineEmits(['show-reg-dialog']);
</script>