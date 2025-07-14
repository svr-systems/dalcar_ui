<template>
  <v-text-field
    :label="label"
    @update:model-value="emitValue"
    :model-value="modelValue"
    :type="isVisible ? 'text' : 'password'"
    variant="outlined"
    density="compact"
    :prepend-inner-icon="prepend"
    :append-inner-icon="isVisible ? 'mdi-eye-off' : 'mdi-eye'"
    maxlength="20"
    :rules="rules"
    :counter="counter"
    :disabled="disabled"
    @click:append-inner="toggleVisibility"
    autocomplete="current-password"
    hide-details="auto"
  />
</template>

<script setup>
// Importaciones
import { ref } from 'vue'

// Definición de props y eventos
const props = defineProps({
  modelValue: String,
  label: String,
  rules: Array,
  counter: Boolean,
  disabled: Boolean,
  prepend: String,
})

const emit = defineEmits(['update:modelValue'])

// Estado interno
const isVisible = ref(false)

// Funciones
const toggleVisibility = () => {
  isVisible.value = !isVisible.value
}

const emitValue = (val) => {
  emit('update:modelValue', val)
}
</script>
