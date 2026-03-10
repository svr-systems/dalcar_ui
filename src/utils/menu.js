/**
 * Ítems del menú lateral para usuarios del sistema.
 */
export const systemMenuItems = [
  { title: "Inicio", icon: "mdi-home", link: "home" },
  { title: "Apartados", icon: "mdi-hand-coin", link: "vehicle_reservations" },
  { title: "Autos", icon: "mdi-car", link: "vehicles" },
  {
    title: "Ordenes de compra",
    icon: "mdi-cash-multiple",
    link: "purchase_orders",
  },
  { title: "Historico", icon: "mdi-car-clock", link: "legacy_vehicles" },
  { title: "Financieras", icon: "mdi-bank", link: "financiers" },
  { title: "Proveedores", icon: "mdi-account-group", link: "vendors" },
  { title: "Inversionistas", icon: "mdi-handshake", link: "investors" },
  { title: "Empresas", icon: "mdi-office-building", link: "companies" },
  { title: "Usuarios", icon: "mdi-account", link: "users" },
];

/**
 * Ítems del menú lateral para vendedores.
 */
export const sellerMenuItems = [
  { title: "Inicio", icon: "mdi-home", link: "home" },
  { title: "Autos", icon: "mdi-car", link: "seller/vehicles" },
];
