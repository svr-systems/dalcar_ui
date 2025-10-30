<template>
  <v-col cols="12">
    <v-card>
      <v-card-title>
        <v-row dense>
          <v-col cols="11">
            <CardTitle text="DATOS GENERALES" sub />
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-form ref="legacyVehicleClientForm" @submit.prevent>
          <v-row dense>
            <v-col cols="12" md="4">
              <v-text-field
                label="Nombre"
                v-model="legacyVehicleClient.first_name"
                type="text"
                variant="outlined"
                density="compact"
                maxlength="50"
                autocomplete="off"
              />
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                label="Apellido paterno"
                v-model="legacyVehicleClient.last_name"
                type="text"
                variant="outlined"
                density="compact"
                maxlength="50"
                autocomplete="off"
              />
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                label="Apellido materno*"
                v-model="legacyVehicleClient.mother_last_name"
                type="text"
                variant="outlined"
                density="compact"
                maxlength="50"
                autocomplete="off"
              />
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field
                label="CURP"
                v-model="legacyVehicleClient.curp"
                type="text"
                variant="outlined"
                density="compact"
                maxlength="18"
                autocomplete="off"
              />
            </v-col>

            <v-col cols="12" md="3">
              <v-file-input
                label="Identificación oficial"
                v-model="legacyVehicleClient.identification_file"
                variant="outlined"
                density="compact"
                prepend-icon=""
                show-size
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field
                label="Teléfono"
                v-model="legacyVehicleClient.phone"
                type="tel"
                variant="outlined"
                density="compact"
                maxlength="15"
                autocomplete="off"
              />
            </v-col>

            <v-col cols="12" md="3">
              <v-text-field
                label="E-mail"
                v-model="legacyVehicleClient.email"
                type="email"
                variant="outlined"
                density="compact"
                maxlength="100"
                autocomplete="off"
              />
            </v-col>
          </v-row>
        </v-form>
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
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col cols="12" md="6">
            <v-text-field
              label="Calle"
              v-model="legacyVehicleClient.street"
              type="text"
              variant="outlined"
              density="compact"
              maxlength="100"
              autocomplete="off"
            />
          </v-col>

          <v-col cols="12" md="3">
            <v-text-field
              label="No. Exterior"
              v-model="legacyVehicleClient.exterior_number"
              type="text"
              variant="outlined"
              density="compact"
              maxlength="10"
              autocomplete="off"
            />
          </v-col>

          <v-col cols="12" md="3">
            <v-text-field
              label="No. Interior*"
              v-model="legacyVehicleClient.interior_number"
              type="text"
              variant="outlined"
              density="compact"
              maxlength="10"
              autocomplete="off"
            />
          </v-col>

          <v-col cols="12" md="3">
            <v-text-field
              label="Colonia"
              v-model="legacyVehicleClient.neighborhood"
              type="text"
              variant="outlined"
              density="compact"
              maxlength="100"
              autocomplete="off"
            />
          </v-col>

          <v-col cols="12" md="3">
            <v-text-field
              label="Código postal"
              v-model="legacyVehicleClient.postal_code"
              type="text"
              variant="outlined"
              density="compact"
              maxlength="5"
              autocomplete="off"
            />
          </v-col>

          <v-col cols="12" md="3">
            <v-select
              label="Estado"
              v-model="legacyVehicleClient.state_id"
              :items="states"
              item-value="id"
              item-title="name"
              variant="outlined"
              density="compact"
            />
          </v-col>

          <v-col cols="12" md="3">
            <v-select
              label="Municipio"
              v-model="legacyVehicleClient.municipality_id"
              :items="municipalities"
              item-value="id"
              item-title="name"
              variant="outlined"
              density="compact"
            />
          </v-col>

          <v-col cols="12" md="12">
            <v-file-input
              label="Comprobante de domicilio"
              v-model="legacyVehicleClient.address_proof_file"
              variant="outlined"
              density="compact"
              prepend-icon=""
              show-size
              accept=".pdf,.jpg,.jpeg,.png"
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
            <CardTitle text="FISCAL" sub />
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-row dense>
          <v-col cols="12" md="4">
            <v-file-input
              label="CSF*"
              v-model="legacyVehicleClient.csf_file"
              variant="outlined"
              density="compact"
              prepend-icon=""
              show-size
              accept=".cer,.key,.p12"
            />
          </v-col>

          <v-col cols="12" md="8">
            <v-select
              label="Razón social"
              v-model="legacyVehicleClient.business_name_id"
              :items="businessNames"
              item-value="id"
              item-title="name"
              variant="outlined"
              density="compact"
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field
              label="RFC"
              v-model="legacyVehicleClient.rfc"
              type="text"
              variant="outlined"
              density="compact"
              maxlength="13"
              autocomplete="off"
            />
          </v-col>

          <v-col cols="12" md="8">
            <v-select
              label="Régimen fiscal"
              v-model="legacyVehicleClient.tax_regime_id"
              :items="taxRegimes"
              item-value="id"
              item-title="name"
              variant="outlined"
              density="compact"
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field
              label="CP"
              v-model="legacyVehicleClient.fiscal_postal_code"
              type="text"
              variant="outlined"
              density="compact"
              maxlength="5"
              autocomplete="off"
            />
          </v-col>

          <v-col cols="12" md="8">
            <v-select
              label="Uso de CFDI"
              v-model="legacyVehicleClient.cfdi_usage_id"
              :items="cfdiUsages"
              item-value="id"
              item-title="name"
              variant="outlined"
              density="compact"
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
        color="success"
        @click.prevent="legacyVehicleClientAdd()"
        :loading="legacyVehicleClientLdg"
      >
        <v-icon>mdi-check</v-icon>
        <v-tooltip activator="parent" location="left">
          Continuar
        </v-tooltip>
      </v-btn>
    </div>
  </v-col>
</template>

<script setup>
import { ref } from "vue";

import { getDateTime } from "@/utils/formatters";

import CardTitle from "@/components/CardTitle.vue";
import InpDate from "@/components/InpDate.vue";

const currentDate = ref(getDateTime("-", "", "", false));

const states = ref([]);
const municipalities = ref([]);
const businessNames = ref([]);
const taxRegimes = ref([]);
const cfdiUsages = ref([]);

try {
  // const endpoint = `${URL_API}/states?is_active=1&filter=0`
  // const response = await axios.get(endpoint, getHdrs(store.getAuth?.token))
  // item.value = getRsp(response).data.item
  states.value = [
    { id: 1, name: "Aguascalientes" },
    { id: 2, name: "Baja California" },
    { id: 3, name: "Baja California Sur" },
    { id: 4, name: "Campeche" },
    { id: 5, name: "Chiapas" },
    { id: 6, name: "Chihuahua" },
    { id: 7, name: "Coahuila" },
    { id: 8, name: "Colima" },
    { id: 9, name: "Ciudad de México" },
    { id: 10, name: "Durango" },
    { id: 11, name: "Guanajuato" },
    { id: 12, name: "Guerrero" },
    { id: 13, name: "Hidalgo" },
    { id: 14, name: "Jalisco" },
    { id: 15, name: "México" },
    { id: 16, name: "Michoacán" },
    { id: 17, name: "Morelos" },
    { id: 18, name: "Nayarit" },
    { id: 19, name: "Nuevo León" },
    { id: 20, name: "Oaxaca" },
    { id: 21, name: "Puebla" },
    { id: 22, name: "Querétaro" },
    { id: 23, name: "Quintana Roo" },
    { id: 24, name: "San Luis Potosí" },
    { id: 25, name: "Sinaloa" },
    { id: 26, name: "Sonora" },
    { id: 27, name: "Tabasco" },
    { id: 28, name: "Tamaulipas" },
    { id: 29, name: "Tlaxcala" },
    { id: 30, name: "Veracruz" },
    { id: 31, name: "Yucatán" },
    { id: 32, name: "Zacatecas" },
  ];
} catch (err) {
  alert?.show("red-darken-1", getErr(err));
}

try {
  // const endpoint = `${URL_API}/municipalities?is_active=1&filter=0`
  // const response = await axios.get(endpoint, getHdrs(store.getAuth?.token))
  // item.value = getRsp(response).data.item
  municipalities.value = [
    { id: 1, name: "Álvaro Obregón" },
    { id: 2, name: "Azcapotzalco" },
    { id: 3, name: "Benito Juárez" },
    { id: 4, name: "Coyoacán" },
    { id: 5, name: "Cuajimalpa" },
    { id: 6, name: "Cuauhtémoc" },
    { id: 7, name: "Gustavo A. Madero" },
    { id: 8, name: "Iztacalco" },
    { id: 9, name: "Iztapalapa" },
    { id: 10, name: "Magdalena Contreras" },
    { id: 11, name: "Miguel Hidalgo" },
    { id: 12, name: "Milpa Alta" },
    { id: 13, name: "Tláhuac" },
    { id: 14, name: "Tlalpan" },
    { id: 15, name: "Venustiano Carranza" },
    { id: 16, name: "Xochimilco" },
  ];
} catch (err) {
  alert?.show("red-darken-1", getErr(err));
}

try {
  // const endpoint = `${URL_API}/business_names?is_active=1&filter=0`
  // const response = await axios.get(endpoint, getHdrs(store.getAuth?.token))
  // item.value = getRsp(response).data.item
  businessNames.value = [
    { id: 1, name: "Empresa Individual" },
    { id: 2, name: "Sociedad Anónima" },
    { id: 3, name: "Sociedad de Responsabilidad Limitada" },
    { id: 4, name: "Sociedad Civil" },
    { id: 5, name: "Asociación Civil" },
  ];
} catch (err) {
  alert?.show("red-darken-1", getErr(err));
}

try {
  // const endpoint = `${URL_API}/tax_regimes?is_active=1&filter=0`
  // const response = await axios.get(endpoint, getHdrs(store.getAuth?.token))
  // item.value = getRsp(response).data.item
  taxRegimes.value = [
    { id: 1, name: "Régimen General de Ley" },
    { id: 2, name: "Régimen de Incorporación Fiscal" },
    { id: 3, name: "Régimen de Actividades Empresariales" },
    { id: 4, name: "Régimen de Arrendamiento" },
    { id: 5, name: "Régimen de Sueldos y Salarios" },
    { id: 6, name: "Régimen de Honorarios" },
  ];
} catch (err) {
  alert?.show("red-darken-1", getErr(err));
}

try {
  // const endpoint = `${URL_API}/cfdi_usages?is_active=1&filter=0`
  // const response = await axios.get(endpoint, getHdrs(store.getAuth?.token))
  // item.value = getRsp(response).data.item
  cfdiUsages.value = [
    { id: 1, name: "Adquisición de mercancías" },
    { id: 2, name: "Devoluciones, descuentos o bonificaciones" },
    { id: 3, name: "Gastos en general" },
    { id: 4, name: "Construcciones" },
    { id: 5, name: "Mobiliario y equipo de oficina" },
    { id: 6, name: "Equipo de transporte" },
    { id: 7, name: "Equipo de cómputo y accesorios" },
    { id: 8, name: "Dados, troqueles, moldes, matrices y herramental" },
    { id: 9, name: "Comunicaciones telefónicas" },
    { id: 10, name: "Comunicaciones satelitales" },
  ];
} catch (err) {
  alert?.show("red-darken-1", getErr(err));
}

const props = defineProps({
  legacyVehicleId: {
    type: String,
    required: true,
  },
  isActive: {
    type: Number,
    required: true,
  },
});

const legacyVehicleClient = ref({
  id: null,
  legacy_vehicle_id: props.legacyVehicleId,
  first_name: "Carlos",
  last_name: "Rodríguez",
  mother_last_name: "García",
  curp: "ROGC850101HDFRRL01",
  identification_file: null,
  phone: "5551234567",
  email: "carlos.rodriguez@email.com",
  street: "Calle Miguel Hidalgo",
  exterior_number: "123",
  interior_number: "A",
  neighborhood: "Centro",
  postal_code: "06000",
  state_id: 9,
  municipality_id: 6,
  address_proof_file: null,
  csf_file: null,
  business_name_id: 1,
  rfc: "ROGC850101ABC",
  tax_regime_id: 1,
  fiscal_postal_code: "06000",
  cfdi_usage_id: 1,
});

const legacyVehicleClientForm = ref(null);
const legacyVehicleClientLdg = ref(false);

const legacyVehicleClientAdd = async () => {
  console.log("Saving client:", legacyVehicleClient.value);
  alert("Cliente guardado exitosamente");
};
</script>