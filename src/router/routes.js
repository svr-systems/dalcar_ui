// Importación de middlewares
import Auth from "./middleware/Auth";
import Public from "./middleware/Public";
import { Roles } from "./middleware/Roles";

const adminRoles = [1, 2, 4];
const systemRoles = [1, 2, 3, 4];
const sellerRoles = [5];

const routes = [
  /**
   * ===========================================
   * System
   * ===========================================
   */

  /**
   * Vehicle Reservations
   */
  {
    path: "/apartados",
    name: "vehicle_reservations",
    component: () => import("@/views/vehicle_reservations/List.vue"),
    meta: {
      title: "Apartados",
      icon: "mdi-hand-coin",
      middleware: [Auth, Roles(adminRoles)],
    },
  },
  {
    path: "/apartados/:id",
    name: "vehicle_reservations/show",
    component: () => import("@/views/vehicle_reservations/Show.vue"),
    props: true,
    meta: {
      title: "Apartado",
      icon: "mdi-hand-coin",
      middleware: [Auth, Roles(adminRoles)],
    },
  },

  /**
   * Vehicles
   */
  {
    path: "/autos/catalogos/generales",
    name: "vehicles/general-catalogs",
    component: () => import("@/views/vehicles/GeneralCatalogs.vue"),
    meta: {
      title: "Autos | Catálogos generales",
      icon: "mdi-notebook-multiple",
      middleware: [Auth, Roles(adminRoles)],
    },
  },
  {
    path: "/autos/catalogos/marcas",
    name: "vehicles/brand-catalogs",
    component: () => import("@/views/vehicles/VehicleBrandCatalogs.vue"),
    meta: {
      title: "Autos | Catálogos por marca",
      icon: "mdi-car-wrench",
      middleware: [Auth, Roles(adminRoles)],
    },
  },
  {
    path: "/autos",
    name: "vehicles",
    component: () => import("@/views/vehicles/List.vue"),
    meta: {
      title: "Autos",
      icon: "mdi-car",
      middleware: [Auth, Roles(systemRoles)],
    },
  },
  {
    path: "/autos/:id",
    name: "vehicles/show",
    component: () => import("@/views/vehicles/Show.vue"),
    props: true,
    meta: {
      title: "Auto",
      icon: "mdi-car",
      middleware: [Auth, Roles(systemRoles)],
    },
  },

  /**
   * Purchase Orders
   */
  {
    path: "/ordenes_compra",
    name: "purchase_orders",
    component: () => import("@/views/purchase_orders/List.vue"),
    meta: {
      title: "Ordenes de compra",
      icon: "mdi-cash-multiple",
      middleware: [Auth, Roles(systemRoles)],
    },
  },
  {
    path: "/ordenes_compra/agregar",
    name: "purchase_orders/store",
    component: () => import("@/views/purchase_orders/Form.vue"),
    meta: {
      title: "Orden de compra | Agregar",
      icon: "mdi-cash-multiple",
      middleware: [Auth, Roles(adminRoles)],
    },
  },
  {
    path: "/ordenes_compra/:id",
    name: "purchase_orders/show",
    component: () => import("@/views/purchase_orders/Show.vue"),
    props: true,
    meta: {
      title: "Orden de compra",
      icon: "mdi-cash-multiple",
      middleware: [Auth, Roles(systemRoles)],
    },
  },
  {
    path: "/ordenes_compra/:id/editar",
    name: "purchase_orders/update",
    component: () => import("@/views/purchase_orders/Form.vue"),
    props: true,
    meta: {
      title: "Orden de compra | Editar",
      icon: "mdi-cash-multiple",
      middleware: [Auth, Roles(adminRoles)],
    },
  },

  /**
   * Legacy Vehicles
   */
  {
    path: "/historico",
    name: "legacy_vehicles",
    component: () => import("@/views/legacy_vehicles/List.vue"),
    meta: {
      title: "Historico",
      icon: "mdi-car-clock",
      middleware: [Auth, Roles(adminRoles)],
    },
  },
  {
    path: "/historico/agregar",
    name: "legacy_vehicles/store",
    component: () => import("@/views/legacy_vehicles/Form.vue"),
    meta: {
      title: "Historico | Agregar",
      icon: "mdi-car-clock",
      middleware: [Auth, Roles(adminRoles)],
    },
  },
  {
    path: "/historico/:id",
    name: "legacy_vehicles/show",
    component: () => import("@/views/legacy_vehicles/Show.vue"),
    props: true,
    meta: {
      title: "Historico",
      icon: "mdi-car-clock",
      middleware: [Auth, Roles(adminRoles)],
    },
  },
  {
    path: "/historico/:id/editar",
    name: "legacy_vehicles/update",
    component: () => import("@/views/legacy_vehicles/Form.vue"),
    props: true,
    meta: {
      title: "Historico | Editar",
      icon: "mdi-car-clock",
      middleware: [Auth, Roles(adminRoles)],
    },
  },

  /**
   * Financiers
   */
  {
    path: "/financieras",
    name: "financiers",
    component: () => import("@/views/financiers/List.vue"),
    meta: {
      title: "Financieras",
      icon: "mdi-bank",
      middleware: [Auth, Roles(adminRoles)],
    },
  },
  {
    path: "/financieras/agregar",
    name: "financiers/store",
    component: () => import("@/views/financiers/Form.vue"),
    meta: {
      title: "Financiera | Agregar",
      icon: "mdi-bank",
      middleware: [Auth, Roles(adminRoles)],
    },
  },
  {
    path: "/financieras/:id",
    name: "financiers/show",
    component: () => import("@/views/financiers/Show.vue"),
    props: true,
    meta: {
      title: "Financiera",
      icon: "mdi-bank",
      middleware: [Auth, Roles(adminRoles)],
    },
  },
  {
    path: "/financieras/:id/editar",
    name: "financiers/update",
    component: () => import("@/views/financiers/Form.vue"),
    props: true,
    meta: {
      title: "Financiera | Editar",
      icon: "mdi-bank",
      middleware: [Auth, Roles(adminRoles)],
    },
  },

  /**
   * Vendors
   */
  {
    path: "/proveedores",
    name: "vendors",
    component: () => import("@/views/vendors/List.vue"),
    meta: {
      title: "Proveedores",
      icon: "mdi-account-group",
      middleware: [Auth, Roles(adminRoles)],
    },
  },
  {
    path: "/proveedores/agregar",
    name: "vendors/store",
    component: () => import("@/views/vendors/Form.vue"),
    meta: {
      title: "Proveedor | Agregar",
      icon: "mdi-account-group",
      middleware: [Auth, Roles(adminRoles)],
    },
  },
  {
    path: "/proveedores/:id",
    name: "vendors/show",
    component: () => import("@/views/vendors/Show.vue"),
    props: true,
    meta: {
      title: "Proveedor",
      icon: "mdi-account-group",
      middleware: [Auth, Roles(adminRoles)],
    },
  },
  {
    path: "/proveedores/:id/editar",
    name: "vendors/update",
    component: () => import("@/views/vendors/Form.vue"),
    props: true,
    meta: {
      title: "Proveedor | Editar",
      icon: "mdi-account-group",
      middleware: [Auth, Roles(adminRoles)],
    },
  },

  /**
   * Investors
   */
  {
    path: "/inversionistas",
    name: "investors",
    component: () => import("@/views/investors/List.vue"),
    meta: {
      title: "Inversionistas",
      icon: "mdi-handshake",
      middleware: [Auth, Roles(adminRoles)],
    },
  },
  {
    path: "/inversionistas/agregar",
    name: "investors/store",
    component: () => import("@/views/investors/Form.vue"),
    meta: {
      title: "Inversionista | Agregar",
      icon: "mdi-handshake",
      middleware: [Auth, Roles(adminRoles)],
    },
  },
  {
    path: "/inversionistas/:id",
    name: "investors/show",
    component: () => import("@/views/investors/Show.vue"),
    props: true,
    meta: {
      title: "Inversionista",
      icon: "mdi-handshake",
      middleware: [Auth, Roles(adminRoles)],
    },
  },
  {
    path: "/inversionistas/:id/editar",
    name: "investors/update",
    component: () => import("@/views/investors/Form.vue"),
    props: true,
    meta: {
      title: "Inversionista | Editar",
      icon: "mdi-handshake",
      middleware: [Auth, Roles(adminRoles)],
    },
  },

  /**
   * Branches
   */
  {
    path: "/sucursales",
    name: "branches",
    component: () => import("@/views/branches/List.vue"),
    meta: {
      title: "Sucursales",
      icon: "mdi-domain",
      middleware: [Auth, Roles(adminRoles)],
    },
  },
  {
    path: "/sucursales/agregar",
    name: "branches/store",
    component: () => import("@/views/branches/Form.vue"),
    meta: {
      title: "Sucursal | Agregar",
      icon: "mdi-domain",
      middleware: [Auth, Roles(adminRoles)],
    },
  },
  {
    path: "/sucursales/:id",
    name: "branches/show",
    component: () => import("@/views/branches/Show.vue"),
    props: true,
    meta: {
      title: "Sucursal",
      icon: "mdi-domain",
      middleware: [Auth, Roles(adminRoles)],
    },
  },
  {
    path: "/sucursales/:id/editar",
    name: "branches/update",
    component: () => import("@/views/branches/Form.vue"),
    props: true,
    meta: {
      title: "Sucursal | Editar",
      icon: "mdi-domain",
      middleware: [Auth, Roles(adminRoles)],
    },
  },

  /**
   * Companies
   */
  {
    path: "/empresas",
    name: "companies",
    component: () => import("@/views/companies/List.vue"),
    meta: {
      title: "Empresas",
      icon: "mdi-office-building",
      middleware: [Auth, Roles(adminRoles)],
    },
  },
  {
    path: "/empresas/agregar",
    name: "companies/store",
    component: () => import("@/views/companies/Form.vue"),
    meta: {
      title: "Empresa | Agregar",
      icon: "mdi-office-building",
      middleware: [Auth, Roles(adminRoles)],
    },
  },
  {
    path: "/empresas/:id",
    name: "companies/show",
    component: () => import("@/views/companies/Show.vue"),
    props: true,
    meta: {
      title: "Empresa",
      icon: "mdi-office-building",
      middleware: [Auth, Roles(adminRoles)],
    },
  },
  {
    path: "/empresas/:id/editar",
    name: "companies/update",
    component: () => import("@/views/companies/Form.vue"),
    props: true,
    meta: {
      title: "Empresa | Editar",
      icon: "mdi-office-building",
      middleware: [Auth, Roles(adminRoles)],
    },
  },

  /**
   * Users
   */
  {
    path: "/usuarios",
    name: "users",
    component: () => import("@/views/users/List.vue"),
    meta: {
      title: "Usuarios",
      icon: "mdi-account",
      middleware: [Auth, Roles(adminRoles)],
    },
  },
  {
    path: "/usuarios/agregar",
    name: "users/store",
    component: () => import("@/views/users/Form.vue"),
    meta: {
      title: "Usuario | Agregar",
      icon: "mdi-account",
      middleware: [Auth, Roles(adminRoles)],
    },
  },
  {
    path: "/usuarios/:id",
    name: "users/show",
    component: () => import("@/views/users/Show.vue"),
    props: true,
    meta: {
      title: "Usuario",
      icon: "mdi-account",
      middleware: [Auth, Roles(adminRoles)],
    },
  },
  {
    path: "/usuarios/:id/editar",
    name: "users/update",
    component: () => import("@/views/users/Form.vue"),
    props: true,
    meta: {
      title: "Usuario | Editar",
      icon: "mdi-account",
      middleware: [Auth, Roles(adminRoles)],
    },
  },

  /**
   * General
   */
  {
    path: "/inicio",
    name: "home",
    component: () => import("@/views/general/Home.vue"),
    meta: {
      title: "Inicio",
      middleware: [Auth],
    },
  },
  {
    path: "/no_autorizado",
    name: "unauthorized",
    component: () => import("@/views/general/Unauthorized.vue"),
    meta: {
      title: "Acceso Denegado",
      middleware: [Auth],
    },
  },

  /**
   * ===========================================
   * Seller
   * ===========================================
   */
  {
    path: "/vendedor/autos",
    name: "seller/vehicles",
    component: () => import("@/views/seller/vehicles/List.vue"),
    meta: {
      title: "Vendedor | Autos",
      icon: "mdi-car",
      middleware: [Auth, Roles(sellerRoles)],
    },
  },
  {
    path: "/vendedor/autos/:id",
    name: "seller/vehicles/show",
    component: () => import("@/views/seller/vehicles/Show.vue"),
    props: true,
    meta: {
      title: "Vendedor | Auto",
      icon: "mdi-car",
      middleware: [Auth, Roles(sellerRoles)],
    },
  },

  /**
   * ===========================================
   * Public
   * ===========================================
   */
  {
    path: "/iniciar_sesion",
    name: "login",
    component: () => import("@/views/public/UserLogin.vue"),
    meta: {
      title: "Iniciar Sesión",
      middleware: [Public],
    },
  },
  {
    path: "/",
    name: "main",
    component: () => import("@/views/public/Main.vue"),
    meta: {
      title: "DALCAR",
      middleware: [Public],
    },
  },
  {
    path: "/recuperar_contrasena",
    name: "user_password_recover",
    component: () => import("@/views/public/UserPasswordRecover.vue"),
    meta: {
      title: "Recuperar contraseña",
      icon: "mdi-account",
      middleware: [Public],
    },
  },
  {
    path: "/restablecer_contrasena/:id",
    name: "user_password_reset",
    component: () => import("@/views/public/UserPasswordReset.vue"),
    meta: {
      title: "Restablecer contraseña",
      icon: "mdi-account",
      middleware: [Public],
    },
  },
  {
    path: "/confirmar_cuenta/:id",
    name: "user_account_confirm",
    component: () => import("@/views/public/UserAccountConfirm.vue"),
    meta: {
      title: "Confirmar cuenta",
      icon: "mdi-account",
      middleware: [Public],
    },
  },

  /**
   * ===========================================
   * Not Found
   * ===========================================
   */
  {
    path: "/:pathMatch(.*)*",
    name: "not_found",
    component: () => import("@/views/public/NotFound.vue"),
  },
];

export default routes;
