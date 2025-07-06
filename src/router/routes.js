import Auth from "./middleware/Auth";
import Public from "./middleware/Public";
import UsrModule from "./middleware/UsrModule";

const routes = [
  //public
  {
    path: "/iniciar_sesion",
    name: "login",
    component: () => import("@/views/public/UserLogin.vue"),
    meta: {
      title: "Iniciar Sesión",
      middleware: Public,
    },
  },
  //module
  {
    path: "/modulo/usuarios",
    name: "module/usuarios",
    component: () => import("@/views/module/Users/ListUsers.vue"),
    meta: {
      title: "Usuarios",
      icon: "mdi-account-group",
    },
  },
  {
    path: "/modulo/usuarios/:id",
    name: "users-view",
    component: () => import("@/views/module/Users/ShowUser.vue"),
    props: true,
    meta: {
      title: "Detalle Usuario",
      icon: "mdi-account",
    },
  },
  {
    path: "/modulo/usuarios/:id",
    name: "users-edit",
    component: () => import("@/views/module/Users/EditUser.vue"),
    props: true,
    meta: {
      title: "Editar Usuario",
      icon: "mdi-account",
    },
  },
  {
    path: "/modulo/usuarios/agregar",
    name: "module/usuarios/agregar",
    component: () => import("@/views/module/Users/AddUser.vue"),
    meta: {
      title: "Agregar usuario",
      icon: "mdi-account",
    },
  },
  //general
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/general/Home.vue')
  }
  ,
  {
    path: "/",
    name: "main",
    component: () => import("@/views/general/Main.vue"),
    meta: {
      title: "SOLMETEC",
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
  {
    path: "/:pathMatch(.*)*",
    name: "not_found",
    component: () => import("@/views/general/NotFound.vue"),
  },
];

export default routes;
