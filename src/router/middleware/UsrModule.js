import { useAuthStore } from "@/store";

export default function UsrModule(to, from, next) {
  const authStore = useAuthStore();
  const hasRequiredRole = authStore.auth?.user?.role_id === 3;

  if (hasRequiredRole) {
    return next();
  } else {
    return next({ name: "unauthorized" });
  }
}
