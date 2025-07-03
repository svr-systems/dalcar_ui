<template>
  <v-card elevation="24" class="py-4 px-4" :disabled="ldg" :loading="ldg">
    <v-card-title>
      <v-row dense>
        <v-col cols="12">
          <BtnBack :route="{ name: routeName }" />
          <CardTitle :text="route.meta.title" :icon="route.meta.icon" />
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text v-if="item && !item.charged_at">
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>
              <CardTitle text="DETALLE" sub />
            </v-card-title>
            <v-divider />
            <v-card-text>
              <v-row dense>
                <v-col cols="12" md="4">
                  <VisVal lab="Folio" :val="item.uiid" :sub="item.created_at" />
                </v-col>
                <v-col cols="12" md="4">
                  <VisVal
                    lab="Médico"
                    :val="item.doctor.full_name"
                    :sub="item.doctor.uiid"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <VisVal
                    lab="Paciente"
                    :val="item.patient.full_name"
                    :sub="
                      item.patient.uiid + ' | Tel. ' + item.patient.movil_phone
                    "
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card>
            <v-card-title>
              <CardTitle text="COBRO" sub />
            </v-card-title>
            <v-divider />
            <v-card-text>
              <v-form ref="itemForm">
                <v-row dense>
                  <v-col cols="12" class="text-center">
                    <div class="font-weight-light">
                      <b>MONTO</b>
                    </div>
                    <div class="text-h2 pt-1 pb-4">
                      {{ getAmountFormat(item.charge_amount) }}
                    </div>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      label="E-mail del paciente"
                      v-model="item.patient.email"
                      variant="outlined"
                      type="text"
                      density="compact"
                      maxlength="65"
                      counter
                      :rules="rules.email_rqd"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-select
                      label="Forma de pago"
                      v-model="item.fiscal_payment_id"
                      variant="outlined"
                      density="compact"
                      :items="fiscal_payments"
                      :loading="fiscal_payments_ldg"
                      :disabled="fiscal_payments_ldg"
                      item-value="id"
                      :item-title="(v) => v.name + ' | ' + v.code"
                      :rules="rules.rqd"
                    />
                  </v-col>
                  <v-col cols="12" md="4" v-if="item.fiscal_payment_id == 3">
                    <v-text-field
                      label="Referencia"
                      v-model="item.charge_reference"
                      variant="outlined"
                      density="compact"
                      type="text"
                      maxlength="20"
                      counter
                      :rules="rules.txt_rqd"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="2"
                    v-if="
                      item.fiscal_payment_id == 4 ||
                      item.fiscal_payment_id == 18
                    "
                  >
                    <v-text-field
                      label="Núm. aprobación"
                      v-model="item.charge_aprobattion"
                      variant="outlined"
                      density="compact"
                      type="text"
                      maxlength="10"
                      counter
                      :rules="rules.txt_rqd"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="2"
                    v-if="
                      item.fiscal_payment_id == 4 ||
                      item.fiscal_payment_id == 18
                    "
                  >
                    <v-text-field
                      label="Tarjeta (4 últ. dig.)"
                      v-model="item.charge_card"
                      variant="outlined"
                      density="compact"
                      type="text"
                      maxlength="4"
                      counter
                      :rules="rules.txt_rqd"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-divider />
                  </v-col>
                  <v-col cols="12">
                    <v-select
                      label="¿Requiere factura fiscal?"
                      v-model="item.bill_patient"
                      variant="outlined"
                      density="compact"
                      :items="bill_patient_opts"
                      item-value="id"
                      :item-title="(v) => v.name"
                      :rules="[(v) => v != null || 'Campo requerido']"
                    />
                  </v-col>
                  <v-col cols="12" v-if="item.bill_patient">
                    <v-row dense>
                      <v-col cols="12" md="3">
                        <v-text-field
                          label="RFC"
                          v-model="item.fiscal_code"
                          variant="outlined"
                          density="compact"
                          type="text"
                          maxlength="13"
                          counter
                          :rules="rules.fiscal_code_rqd"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          label="Nombre | Razón social"
                          v-model="item.fiscal_name"
                          variant="outlined"
                          density="compact"
                          type="text"
                          maxlength="75"
                          counter
                          :rules="rules.txt_rqd"
                        />
                      </v-col>
                      <v-col cols="12" md="3">
                        <v-text-field
                          label="CP"
                          v-model="item.fiscal_zip"
                          variant="outlined"
                          density="compact"
                          type="text"
                          maxlength="5"
                          counter
                          :rules="rules.zip_rqd"
                        />
                      </v-col>
                      <v-col cols="12" md="3">
                        <v-select
                          label="Tipo Fiscal"
                          v-model="item.fiscal_type_id"
                          variant="outlined"
                          density="compact"
                          :items="fiscal_types"
                          :loading="fiscal_types_ldg"
                          :disabled="fiscal_types_ldg"
                          item-value="id"
                          :item-title="(v) => v.name"
                          :rules="rules.rqd"
                          @update:modelValue="getFiscalRegimes()"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-autocomplete
                          label="Régimen Fiscal"
                          v-model="item.fiscal_regime_id"
                          variant="outlined"
                          density="compact"
                          :items="fiscal_regimes"
                          :loading="fiscal_regimes_ldg"
                          :disabled="fiscal_regimes_ldg"
                          item-value="id"
                          :item-title="(v) => v.name + ' | ' + v.code"
                          :rules="rules.rqd"
                          @update:modelValue="getFiscalUses()"
                        />
                      </v-col>
                      <v-col cols="12" md="3">
                        <v-autocomplete
                          label="Uso CFDI"
                          v-model="item.fiscal_use_id"
                          variant="outlined"
                          density="compact"
                          :items="fiscal_uses"
                          :loading="fiscal_uses_ldg"
                          :disabled="fiscal_uses_ldg"
                          item-value="id"
                          :item-title="(v) => v.name + ' | ' + v.code"
                          :rules="rules.rqd"
                        />
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12">
                    <v-divider />
                  </v-col>
                  <v-col cols="12">
                    <v-row dense justify="center" class="text-center">
                      <v-col cols="12" class="font-weight-light">
                        <b>COMPROBANTE DE PAGO</b>
                      </v-col>
                      <v-col cols="10" md="4" class="py-3">
                        <video
                          ref="videoRef"
                          v-if="!capture"
                          autoplay
                          playsinline
                          width="100%"
                        />
                        <v-img v-else :src="capture" alt="Comprobante" />
                      </v-col>
                      <v-col cols="12">
                        <v-btn
                          :icon="capture ? 'mdi-camera-retake' : 'mdi-camera'"
                          size="x-small"
                          variant="outlined"
                          :color="capture ? '' : 'warning'"
                          class="mx-1"
                          @click="captureHandle"
                        />
                        <v-btn
                          v-if="capture"
                          icon="mdi-arrow-expand"
                          size="x-small"
                          variant="outlined"
                          class="mx-1"
                          @click="capture_dlg = true"
                        />
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-btn
            block
            size="small"
            color="success"
            :loading="ldg"
            @click.prevent="handleAction"
          >
            Continuar
            <v-icon icon="mdi-account-cash" size="small" end />
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <v-dialog v-model="capture_dlg" persistent scrim="black" max-width="600">
    <v-card flat>
      <v-card-title class="card_title_border">
        <v-row dense>
          <v-col cols="9">
            <CardTitle text="CAPTURA" sub />
          </v-col>
          <v-col cols="3" class="text-right">
            <v-tooltip location="left">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  color="primary"
                  size="small"
                  icon="mdi-close"
                  variant="text"
                  @click="capture_dlg = false"
                />
              </template>
              <span>Cerrar</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text v-if="capture">
        <v-row dense>
          <v-col cols="12">
            <v-img :src="capture" alt="Comprobante" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, inject } from "vue";
import { useAuthStore } from "@/store";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import {
  URL_API,
  getHdrs,
  getRsp,
  getErr,
  getRules,
  getObj,
  getFormData,
  getAmountFormat,
} from "@/general";
import BtnBack from "@/components/BtnBack.vue";
import CardTitle from "@/components/CardTitle.vue";
import VisVal from "@/components/VisVal.vue";

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const alert = inject("alert");
const confirm = inject("confirm");
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const routeName = "module/consultations";
const id = ref(window.atob(route.params.id));
const ldg = ref(true);
const item = ref(null);
const itemForm = ref(null);
const rules = getRules();
const fiscal_payments = ref([]);
const fiscal_payments_ldg = ref(true);
const bill_patient_opts = ref([
  { id: 0, name: "NO" },
  { id: 1, name: "SI" },
  { id: null, name: "-" },
]);
const fiscal_types = ref([]);
const fiscal_types_ldg = ref(true);
const fiscal_regimes = ref([]);
const fiscal_regimes_ldg = ref(false);
const fiscal_uses = ref([]);
const fiscal_uses_ldg = ref(false);
const videoRef = ref(null);
const camera_stream = ref(null);
const capture = ref(null);
const capture_doc = ref(null);
const capture_dlg = ref(false);
const camera_active = ref(false);

const getCatalogs = async () => {
  axios
    .get(URL_API + "/module/fiscal_payments", getHdrs(authStore.getAuth.token))
    .then((rsp) => {
      fiscal_payments.value = getRsp(rsp).data.items;
    })
    .catch((err) => {
      alert?.show("error", getErr(err));
    })
    .finally(() => {
      fiscal_payments_ldg.value = false;
    });

  axios
    .get(URL_API + "/module/fiscal_types", getHdrs(authStore.getAuth.token))
    .then((rsp) => {
      fiscal_types.value = getRsp(rsp).data.items;
    })
    .catch((err) => {
      alert?.show("error", getErr(err));
    })
    .finally(() => {
      fiscal_types_ldg.value = false;
    });
};

const getItem = async () => {
  try {
    const rsp = getRsp(
      await axios.get(
        URL_API + "/" + routeName + "/" + id.value,
        getHdrs(authStore.getAuth.token)
      )
    );

    item.value = rsp.data.item;

    if (item.value.charged_at) router.push({ name: routeName });

    item.value.fiscal_name = item.value.patient.full_name;

    await getFiscalRegimes(true);
    await getFiscalUses(true);
  } catch (err) {
    alert?.show("error", getErr(err));
  } finally {
    ldg.value = false;
  }
};

const getFiscalRegimes = async (isMounted = false) => {
  if (!isMounted) {
    item.value.fiscal_regime_id = null;
    item.value.fiscal_use_id = null;
  }

  fiscal_regimes_ldg.value = true;

  try {
    fiscal_regimes.value = getRsp(
      await axios.get(
        URL_API +
          "/module/fiscal_regimes?fiscal_type_id=" +
          item.value.fiscal_type_id,
        getHdrs(authStore.getAuth.token)
      )
    ).data.items;
  } catch (err) {
    alert?.show("error", getErr(err));
  } finally {
    fiscal_regimes_ldg.value = false;
  }
};

const getFiscalUses = async (isMounted = false) => {
  if (!isMounted) {
    item.value.fiscal_use_id = null;
  }

  fiscal_uses_ldg.value = true;

  try {
    fiscal_uses.value = getRsp(
      await axios.get(
        URL_API +
          "/module/fiscal_uses?fiscal_regime_id=" +
          item.value.fiscal_regime_id,
        getHdrs(authStore.getAuth.token)
      )
    ).data.items;
  } catch (err) {
    alert?.show("error", getErr(err));
  } finally {
    fiscal_uses_ldg.value = false;
  }
};

const handleAction = async () => {
  const { valid } = await itemForm.value.validate();

  if (!valid) {
    alert?.show("error", "Revisa los detalles señalados");
    return;
  }

  const confirmed = await confirm?.show("¿Confirma el cobro de la consulta?");
  if (!confirmed) return;

  ldg.value = true;

  try {
    let obj = getObj(item.value, true);

    if (capture_doc.value) {
      obj.charge_proof_doc = capture_doc.value;
    }

    const rsp = getRsp(
      await axios.post(
        URL_API + "/" + routeName,
        getFormData(obj),
        getHdrs(authStore.getAuth.token, true)
      )
    );

    alert?.show("success", rsp.msg);
    router.push({ name: routeName });
  } catch (err) {
    alert?.show("error", getErr(err));
  } finally {
    ldg.value = false;
  }
};

//CAMERA METHODS
const cameraStart = async () => {
  try {
    camera_stream.value = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    camera_active.value = true;
    capture.value = null;

    setTimeout(() => {
      if (videoRef.value) {
        videoRef.value.srcObject = camera_stream.value;
      } else {
        alert?.show(
          "error",
          "El elemento <video> no está disponible en el DOM."
        );
      }
    }, 100);
  } catch (err) {
    alert?.show("error", getErr(err));
  }
};

const stopCamera = () => {
  if (camera_stream.value) {
    camera_stream.value.getTracks().forEach((track) => track.stop());
  }
  camera_stream.value = null;
  camera_active.value = false;
};

const capturePhoto = () => {
  if (!camera_active.value || !videoRef.value) return;

  const video = videoRef.value;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  capture.value = canvas.toDataURL("image/jpeg", 0.9);

  fetch(capture.value)
    .then((res) => res.blob())
    .then((blob) => {
      capture_doc.value = new File([blob], "photo.jpg", {
        type: "image/jpeg",
      });
    });

  stopCamera();
};

const captureHandle = () => {
  if (capture.value) {
    capture.value = null;
    capture_doc.value = null;
    cameraStart();
  } else {
    capturePhoto();
  }
};

onMounted(() => {
  getCatalogs();
  getItem();
  cameraStart();
});

onBeforeUnmount(() => {
  stopCamera();
  capture.value = null;
});
</script>
