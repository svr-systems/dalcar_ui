<template>
  <span>
    <v-tooltip v-if="docObj" location="bottom">
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" icon variant="text" size="small" @click.prevent="downloadDocument">
          <v-icon icon="mdi-download"/>
        </v-btn>
      </template>
      <span>Descargar</span>
    </v-tooltip>
  </span>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getBlob, getDateTime } from '@/general'

const props = defineProps({
  val: {
    type: Object,
    default: null,
  },
})

const docObj = ref(null)

const downloadDocument = () => {
  if (!docObj.value) return

  const link = document.createElement('a')
  link.setAttribute('target', '_blank')
  link.href = docObj.value
  link.download = `${getDateTime('', '', '')}.${props.val.ext}`
  link.click()
}

onMounted(() => {
  if (props.val) {
    docObj.value = URL.createObjectURL(getBlob(props.val.cnt, props.val.ext))
  }
})
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
</style>