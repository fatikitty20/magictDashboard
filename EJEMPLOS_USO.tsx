/**
 * EJEMPLOS DE USO - Nueva Arquitectura Refactorizada
 * 
 * Este archivo muestra cómo usar la nueva arquitectura en diferentes contextos
 */

// ============================================================================
// EJEMPLO 1: Usar el sistema de permisos en un componente
// ============================================================================

import { usePermissions } from "@/features/auth";

export const ReportsViewConPermisos = () => {
  const { tienePermiso } = usePermissions();

  if (!tienePermiso("ver_reports")) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-red-600">No tienes permisos para ver reportes</p>
      </div>
    );
  }

  return <ReportsView />;
};

// ============================================================================
// EJEMPLO 2: Importar features usando index.ts (nuevo patrón limpio)
// ============================================================================

// ❌ Patrón anterior (específico, largo)
// import { PaymentsService } from "@/features/payments/services/paymentsService";
// import { PaymentsTable } from "@/features/payments/components/PaymentsTable";
// import type { Payment } from "@/features/payments/types/payment";

// ✅ Nuevo patrón (limpio, centralizado)
import { paymentsService, PaymentsTable, type Payment } from "@/features/payments";
import { OrdersStats, OrdersTable } from "@/features/orders";

export const MiVista = () => {
  // Todo lo que necesitas de un feature está en el index.ts
  return (
    <div>
      <PaymentsTable payments={[]} />
      <OrdersTable orders={[]} />
    </div>
  );
};

// ============================================================================
// EJEMPLO 3: Crear un nuevo feature siguiendo el patrón
// ============================================================================

// src/features/invoices/types/invoice.ts
export interface Invoice {
  id: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  createdAt: Date;
}

// src/features/invoices/services/invoicesService.ts
// class InvoicesService {
//   async getInvoices(): Promise<Invoice[]> {
//     // Llamada a API aquí
//     return [];
//   }
// }
// export const invoicesService = new InvoicesService();

// src/features/invoices/hooks/useInvoices.ts
// import { useQuery } from "@tanstack/react-query";
// import { invoicesService } from "../services/invoicesService";
//
// export const useInvoices = () => {
//   return useQuery({
//     queryKey: ["invoices"],
//     queryFn: () => invoicesService.getInvoices(),
//   });
// };

// src/features/invoices/components/InvoicesTable.tsx
// import { useInvoices } from "../hooks/useInvoices";
// import type { Invoice } from "../types/invoice";
//
// export const InvoicesTable = () => {
//   const { data, isLoading } = useInvoices();
//   return <table>{/* ... */}</table>;
// };

// src/features/invoices/views/InvoicesView.tsx
// import { InvoicesTable } from "../components/InvoicesTable";
//
// export const InvoicesView = () => {
//   return <InvoicesTable />;
// };

// src/features/invoices/index.ts
// export * from "./types/invoice";
// export { invoicesService } from "./services/invoicesService";
// export { InvoicesTable } from "./components/InvoicesTable";
// export { InvoicesView } from "./views/InvoicesView";
// export { useInvoices } from "./hooks/useInvoices";

// ============================================================================
// EJEMPLO 4: Usar ProtectedRoute con allowedRoles (futuro)
// ============================================================================

import { RutaProtegida } from "@/features/auth";
import { ROLES } from "@/features/auth/roles";

// Solo admins pueden ver esta ruta
export const RutaAdminSolamente = () => (
  <RutaProtegida allowedRoles={[ROLES.ADMIN]}>
    <AdminPanel />
  </RutaProtegida>
);

// Solo clientes pueden ver esta ruta
export const RutaClienteSolamente = () => (
  <RutaProtegida allowedRoles={[ROLES.CLIENT]}>
    <ClientDashboard />
  </RutaProtegida>
);

// ============================================================================
// EJEMPLO 5: Acceder a la configuración dinámica del dashboard
// ============================================================================

import { useDashboard } from "@/features/dashboard";

export const MiComponente = () => {
  const dashboardConfig = useDashboard();

  // dashboardConfig.widgets contiene qué widgets ve el usuario según su rol
  // dashboardConfig.menuItems contiene qué items de menú ve el usuario según su rol

  return (
    <div>
      <h1>Dashboard del usuario: {dashboardConfig.role}</h1>
      <p>Widgets disponibles: {dashboardConfig.widgets.join(", ")}</p>
    </div>
  );
};

// ============================================================================
// EJEMPLO 6: Usar el hook useAuth mejorado
// ============================================================================

import { useAuth } from "@/features/auth";

export const MiComponenteConAuth = () => {
  const { user, isAuthenticated, signOut } = useAuth();

  if (!isAuthenticated) {
    return <p>Por favor, inicia sesión</p>;
  }

  return (
    <div>
      <p>Usuario: {user?.correo}</p>
      <p>Rol: {user?.role}</p>
      <button onClick={signOut}>Cerrar sesión</button>
    </div>
  );
};

// ============================================================================
// EJEMPLO 7: Combinar permisos + UI condicional
// ============================================================================

import { usePermissions } from "@/features/auth";

export const PanelDeAcciones = () => {
  const { tienePermiso, tienePermisos } = usePermissions();

  return (
    <div className="space-y-2">
      {tienePermiso("gestionar_usuarios") && (
        <button>Gestionar Usuarios</button>
      )}

      {tienePermisos(["exportar_datos", "ver_reports"]) && (
        <button>Exportar Reporte</button>
      )}

      {tienePermiso("ver_payments") && (
        <button>Ver Pagos</button>
      )}
    </div>
  );
};

// ============================================================================
// PATRÓN RECOMENDADO PARA NUEVOS COMPONENTES
// ============================================================================

// ✅ CORRECTO: Separación clara de responsabilidades

// types/
export interface MyFeatureData {
  id: string;
  name: string;
}

// services/
class MyFeatureService {
  async fetch(): Promise<MyFeatureData[]> {
    return [];
  }
}

// hooks/
function useMyFeature() {
  return {
    data: [],
    isLoading: false,
  };
}

// components/
function MyFeatureTable() {
  const { data } = useMyFeature();
  return <table>{/* ... */}</table>;
}

// views/
function MyFeatureView() {
  const { tienePermiso } = usePermissions();

  if (!tienePermiso("ver_my_feature")) {
    return <div>Sin acceso</div>;
  }

  return (
    <div>
      <h1>Mi Feature</h1>
      <MyFeatureTable />
    </div>
  );
}

// index.ts
// export * from "./types";
// export { MyFeatureService } from "./services";
// export { MyFeatureTable } from "./components";
// export { useMyFeature } from "./hooks";

// ============================================================================
// PATRONES A EVITAR
// ============================================================================

// ❌ INCORRECTO: Mezclar responsabilidades en un componente
function BadComponent() {
  // ❌ API calls aquí (debería estar en services)
  // const [data, setData] = useState([]);
  // useEffect(() => {
  //   fetch('/api/data').then(r => setData(r));
  // }, []);

  // ❌ Lógica de negocio compleja aquí (debería estar en hooks)
  // const filtered = data.filter(d => d.status === 'active');
  // const sorted = filtered.sort((a, b) => a.date - b.date);

  // ❌ Lógica condicional por rol aquí (debería usar usePermissions)
  // if (user.role === 'admin') { ... }

  return <div>Esto está mal 😞</div>;
}

// ✅ CORRECTO: Cada cosa en su lugar

// services/myService.ts → API calls
// hooks/useMyData.ts → Lógica de negocio
// components/MyTable.tsx → Solo UI
// views/MyView.tsx → Orquestación

export default {};
