<template>
  <div>
    <div v-if="label" :class="['font-weight-light', 'text-caption']">
      {{ label }}
    </div>
    <div>
      {{ value ?? '-' }}
    </div>
    <div v-if="subvalue" class="text-caption">
      <small>{{ subvalue }}</small>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: [String, Number, Boolean],
  subvalue: String,
})
</script>
