<template>
  <v-card :loading="isLoading">
    <v-card-title>
      <v-row dense>
        <v-col cols="10">
          <BtnBack :route="{ name: routeName }" />
          <CardTitle :text="route.meta.title" :icon="route.meta.icon" />
        </v-col>
        <v-col v-if="item" cols="2" class="text-right">
          <v-btn
            v-if="item.active"
            icon
            variant="flat"
            size="x-small"
            color="warning"
            :to="{ name: `${routeName}/update`, params: { id: getEncodeId(itemId) } }"
          >
            <v-icon>mdi-pencil</v-icon>
            <v-tooltip activator="parent" location="left">Editar</v-tooltip>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-title>

    <v-card-text v-if="item">
      <v-row>
        <v-col v-if="!item.active" cols="12">
          <v-alert type="error" density="compact" class="rounded">
            <v-row dense>
              <v-col class="grow pt-2">El registro se encuentra inactivo</v-col>
              <v-col v-if="store.getAuth?.user?.role_id === 1" class="shrink text-right">
                <v-btn
                  icon
                  variant="flat"
                  size="x-small"
                  color="success"
                  @click.prevent="restoreItem"
                >
                  <v-icon>mdi-delete-restore</v-icon>
                  <v-tooltip activator="parent" location="left">Reactivar</v-tooltip>
                </v-btn>
              </v-col>
            </v-row>
          </v-alert>
        </v-col>

        <v-col cols="12">
          <v-card>
            <v-card-title>
              <v-row dense>
                <v-col cols="11">
                  <CardTitle :text="'DATOS GENERALES | ' + item.uiid" sub />
                </v-col>
                <v-col cols="1" class="text-right">
                  <v-btn
                    v-if="store.getAuth?.user?.role_id === 1"
                    icon
                    variant="flat"
                    size="x-small"
                    @click.prevent="regDialog = true"
                  >
                    <v-icon>mdi-clock-outline</v-icon>
                    <v-tooltip activator="parent" location="left">Registro</v-tooltip>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-title>

            <v-card-text>
              <v-row dense>
                <v-col cols="12" md="9">
                  <VisVal label="Nombre comercial" :value="item.name" />
                </v-col>
                <v-col cols="12" md="3">
                  <VisDoc label="Logo" :value="item.logo_b64" img />
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
                  <CardTitle text="FISCAL" sub />
                </v-col>
                <v-col cols="1" class="text-right" />
              </v-row>
            </v-card-title>
            <v-card-text>
              <v-row dense>
                <v-col cols="12" md="6">
                  <VisVal label="Nombre | Razón Social" :value="item.fiscal_name" />
                </v-col>
                <v-col cols="12" md="3">
                  <VisVal label="RFC" :value="item.fiscal_code" />
                </v-col>
                <v-col cols="12" md="3">
                  <VisVal label="Código postal" :value="item.fiscal_zip" />
                </v-col>
                <v-col cols="12" md="6">
                  <VisVal label="Regimen fiscal" :value="item.fiscal_regime.name" />
                </v-col>
                <v-col cols="12" md="6">
                  <VisVal
                    label="Dirección (calle | núm. exterior | núm. interior)"
                    :value="item.fiscal_address"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <VisVal label="Colonia" :value="item.fiscal_neighborhood" />
                </v-col>
                <v-col cols="12" md="4">
                  <VisVal label="Estado" :value="item.fiscal_town.state.name" />
                </v-col>
                <v-col cols="12" md="4">
                  <VisVal label="Municipio" :value="item.fiscal_town.name" />
                </v-col>
                <v-col cols="12" class="pb-5">
                  <v-divider />
                </v-col>
                <v-col cols="12" md="4">
                  <VisDoc label="FIEL .cer" :value="item.fiscal_fiel_cer_b64" />
                </v-col>
                <v-col cols="12" md="4">
                  <VisDoc label=".key" :value="item.fiscal_fiel_key_b64" />
                </v-col>
                <v-col cols="12" md="4">
                  <div>
                    <div :class="['font-weight-light', 'text-caption']">Clave</div>
                    <div>
                      <v-icon size="x-small" :color="item.fiscal_fiel_pass ? 'info' : ''">
                        mdi-checkbox-blank-circle{{ item.fiscal_fiel_pass ? '' : '-outline' }}
                      </v-icon>
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" md="4">
                  <VisDoc label="CSD .cer" :value="item.fiscal_csd_cer_b64" />
                </v-col>
                <v-col cols="12" md="4">
                  <VisDoc label=".key" :value="item.fiscal_csd_key_b64" />
                </v-col>
                <v-col cols="12" md="4">
                  <div>
                    <div :class="['font-weight-light', 'text-caption']">Clave</div>
                    <div>
                      <v-icon size="x-small" :color="item.fiscal_csd_pass ? 'info' : ''">
                        mdi-checkbox-blank-circle{{ item.fiscal_csd_pass ? '' : '-outline' }}
                      </v-icon>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col v-if="item.active && store.getAuth?.user?.role_id === 1" cols="12">
          <v-btn
            icon
            variant="flat"
            size="x-small"
            color="red-darken-1"
            @click.prevent="deleteItem"
          >
            <v-icon>mdi-minus-thick</v-icon>
            <v-tooltip activator="parent" location="right">Inactivar</v-tooltip>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>

    <DlgReg v-model="regDialog" :item="item" />
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
import { getDecodeId, getEncodeId } from '@/utils/coders'

// Componentes
import BtnBack from '@/components/BtnBack.vue'
import CardTitle from '@/components/CardTitle.vue'
import DlgReg from '@/components/DlgReg.vue'
import VisVal from '@/components/VisVal.vue'
import VisDoc from '@/components/VisDoc.vue'

// Constantes fijas
const routeName = 'companies'

// Estado y referencias
const alert = inject('alert')
const confirm = inject('confirm')
const store = useStore()
const router = useRouter()
const route = useRoute()

// Estado reactivo
const itemId = ref(getDecodeId(route.params.id))
const isLoading = ref(true)
const item = ref(null)
const regDialog = ref(false)

// Obtener registro
const getItem = async () => {
  isLoading.value = true
  try {
    // const endpoint = `${URL_API}/system/${routeName}/${itemId.value}`
    // const response = await axios.get(endpoint, getHdrs(store.getAuth?.token))
    // item.value = getRsp(response).data.item
    item.value = {
      id: 1,
      active: true,
      uiid: 'E-0001',
      name: 'DALCAR AUTOMOTRIZ',
      logo: null,
      logo_doc: null,
      logo_dlt: false,
      logo_b64: null,
      fiscal_name: 'DALCAR AUTOMOTRIZ',
      fiscal_code: 'XYZ112233AB1',
      fiscal_zip: '00000',
      fiscal_regime: {
        name: 'REGIMEN GENERAL DE LEY PERSONAS MORALES | 601',
      },
      fiscal_address: null,
      fiscal_neighborhood: null,
      fiscal_town: {
        name: 'QUERETARO',
        state: {
          name: 'QUERETARO',
        },
      },
      fiscal_fiel_cer: null,
      fiscal_fiel_cer_doc: null,
      fiscal_fiel_cer_dlt: false,
      fiscal_fiel_cer_b64: null,
      fiscal_fiel_key: null,
      fiscal_fiel_key_doc: null,
      fiscal_fiel_key_dlt: false,
      fiscal_fiel_key_b64: null,
      fiscal_fiel_pass: null,
      fiscal_csd_cer: null,
      fiscal_csd_cer_doc: null,
      fiscal_csd_cer_dlt: false,
      fiscal_csd_cer_b64: null,
      fiscal_csd_key: null,
      fiscal_csd_key_doc: null,
      fiscal_csd_key_dlt: false,
      fiscal_csd_key_b64: null,
      fiscal_csd_pass: null,
    }
  } catch (err) {
    alert?.show('red-darken-1', getErr(err))
  } finally {
    isLoading.value = false
  }
}

// Inactivar
const deleteItem = async () => {
  const confirmed = await confirm?.show('¿Confirma inactivar el registro?')
  if (!confirmed) return

  isLoading.value = true
  try {
    const endpoint = `${URL_API}/system/${routeName}/${itemId.value}`
    const response = getRsp(await axios.delete(endpoint, getHdrs(store.getAuth?.token)))
    alert?.show('red-darken-1', response.msg)
    router.push({ name: routeName })
  } catch (err) {
    alert?.show('red-darken-1', getErr(err))
  } finally {
    isLoading.value = false
  }
}

// Reactivar
const restoreItem = async () => {
  const confirmed = await confirm?.show('¿Confirma activar el registro?')
  if (!confirmed) return

  isLoading.value = true
  try {
    const endpoint = `${URL_API}/system/${routeName}/restore`
    const response = getRsp(
      await axios.post(endpoint, { id: itemId.value }, getHdrs(store.getAuth?.token))
    )
    item.value = response.data.item
    alert?.show('success', response.msg)
  } catch (err) {
    alert?.show('red-darken-1', getErr(err))
  } finally {
    isLoading.value = false
  }
}

// Inicializar
onMounted(() => {
  getItem()
})
</script>
