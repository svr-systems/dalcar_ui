<template>
  <v-dialog v-model="show" persistent scrim="black" max-width="400">
    <v-card flat>
      <v-card-title class="card_title_border">
        <v-row dense>
          <v-col cols="6">
            <CardTitle text="REGISTRO" icon="mdi-database-clock" sub />
          </v-col>
          <v-col cols="6" class="text-right">
            <v-tooltip location="left">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  variant="text"
                  icon
                  size="x-small"
                  @click.prevent="show = false"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </template>
              <span>Cerrar</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text v-if="item">
        <v-row dense>
          <v-col cols="6">
            <VisVal lab="Creación" :val="item.created_by.email" :sub="item.created_at" />
          </v-col>
          <v-col cols="6">
            <VisVal lab="Últ. edición" :val="item.updated_by.email" :sub="item.updated_at" />
          </v-col>
          <v-col v-if="item.email_verified_at" cols="6">
            <VisVal lab="Verif." noval :sub="item.email_verified_at" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import CardTitle from '@/components/CardTitle.vue'
import VisVal from '@/components/VisVal.vue'
import { computed } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  item: Object,
})

const emit = defineEmits(['update:modelValue'])

const show = computed({
  get() {
    return props.modelValue
  },
  set(v) {
    emit('update:modelValue', v)
  },
})
</script>