import { useAuthStore } from "@/store";

export default function Auth(to, from, next) {
  const authStore = useAuthStore();
  const isAuthenticated = !!authStore.auth;

  if (isAuthenticated) {
    return next();
  } else {
    return next({
      name: "login",
      query: { redirect: to.fullPath },// Pasa en la URL a dónde quería ir el usuario (to.fullPath) para redirigirlo al login para que se autentique primero y ahora sí despues llevar automáticamente al usuario a la página que quería visitar originalmente.
    });
  }
}