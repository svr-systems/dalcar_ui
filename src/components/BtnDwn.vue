<template>
  <span>
    <v-tooltip v-if="docObj" location="bottom">
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn v-bind="activatorProps" size="small" icon class="pointer" @click.prevent="docDwd">
          <v-icon size="small" icon="mdi-download" />
        </v-btn>
      </template>
      <span>Descargar</span>
    </v-tooltip>
  </span>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getBlob, getDateTime } from '@/general'

//Props
const props = defineProps({
  val: {
    type: [Object],
    default: null,
  },
})

//Refs
const docObj = ref(null)

//Métodos
const docDwd = () => {
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
