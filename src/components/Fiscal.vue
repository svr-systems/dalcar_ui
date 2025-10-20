<template>
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
</template>

<script setup>
import CardTitle from "@/components/CardTitle.vue";
import VisVal from "@/components/VisVal.vue";
import VisDoc from "@/components/VisDoc.vue";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});
</script>