<template>
  <div>
    <div v-if="lab" :class="['font-weight-light', 'text-caption']">
      {{ lab }}
    </div>
    <div v-if="val">
      {{ val ?? '-' }}
    </div>
    <div v-if="sub" class="text-caption">
      <small>{{ sub }}</small>
    </div>
  </div>
</template>

<script setup>
defineProps({
  lab: String,
  val: [String, Number, Boolean],
  sub: String,
})
</script>
