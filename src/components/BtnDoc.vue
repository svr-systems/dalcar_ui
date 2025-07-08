<template>
  <v-tooltip v-if="val" location="left">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        :color="color"
        size="small"
        icon
        class="ml-1"
        @click.prevent="docDwd"
      >
        <v-icon :icon="`mdi-${icon}`" size="small" />
      </v-btn>
    </template>
    <span>{{ lab }}</span>
  </v-tooltip>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getBlob, getDateTime } from '@/general'

//Props
const props = defineProps({
  lab: {
    type: String,
    required: true,
  },
  val: {
    type: [Object, null],
    default: null,
  },
  icon: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: '',
  },
})

//Refs
const doc_obj = ref(null)

//Métodos
//Esto crea un <a> temporal y dispara la descarga automáticamente.
const docDwd = () => {
  if (!doc_obj.value) return

  const link = document.createElement('a')
  link.setAttribute('target', '_blank')
  link.href = doc_obj.value
  link.download = `${getDateTime('', '', '')}.${props.val.ext}`
  link.click()
}

//Crea un Blob a partir del contenido y la extensión del documento.
onMounted(() => {
  if (props.val) {
    doc_obj.value = URL.createObjectURL(getBlob(props.val.cnt, props.val.ext))
  }
})
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
</style>