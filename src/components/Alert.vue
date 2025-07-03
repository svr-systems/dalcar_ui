<template>
  <v-snackbar
    v-model="visible"
    :color="color"
    :timeout="5500"
    location="top"
  >
    <div class="text-center">
      {{ msg }}
    </div>
  </v-snackbar>
</template>

<script setup>
import { ref, provide } from "vue";

const visible = ref(false);
const color = ref(null);
const msg = ref(null);

const show = (NewColor, NewMsg) => {
  color.value = NewColor;
  msg.value = NewMsg;
  visible.value = true;
};

defineExpose({ show });
</script>