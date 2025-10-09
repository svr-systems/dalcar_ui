<template>
  <v-card :loading="isLoading">
    <v-card-title>
      <v-row dense>
        <v-col cols="11">
          <BtnBack :route="{ name: routeName }" />
          <CardTitle :text="route.meta.title" :icon="route.meta.icon" />
        </v-col>
        <v-col v-if="item" cols="1" class="text-right" />
      </v-row>
    </v-card-title>

    <v-card-text v-if="item">
      <v-row>
        <v-col v-if="!item.is_active" cols="12">
          <v-alert type="error" density="compact" class="rounded">
            <v-row dense>
              <v-col class="grow pt-2">El registro se encuentra inactivo</v-col>
              <v-col
                v-if="store.getAuth?.user?.role_id === 1"
                class="shrink text-right"
              >
                <v-btn
                  icon
                  size="x-small"
                  color="success"
                  @click.prevent="restoreItem"
                >
                  <v-icon>mdi-delete-restore</v-icon>
                  <v-tooltip activator="parent" location="left">
                    Reactivar
                  </v-tooltip>
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
                  <CardTitle :text="`AUTO | ${item.uiid}`" sub />
                </v-col>
                <v-col cols="1" class="text-right">
                  <v-btn
                    v-if="item.is_active"
                    icon
                    size="x-small"
                    color="warning"
                    :to="{
                      name: `${routeName}/update`,
                      params: { id: getEncodeId(itemId) },
                    }"
                  >
                    <v-icon>mdi-pencil</v-icon>
                    <v-tooltip activator="parent" location="left">
                      Editar
                    </v-tooltip>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-title>

            <v-card-text>
              <v-row dense>
                <v-col cols="12" md="3">
                  <VisVal label="Fecha de compra" :value="item.purchase_date" />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal
                    label="Marca"
                    :value="
                      item.vehicle_version.vehicle_model.vehicle_brand.name
                    "
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal
                    label="Modelo"
                    :value="item.vehicle_version.vehicle_model.name"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal
                    label="Año"
                    :value="item.vehicle_version.model_year"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal label="Versión" :value="item.vehicle_version.name" />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal label="Color" :value="item.vehicle_color.name" />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal
                    label="Transmisión"
                    :value="item.vehicle_transmission.name"
                  />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal label="VIN" :value="item.vin" />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal label="Motor" :value="item.engine_number" />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal label="REPUVE" :value="item.repuve" />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal label="Clave vehicular" :value="item.vehicle_key" />
                </v-col>

                <v-col cols="12" md="3">
                  <VisVal
                    label="Número de pasajeros"
                    :value="item.passenger_capacity"
                  />
                </v-col>

                <v-col cols="12" md="12">
                  <VisVal label="Observaciones" :value="item.notes" />
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
                  <CardTitle text="PROCEDENCIA" sub />
                </v-col>
                <v-col cols="1" class="text-right" />
              </v-row>
            </v-card-title>

            <v-card-text>
              <v-row dense>
                <v-col cols="12" md="3">
                  <VisVal label="Procedencia" :value="item.origin_type?.name" />
                </v-col>

                <v-col v-if="item.origin_type_id > 1" cols="12" md="3">
                  <VisVal label="Pedimento" :value="item.pediment_number" />
                </v-col>

                <v-col v-if="item.origin_type_id > 1" cols="12" md="3">
                  <VisVal label="Fecha" :value="item.pediment_date" />
                </v-col>

                <v-col v-if="item.origin_type_id > 1" cols="12" md="3">
                  <VisVal label="Aduana" :value="item.custom_office?.name" />
                </v-col>

                <v-col v-if="item.origin_type_id > 1" cols="12" md="12">
                  <VisVal label="Observaciones" :value="item.pediment_notes" />
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
                  <CardTitle text="ADQUISICIÓN" sub />
                </v-col>
                <v-col cols="1" class="text-right">
                  <v-btn
                    v-if="item.is_active"
                    icon
                    variant="text"
                    size="x-small"
                    color="success"
                    @click="legacyVehicleTradeAddDlg()"
                  >
                    <v-icon>mdi-plus</v-icon>
                    <v-tooltip activator="parent" location="start">
                      Agregar
                    </v-tooltip>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-text>
              <v-table density="compact" striped="even">
                <thead>
                  <tr>
                    <th width="40">#</th>
                    <th>Proveedor</th>
                    <th>Precio Compra</th>
                    <th>Comisión</th>
                    <th>Precio Venta</th>
                    <th>IVA</th>
                    <th>Monto Factura</th>
                    <th>Observaciones</th>
                    <th width="40" />
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(legacyVehicleTrade, i) in legacyVehicleTrades"
                    :key="i"
                  >
                    <td>{{ i + 1 }}</td>
                    <td>
                      {{
                        legacyVehicleTrade.vendor
                          ? legacyVehicleTrade.vendor.name
                          : "-"
                      }}
                    </td>
                    <td>
                      {{
                        legacyVehicleTrade.purchase_price
                          ? getAmountFormat(legacyVehicleTrade.purchase_price)
                          : "-"
                      }}
                    </td>
                    <td>
                      {{
                        legacyVehicleTrade.commission_amount
                          ? getAmountFormat(
                              legacyVehicleTrade.commission_amount
                            )
                          : "-"
                      }}
                    </td>
                    <td>
                      {{
                        legacyVehicleTrade.sale_price
                          ? getAmountFormat(legacyVehicleTrade.sale_price)
                          : "-"
                      }}
                    </td>
                    <td>{{ legacyVehicleTrade.vat_type.name }}</td>
                    <td>
                      {{
                        legacyVehicleTrade.invoice_amount
                          ? getAmountFormat(legacyVehicleTrade.invoice_amount)
                          : "-"
                      }}
                    </td>
                    <td>{{ legacyVehicleTrade.note }}</td>
                    <td class="text-right">
                      <v-btn
                        v-if="
                          item.is_active && legacyVehicleTrades.length - 1 == i
                        "
                        icon
                        variant="text"
                        size="x-small"
                        color="error"
                        @click.prevent="
                          legacyVehicleTradeRemove(legacyVehicleTrade.id)
                        "
                      >
                        <v-icon>mdi-minus</v-icon>
                        <v-tooltip activator="parent" location="left">
                          Eliminar
                        </v-tooltip>
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12">
          <v-card>
            <v-card-title>
              <v-row dense>
                <v-col cols="11">
                  <CardTitle text="FACTURAS" sub />
                </v-col>
                <v-col cols="1" class="text-right">
                  <v-btn
                    v-if="item.is_active"
                    icon
                    variant="text"
                    size="x-small"
                    color="success"
                    @click="legacyVehicleInvoiceAddDlg()"
                  >
                    <v-icon>mdi-plus</v-icon>
                    <v-tooltip activator="parent" location="start">
                      Agregar
                    </v-tooltip>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-text>
              <v-table density="compact" striped="even">
                <thead>
                  <tr>
                    <th width="40">#</th>
                    <th>Observaciones</th>
                    <th width="40">Archivo</th>
                    <th width="40" />
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(legacyVehicleInvoice, i) in legacyVehicleInvoices"
                    :key="i"
                  >
                    <td>{{ i + 1 }}</td>
                    <td>
                      {{ legacyVehicleInvoice.note }}
                    </td>
                    <td>
                      <VisDoc :value="legacyVehicleInvoice.document_b64" :preview="true" />
                    </td>
                    <td class="text-right">
                      <v-btn
                        v-if="item.is_active"
                        icon
                        variant="text"
                        size="x-small"
                        color="error"
                        @click.prevent="
                          legacyVehicleInvoiceRemove(legacyVehicleInvoice.id)
                        "
                      >
                        <v-icon>mdi-minus</v-icon>
                        <v-tooltip activator="parent" location="left">
                          Eliminar
                        </v-tooltip>
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12">
          <v-card>
            <v-card-title>
              <v-row dense>
                <v-col cols="11">
                  <CardTitle text="DOCUMENTOS" sub />
                </v-col>
                <v-col cols="1" class="text-right">
                  <v-btn
                    v-if="item.is_active"
                    icon
                    variant="text"
                    size="x-small"
                    color="success"
                    @click="legacyVehicleDocumentAddDlg()"
                  >
                    <v-icon>mdi-plus</v-icon>
                    <v-tooltip activator="parent" location="start">
                      Agregar
                    </v-tooltip>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-text>
              <v-table density="compact" striped="even">
                <thead>
                  <tr>
                    <th width="40">#</th>
                    <th>Tipo</th>
                    <th>Observaciones</th>
                    <th width="40">Archivo</th>
                    <th width="40" />
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(legacyVehicleDocument, i) in legacyVehicleDocuments"
                    :key="i"
                  >
                    <td>{{ i + 1 }}</td>
                    <td>
                      {{ legacyVehicleDocument.document_type.name }}
                    </td>
                    <td>
                      {{ legacyVehicleDocument.note }}
                    </td>
                    <td>
                      <VisDoc :value="legacyVehicleDocument.document_b64" />
                    </td>
                    <td class="text-right">
                      <v-btn
                        v-if="item.is_active"
                        icon
                        variant="text"
                        size="x-small"
                        color="error"
                        @click.prevent="
                          legacyVehicleDocumentRemove(legacyVehicleDocument.id)
                        "
                      >
                        <v-icon>mdi-minus</v-icon>
                        <v-tooltip activator="parent" location="left">
                          Eliminar
                        </v-tooltip>
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>
          </v-card>
        </v-col>

        <Investors :legacy-vehicle-id="itemId" :is-active="item.is_active" @refresh="getItem" />

        <v-col cols="12">
          <v-card>
            <v-card-title>
              <v-row dense>
                <v-col cols="11">
                  <CardTitle text="GASTOS" sub />
                </v-col>
                <v-col cols="1" class="text-right">
                  <v-btn
                    v-if="item.is_active"
                    icon
                    variant="text"
                    size="x-small"
                    color="success"
                    @click="legacyVehicleExpenseAddDlg()"
                  >
                    <v-icon>mdi-plus</v-icon>
                    <v-tooltip activator="parent" location="start">
                      Agregar
                    </v-tooltip>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-text>
              <v-table density="compact" striped="even">
                <thead>
                  <tr>
                    <th width="40">#</th>
                    <th>Tipo</th>
                    <th>Observaciones</th>
                    <th>Fecha</th>
                    <th>Monto</th>
                    <th width="40" />
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(legacyVehicleExpense, i) in legacyVehicleExpenses"
                    :key="i"
                  >
                    <td>{{ i + 1 }}</td>
                    <td>
                      {{ legacyVehicleExpense.expense_type.name }}
                    </td>
                    <td>
                      {{ legacyVehicleExpense.note }}
                    </td>
                    <td>
                      {{ legacyVehicleExpense.expense_date }}
                    </td>
                    <td>{{ getAmountFormat(legacyVehicleExpense.amount) }}</td>
                    <td class="text-right">
                      <v-btn
                        v-if="item.is_active"
                        icon
                        variant="text"
                        size="x-small"
                        color="error"
                        @click.prevent="
                          legacyVehicleExpenseRemove(legacyVehicleExpense.id)
                        "
                      >
                        <v-icon>mdi-minus</v-icon>
                        <v-tooltip activator="parent" location="left">
                          Eliminar
                        </v-tooltip>
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col
          v-if="item.is_active && store.getAuth?.user?.role_id === 1"
          cols="12"
        >
          <v-btn
            icon
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

    <!-- DIALOGS -->
    <v-dialog
      v-model="legacyVehicleTradeDlg"
      persistent
      scrim="black"
      max-width="1200"
    >
      <v-card
        :loading="legacyVehicleTradeLdg"
        :disabled="legacyVehicleTradeLdg"
        flat
      >
        <v-card-title>
          <v-row dense>
            <v-col cols="11">
              <CardTitle text="ADQUISICIÓN" subvalue />
            </v-col>
            <v-col cols="1" class="text-right">
              <v-btn
                icon
                variant="text"
                size="x-small"
                @click="legacyVehicleTradeDlg = false"
              >
                <v-icon>mdi-close</v-icon>
                <v-tooltip activator="parent" location="left">Cerrar</v-tooltip>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>

        <v-card-text v-if="legacyVehicleTrade">
          <v-form ref="legacyVehicleTradeForm" @submit.prevent>
            <v-row dense>
              <v-col v-if="legacyVehicleTrade.is_purchase" cols="12">
                <v-autocomplete
                  label="Proveedor"
                  v-model="legacyVehicleTrade.vendor_id"
                  :items="vendors"
                  :loading="vendorsLoading"
                  item-value="id"
                  item-title="name"
                  variant="outlined"
                  density="compact"
                  :rules="rules.required"
                  autocomplete="off"
                />
              </v-col>

              <v-col v-if="legacyVehicleTrade.is_purchase" cols="12" md="3">
                <v-text-field
                  :label="
                    'Precio Compra ' +
                    getAmountFormat(legacyVehicleTrade.purchase_price)
                  "
                  v-model="legacyVehicleTrade.purchase_price"
                  type="number"
                  variant="outlined"
                  density="compact"
                  min="0"
                  :rules="rules.required"
                  autocomplete="off"
                />
              </v-col>
              <v-col v-else cols="12" md="3">
                <v-text-field
                  :label="
                    'Precio Venta ' +
                    getAmountFormat(legacyVehicleTrade.sale_price)
                  "
                  v-model="legacyVehicleTrade.sale_price"
                  type="number"
                  variant="outlined"
                  density="compact"
                  min="0"
                  :rules="rules.required"
                  autocomplete="off"
                />
              </v-col>

              <v-col v-if="legacyVehicleTrade.is_purchase" cols="12" md="3">
                <v-text-field
                  :label="
                    'Comisión ' +
                    getAmountFormat(legacyVehicleTrade.commission_amount)
                  "
                  v-model="legacyVehicleTrade.commission_amount"
                  type="number"
                  variant="outlined"
                  density="compact"
                  min="0"
                  :rules="rules.required"
                  autocomplete="off"
                />
              </v-col>

              <v-col cols="12" md="3">
                <v-select
                  label="IVA"
                  v-model="legacyVehicleTrade.vat_type_id"
                  :items="vatTypes"
                  :loading="vatTypesLoading"
                  item-value="id"
                  item-title="name"
                  variant="outlined"
                  density="compact"
                  :rules="rules.required"
                />
              </v-col>

              <v-col v-if="legacyVehicleTrade.is_purchase" cols="12" md="3">
                <v-text-field
                  :label="
                    'Monto factura ' +
                    getAmountFormat(legacyVehicleTrade.invoice_amount)
                  "
                  v-model="legacyVehicleTrade.invoice_amount"
                  type="number"
                  variant="outlined"
                  density="compact"
                  min="0"
                  :rules="rules.required"
                  autocomplete="off"
                />
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Observaciones*"
                  v-model="legacyVehicleTrade.note"
                  type="text"
                  variant="outlined"
                  density="compact"
                  maxlength="255"
                  counter
                  :rules="rules.textOptional"
                  autocomplete="off"
                />
              </v-col>

              <v-col cols="12" class="text-right">
                <v-btn
                  icon
                  size="x-small"
                  color="success"
                  @click.prevent="legacyVehicleTradeAdd()"
                  :loading="legacyVehicleTradeLdg"
                >
                  <v-icon>mdi-check</v-icon>
                  <v-tooltip activator="parent" location="left">
                    Continuar
                  </v-tooltip>
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="legacyVehicleExpenseDlg"
      persistent
      scrim="black"
      max-width="1200"
    >
      <v-card
        :loading="legacyVehicleExpenseLdg"
        :disabled="legacyVehicleExpenseLdg"
        flat
      >
        <v-card-title>
          <v-row dense>
            <v-col cols="11">
              <CardTitle text="GASTO" subvalue />
            </v-col>
            <v-col cols="1" class="text-right">
              <v-btn
                icon
                variant="text"
                size="x-small"
                @click="legacyVehicleExpenseDlg = false"
              >
                <v-icon>mdi-close</v-icon>
                <v-tooltip activator="parent" location="left">Cerrar</v-tooltip>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>

        <v-card-text v-if="legacyVehicleExpense">
          <v-form ref="legacyVehicleExpenseForm" @submit.prevent>
            <v-row dense>
              <v-col cols="12" md="3">
                <v-autocomplete
                  v-if="!isAddingNewExpenseType"
                  label="Tipo"
                  v-model="legacyVehicleExpense.expense_type_id"
                  :items="expenseTypes"
                  :loading="expenseTypesLoading"
                  item-value="id"
                  item-title="name"
                  variant="outlined"
                  density="compact"
                  :rules="rules.required"
                  autocomplete="off"
                />
                <v-text-field
                  v-else
                  ref="newExpenseTypeInputRef"
                  label="Nuevo tipo"
                  v-model="newExpenseTypeName"
                  variant="outlined"
                  density="compact"
                  :rules="rules.textRequired"
                  autocomplete="off"
                  maxlength="50"
                  @keydown.enter.prevent="addNewExpenseType"
                >
                  <template #append-inner>
                    <v-btn
                      icon
                      variant="text"
                      size="small"
                      color="error"
                      @click="cancelAddingNewExpenseType"
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      variant="text"
                      size="small"
                      color="success"
                      :loading="isSavingNewExpenseType"
                      @click="addNewExpenseType"
                    >
                      <v-icon>mdi-check</v-icon>
                    </v-btn>
                  </template>
                </v-text-field>
              </v-col>

              <v-col cols="12" md="3">
                <v-text-field
                  label="Observaciones"
                  v-model="legacyVehicleExpense.note"
                  type="text"
                  variant="outlined"
                  density="compact"
                  maxlength="50"
                  counter
                  :rules="rules.textRequired"
                  autocomplete="off"
                />
              </v-col>

              <v-col cols="12" md="3">
                <InpDate
                  label="Fecha"
                  v-model="legacyVehicleExpense.expense_date"
                  :rules="rules.required"
                  :before="true"
                />
              </v-col>

              <v-col cols="12" md="2">
                <v-text-field
                  :label="
                    'Monto ' + getAmountFormat(legacyVehicleExpense.amount)
                  "
                  v-model="legacyVehicleExpense.amount"
                  type="number"
                  variant="outlined"
                  density="compact"
                  counter
                  min="0"
                  :rules="rules.required"
                  autocomplete="off"
                />
              </v-col>

              <v-col cols="12" class="text-right">
                <v-btn
                  icon
                  size="x-small"
                  color="success"
                  @click.prevent="legacyVehicleExpenseAdd()"
                  :loading="legacyVehicleExpenseLdg"
                  :disabled="isAddingNewExpenseType"
                >
                  <v-icon>mdi-check</v-icon>
                  <v-tooltip activator="parent" location="left">
                    Continuar
                  </v-tooltip>
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="legacyVehicleDocumentDlg"
      persistent
      scrim="black"
      max-width="1200"
    >
      <v-card
        :loading="legacyVehicleDocumentLdg"
        :disabled="legacyVehicleDocumentLdg"
        flat
      >
        <v-card-title>
          <v-row dense>
            <v-col cols="11">
              <CardTitle text="DOCUMENTO" subvalue />
            </v-col>
            <v-col cols="1" class="text-right">
              <v-btn
                icon
                variant="text"
                size="x-small"
                @click="legacyVehicleDocumentDlg = false"
              >
                <v-icon>mdi-close</v-icon>
                <v-tooltip activator="parent" location="left">Cerrar</v-tooltip>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>

        <v-card-text v-if="legacyVehicleDocument">
          <v-form ref="legacyVehicleDocumentForm" @submit.prevent>
            <v-row dense>
              <v-col cols="12" md="6">
                <v-autocomplete
                  v-if="!isAddingNewDocumentType"
                  label="Tipo"
                  v-model="legacyVehicleDocument.document_type_id"
                  :items="documentTypes"
                  :loading="documentTypesLoading"
                  item-value="id"
                  item-title="name"
                  variant="outlined"
                  density="compact"
                  :rules="rules.required"
                  autocomplete="off"
                />
                <v-text-field
                  v-else
                  ref="newDocumentTypeInputRef"
                  label="Nuevo tipo"
                  v-model="newDocumentTypeName"
                  variant="outlined"
                  density="compact"
                  :rules="rules.textRequired"
                  autocomplete="off"
                  maxlength="50"
                  @keydown.enter.prevent="addNewDocumentType"
                >
                  <template #append-inner>
                    <v-btn
                      icon
                      variant="text"
                      size="small"
                      color="error"
                      @click="cancelAddingNewDocumentType"
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      variant="text"
                      size="small"
                      color="success"
                      :loading="isSavingNewDocumentType"
                      @click="addNewDocumentType"
                    >
                      <v-icon>mdi-check</v-icon>
                    </v-btn>
                  </template>
                </v-text-field>
              </v-col>

              <v-col cols="12" md="6">
                <v-file-input
                  label="Archivo (PDF)"
                  v-model="legacyVehicleDocument.document_doc"
                  variant="outlined"
                  density="compact"
                  prepend-icon=""
                  show-size
                  accept=".pdf"
                  :rules="rules.fileRequired"
                />
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Observaciones"
                  v-model="legacyVehicleDocument.note"
                  type="text"
                  variant="outlined"
                  density="compact"
                  maxlength="50"
                  counter
                  :rules="rules.textRequired"
                  autocomplete="off"
                />
              </v-col>

              <v-col cols="12" class="text-right">
                <v-btn
                  icon
                  size="x-small"
                  color="success"
                  @click.prevent="legacyVehicleDocumentAdd()"
                  :loading="legacyVehicleDocumentLdg"
                  :disabled="isAddingNewDocumentType"
                >
                  <v-icon>mdi-check</v-icon>
                  <v-tooltip activator="parent" location="left">
                    Continuar
                  </v-tooltip>
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="legacyVehicleInvoiceDlg"
      persistent
      scrim="black"
      max-width="1200"
    >
      <v-card
        :loading="legacyVehicleInvoiceLdg"
        :disabled="legacyVehicleInvoiceLdg"
        flat
      >
        <v-card-title>
          <v-row dense>
            <v-col cols="11">
              <CardTitle text="FACTURA" subvalue />
            </v-col>
            <v-col cols="1" class="text-right">
              <v-btn
                icon
                variant="text"
                size="x-small"
                @click="legacyVehicleInvoiceDlg = false"
              >
                <v-icon>mdi-close</v-icon>
                <v-tooltip activator="parent" location="left">Cerrar</v-tooltip>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>

        <v-card-text v-if="legacyVehicleInvoice">
          <v-form ref="legacyVehicleInvoiceForm" @submit.prevent>
            <v-row dense>
              <v-col cols="12" md="6">
                <v-file-input
                  label="Archivo (PDF)"
                  v-model="legacyVehicleInvoice.document_doc"
                  variant="outlined"
                  density="compact"
                  prepend-icon=""
                  show-size
                  accept=".pdf"
                  :rules="rules.fileRequired"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  label="Observaciones"
                  v-model="legacyVehicleInvoice.note"
                  type="text"
                  variant="outlined"
                  density="compact"
                  maxlength="50"
                  counter
                  :rules="rules.textRequired"
                  autocomplete="off"
                />
              </v-col>

              <v-col cols="12" class="text-right">
                <v-btn
                  icon
                  size="x-small"
                  color="success"
                  @click.prevent="legacyVehicleInvoiceAdd()"
                  :loading="legacyVehicleInvoicetLdg"
                >
                  <v-icon>mdi-check</v-icon>
                  <v-tooltip activator="parent" location="left">
                    Continuar
                  </v-tooltip>
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref, inject, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";

import { useStore } from "@/store";
import { URL_API } from "@/utils/config";
import { getHdrs, getErr, getRsp } from "@/utils/http";
import { getDecodeId, getEncodeId } from "@/utils/coders";
import { getAmountFormat, getDateTime } from "@/utils/formatters";
import { getRules } from "@/utils/validators";
import { getFormData, getObj } from "@/utils/helpers";

import BtnBack from "@/components/BtnBack.vue";
import CardTitle from "@/components/CardTitle.vue";
import DlgReg from "@/components/DlgReg.vue";
import VisVal from "@/components/VisVal.vue";
import VisDoc from "@/components/VisDoc.vue";
import InpDate from "@/components/InpDate.vue";
import Investors from "@/components/Investors.vue";

const routeName = "legacy_vehicles";
const currentDate = ref(getDateTime("-", "", "", false));

const alert = inject("alert");
const confirm = inject("confirm");
const store = useStore();
const router = useRouter();
const route = useRoute();

const itemId = ref(getDecodeId(route.params.id));
const isLoading = ref(true);
const item = ref(null);
const legacyVehicleTrades = ref([]);
const legacyVehicleExpenses = ref([]);
const legacyVehicleDocuments = ref([]);
const legacyVehicleInvoices = ref([]);
const regDialog = ref(false);
const rules = getRules();

const vendors = ref([]);
const vendorsLoading = ref(true);
const vatTypes = ref([]);
const vatTypesLoading = ref(true);
const expenseTypes = ref([]);
const expenseTypesLoading = ref(true);
const documentTypes = ref([]);
const documentTypesLoading = ref(true);

const getCatalogs = async () => {
  let endpoint = null;
  let response = null;

  try {
    endpoint = `${URL_API}/vendors?is_active=1&filter=0`;
    response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    vendors.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    vendorsLoading.value = false;
  }

  try {
    endpoint = `${URL_API}/vat_types?is_active=1&filter=0`;
    response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    vatTypes.value = getRsp(response).data.items;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    vatTypesLoading.value = false;
  }

  try {
    endpoint = `${URL_API}/expense_types?is_active=1&filter=0`;
    response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    expenseTypes.value = getRsp(response).data.items;
    expenseTypes.value.push({ id: 0, name: "OTRO" });
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    expenseTypesLoading.value = false;
  }

  try {
    endpoint = `${URL_API}/document_types?is_active=1&filter=0`;
    response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    documentTypes.value = getRsp(response).data.items;
    documentTypes.value.push({ id: 0, name: "OTRO" });
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    documentTypesLoading.value = false;
  }
};

const getItem = async () => {
  let endpoint = null;
  let response = null;

  isLoading.value = true;
  try {
    endpoint = `${URL_API}/${routeName}/legacy_vehicles_trades`;
    response = await axios.get(endpoint, {
      params: {
        legacy_vehicle_id: itemId.value,
        is_active: 1,
      },
      ...getHdrs(store.getAuth?.token),
    });
    legacyVehicleTrades.value = getRsp(response).data.items;

    endpoint = `${URL_API}/${routeName}/legacy_vehicle_expenses`;
    response = await axios.get(endpoint, {
      params: {
        legacy_vehicle_id: itemId.value,
        is_active: 1,
      },
      ...getHdrs(store.getAuth?.token),
    });
    legacyVehicleExpenses.value = getRsp(response).data.items;

    endpoint = `${URL_API}/${routeName}/legacy_vehicle_documents`;
    response = await axios.get(endpoint, {
      params: {
        legacy_vehicle_id: itemId.value,
        is_active: 1,
      },
      ...getHdrs(store.getAuth?.token),
    });
    legacyVehicleDocuments.value = getRsp(response).data.items;

    endpoint = `${URL_API}/${routeName}/legacy_vehicle_invoices`;
    response = await axios.get(endpoint, {
      params: {
        legacy_vehicle_id: itemId.value,
        is_active: 1,
      },
      ...getHdrs(store.getAuth?.token),
    });
    legacyVehicleInvoices.value = getRsp(response).data.items;

    endpoint = `${URL_API}/${routeName}/${itemId.value}`;
    response = await axios.get(endpoint, getHdrs(store.getAuth?.token));
    item.value = getRsp(response).data.item;
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

const deleteItem = async () => {
  const confirmed = await confirm?.show("¿Confirma inactivar el registro?");
  if (!confirmed) return;

  isLoading.value = true;
  try {
    const endpoint = `${URL_API}/${routeName}/${itemId.value}`;
    const response = getRsp(
      await axios.delete(endpoint, getHdrs(store.getAuth?.token))
    );
    alert?.show("success", response.msg);
    router.push({ name: routeName });
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

const restoreItem = async () => {
  const confirmed = await confirm?.show("¿Confirma activar el registro?");
  if (!confirmed) return;

  isLoading.value = true;
  try {
    const endpoint = `${URL_API}/${routeName}/restore`;
    const response = getRsp(
      await axios.post(
        endpoint,
        { id: itemId.value },
        getHdrs(store.getAuth?.token)
      )
    );
    item.value = response.data.item;
    alert?.show("success", response.msg);
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

// legacyVehicleTrade
const legacyVehicleTrade = ref(null);
const legacyVehicleTradeLdg = ref(false);
const legacyVehicleTradeDlg = ref(false);
const legacyVehicleTradeForm = ref(null);

const legacyVehicleTradeAddDlg = () => {
  let is_purchase = 1;
  if (legacyVehicleTrades.value.length > 0) {
    is_purchase =
      legacyVehicleTrades.value[legacyVehicleTrades.value.length - 1]
        .is_purchase == 1
        ? 0
        : 1;
  }

  legacyVehicleTrade.value = {
    id: null,
    legacy_vehicle_id: itemId.value,
    is_purchase: is_purchase,
    vendor_id: null,
    purchase_price: null,
    commission_amount: null,
    vat_type_id: null,
    invoice_amount: null,
    sale_price: null,
    note: null,
  };
  legacyVehicleTradeLdg.value = false;
  legacyVehicleTradeDlg.value = true;
};

const legacyVehicleTradeAdd = async () => {
  const { valid } = await legacyVehicleTradeForm.value.validate();
  if (!valid) return;

  const confirmed = await confirm?.show(`¿Confirma agregar?`);
  if (!confirmed) return;

  legacyVehicleTradeLdg.value = true;

  try {
    const endpoint = `${URL_API}/${routeName}/legacy_vehicles_trades`;
    const response = getRsp(
      await axios.post(
        endpoint,
        legacyVehicleTrade.value,
        getHdrs(store.getAuth?.token)
      )
    );

    alert?.show("success", response.msg);
    legacyVehicleTradeDlg.value = false;
    getItem();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    legacyVehicleTradeLdg.value = false;
  }
};

const legacyVehicleTradeRemove = async (id) => {
  const confirmed = await confirm?.show("¿Confirma eliminar el registro?");
  if (!confirmed) return;

  isLoading.value = true;
  try {
    const endpoint = `${URL_API}/${routeName}/legacy_vehicles_trades/${id}`;
    const response = getRsp(
      await axios.delete(endpoint, getHdrs(store.getAuth?.token))
    );
    alert?.show("success", response.msg);
    getItem();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

// legacyVehicleExpense
const legacyVehicleExpense = ref(null);
const legacyVehicleExpenseLdg = ref(false);
const legacyVehicleExpenseDlg = ref(false);
const legacyVehicleExpenseForm = ref(null);

const isAddingNewExpenseType = ref(false);
const newExpenseTypeName = ref("");
const newExpenseTypeInputRef = ref(null);
const isSavingNewExpenseType = ref(false);

watch(
  () => legacyVehicleExpense.value?.expense_type_id,
  (newExpenseTypeId) => {
    if (!legacyVehicleExpense.value) return;

    if (newExpenseTypeId === 0) {
      isAddingNewExpenseType.value = true;
    } else {
      isAddingNewExpenseType.value = false;
      newExpenseTypeName.value = "";
      newExpenseTypeInputRef.value?.resetValidation();
    }
  }
);

const addNewExpenseType = async () => {
  if (!newExpenseTypeName.value || newExpenseTypeName.value.trim() === "") {
    alert?.show("red-darken-1", "Por favor, ingresa el nombre del nuevo tipo");
    return;
  }

  const confirmed = await confirm?.show(
    `¿Confirma agregar el nuevo tipo "${newExpenseTypeName.value}"?`
  );
  if (!confirmed) return;

  isSavingNewExpenseType.value = true;
  try {
    const payload = {
      name: newExpenseTypeName.value.trim(),
    };
    const endpoint = `${URL_API}/expense_types`;
    const response = await axios.post(
      endpoint,
      payload,
      getHdrs(store.getAuth?.token)
    );
    const newExpenseTypeId = getRsp(response).data.item.id;

    alert?.show("green-darken-1", "Nuevo tipo agregado con éxito");

    const getEndpoint = `${URL_API}/expense_types/${newExpenseTypeId}`;
    const getResponse = await axios.get(
      getEndpoint,
      getHdrs(store.getAuth?.token)
    );
    const newExpenseType = getRsp(getResponse).data.item;

    const otroOption = expenseTypes.value.pop();
    expenseTypes.value = [...expenseTypes.value, newExpenseType, otroOption];
    legacyVehicleExpense.value.expense_type_id = newExpenseType.id;

    newExpenseTypeName.value = "";
    isAddingNewExpenseType.value = false;
    newExpenseTypeInputRef.value?.resetValidation();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isSavingNewExpenseType.value = false;
  }
};

const cancelAddingNewExpenseType = () => {
  isAddingNewExpenseType.value = false;
  newExpenseTypeName.value = "";
  newExpenseTypeInputRef.value?.resetValidation();
  legacyVehicleExpense.value.expense_type_id = null;
};

const legacyVehicleExpenseAddDlg = () => {
  isAddingNewExpenseType.value = false;
  newExpenseTypeName.value = "";
  legacyVehicleExpense.value = {
    id: null,
    legacy_vehicle_id: itemId.value,
    expense_type_id: null,
    note: null,
    expense_date: currentDate.value,
    amount: null,
  };
  legacyVehicleExpenseLdg.value = false;
  legacyVehicleExpenseDlg.value = true;
};

const legacyVehicleExpenseAdd = async () => {
  const { valid } = await legacyVehicleExpenseForm.value.validate();
  if (!valid) return;

  const confirmed = await confirm?.show(`¿Confirma agregar?`);
  if (!confirmed) return;

  legacyVehicleExpenseLdg.value = true;

  try {
    const endpoint = `${URL_API}/${routeName}/legacy_vehicle_expenses`;
    const response = getRsp(
      await axios.post(
        endpoint,
        legacyVehicleExpense.value,
        getHdrs(store.getAuth?.token)
      )
    );

    alert?.show("success", response.msg);
    legacyVehicleExpenseDlg.value = false;
    getItem();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    legacyVehicleExpenseLdg.value = false;
  }
};

const legacyVehicleExpenseRemove = async (id) => {
  const confirmed = await confirm?.show("¿Confirma eliminar el registro?");
  if (!confirmed) return;

  isLoading.value = true;
  try {
    const endpoint = `${URL_API}/${routeName}/legacy_vehicle_expenses/${id}`;
    const response = getRsp(
      await axios.delete(endpoint, getHdrs(store.getAuth?.token))
    );
    alert?.show("success", response.msg);
    getItem();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

// legacyVehicleDocument
const legacyVehicleDocument = ref(null);
const legacyVehicleDocumentLdg = ref(false);
const legacyVehicleDocumentDlg = ref(false);
const legacyVehicleDocumentForm = ref(null);

const isAddingNewDocumentType = ref(false);
const newDocumentTypeName = ref("");
const newDocumentTypeInputRef = ref(null);
const isSavingNewDocumentType = ref(false);

watch(
  () => legacyVehicleDocument.value?.document_type_id,
  (newDocumentTypeId) => {
    if (!legacyVehicleDocument.value) return;

    if (newDocumentTypeId === 0) {
      isAddingNewDocumentType.value = true;
    } else {
      isAddingNewDocumentType.value = false;
      newDocumentTypeName.value = "";
      newDocumentTypeInputRef.value?.resetValidation();
    }
  }
);

const addNewDocumentType = async () => {
  if (!newDocumentTypeName.value || newDocumentTypeName.value.trim() === "") {
    alert?.show("red-darken-1", "Por favor, ingresa el nombre del nuevo tipo");
    return;
  }

  const confirmed = await confirm?.show(
    `¿Confirma agregar el nuevo tipo "${newDocumentTypeName.value}"?`
  );
  if (!confirmed) return;

  isSavingNewDocumentType.value = true;
  try {
    const payload = {
      name: newDocumentTypeName.value.trim(),
    };
    const endpoint = `${URL_API}/document_types`;
    const response = await axios.post(
      endpoint,
      payload,
      getHdrs(store.getAuth?.token)
    );
    const newDocumentTypeId = getRsp(response).data.item.id;

    alert?.show("green-darken-1", "Nuevo tipo agregado con éxito");

    const getEndpoint = `${URL_API}/document_types/${newDocumentTypeId}`;
    const getResponse = await axios.get(
      getEndpoint,
      getHdrs(store.getAuth?.token)
    );
    const newDocumentType = getRsp(getResponse).data.item;

    const otroOption = documentTypes.value.pop();
    documentTypes.value = [...documentTypes.value, newDocumentType, otroOption];
    legacyVehicleDocument.value.document_type_id = newDocumentType.id;

    newDocumentTypeName.value = "";
    isAddingNewDocumentType.value = false;
    newDocumentTypeInputRef.value?.resetValidation();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isSavingNewDocumentType.value = false;
  }
};

const cancelAddingNewDocumentType = () => {
  isAddingNewDocumentType.value = false;
  newDocumentTypeName.value = "";
  newDocumentTypeInputRef.value?.resetValidation();
  legacyVehicleDocument.value.document_type_id = null;
};

const legacyVehicleDocumentAddDlg = () => {
  isAddingNewDocumentType.value = false;
  newDocumentTypeName.value = "";
  legacyVehicleDocument.value = {
    id: null,
    is_active: 1,
    legacy_vehicle_id: itemId.value,
    document_type_id: null,
    document_path: null,
    document_doc: null,
    document_dlt: false,
    note: null,
  };
  legacyVehicleDocumentLdg.value = false;
  legacyVehicleDocumentDlg.value = true;
};

const legacyVehicleDocumentAdd = async () => {
  const { valid } = await legacyVehicleDocumentForm.value.validate();
  if (!valid) return;

  const confirmed = await confirm?.show(`¿Confirma agregar?`);
  if (!confirmed) return;

  legacyVehicleDocumentLdg.value = true;

  try {
    const endpoint = `${URL_API}/${routeName}/legacy_vehicle_documents`;
    const response = getRsp(
      await axios.post(
        endpoint,
        getFormData(legacyVehicleDocument.value),
        getHdrs(store.getAuth?.token, true)
      )
    );

    alert?.show("success", response.msg);
    legacyVehicleDocumentDlg.value = false;
    getItem();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    legacyVehicleDocumentLdg.value = false;
  }
};

const legacyVehicleDocumentRemove = async (id) => {
  const confirmed = await confirm?.show("¿Confirma eliminar el registro?");
  if (!confirmed) return;

  isLoading.value = true;
  try {
    const endpoint = `${URL_API}/${routeName}/legacy_vehicle_documents/${id}`;
    const response = getRsp(
      await axios.delete(endpoint, getHdrs(store.getAuth?.token))
    );
    alert?.show("success", response.msg);
    getItem();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

// legacyVehicleInvoice
const legacyVehicleInvoice = ref(null);
const legacyVehicleInvoiceLdg = ref(false);
const legacyVehicleInvoiceDlg = ref(false);
const legacyVehicleInvoiceForm = ref(null);

const legacyVehicleInvoiceAddDlg = () => {
  legacyVehicleInvoice.value = {
    id: null,
    is_active: 1,
    legacy_vehicle_id: itemId.value,
    document_path: null,
    document_doc: null,
    document_dlt: false,
    note: null,
  };
  legacyVehicleInvoiceLdg.value = false;
  legacyVehicleInvoiceDlg.value = true;
};

const legacyVehicleInvoiceAdd = async () => {
  const { valid } = await legacyVehicleInvoiceForm.value.validate();
  if (!valid) return;

  const confirmed = await confirm?.show(`¿Confirma agregar?`);
  if (!confirmed) return;

  legacyVehicleInvoiceLdg.value = true;

  try {
    const endpoint = `${URL_API}/${routeName}/legacy_vehicle_invoices`;
    const response = getRsp(
      await axios.post(
        endpoint,
        getFormData(legacyVehicleInvoice.value),
        getHdrs(store.getAuth?.token, true)
      )
    );

    alert?.show("success", response.msg);
    legacyVehicleInvoiceDlg.value = false;
    getItem();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    legacyVehicleInvoiceLdg.value = false;
  }
};

const legacyVehicleInvoiceRemove = async (id) => {
  const confirmed = await confirm?.show("¿Confirma eliminar el registro?");
  if (!confirmed) return;

  isLoading.value = true;
  try {
    const endpoint = `${URL_API}/${routeName}/legacy_vehicle_invoices/${id}`;
    const response = getRsp(
      await axios.delete(endpoint, getHdrs(store.getAuth?.token))
    );
    alert?.show("success", response.msg);
    getItem();
  } catch (err) {
    alert?.show("red-darken-1", getErr(err));
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  getCatalogs();
  getItem();
});
</script>
