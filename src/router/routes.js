import Auth from './middleware/Auth'
import Public from './middleware/Public'

const routes = [
  //USR SYSTEM START
  //users
  {
    path: '/usuarios',
    name: 'users',
    component: () => import('@/views/users/List.vue'),
    meta: {
      title: 'Usuarios',
      icon: 'mdi-account',
      middleware: Auth,
    },
  },
  {
    path: '/usuarios/agregar',
    name: 'users/store',
    component: () => import('@/views/users/Form.vue'),
    meta: {
      title: 'Usuario | Agregar',
      icon: 'mdi-account',
      middleware: Auth,
    },
  },
  {
    path: '/usuarios/:id',
    name: 'users/show',
    component: () => import('@/views/users/Show.vue'),
    props: true,
    meta: {
      title: 'Usuario',
      icon: 'mdi-account',
      middleware: Auth,
    },
  },
  {
    path: '/usuarios/:id/editar',
    name: 'users/update',
    component: () => import('@/views/users/Form.vue'),
    props: true,
    meta: {
      title: 'Usuario | Editar',
      icon: 'mdi-account',
      middleware: Auth,
    },
  },
  //SPECIALTIES
  {
    path: '/especialidades',
    name: 'specialties',
    component: () => import('@/views/specialties/List.vue'),
    meta: {
      title: 'Especialidades',
      icon: 'mdi-medication',
      middleware: Auth,
    },
  },
  {
    path: '/especialidades/agregar',
    name: 'specialties/store',
    component: () => import('@/views/specialties/Form.vue'),
    meta: {
      title: 'Especialidad | Agregar',
      icon: 'mdi-medication',
      middleware: Auth,
    },
  },
  {
    path: '/especialidades/:id',
    name: 'specialties/show',
    component: () => import('@/views/specialties/Show.vue'),
    props: true,
    meta: {
      title: 'Especialidad',
      icon: 'mdi-medication',
      middleware: Auth,
    },
  },
  {
    path: '/especialidades/:id/editar',
    name: 'specialties/update',
    component: () => import('@/views/specialties/Form.vue'),
    props: true,
    meta: {
      title: 'Especialidad | Editar',
      icon: 'mdi-medication',
      middleware: Auth,
    },
  },
  //HOSPITALS
  {
    path: '/hospitales',
    name: 'hospitals',
    component: () => import('@/views/hospitals/List.vue'),
    meta: {
      title: 'Hospitales',
      icon: 'mdi-hospital-building',
      middleware: Auth,
    },
  },
  {
    path: '/hospitales/agregar',
    name: 'hospitals/store',
    component: () => import('@/views/hospitals/Form.vue'),
    meta: {
      title: 'Hospital | Agregar',
      icon: 'mdi-hospital-building',
      middleware: Auth,
    },
  },
  {
    path: '/hospitales/:id',
    name: 'hospitals/show',
    component: () => import('@/views/hospitals/Show.vue'),
    props: true,
    meta: {
      title: 'Hospital',
      icon: 'mdi-hospital-building',
      middleware: Auth,
    },
  },
  {
    path: '/hospitales/:id/editar',
    name: 'hospitals/update',
    component: () => import('@/views/hospitals/Form.vue'),
    props: true,
    meta: {
      title: 'Hospital | Editar',
      icon: 'mdi-hospital-building',
      middleware: Auth,
    },
  },
  //GENERAL
  {
    path: '/inicio',
    name: 'home',
    component: () => import('@/views/general/Home.vue'),
    meta: {
      title: 'Inicio',
      middleware: Auth,
    },
  },
  {
    path: '/no_autorizado',
    name: 'unauthorized',
    component: () => import('@/views/general/Unauthorized.vue'),
    meta: {
      title: 'Acceso Denegado',
      middleware: Auth,
    },
  },
  //PUBLIC
  {
    path: '/iniciar_sesion',
    name: 'login',
    component: () => import('@/views/public/UserLogin.vue'),
    meta: {
      title: 'Iniciar Sesión',
      middleware: Public,
    },
  },
  {
    path: '/',
    name: 'main',
    component: () => import('@/views/public/Main.vue'),
    meta: {
      title: 'SVR',
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
    path: '/:pathMatch(.*)*',
    name: 'not_found',
    component: () => import('@/views/public/NotFound.vue'),
  },
]

export default routes
