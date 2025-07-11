<template>
  <v-dialog v-model="show" persistent scrim="black" max-width="500">
    <v-card flat>
      <v-card-title>
        <v-row dense>
          <v-col cols="6">
            <CardTitle text="REGISTRO" icon="mdi-database-clock" sub />
          </v-col>
          <v-col cols="6" class="text-right">
            <v-btn icon variant="text" size="x-small" @click.prevent="show = false">
              <v-icon>mdi-close</v-icon>
              <v-tooltip activator="parent" location="left">Cerrar</v-tooltip>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>

      <v-card-text v-if="item">
        <v-row dense>
          <v-col cols="6">
            <VisVal lab="Creación" :val="item.created_by?.email" :sub="item.created_at" />
          </v-col>
          <v-col cols="6">
            <VisVal lab="Últ. edición" :val="item.updated_by?.email" :sub="item.updated_at" />
          </v-col>
          <v-col v-if="item.email_verified_at" cols="6">
            <VisVal lab="Verif." :val="null" :sub="item.email_verified_at" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
// Importaciones de componentes
import { computed } from 'vue'
import CardTitle from '@/components/CardTitle.vue'
import VisVal from '@/components/VisVal.vue'

// Props y emits
const props = defineProps({
  modelValue: Boolean,
  item: Object,
})
const emit = defineEmits(['update:modelValue'])

// Computado para el modelo
const show = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})
</script>
