<template>
  <v-card :loading="ldg">
    <v-card-title>
      <v-row dense>
        <v-col cols="10">
          <BtnBack :route="{ name: route }" />
          <CardTitle :text="route.meta.title" :icon="route.meta.icon" />
        </v-col>
        <v-col v-if="item" cols="2" class="text-right">
          <v-tooltip v-if="item.active" bottom>
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                fab
                x-small
                color="warning"
                :to="{
                  name: route + '/update',
                  params: { id: encodeId(item.id) },
                }"
              >
                <v-icon small> mdi-pencil </v-icon>
              </v-btn>
            </template>
            <span>Editar</span>
          </v-tooltip>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text v-if="item">
      <v-row>
        <v-col v-if="!item.active" cols="12">
          <v-alert dense outlined text shaped type="error">
            <v-row dense>
              <v-col class="grow"> El registro se encuentra inactivo </v-col>
              <v-col v-if="store.getAuth?.user?.role_id == 1" class="shrink">
                <v-btn x-small color="success" @click="restoreItem">
                  Activar
                  <v-icon x-small right> mdi-delete-restore </v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-alert>
        </v-col>
        <v-col cols="12">
          <v-card>
            <v-card-title class="card_title_border">
              <v-row dense>
                <v-col cols="10">
                  <CardTitle :text="'GENERAL | ' + item.uiid" sub />
                </v-col>
                <v-col cols="2" class="text-right">
                  <v-tooltip v-if="store.getAuth?.user?.role_id == 1" bottom>
                    <template v-slot:activator="{ props }">
                      <v-btn v-bind="props" icon small @click.prevent="reg_dlg = true">
                        <v-icon small> mdi-database-clock </v-icon>
                      </v-btn>
                    </template>
                    <span>Registro</span>
                  </v-tooltip>
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-text>
              <v-row dense>
                <v-col cols="12" md="3">
                  <VisVal lab="Nombre" :val="item.name" />
                </v-col>
                <v-col cols="12" md="3">
                  <VisVal lab="A. paterno" :val="item.surname_p" />
                </v-col>
                <v-col cols="12" md="3">
                  <VisVal lab="A. materno" :val="item.surname_m" />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card>
            <v-card-title class="card_title_border">
              <v-row dense>
                <v-col cols="10">
                  <CardTitle text="CUENTA" sub />
                </v-col>
                <v-col cols="2" class="text-right" />
              </v-row>
            </v-card-title>
            <v-card-text>
              <v-row dense>
                <v-col cols="12" md="3">
                  <VisVal lab="E-mail" :val="item.email" />
                </v-col>
                <v-col cols="12" md="3">
                  <VisVal lab="Rol" :val="item.role?.name" />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card>
            <v-card-title class="card_title_border">
              <v-row dense>
                <v-col cols="10">
                  <CardTitle text="CONTACTO" sub />
                </v-col>
                <v-col cols="2" class="text-right" />
              </v-row>
            </v-card-title>
            <v-card-text>
              <v-row dense>
                <v-col cols="12" md="3">
                  <VisVal lab="Teléfono fijo" :val="item.phone" />
                </v-col>
                <v-col cols="12" md="3">
                  <VisVal lab="Teléfono móvil" :val="item.movil_phone" />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col
          v-if="
            item.active && (store.getAuth?.user?.role_id == 1 || store.getAuth?.user?.role_id == 2)
          "
          cols="12"
        >
          <v-tooltip right>
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" fab x-small color="error" @click.prevent="deleteItem">
                <v-icon small> mdi-delete </v-icon>
              </v-btn>
            </template>
            <span>Inactivar</span>
          </v-tooltip>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from '@/store/index.js'
import { URL_API, getHdrs, getRsp, getErr } from '@/general'
import axios from 'axios'
import BtnBack from '@/components/BtnBack.vue'
import CardTitle from '@/components/CardTitle.vue'
import VisVal from '@/components/VisVal.vue'

const route = useRoute()
const router = useRouter()
const store = useStore()
const alert = inject('alert')
const confirm = inject('confirm')

const id = ref(window.atob(route.params.id));
const ldg = ref(true)
const item = ref(null)
const reg_dlg = ref(false)
const routeName = 'users'
const encodeId = (id) => window.btoa(id);

const getItem = async () => {
  ldg.value = true
  try {
    const response = await axios.get(
      `${URL_API}/system/${routeName}/${id.value}`,
      getHdrs(store.getAuth?.token)
    )
    const rsp = getRsp(response)
    item.value = rsp.data.item
  } catch (err) {
    alert?.show('error', getErr(err))
  } finally {
    ldg.value = false
  }
}

const deleteItem = async () => {
  const confirmed = await confirm?.show('¿Confirma eliminar el registro?')
  if (confirmed) {
    ldg.value = true
    try {
      const response = await axios.delete(
        `${URL_API}/system/${routeName}/${id.value}`,
        getHdrs(store.getAuth?.token)
      )
      const rsp = getRsp(response)
      alert?.show('error', rsp.msg)
      router.push({ name: routeName })
    } catch (err) {
      alert?.show('error', getErr(err))
    } finally {
      ldg.value = false
    }
  }
}

const restoreItem = async () => {
  const confirmed = await confirm?.show('¿Confirma activar el registro?')
  if (confirmed) {
    ldg.value = true
    try {
      const response = await axios.post(
        `${URL_API}/system/${routeName}/restore`,
        { id: id.value },
        getHdrs(store.getAuth?.token)
      )
      const rsp = getRsp(response)
      alert?.show('success', rsp.msg)
      item.value = rsp.data.item
    } catch (err) {
      alert?.show('error', getErr(err))
    } finally {
      ldg.value = false
    }
  }
}

onMounted(() => {
  getItem()
})
</script>