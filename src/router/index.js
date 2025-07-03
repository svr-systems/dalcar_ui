import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'

const router = createRouter({
  history: process.env.NODE_ENV === 'production' 
    ? createWebHashHistory(import.meta.env.BASE_URL)
    : createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }

  const middleware = to.meta.middleware
  return middleware ? middleware(to, from, next) : next()
})

export default router
