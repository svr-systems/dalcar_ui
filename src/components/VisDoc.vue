<template>
  <div>
    <div class="text-caption font-weight-bold">{{ lab }}</div>
    <div>
      <div v-if="val">
        <v-tooltip v-if="img_prop" location="right">
          <template v-slot:activator="{ props: activatorProps }">
            <v-avatar
              v-bind="activatorProps"
              size="21"
              class="pointer"
              @click.prevent="img_dlg = true"
            >
              <v-img :src="doc_obj" />
            </v-avatar>
          </template>
          <span>Ver</span>
        </v-tooltip>
        <v-tooltip location="right">
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn
              v-bind="activatorProps"
              size="x-small"
              icon
              @click.prevent="docDwd"
            >
              <v-icon size="small">mdi-download</v-icon>
            </v-btn>
          </template>
          <span>Descargar</span>
        </v-tooltip>
      </div>
      <v-tooltip v-else location="right">
        <template v-slot:activator="{ props: activatorProps }">
          <v-icon v-bind="activatorProps" size="small">mdi-alert</v-icon>
        </template>
        <span>Pendiente</span>
      </v-tooltip>
    </div>
    <v-dialog v-model="img_dlg" persistent scrim="black" max-width="350">
      <v-card flat>
        <v-card-title class="card_title_border">
          <v-row density="compact">
            <v-col cols="6">
              <CardTitle :text="lab" icon="" sub />
            </v-col>
            <v-col cols="6" class="text-right">
              <v-tooltip location="bottom">
                <template v-slot:activator="{ props: activatorProps }">
                  <v-btn
                    v-bind="activatorProps"
                    icon
                    size="small"
                    color="primary"
                    @click.prevent="img_dlg = false"
                  >
                    <v-icon size="small">mdi-close</v-icon>
                  </v-btn>
                </template>
                <span>Cerrar</span>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text v-if="doc_obj">
          <v-row density="compact">
            <v-col cols="12">
              <v-img :src="doc_obj" />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getBlob, getDateTime } from "@/general";
import CardTitle from "@/components/CardTitle.vue";

//Props
const props = defineProps({
  lab: String,
  val: Object,
  img: {
    type: Boolean,
    default: undefined,
  },
});

//Refs
const doc_obj = ref(null);
const img_prop = ref(false);
const img_dlg = ref(false);

//Métodos
const docDwd = () => {
  const link = document.createElement("a");
  link.setAttribute("target", "_blank");
  link.href = doc_obj.value;
  link.download = `${getDateTime("", "", "")}.${props.val.ext}`;
  link.click();
};

onMounted(() => {
  if (props.val) {
    doc_obj.value = URL.createObjectURL(getBlob(props.val.cnt, props.val.ext));
  }
  img_prop.value = props.img !== undefined;
});
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
</style>