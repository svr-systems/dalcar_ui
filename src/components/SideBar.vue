<template>
  <v-app>
    <v-layout>
      <v-app-bar color="grey lighten-1" density="comfortable">
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer" />
        <v-toolbar-title>Universidad Azteca</v-toolbar-title>
        <v-spacer />

        <v-btn icon variant="text">
          <v-icon>mdi-bell-outline</v-icon>
        </v-btn>

        <v-btn icon variant="text" @click="userDialog = true">
          <v-icon>mdi-account-circle</v-icon>
        </v-btn>
      </v-app-bar>

      <v-navigation-drawer v-model="drawer" permanent>
        <v-container class="d-flex justify-center py-4">
          <v-img
            src="https://static.wixstatic.com/media/dbaee8_453933def9284ef29a843fa1c7645a89~mv2.png/v1/crop/x_0,y_133,w_500,h_198/fill/w_500,h_198,al_c,q_85,enc_avif,quality_auto/Logotipos.png"
            max-width="100"
            contain
          />
        </v-container>

        <v-list nav>
          <v-list-item prepend-icon="mdi-home" title="Inicio" to="/home" value="home" />
          <v-list-item
            prepend-icon="mdi-account"
            title="Usuarios"
            to="/usuarios"
            value="usuarios"
          />
        </v-list>
      </v-navigation-drawer>

      <v-main>
        <router-view />
      </v-main>

      <v-dialog v-model="userDialog" max-width="360" persistent>
        <v-card class="pa-4">
          <v-card-title class="justify-center text-h6 font-weight-bold">
            <v-icon size="28" class="me-2">mdi-account-circle</v-icon>
            Perfil
          </v-card-title>

          <v-divider class="my-2" />

          <v-card-text class="text-center px-6">
            <v-avatar size="80" class="mx-auto mb-4">
              <v-icon size="80" color="primary">mdi-account-circle</v-icon>
            </v-avatar>

            <div class="text-subtitle-1 font-weight-medium mb-1">Juan Pérez</div>
            <div class="text-body-2 grey--text mb-1">juan.perez@ejemplo.com</div>
            <div class="text-body-2 mb-1">Rol: Administrador</div>
            <div class="text-body-2 grey--text">ID: #123456</div>
          </v-card-text>

          <v-divider class="my-2" />

          <BtnTheme />

          <v-card-actions class="d-flex flex-column px-4 pt-2 pb-4">
            <v-btn block color="red" variant="tonal">
              <v-icon start>mdi-logout</v-icon>
              Salir
            </v-btn>
            <v-btn block variant="text" class="mt-2" @click="userDialog = false">
              <v-icon start>mdi-close</v-icon>
              Cerrar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import BtnTheme from '@/components/BtnTheme.vue'

const drawer = ref(false)
const userDialog = ref(false)
</script>
