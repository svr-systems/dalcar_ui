<template>
  <v-container fluid>
    <v-row justify="center" class="text-center">
      <v-col cols="12" class="pt-10" />
      <v-col cols="12">
        <div class="text-h5 font-weight-light">Bienvenido</div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
// Aquí puedes agregar lógica reactiva si luego necesitas detectar el rol del usuario,
// cargar datos para KPIs u otra información personalizada.

// Ejemplo básico para referencia futura:
// import { computed } from 'vue'
// import { useStore } from '@/store'

// const store = useStore()
// const userRole = computed(() => store.user?.role)
</script>
