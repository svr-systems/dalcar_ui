<template>
  <v-btn
    v-if="val?.cnt && val?.ext && docUrl"
    icon
    variant="text"
    size="small"
    @click.prevent="docDwd"
  >
    <v-icon>mdi-download</v-icon>
    <v-tooltip activator="parent" location="bottom">Descargar</v-tooltip>
  </v-btn>
</template>

<script setup>
// Importaciones de librerías
import { ref, onMounted } from 'vue'
import { getBlob, getDateTime } from '@/general'

// Props
const props = defineProps({
  val: {
    type: Object,
    default: null,
  },
})

// Estado reactivo
const docUrl = ref(null)

// Descargar documento
const docDwd = () => {
  const link = document.createElement('a')
  link.setAttribute('target', '_blank')
  link.href = docUrl.value
  link.download = `documento_${getDateTime('', '', '')}.${props.val?.ext || 'bin'}`
  link.click()
}

// Inicialización
onMounted(() => {
  if (props.val && props.val.cnt && props.val.ext) {
    docUrl.value = URL.createObjectURL(getBlob(props.val.cnt, props.val.ext))
  }
})
</script>
