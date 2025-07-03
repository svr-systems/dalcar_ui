import { useAuthStore } from "@/store";

export default function Public(to, from, next) {
  const authStore = useAuthStore();
  const isAuthenticated = !!authStore.auth;

  //Para que un usuario que ya ha iniciado sesión no pueda volver a pantallas publicas (login o registro).
  if (isAuthenticated) {
    return next({ name: "module/consultations" });
  } else {
    return next();
  }
}
