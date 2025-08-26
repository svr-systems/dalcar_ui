// Importación de middlewares
import Auth from "./middleware/Auth";
import Public from "./middleware/Public";

const routes = [
  //USR SYSTEM
  // purchase order
  {
    path: "/orden_compra",
    name: "purchaseOrders",
    component: () => import("@/views/purchaseOrder/List.vue"),
    meta: {
      title: "Orden de compra",
      icon: "mdi-cash-multiple",
      middleware: Auth,
    },
  },
  {
    path: "/orden_compra/agregar",
    name: "purchaseOrders/store",
    component: () => import("@/views/purchaseOrder/Form.vue"),
    meta: {
      title: "Orden de compra | Agregar",
      icon: "mdi-cash-multiple",
      middleware: Auth,
    },
  },
  {
    path: "/orden_compra/:id",
    name: "purchaseOrders/show",
    component: () => import("@/views/purchaseOrder/Show.vue"),
    props: true,
    meta: {
      title: "Orden de compra",
      icon: "mdi-cash-multiple",
      middleware: Auth,
    },
  },
  {
    path: "/orden_compra/:id/editar",
    name: "purchaseOrders/update",
    component: () => import("@/views/purchaseOrder/Form.vue"),
    props: true,
    meta: {
      title: "Orden de compra | Editar",
      icon: "mdi-cash-multiple",
      middleware: Auth,
    },
  },
  // inventory
  {
    path: "/inventario",
    name: "inventory",
    component: () => import("@/views/inventory/List.vue"),
    meta: {
      title: "Inventario",
      icon: "mdi-package-variant-closed",
      middleware: Auth,
    },
  },
  {
    path: "/inventario/agregar",
    name: "inventory/store",
    component: () => import("@/views/inventory/Form.vue"),
    meta: {
      title: "Inventario | Agregar",
      icon: "mdi-package-variant-closed",
      middleware: Auth,
    },
  },
  {
    path: "/inventario/:id",
    name: "inventory/show",
    component: () => import("@/views/inventory/Show.vue"),
    props: true,
    meta: {
      title: "Inventario",
      icon: "mdi-package-variant-closed",
      middleware: Auth,
    },
  },
  {
    path: "/inventario/:id/editar",
    name: "inventory/update",
    component: () => import("@/views/inventory/Form.vue"),
    props: true,
    meta: {
      title: "Inventario | Editar",
      icon: "mdi-package-variant-closed",
      middleware: Auth,
    },
  },
  //providers
  {
    path: "/proveedores",
    name: "providers",
    component: () => import("@/views/providers/List.vue"),
    meta: {
      title: "Proveedores",
      icon: "mdi-account-group",
      middleware: Auth,
    },
  },
  {
    path: "/proveedores/agregar",
    name: "providers/store",
    component: () => import("@/views/providers/Form.vue"),
    meta: {
      title: "Proveedor | Agregar",
      icon: "mdi-account-group",
      middleware: Auth,
    },
  },
  {
    path: "/proveedores/:id",
    name: "providers/show",
    component: () => import("@/views/providers/Show.vue"),
    props: true,
    meta: {
      title: "Proveedor",
      icon: "mdi-account-group",
      middleware: Auth,
    },
  },
  {
    path: "/proveedores/:id/editar",
    name: "providers/update",
    component: () => import("@/views/providers/Form.vue"),
    props: true,
    meta: {
      title: "Proveedor | Editar",
      icon: "mdi-account-group",
      middleware: Auth,
    },
  },
  //investors
  {
    path: "/inversionistas",
    name: "investors",
    component: () => import("@/views/investors/List.vue"),
    meta: {
      title: "Inversionistas",
      icon: "mdi-handshake",
      middleware: Auth,
    },
  },
  {
    path: "/inversionistas/agregar",
    name: "investors/store",
    component: () => import("@/views/investors/Form.vue"),
    meta: {
      title: "Inversionista | Agregar",
      icon: "mdi-handshake",
      middleware: Auth,
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
      middleware: Auth,
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
      middleware: Auth,
    },
  },
  //branches
  {
    path: "/sucursales",
    name: "branches",
    component: () => import("@/views/branches/List.vue"),
    meta: {
      title: "Sucursales",
      icon: "mdi-domain",
      middleware: Auth,
    },
  },
  {
    path: "/sucursales/agregar",
    name: "branches/store",
    component: () => import("@/views/branches/Form.vue"),
    meta: {
      title: "Sucursal | Agregar",
      icon: "mdi-domain",
      middleware: Auth,
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
      middleware: Auth,
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
      middleware: Auth,
    },
  },
  //companies
  {
    path: "/empresas",
    name: "companies",
    component: () => import("@/views/companies/List.vue"),
    meta: {
      title: "Empresas",
      icon: "mdi-office-building",
      middleware: Auth,
    },
  },
  {
    path: "/empresas/agregar",
    name: "companies/store",
    component: () => import("@/views/companies/Form.vue"),
    meta: {
      title: "Empresa | Agregar",
      icon: "mdi-office-building",
      middleware: Auth,
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
      middleware: Auth,
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
      middleware: Auth,
    },
  },
  //users
  {
    path: "/usuarios",
    name: "users",
    component: () => import("@/views/users/List.vue"),
    meta: {
      title: "Usuarios",
      icon: "mdi-account",
      middleware: Auth,
    },
  },
  {
    path: "/usuarios/agregar",
    name: "users/store",
    component: () => import("@/views/users/Form.vue"),
    meta: {
      title: "Usuario | Agregar",
      icon: "mdi-account",
      middleware: Auth,
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
      middleware: Auth,
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
      middleware: Auth,
    },
  },
  //GENERAL
  {
    path: "/inicio",
    name: "home",
    component: () => import("@/views/general/Home.vue"),
    meta: {
      title: "Inicio",
      middleware: Auth,
    },
  },
  {
    path: "/no_autorizado",
    name: "unauthorized",
    component: () => import("@/views/general/Unauthorized.vue"),
    meta: {
      title: "Acceso Denegado",
      middleware: Auth,
    },
  },
  //PUBLIC
  {
    path: "/iniciar_sesion",
    name: "login",
    component: () => import("@/views/public/UserLogin.vue"),
    meta: {
      title: "Iniciar Sesión",
      middleware: Public,
    },
  },
  {
    path: "/",
    name: "main",
    component: () => import("@/views/public/Main.vue"),
    meta: {
      title: "SVR",
      middleware: Public,
    },
  },
  {
    path: "/recuperar_contrasena",
    name: "user_password_recover",
    component: () => import("@/views/public/UserPasswordRecover.vue"),
    meta: {
      title: "Recuperar contraseña",
      icon: "mdi-account",
      middleware: Public,
    },
  },
  {
    path: "/restablecer_contrasena/:id",
    name: "user_password_reset",
    component: () => import("@/views/public/UserPasswordReset.vue"),
    meta: {
      title: "Restablecer contraseña",
      icon: "mdi-account",
      middleware: Public,
    },
  },
  {
    path: "/confirmar_cuenta/:id",
    name: "user_account_confirm",
    component: () => import("@/views/public/UserAccountConfirm.vue"),
    meta: {
      title: "Confirmar cuenta",
      icon: "mdi-account",
      middleware: Public,
    },
  },
  //NOT FOUND
  {
    path: "/:pathMatch(.*)*",
    name: "not_found",
    component: () => import("@/views/public/NotFound.vue"),
  },
];

export default routes;
