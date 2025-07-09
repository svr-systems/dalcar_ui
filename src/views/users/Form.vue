<template>
  <v-card elevation="24" :disabled="ldg" :loading="ldg">
    <v-card-title>
      <v-row dense>
        <v-col cols="10">
          <BtnBack :route="{ name: 'users' }" />
          <CardTitle :text="$route.meta.title" :icon="$route.meta.icon" />
        </v-col>
        <v-col cols="2" class="text-right" />
      </v-row>
    </v-card-title>
    <v-card-text v-if="item">
      <v-form @submit.prevent ref="item_form" lazy-validation>
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-title class="card_title_border">
                <v-row dense>
                  <v-col cols="10">
                    <CardTitle :text="'GENERAL' + (store_mode ? '' : ' | ' + item.uiid)" sub />
                  </v-col>
                  <v-col cols="2" class="text-right" />
                </v-row>
              </v-card-title>
              <v-card-text>
                <v-row dense>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="Nombre"
                      v-model="item.name"
                      dense
                      outlined
                      type="text"
                      :rules="rules.txt_rqd"
                      maxlength="50"
                      counter
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="A. paterno"
                      v-model="item.surname_p"
                      dense
                      outlined
                      type="text"
                      :rules="rules.txt_rqd"
                      maxlength="25"
                      counter
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="A. materno*"
                      v-model="item.surname_m"
                      dense
                      outlined
                      type="text"
                      :rules="rules.txt"
                      maxlength="25"
                      counter
                    />
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
                    <v-text-field
                      label="E-mail"
                      v-model="item.email"
                      dense
                      outlined
                      type="text"
                      :rules="rules.email_rqd"
                      maxlength="65"
                      counter
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-select
                      label="Rol"
                      v-model="item.role_id"
                      dense
                      outlined
                      :rules="rules.rqd"
                      :items="roles"
                      item-title="name"
                      item-value="id"
                      :loading="roles_ldg"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12">
            <div class="text-right">
              <v-tooltip left>
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    fab
                    icon
                    size="x-small"
                    :color="store_mode ? 'success' : 'warning'"
                    @click.prevent="handleAction"
                    :loading="ldg"
                  >
                    <v-icon> mdi-check</v-icon>
                  </v-btn>
                </template>
                Confirmar
              </v-tooltip>
            </div>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { URL_API, getHdrs, getRsp, getErr, getRules, getObj, getFormData } from '@/general'
import { getUserObj, getUserModuleObj } from '@/objects'
import { useStore } from "@/store/index.js";
import axios from 'axios'
import BtnBack from '@/components/BtnBack.vue'
import CardTitle from '@/components/CardTitle.vue'

const route = useRoute()
const router = useRouter()
const alert = inject('alert')
const confirm = inject('confirm')
const store = useStore()

const routeName = 'users'
const id = ref(route.params.id ? atob(route.params.id) : null)
const ldg = ref(true)
const store_mode = ref(true)
const item = ref(null)
const rules = getRules()
const roles = ref([])
const roles_ldg = ref(true)

const getCatalogs = async () => {
  try {
    const rolesResponse = await axios.get(URL_API + '/system/roles', getHdrs(store.getAuth?.token))
    roles.value = getRsp(rolesResponse).data.items
    roles_ldg.value = false
  } catch (err) {
    alert?.show('error', getErr(err))
  }
}

const getItem = async () => {
  store_mode.value = id.value == null

  if (store_mode.value) {
    item.value = getUserObj()
    item.value.user_module = getUserModuleObj()
    ldg.value = false
  } else {
    try {
      const response = await axios.get(
        URL_API + '/system/' + routeName + '/' + id.value,
        getHdrs(store.getAuth?.token)
      )
      item.value = getRsp(response).data.item
      ldg.value = false
    } catch (err) {
      alert?.show('error', getErr(err))
    }
  }
}

const handleAction = async () => {
  if (item_form.value.validate()) {
    const confirmed = await confirm?.show(
      '¿Confirma ' + (store_mode.value ? 'agregar' : 'editar') + ' registro?'
    )

    if (confirmed) {
      ldg.value = true
      const obj = getObj(item.value, store_mode.value)

      try {
        const response = await axios.post(
          URL_API + '/system/' + routeName + (store_mode.value ? '' : '/' + obj.id),
          getFormData(obj),
          getHdrs(store.getAuth?.token, true)
        )
        const rsp = getRsp(response)
        alert?.show('success', rsp.msg)

        router.push({
          name: routeName + '/show',
          params: {
            id: btoa(store_mode.value ? rsp.data.item.id : id.value),
          },
        })
      } catch (err) {
        alert?.show('error', getErr(err))
      } finally {
        ldg.value = false
      }
    }
  } else {
    alert?.show('error', 'Revisa los detalles señalados')
  }
}

const item_form = ref(null)

onMounted(() => {
  getCatalogs()
  getItem()
})
</script>