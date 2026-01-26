<template>
  <div class="d-inline-flex flex-column">
    <div
      v-if="label"
      class="font-weight-light text-caption text-medium-emphasis"
    >
      {{ label }}
    </div>

    <v-btn
      v-if="hasSource"
      icon
      :variant="variant"
      :size="size"
      :density="density"
      @click="handleClick"
    >
      <v-icon>mdi-eye</v-icon>
      <v-tooltip activator="parent" location="left">
        {{ tooltip }}
      </v-tooltip>
    </v-btn>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from "vue";
import { getBlob } from "@/utils/coders";

const props = defineProps({
  file: {
    type: [File, Array, Object, null],
    default: null,
  },
  doc: {
    type: Object,
    default: null, // { cnt: 'base64', ext: 'pdf', name?: 'archivo.pdf' }
  },
  tooltip: {
    type: String,
    default: "Ver / descargar archivo",
  },
  variant: {
    type: String,
    default: "text",
  },
  size: {
    type: String,
    default: "x-small",
  },
  label: {
    type: String,
    default: null,
  },
  density: {
    type: String,
    default: "comfortable",
  },
});

const previewUrl = ref(null);
const isObjectUrl = ref(false);

const resolvedFile = computed(() => {
  if (!props.file) return null;
  return Array.isArray(props.file) ? props.file[0] : props.file;
});

const resolvedExt = computed(() => {
  if (props.doc?.ext) {
    return String(props.doc.ext).toLowerCase();
  }
  if (resolvedFile.value?.name) {
    const parts = resolvedFile.value.name.split(".");
    if (parts.length > 1) {
      return parts.pop().toLowerCase();
    }
  }
  return "";
});

const resolvedName = computed(() => {
  if (props.doc?.name) return props.doc.name;
  if (resolvedFile.value?.name) return resolvedFile.value.name;
  if (resolvedExt.value) return `archivo.${resolvedExt.value}`;
  return "archivo";
});

const hasSource = computed(() => {
  return !!resolvedFile.value || !!props.doc;
});

const isPreviewable = computed(() => {
  const ext = resolvedExt.value;
  const previewExt = [
    "pdf",
    "png",
    "jpg",
    "jpeg",
    "gif",
    "webp",
    "svg",
    "xml",
    "txt",
    "html",
    "htm",
  ];
  if (!ext) return false;
  return previewExt.includes(ext);
});

const buildUrl = () => {
  if (isObjectUrl.value && previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
    isObjectUrl.value = false;
    previewUrl.value = null;
  }

  if (resolvedFile.value instanceof File) {
    previewUrl.value = URL.createObjectURL(resolvedFile.value);
    isObjectUrl.value = true;
    return;
  }

  if (props.doc?.cnt && resolvedExt.value) {
    const blob = getBlob(props.doc.cnt, resolvedExt.value);
    previewUrl.value = URL.createObjectURL(blob);
    isObjectUrl.value = true;
  }
};

const openInNewTab = () => {
  if (!previewUrl.value) return;
  window.open(previewUrl.value, "_blank");
};

const downloadFile = () => {
  if (!previewUrl.value) return;

  const link = document.createElement("a");
  link.href = previewUrl.value;
  link.setAttribute("target", "_blank");
  link.download = resolvedName.value;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const handleClick = () => {
  if (!previewUrl.value) {
    buildUrl();
  }
  if (!previewUrl.value) return;

  if (isPreviewable.value) {
    openInNewTab();
  } else {
    downloadFile();
  }
};

onBeforeUnmount(() => {
  if (isObjectUrl.value && previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
});
</script>
