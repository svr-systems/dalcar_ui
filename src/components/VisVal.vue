<template>
  <div>
    <div v-if="lab != 'undefined'" class="font-weight-light text-caption">
      {{ lab }}
    </div>
    <div v-if="val != 'undefined'">
      {{ val ? val : "-" }}
    </div>
    <div v-if="sub != 'undefined'" class="text-caption">
      <small>{{ sub }}</small>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  lab: String,
  val: [String, Number, Boolean],
  sub: String,
});
</script>
