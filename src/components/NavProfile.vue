<template>
  <v-dialog v-model="dialogModel" persistent scrim="black" max-width="400">
    <v-card class="pa-4 text-center" elevation="24" :loading="isLoading" :disabled="isLoading">
      <v-row dense>
        <v-col cols="12" class="text-right">
          <v-btn icon variant="text" size="x-small" @click.prevent="dialogModel = false">
            <v-icon>mdi-close</v-icon>
            <v-tooltip activator="parent" location="bottom">Cerrar</v-tooltip>
          </v-btn>
        </v-col>

        <v-col cols="12">
          <b>
            <small>
              {{ store.auth?.user?.email || 'Correo' }}
            </small>
          </b>
        </v-col>

        <v-col cols="12">
          <v-avatar size="100">
            <v-img v-if="store.auth?.user?.avatar_b64" :src="store.auth.user.avatar_b64" />
            <v-icon v-else size="120">mdi-account-circle</v-icon>
          </v-avatar>
        </v-col>

        <v-col cols="12">
          <span class="font-weight-medium">
            {{ store.auth?.user?.full_name || 'Nombre' }}
          </span>
        </v-col>

        <v-col cols="6">
          <v-sheet class="py-1" style="border: 2px solid #777; border-radius: 50px 0 0 50px">
            <div class="text-caption font-weight-bold">Rol</div>
            <div>{{ store.auth?.user?.role?.name || '---' }}</div>
          </v-sheet>
        </v-col>
        <v-col cols="6">
          <v-sheet class="py-1" style="border: 2px solid #777; border-radius: 0 50px 50px 0">
            <div class="text-caption font-weight-bold">ID</div>
            <div>{{ store.auth?.user?.uiid || '---' }}</div>
          </v-sheet>
        </v-col>

        <v-col cols="12" class="pt-4">
          <v-btn block color="warning" @click="handleAction">
            Cerrar Sesión
            <v-icon end>mdi-logout</v-icon>
          </v-btn>
        </v-col>

        <v-col v-if="!isLoading" cols="12" class="pt-4">
          <BtnTheme />
        </v-col>

        <v-col cols="12" class="pt-2">
          <Version />
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import { useStore } from '@/store'
import BtnTheme from '@/components/BtnTheme.vue'
import Version from '@/components/Version.vue'

// Store y router
const store = useStore()
const router = useRouter()
const theme = useTheme()

// Props para v-model
const props = defineProps({
  modelValue: Boolean,
})
const emit = defineEmits(['update:modelValue'])

// Estado de loading
const isLoading = ref(false)

// Computed para dialog
const dialogModel = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

// Cerrar sesión
const handleAction = async () => {
  isLoading.value = true
  try {
    store.logoutAction()
    router.push({ name: 'login' })
  } catch (err) {
    alert?.show('red-darken-1', getErr(err))
  } finally {
    isLoading.value = false
    emit('update:modelValue', false)
  }
}
</script>