<template>
  <v-text-field
    :label="label"
    v-model="val"
    variant="outlined"
    :type="visible ? 'text' : 'password'"
    maxlength="50"
    :rules="rules"
    :counter="counter"
    :disabled="disabled"
    :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
    @click:append-inner="visible = !visible"
  />
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const props = defineProps({
  label: String,
  model: String,
  rules: Array,
  counter: Boolean,
  disabled: Boolean,
});

const visible = ref(false);

const emit = defineEmits(["update:model"]);

const val = computed({
  get() {
    return props.model;
  },
  set(value) {
    emit("update:model", value);
  },
});
</script>
