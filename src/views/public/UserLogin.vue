<template>
  <v-row justify="center">
    <v-col cols="12" md="4" class="mt-11">
      <v-card
        elevation="24"
        class="py-4 px-4"
        :loading="isLoading"
        :disabled="isLoading"
      >
        <v-card-text class="text-center">
          <v-row dense>
            <v-col cols="12" class="text-left" style="height: 40px" />
            <v-col cols="12" class="pb-6">
              <Logo width="60%" />
            </v-col>
            <v-col cols="12">
              <v-form ref="formRef" @submit.prevent="loginAction">
                <v-row dense>
                  <v-col cols="12" class="text-left">
                    <v-text-field
                      v-model="item.email"
                      label="E-mail"
                      type="email"
                      variant="outlined"
                      density="compact"
                      maxlength="65"
                      counter
                      :rules="rules.emailRequired"
                      autocomplete="email"
                      hide-details="auto"
                    />
                  </v-col>
                  <v-col cols="12" class="text-left">
                    <InpPassword
                      v-model="item.password"
                      label="Contraseña"
                      counter
                      :rules="rules.required"
                      autocomplete="current-password"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-btn
                      block
                      color="info"
                      type="submit"
                      :loading="isLoading"
                    >
                      Iniciar sesión
                      <v-icon end>mdi-login</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-col>
            <v-col cols="12" class="pt-4">
              <v-btn
                variant="text"
                size="x-small"
                :to="{
                  name: 'user_password_recover',
                  query: { email: item.email },
                }"
              >
                ¿Olvidaste tu contraseña?
              </v-btn>
            </v-col>
            <v-col cols="12" class="pt-8">
              <BtnTheme />
            </v-col>
            <v-col cols="12" class="pt-2">
              <Version />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
// Librerías
import { ref, inject } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

// Estado global y utilidades
import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getHdrs, getErr, getRsp } from "@/utils/http";
import { getObj } from "@/utils/helpers";
import { getRules } from "@/utils/validators";

// Componentes
import Logo from "@/components/Logo.vue";
import InpPassword from "@/components/InpPassword.vue";
import BtnTheme from "@/components/BtnTheme.vue";
import Version from "@/components/Version.vue";

// Estado
const alert = inject("alert");
const router = useRouter();
const store = useStore();

const isLoading = ref(false);
const formRef = ref(null);
const item = ref({
  email: "",
  password: "",
});
const rules = getRules();

// Funciones
const loginAction = async () => {
  const { valid } = await formRef.value.validate();
  if (!valid) return;

  isLoading.value = true;
  const payload = getObj(item.value, true);

  try {
    // const endpoint = `${URL_API}/login`
    // const response = await axios.post(endpoint, payload, getHdrs())
    const response = {
      data: {
        msg: "Datos de acceso validos",
        data: {
          auth: {
            token:
              "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIwMTk4NWRmZC0wNTM0LTcyODktYTQyZi0wNzE3NWRhMmUyNmQiLCJqdGkiOiJmMTQ0MGZhYTM5ZmRlMzM1YjMzOWU0YjNjNGVhMmU1N2M3NTY5MzQ4YjVkMjNmODVmZjNlYjBmNWYwZDJlNDM3M2Q1ZGY1ZDhjYTAxMWU0NiIsImlhdCI6MTc1NDk0NDQ5Mi43MDUxNDgsIm5iZiI6MTc1NDk0NDQ5Mi43MDUxNSwiZXhwIjoxNzg2NDgwNDkyLjcwMTIxMywic3ViIjoiMSIsInNjb3BlcyI6W119.R2afKGjvsvl9AmkwZo90frshI9xoIT2hv4vAxDROle147REv25ZNDWMbdINFfIIs-AY4LVhxCMztxnoKrLrhSlr-3b3biDfdho6-jo36QAPSSqgsWiq6QwXFgvty3_918yfuIMle5p5Xt_wB6aUS83as4uoOPzg2IChXAjXgiyDV23pK3xwPsOG8TV1JPfHHqabunXKpbIeLryLZgkjSR34OzAqOAwoFWCZVBCUBjU70-nf9pf1yytWuMLUcKSc0lxE5JcRnoAggLpyBvI24dLdS_aQz01UH6v6tKBtOmb2sMB69vAGWTX8WLTC61--9NF_xeA1YAV3qb0A1OrbELiXb1d6wb18AegxQfE5NI_3tM5n3nFjp6pVVaiAzJ5U3HEy86OBGvIrTMZ-1VuRoZHYnfWbtuWTiyEeLXm8cviF23PBr5bJiir0crYoiXaV65P2Zr1vHILCMyhD9BdEfFmkiMqI3Bj4PsB5xC8S3NbSn2s03Mx8AW0ecWRSL87gSeh5V2U5SxGx2DGT9ndxvkfxXKpLomB5gd-e-2JnDRrgeH-bcQ8w5jKKKV3oc0rBRTKEkdUX5iVDY7z7uobadbbfji2P0r4fq69g4vG_PNF9V08OK6m-EnszVTvdLqUqAxQ6HuuoPG5xCsx2n9oYyFl_s3F9rvm-m4Z3rhwnajQ4",
            user: {
              id: 1,
              name: "TEST",
              surname_p: "DALCAR",
              surname_m: null,
              avatar: "aK8XMCggkj6b1DWqHLLIsMoqf8RtyAL9ZfRlW3FXIxn.png",
              email: "test@dalcar.mx",
              role_id: 1,
              employment_position: "",
              uiid: "U-0001",
              full_name: "TEST DALCAR",
              role: {
                name: "ADMINISTRADOR",
              },
            },
          },
        },
      },
    };

    await store.loginAction(getRsp(response).data.auth);
    await router.push({ name: "home" });
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};
</script>
