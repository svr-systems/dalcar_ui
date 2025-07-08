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
  //NOT FOUND
  {
    path: '/:pathMatch(.*)*',
    name: 'not_found',
    component: () => import('@/views/public/NotFound.vue'),
  },
]

export default routes
