<template>
  <v-row justify="center" class="mt-12">
    <v-col cols="12" md="4">
      <v-card
        elevation="12"
        class="pa-6 text-center"
        style="background-color: #C0C0C0; border-radius: 16px;"
      >
        <v-card-text>
          <!-- Logo -->
          <v-img
            src="https://static.wixstatic.com/media/dbaee8_453933def9284ef29a843fa1c7645a89~mv2.png/v1/crop/x_0,y_133,w_500,h_198/fill/w_500,h_198,al_c,q_85,enc_avif,quality_auto/Logotipos.png"
            max-width="600"
            class="mb-10"
            alt="Logo Universidad"
            contain
          />

          <!-- Formulario -->
          <v-form @submit.prevent>
            <v-row dense justify="center">
              <v-col cols="12">
                <v-text-field
                  label="E-mail"
                  variant="outlined"
                  type="text"
                  density="compact"
                />
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Contraseña"
                  variant="outlined"
                  type="password"
                  density="compact"
                  
                />
              </v-col>

              <v-col cols="12">
                <v-btn
                  block
                  size="large"
                  style="border: 2px solid white; border-radius: 8px; font-weight: bold;"
                  color="blue-darken-3"
                  class="white--text"
                  type="submit"
                >
                  Iniciar sesión
                </v-btn>
              </v-col>

              <v-col cols="12" class="mt-4">
                <v-btn variant="text">¿Olvidaste tu contraseña?</v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
