import { defineStore } from 'pinia'

export const useStore = defineStore('auth', {
  state: () => ({
    auth: null,
    conf: {
      theme_dark: true,
    },
  }),

  actions: {
    loginAction(auth) {
      this.auth = auth
    },
    logoutAction() {
      this.auth = null
    },
    themeDarkAction() {
      this.conf.theme_dark = !this.conf.theme_dark
    },
    profileAction(item) {
      if (this.auth) {
        this.auth.user = item
      }
    },
  },

  getters: {
    getAuth: (state) => state.auth,
    getConf: (state) => state.conf,
    getUser: (state) => state.auth?.user || null,
    isAdmin: (state) => state.auth?.user?.role_id === 1,
  },

  persist: true,
})
