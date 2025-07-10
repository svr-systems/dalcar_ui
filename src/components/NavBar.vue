<template>
  <div>
    <v-app-bar density="compact" :elevation="2">
      <v-app-bar-nav-icon v-if="isMobile" @click.stop="drawer = !drawer" />

      <v-toolbar-title>{{ APP_NAME }}</v-toolbar-title>
      <v-spacer />
      <v-btn icon variant="text">
        <v-icon>mdi-bell-outline</v-icon>
      </v-btn>
      <v-btn icon variant="text" @click="user_dlg = true">
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      :permanent="!isMobile"
      :temporary="isMobile"
      :expand-on-hover="!isMobile"
      rail
    >
      <v-list nav>
        <v-list-item
          v-for="(drawer_item, i) in drawer_items"
          :key="i"
          :title="drawer_item.title"
          :prepend-icon="drawer_item.icon"
          :to="{ name: drawer_item.link }"
        />
      </v-list>
    </v-navigation-drawer>

    <v-dialog v-model="user_dlg" persistent scrim="black" max-width="360">
      <v-card elevation="24" class="py-4 px-4" :loading="user_ldg" :disabled="user_ldg">
        <v-card-title class="card_title_border">
          <v-row density="compact">
            <v-col cols="6">
              <CardTitle text="Mi perfil" icon="" />
            </v-col>
            <v-col cols="6" class="text-right">
              <v-btn variant="plain" size="small" @click.prevent="user_dlg = false">
                <v-icon>mdi-close</v-icon>
                <v-tooltip activator="parent" location="bottom">Cerrar</v-tooltip>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <v-divider class="my-2" />
        <v-card-text class="text-center px-3">
          <v-avatar size="80" class="mx-auto mb-4">
            <v-img v-if="store.auth.user.avatar_b64" :src="store.auth.user.avatar_b64" cover />
            <v-icon v-else size="80">mdi-account-circle</v-icon>
          </v-avatar>
          <div class="text-subtitle-1 mb-1">{{ store.auth.user.full_name }}</div>
          <div class="text-body-2 mb-1">{{ store.auth.user.email }}</div>
          <div class="text-caption">
            {{ store.auth.user.role.name }} | {{ store.auth.user.uiid }}
          </div>
        </v-card-text>
        <v-divider class="my-2" />
        <BtnTheme />
        <v-btn block variant="tonal" size="small" color="red" @click.prevent="logout">
          <v-icon start>mdi-logout</v-icon>
          Cerrar Sesión
        </v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, inject, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useDisplay } from 'vuetify'
import { APP_NAME, URL_API, getHdrs, getErr } from '@/general'
import { useStore } from '@/store/index.js'
import CardTitle from '@/components/CardTitle.vue'
import BtnTheme from '@/components/BtnTheme.vue'

const router = useRouter()
const store = useStore()
const confirm = inject('confirm')
const alert = inject('alert')
const display = useDisplay()
const isMobile = computed(() => display.smAndDown.value)
const user_dlg = ref(false)
const user_ldg = ref(false)
const drawer = ref(!isMobile.value)



const drawer_items = [
  {
    title: 'Inicio',
    icon: 'mdi-home',
    link: 'home',
  },
  {
    title: 'Usuarios',
    icon: 'mdi-account',
    link: 'users',
  },
    {
    title: 'Especialidades',
    icon: 'mdi-medication',
    link: 'specialties',
  },
]

const logout = async () => {
  user_ldg.value = true
  try {
    await axios.get(URL_API + '/auth/logout', getHdrs(store.getAuth?.token))
    user_dlg.value = false
    store.logoutAction(null)
    router.push({ name: 'login' })
  } catch (err) {
    alert?.show('error', getErr(err))
    logout()
  } finally {
    user_ldg.value = false
  }
}

watch(isMobile, (val) => {
  drawer.value = !val
})
</script>

