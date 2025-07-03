<template>
  <v-dialog v-model="visible" persistent scrim="black" max-width="380">
    <v-card elevation="24" class="py-4">
      <v-card-text>
        <v-row dense class="text-center">
          <v-col cols="12">
            <v-icon
              color="warning"
              size="48"
              icon="mdi-alert-octagon-outline"
            />
          </v-col>
          <v-col cols="12">
            <h3 class="font-weight-light">
              {{ msg }}
            </h3>
          </v-col>
          <v-col cols="12" class="pt-3">
            <v-btn
              size="small"
              variant="flat"
              icon="mdi-close"
              color="error"
              class="mr-2"
              @click="handleAction(false)"
            />
            <v-btn
              size="small"
              variant="flat"
              icon="mdi-check"
              color="success"
              class="ml-2"
              @click="handleAction(true)"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from "vue";

const visible = ref(false);
const msg = ref("");
const resolve = ref(null);

const show = (message) => {
  msg.value = message;
  visible.value = true;

  return new Promise((rsp) => {
    resolve.value = rsp;
  });
};

const handleAction = (response) => {
  resolve.value?.(response);
  visible.value = false;
};

defineExpose({ show });
</script>