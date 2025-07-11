<template>
  <span :class="['font-weight-light', sub ? 'text-caption' : 'text-subtitle-1']">
    <v-icon v-if="icon" :icon="icon" :size="sub ? 'small' : undefined" class="ml-1" />
    {{ text }}
  </span>
</template>

<script setup>
defineProps({
  sub: Boolean,
  text: String,
  icon: String,
})
</script>
