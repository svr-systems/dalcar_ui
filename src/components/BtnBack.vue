<template>
  <v-btn size="x-small" icon="mdi-chevron-left" :to="route" />
</template>

<script setup>
defineProps({
  route: Object,
});
</script>
