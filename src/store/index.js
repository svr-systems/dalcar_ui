import { defineStore } from "pinia";
import { ref, computed } from 'vue';

export const useAuthStore = defineStore("auth", {
  state: () => ({
    auth: null,
    conf: {
      theme_dark: true,
    },
  }),

  actions: {
    loginAction(auth) {
      this.auth = auth;
    },
    logoutAction() {
      this.auth = null;
    },
    themeDarkAction() {
      this.conf.theme_dark = !this.conf.theme_dark;
    },
    profileAction(item) {
      if (this.auth) {
        this.auth.user = item;
      }
    },
  },

  getters: {
    getAuth: (state) => state.auth,
    getConf: (state) => state.conf,
  },

  persist: true,
});

export const useEmployeeStore = defineStore('employees', () => {
  const employees = ref([]);

  const activeEmployees = computed(() => employees.value.filter(e => e.active));
  const inactiveEmployees = computed(() => employees.value.filter(e => !e.active));

  function addEmployee(employee) {
    const lastId = employees.value.length > 0
      ? Math.max(...employees.value.map(e => e.id))
      : 0;

    const newEmployee = {
      ...employee,
      id: lastId + 1,
      uiid: Math.random().toString(36).substring(2, 10).toUpperCase(),
      active: true,
    };
    employees.value.push(newEmployee);
  }

  function updateEmployee(updatedEmployee) {
    const idx = employees.value.findIndex(e => e.id === updatedEmployee.id);
    if (idx !== -1) {
      employees.value[idx] = { ...employees.value[idx], ...updatedEmployee };
    }
  }

  function deactivateEmployee(id) {
    const employee = employees.value.find(e => e.id === id);
    if (employee) employee.active = false;
  }

  function restoreEmployee(id) {
    const employee = employees.value.find(e => e.id === id);
    if (employee) employee.active = true;
  }

  function getEmployee(id) {
    return employees.value.find(e => e.id === id);
  }

  return {
    employees,
    activeEmployees,
    inactiveEmployees,
    addEmployee,
    updateEmployee,
    deactivateEmployee,
    restoreEmployee,
    getEmployee,
  };
}, {
  persist: true,
});
