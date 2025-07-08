<template>
  <span :class="'font-weight-light ' + (sub ? 'text-caption' : 'text-subtitle-1')">
    <v-icon v-if="icon" :size="sub ? 'small' : ''" :icon="icon" class="ml-1" />
    {{ text }}
  </span>
</template>

<script setup>
defineProps({
  text: String,
  icon: String,
  sub: Boolean,
})
</script>
