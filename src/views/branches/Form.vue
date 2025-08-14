<template>
  <v-card elevation="24" :disabled="isLoading" :loading="isLoading">
    <v-card-title>
      <v-row dense>
        <v-col cols="10">
          <BtnBack
            :route="{
              name: routeName + (!isStoreMode ? '/show' : ''),
            }"
          />
          <CardTitle :text="$route.meta.title" :icon="$route.meta.icon" />
        </v-col>
        <v-col cols="2" class="text-right" />
      </v-row>
    </v-card-title>

    <v-card-text v-if="item">
      <v-form ref="formRef" @submit.prevent>
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-title>
                <v-row dense>
                  <v-col cols="11">
                    <CardTitle
                      :text="`DATOS GENERALES${isStoreMode ? '' : ' | ' + (item.uiid || '')}`"
                      sub
                    />
                  </v-col>
                  <v-col cols="1" class="text-right" />
                </v-row>
              </v-card-title>
              <v-card-text>
                <v-row dense>
                  <v-col cols="12">
                    <v-text-field
                      label="Nombre"
                      v-model="item.name"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="50"
                      counter
                      :rules="rules.textRequired"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12">
            <v-card>
              <v-card-title>
                <v-row dense>
                  <v-col cols="11">
                    <CardTitle text="DOMICILIO" sub />
                  </v-col>
                  <v-col cols="1" class="text-right" />
                </v-row>
              </v-card-title>
              <v-card-text>
                <v-row dense>
                  <v-col cols="12" md="8">
                    <v-text-field
                      label="Dirección (calle | núm. exterior | núm. interior)*"
                      v-model="item.address_address"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="100"
                      counter
                      :rules="rules.textOptional"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      label="Colonia*"
                      v-model="item.address_neighborhood"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="75"
                      counter
                      :rules="rules.textOptional"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      label="Código postal"
                      v-model="item.address_zip"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="5"
                      counter
                      :rules="rules.zipRequired"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-autocomplete
                      label="Estado"
                      v-model="item.address_town.state_id"
                      :items="states"
                      :loading="statesLoading"
                      item-value="id"
                      item-title="name"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-autocomplete
                      label="Municipio"
                      v-model="item.address_town_id"
                      :items="towns"
                      :loading="townsLoading"
                      item-value="id"
                      item-title="name"
                      variant="outlined"
                      density="compact"
                      :rules="rules.required"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12">
            <v-card>
              <v-card-title>
                <v-row dense>
                  <v-col cols="11">
                    <CardTitle text="CONTACTO" sub />
                  </v-col>
                  <v-col cols="1" class="text-right" />
                </v-row>
              </v-card-title>
              <v-card-text>
                <v-row dense>
                  <v-col cols="12" md="8">
                    <v-text-field
                      label="E-mail*"
                      v-model="item.email"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="65"
                      counter
                      :rules="rules.emailOptional"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      label="Télefono*"
                      v-model="item.phone"
                      type="text"
                      variant="outlined"
                      density="compact"
                      maxlength="10"
                      counter
                      :rules="rules.phoneOptional"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12">
            <div class="text-right">
              <v-btn
                icon
                variant="flat"
                size="x-small"
                :color="isStoreMode ? 'success' : 'warning'"
                @click.prevent="handleAction"
                :loading="isLoading"
              >
                <v-icon>mdi-check</v-icon>
                <v-tooltip activator="parent" location="left">Continuar</v-tooltip>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
// Importaciones de librerías externas
import { ref, inject, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

// Importaciones internas del proyecto
import { useStore } from '@/store'
import { URL_API } from '@/utils/config'
import { getHdrs, getErr, getRsp } from '@/utils/http'
import { getDecodeId } from '@/utils/coders'
import { getRules } from '@/utils/validators'
import { getObj, getFormData } from '@/utils/helpers'
import { getUserObj } from '@/utils/objects'

// Componentes
import BtnBack from '@/components/BtnBack.vue'
import CardTitle from '@/components/CardTitle.vue'
import BtnDwd from '@/components/BtnDwd.vue'
import InpPassword from '@/components/InpPassword.vue'

// Estado y referencias
const alert = inject('alert')
const confirm = inject('confirm')
const store = useStore()
const router = useRouter()
const route = useRoute()

// Estado reactivo
const itemId = ref(route.params.id ? getDecodeId(route.params.id) : null)
const isStoreMode = ref(!itemId.value)
const isLoading = ref(true)
const formRef = ref(null)
const item = ref(null)
const rules = getRules()
const fiscalRegimes = ref([])
const fiscalRegimesLoading = ref(true)
const states = ref([])
const statesLoading = ref(true)
const towns = ref([])
const townsLoading = ref(false)

// Constantes fijas
const routeName = 'branches'

// Obtener catálogos
const getCatalogs = async () => {
  let endpoint = null
  let response = null

  try {
    endpoint = `${URL_API}/system/fiscal_regimes`
    response = await axios.get(endpoint, getHdrs(store.getAuth?.token))
    fiscalRegimes.value = getRsp(response).data.items
  } catch (err) {
    alert?.show('red-darken-1', getErr(err))
  } finally {
    fiscalRegimesLoading.value = false
  }

  try {
    endpoint = `${URL_API}/system/states`
    response = await axios.get(endpoint, getHdrs(store.getAuth?.token))
    states.value = getRsp(response).data.items
  } catch (err) {
    alert?.show('red-darken-1', getErr(err))
  } finally {
    statesLoading.value = false
  }
}

// Obtener datos
const getItem = async () => {
  if (isStoreMode.value) {
    item.value = {
      id: 1,
      active: true,
      name: null,
      address: null,
      address_neighborhood: null,
      address_zip: null,
      address_town: {
        state_id: null,
      },
      address_town_id: null,
      email: null,
      phone: null,
    }
    isLoading.value = false
  } else {
    try {
      const endpoint = `${URL_API}/system/${routeName}/${itemId.value}`
      const response = await axios.get(endpoint, getHdrs(store.getAuth?.token))
      item.value = getRsp(response).data.item
    } catch (err) {
      alert?.show('red-darken-1', getErr(err))
    } finally {
      isLoading.value = false
    }
  }
}

// Agregar o editar
const handleAction = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) {
    alert?.show('red-darken-1', 'Revisa los detalles señalados')
    return
  }

  const confirmed = await confirm?.show(
    `¿Confirma ${isStoreMode.value ? 'agregar' : 'editar'} registro?`
  )
  if (!confirmed) return

  isLoading.value = true
  const payload = getObj(item.value, isStoreMode.value)

  try {
    const endpoint = `${URL_API}/system/${routeName}${!isStoreMode.value ? `/${payload.id}` : ''}`
    const response = getRsp(
      await axios.post(endpoint, getFormData(payload), getHdrs(store.getAuth?.token, true))
    )

    alert?.show('success', response.msg)

    router.push({
      name: `${routeName}/show`,
      params: {
        id: btoa(isStoreMode.value ? response.data.item.id : itemId.value),
      },
    })
  } catch (err) {
    alert?.show('red-darken-1', getErr(err))
  } finally {
    isLoading.value = false
  }
}

// Inicialización
onMounted(() => {
  getCatalogs()
  getItem()
})
</script>
