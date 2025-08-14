<template>
  <v-navigation-drawer
    v-model="drawerModel"
    :permanent="!isMobile"
    :temporary="isMobile"
    :expand-on-hover="!isMobile"
    :rail="!isMobile"
  >
    <v-list nav>
      <v-list-item
        v-for="(item, i) in drawerItems"
        :key="i"
        :title="item.title"
        :prepend-icon="item.icon"
        :to="{ name: item.link }"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
// Props y emits
import { computed } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  isMobile: Boolean,
})

const emit = defineEmits(['update:modelValue'])

// Modelo para v-model
const drawerModel = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

// Ítems del menú
const drawerItems = [
  { title: 'Inicio', icon: 'mdi-home', link: 'home' },
  { title: 'Proveedores', icon: 'mdi-account-group', link: 'providers' },
  { title: 'Inversionistas', icon: 'mdi-handshake', link: 'investors' },
  { title: 'Sucursales', icon: 'mdi-domain', link: 'branches' },
  { title: 'Empresas', icon: 'mdi-office-building', link: 'companies' },
  { title: 'Usuarios', icon: 'mdi-account', link: 'users' },
]
</script>
