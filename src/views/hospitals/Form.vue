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
          <CardTitle :text="route.meta.title" :icon="route.meta.icon" />
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
                  <v-col cols="10">
                    <CardTitle :text="'GENERAL' + (isStoreMode ? '' : ' | ' + item.uiid)" sub />
                  </v-col>
                  <v-col cols="2" class="text-right" />
                </v-row>
              </v-card-title>
              <v-card-text>
                <v-row dense>
                  <v-col cols="12" md="6">
                    <v-text-field
                      label="Nombre"
                      v-model="item.name"
                      variant="outlined"
                      density="compact"
                      type="text"
                      :rules="rules.txt_rqd"
                      maxlength="100"
                      counter
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="Comisión"
                      v-model="item.fee"
                      variant="outlined"
                      density="compact"
                      :rules="rules.rqd"
                      type="number"
                      min="1"
                      max="30"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-file-input
                      label="Logo*"
                      v-model="item.logo_doc"
                      variant="outlined"
                      density="compact"
                      :rules="rules.img"
                      show-size
                      prepend-icon=""
                      accept=".jpg,.jpeg,.png"
                      :disabled="item.logo_dlt"
                    >
                      <template v-slot:append-inner>
                        <div v-if="!isStoreMode && item.logo && !item.logo_doc" class="d-flex">
                          <BtnDwd :val="item.logo_b64" />
                          <v-tooltip location="bottom">
                            <template v-slot:activator="{ props }">
                              <v-btn
                                v-bind="props"
                                icon
                                size="small"
                                variant="text"
                                :color="item.logo_dlt ? 'error' : ''"
                                @click.prevent="item.logo_dlt = !item.logo_dlt"
                              >
                                <v-icon icon="mdi-delete" />
                              </v-btn>
                            </template>
                            <span>{{ item.logo_dlt ? 'NO ' : '' }}Eliminar</span>
                          </v-tooltip>
                        </div>
                      </template>
                    </v-file-input>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card>
              <v-card-title>
                <v-row dense>
                  <v-col cols="10">
                    <CardTitle text="PERSONA DE CONTACTO" sub />
                  </v-col>
                  <v-col cols="2" class="text-right" />
                </v-row>
              </v-card-title>
              <v-card-text>
                <v-row dense>
                  <v-col cols="12" md="6">
                    <v-text-field
                      label="Nombre"
                      v-model="item.contact"
                      variant="outlined"
                      density="compact"
                      type="text"
                      :rules="rules.txt_rqd"
                      maxlength="100"
                      counter
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="Teléfono"
                      v-model="item.contact_phone"
                      variant="outlined"
                      density="compact"
                      type="text"
                      :rules="rules.phone_rqd"
                      maxlength="10"
                      counter
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
                  <v-col cols="10">
                    <CardTitle text="FISCAL" sub />
                  </v-col>
                  <v-col cols="2" class="text-right" />
                </v-row>
              </v-card-title>
              <v-card-text>
                <v-row dense>
                  <v-col cols="12" md="3">
                    <v-file-input
                      label="CSF*"
                      v-model="item.fiscal_constancy_doc"
                      variant="outlined"
                      density="compact"
                      :rules="rules.img"
                      show-size
                      prepend-icon=""
                      accept=".pdf"
                      :disabled="item.fiscal_constancy_dlt"
                    >
                      <template v-slot:append-inner>
                        <div
                          v-if="!isStoreMode && item.fiscal_constancy && !item.fiscal_constancy_doc"
                          class="d-flex"
                        >
                          <BtnDwd :val="item.fiscal_constancy_b64" />
                          <v-tooltip location="bottom">
                            <template v-slot:activator="{ props }">
                              <v-btn
                                v-bind="props"
                                icon
                                size="small"
                                variant="text"
                                :color="item.fiscal_constancy_dlt ? 'error' : ''"
                                @click.prevent="
                                  item.fiscal_constancy_dlt = !item.fiscal_constancy_dlt
                                "
                              >
                                <v-icon icon="mdi-delete" />
                              </v-btn>
                            </template>
                            <span>{{ item.fiscal_constancy_dlt ? 'NO ' : '' }}Eliminar</span>
                          </v-tooltip>
                        </div>
                      </template>
                    </v-file-input>
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      :label="'RFC' + (!item.fiscal_code ? '*' : '')"
                      v-model="item.fiscal_code"
                      variant="outlined"
                      density="compact"
                      type="text"
                      :rules="rules.fiscal_code"
                      maxlength="13"
                      counter
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      :label="'Nombre | Razón social' + (!item.fiscal_code ? '*' : '')"
                      v-model="item.fiscal_name"
                      variant="outlined"
                      density="compact"
                      type="text"
                      :rules="!item.fiscal_code ? rules.txt : rules.txt_rqd"
                      maxlength="75"
                      counter
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      :label="'CP' + (!item.fiscal_code ? '*' : '')"
                      v-model="item.fiscal_zip"
                      variant="outlined"
                      density="compact"
                      type="text"
                      :rules="!item.fiscal_code ? rules.zip : rules.zip_rqd"
                      maxlength="5"
                      counter
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-select
                      :label="'Tipo' + (!item.fiscal_code ? '*' : '')"
                      v-model="item.fiscal_type_id"
                      variant="outlined"
                      density="compact"
                      :rules="!item.fiscal_code ? [] : rules.rqd"
                      :items="fiscal_types"
                      item-title="name"
                      item-value="id"
                      :loading="fiscal_types_loading"
                      @update:modelValue="getFiscalRegimes"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-autocomplete
                      :label="'Régimen' + (!item.fiscal_code ? '*' : '')"
                      v-model="item.fiscal_regime_id"
                      variant="outlined"
                      density="compact"
                      :rules="!item.fiscal_code ? [] : rules.rqd"
                      :items="fiscal_regimes"
                      :item-title="(v) => v.name + ' | ' + v.code"
                      item-value="id"
                      :loading="fiscal_regimes_loading"
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
                  <v-col cols="10">
                    <CardTitle text="DOMICILIO" sub />
                  </v-col>
                  <v-col cols="2" class="text-right" />
                </v-row>
              </v-card-title>
              <v-card-text>
                <v-row dense>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="CP"
                      v-model="item.address_zip"
                      variant="outlined"
                      density="compact"
                      type="text"
                      :rules="rules.zip_rqd"
                      maxlength="5"
                      counter
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-autocomplete
                      label="Estado"
                      v-model="item.address_town.state_id"
                      variant="outlined"
                      density="compact"
                      :rules="rules.rqd"
                      :items="states"
                      item-title="name"
                      item-value="id"
                      :loading="states_loading"
                      @update:modelValue="getAddressTowns"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-select
                      label="Municipio"
                      v-model="item.address_town_id"
                      variant="outlined"
                      density="compact"
                      :rules="rules.rqd"
                      :items="address_towns"
                      item-title="name"
                      item-value="id"
                      :loading="address_towns_loading"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="Calle*"
                      v-model="item.address_street"
                      variant="outlined"
                      density="compact"
                      type="text"
                      :rules="rules.text"
                      maxlength="75"
                      counter
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="Exterior*"
                      v-model="item.address_exterior"
                      variant="outlined"
                      density="compact"
                      type="text"
                      maxlength="15"
                      counter
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="Interior*"
                      v-model="item.address_interior"
                      variant="outlined"
                      density="compact"
                      type="text"
                      maxlength="15"
                      counter
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      label="Colonia*"
                      v-model="item.address_neighborhood"
                      variant="outlined"
                      density="compact"
                      type="text"
                      :rules="rules.text"
                      maxlength="75"
                      counter
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-file-input
                      label="Comprobante*"
                      v-model="item.address_proof_doc"
                      variant="outlined"
                      density="compact"
                      :rules="rules.img"
                      show-size
                      prepend-icon=""
                      accept=".pdf"
                      :disabled="item.address_proof_dlt"
                    >
                      <template v-slot:append-inner>
                        <div
                          v-if="!isStoreMode && item.address_proof && !item.address_proof_doc"
                          class="d-flex"
                        >
                          <BtnDwd :val="item.address_proof_b64" />
                          <v-tooltip location="bottom">
                            <template v-slot:activator="{ props }">
                              <v-btn
                                v-bind="props"
                                icon
                                size="small"
                                variant="text"
                                :color="item.address_proof_dlt ? 'error' : ''"
                                @click.prevent="item.address_proof_dlt = !item.address_proof_dlt"
                              >
                                <v-icon icon="mdi-delete" />
                              </v-btn>
                            </template>
                            <span>{{ item.address_proof_dlt ? 'NO ' : '' }}Eliminar</span>
                          </v-tooltip>
                        </div>
                      </template>
                    </v-file-input>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12">
            <div class="text-right">
              <v-tooltip location="left">
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon
                    variant="flat"
                    size="x-small"
                    :color="isStoreMode ? 'success' : 'warning'"
                    @click.prevent="handleAction"
                    :loading="isLoading"
                  >
                    <v-icon icon="mdi-check" size="small" />
                  </v-btn>
                </template>
                <span>Confirmar</span>
              </v-tooltip>
            </div>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from '@/store'
import { URL_API, getHdrs, getErr, getRsp, getRules, getObj, getFormData } from '@/general'
import axios from 'axios'

// Componentes
import BtnBack from '@/components/BtnBack.vue'
import CardTitle from '@/components/CardTitle.vue'
import BtnDwd from '@/components/BtnDwd.vue'

// Constantes
const routeName = 'hospitals'

// Inyecciones
const alert = inject('alert')
const confirm = inject('confirm')
const store = useStore()
const router = useRouter()
const route = useRoute()

// Referencias reactivas
const itemId = ref(route.params.id ? atob(route.params.id) : null)
const isStoreMode = ref(!itemId.value)
const isLoading = ref(true)
const formRef = ref(null)
const item = ref(null)
const rules = getRules()

// Catálogos
const fiscal_types = ref([])
const fiscal_types_loading = ref(true)
const fiscal_regimes = ref([])
const fiscal_regimes_loading = ref(false)
const states = ref([])
const states_loading = ref(true)
const address_towns = ref([])
const address_towns_loading = ref(false)

// Obtener catálogos
const getCatalogs = async () => {
  try {
    // Obtener tipos fiscales
    const fiscalTypesResponse = await axios.get(
      `${URL_API}/system/fiscal_types`,
      getHdrs(store.getAuth?.token)
    )
    fiscal_types.value = getRsp(fiscalTypesResponse).data.items
    fiscal_types.value.push({ id: null, name: '-' })

    // Obtener estados
    const statesResponse = await axios.get(
      `${URL_API}/system/states`,
      getHdrs(store.getAuth?.token)
    )
    states.value = getRsp(statesResponse).data.items
  } catch (err) {
    alert?.show('error', getErr(err))
  } finally {
    fiscal_types_loading.value = false
    states_loading.value = false
  }
}

// Obtener datos del hospital
const getItem = async () => {
  if (isStoreMode.value) {
    item.value = {
      name: null,
      fee: null,
      logo: null,
      logo_doc: null,
      logo_dlt: false,
      contact: null,
      contact_phone: null,
      fiscal_constancy: null,
      fiscal_constancy_doc: null,
      fiscal_constancy_dlt: false,
      fiscal_code: null,
      fiscal_name: null,
      fiscal_zip: null,
      fiscal_type_id: null,
      fiscal_regime_id: null,
      address_zip: null,
      address_town: {
        state_id: null,
      },
      address_town_id: null,
      address_street: null,
      address_exterior: null,
      address_interior: null,
      address_neighborhood: null,
      address_proof: null,
      address_proof_doc: null,
      address_proof_dlt: false,
    }
    isLoading.value = false
  } else {
    try {
      const response = await axios.get(
        `${URL_API}/system/${routeName}/${itemId.value}`,
        getHdrs(store.getAuth?.token)
      )
      item.value = getRsp(response).data.item

      if (item.value.fiscal_regime_id) {
        await getFiscalRegimes(true)
      }

      await getAddressTowns(true)
    } catch (err) {
      alert?.show('error', getErr(err))
    } finally {
      isLoading.value = false
    }
  }
}

// Obtener regímenes fiscales
const getFiscalRegimes = async (mounted = false) => {
  if (!mounted) {
    item.value.fiscal_regime_id = null
  }

  fiscal_regimes_loading.value = true

  try {
    const response = await axios.get(
      `${URL_API}/system/fiscal_regimes?fiscal_type_id=${item.value.fiscal_type_id}`,
      getHdrs(store.getAuth?.token)
    )
    fiscal_regimes.value = getRsp(response).data.items
  } catch (err) {
    alert?.show('error', getErr(err))
  } finally {
    fiscal_regimes_loading.value = false
  }
}

// Obtener municipios
const getAddressTowns = async (mounted = false) => {
  if (!mounted) {
    item.value.address_town_id = null
  }

  address_towns_loading.value = true

  try {
    const response = await axios.get(
      `${URL_API}/system/towns?state_id=${item.value.address_town.state_id}`,
      getHdrs(store.getAuth?.token)
    )
    address_towns.value = getRsp(response).data.items
  } catch (err) {
    alert?.show('error', getErr(err))
  } finally {
    address_towns_loading.value = false
  }
}

// Manejar acción de guardar
const handleAction = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) {
    alert?.show('error', 'Revisa los detalles señalados')
    return
  }

  const confirmed = await confirm?.show(
    `¿Confirma ${isStoreMode.value ? 'agregar' : 'editar'} registro?`
  )
  if (!confirmed) return

  isLoading.value = true
  const obj = getObj(item.value, isStoreMode.value)

  try {
    const response = await axios.post(
      `${URL_API}/system/${routeName}${!isStoreMode.value ? `/${obj.id}` : ''}`,
      getFormData(obj),
      getHdrs(store.getAuth?.token, true)
    )
    const rsp = getRsp(response)

    alert?.show('success', rsp.msg)

    router.push({
      name: `${routeName}/show`,
      params: {
        id: btoa(isStoreMode.value ? rsp.data.item.id : itemId.value),
      },
    })
  } catch (err) {
    alert?.show('error', getErr(err))
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