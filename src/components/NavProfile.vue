<template>
  <v-dialog v-model="dialogModel" persistent scrim="black" max-width="360">
    <v-card elevation="24" class="py-4 px-4" :loading="isLoading" :disabled="isLoading">
      <v-card-title>
        <v-row dense>
          <v-col cols="6">
            <CardTitle text="Mi perfil" icon="" />
          </v-col>
          <v-col cols="6" class="text-right">
            <v-btn icon variant="text" size="small" @click.prevent="dialogModel = false">
              <v-icon>mdi-close</v-icon>
              <v-tooltip activator="parent" location="bottom">Cerrar</v-tooltip>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>

      <v-divider class="my-2" />

      <v-card-text class="text-center px-3">
        <v-avatar size="80" class="mx-auto mb-4">
          <v-img v-if="store.auth?.user.avatar_b64" :src="store.auth.user.avatar_b64" cover />
          <v-icon v-else size="80">mdi-account-circle</v-icon>
        </v-avatar>
        <div class="text-subtitle-1 mb-1">{{ store.auth?.user.full_name }}</div>
        <div class="text-body-2 mb-1">{{ store.auth?.user.email }}</div>
        <div class="text-caption">
          {{ store.auth?.user.role.name }} | {{ store.auth?.user.uiid }}
        </div>
      </v-card-text>

      <v-divider class="py-2" />

      <BtnTheme class="pb-2" />

      <v-btn block variant="tonal" size="small" color="red" @click.prevent="logout">
        <v-icon start>mdi-logout</v-icon>
        Cerrar Sesión
      </v-btn>
    </v-card>
  </v-dialog>
</template>

<script setup>
// Vue y librerías externas
import { ref, inject, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

// Store y helpers
import { useStore } from '@/store'
import { URL_API } from '@/utils/config'
import { getHdrs, getErr } from '@/utils/http'

// Componentes
import BtnTheme from './BtnTheme.vue'
import CardTitle from './CardTitle.vue'

// Props y emit
const props = defineProps({ modelValue: Boolean })
const emit = defineEmits(['update:modelValue'])

// Estado
const dialogModel = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})
const isLoading = ref(false)
const store = useStore()
const router = useRouter()
const alert = inject('alert')

// Cierre de sesión
const logout = async () => {
  isLoading.value = true
  try {
    const endpoint = `${URL_API}/auth/logout`
    await axios.get(endpoint, getHdrs(store.getAuth?.token))
    emit('update:modelValue', false)
    store.logoutAction(null)
    router.push({ name: 'login' })
  } catch (err) {
    alert?.show('red-darken-1', getErr(err))
  } finally {
    isLoading.value = false
  }
}
</script>
