<template>
  <v-col cols="12" class="text-center">
    <img height="80" :src="logoUrl" alt="Logo" />
  </v-col>
</template>

<script setup>
import logo from '@/assets/logo.png'

const logoUrl = logo
</script>