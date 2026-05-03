# 📚 GUÍA DE MIGRACIÓN - Para Desarrolladores

## Cambios Rápidos que Debes Conocer

### 1. Nuevas Importaciones (más limpias)

**Antes:**
```typescript
import { PaymentsService } from "@/features/payments/services/paymentsService";
import { OrdersTable } from "@/features/orders/components/OrdersTable";
import { RutaProtegida } from "@/features/auth/ProtectedRoute";
```

**Después:**
```typescript
import { paymentsService, OrdersTable } from "@/features/orders";
import { RutaProtegida } from "@/features/auth";
```

---

### 2. Sistema de Permisos (NUEVO)

Usa el hook `usePermissions()` para verificar acceso:

```typescript
import { usePermissions } from "@/features/auth";

const MiComponente = () => {
  const { tienePermiso, tienePermisos } = usePermissions();
  
  return (
    <>
      {tienePermiso("ver_reports") && <ReportsButton />}
      {tienePermisos(["exportar_datos", "ver_reports"]) && <ExportButton />}
    </>
  );
};
```

---

### 3. Dashboard Dinámico (ya no hay dashboardAdmin.ts / dashboardClient.ts)

```typescript
import { useDashboard } from "@/features/dashboard";

const Dashboard = () => {
  const config = useDashboard(); // Automáticamente según el rol del usuario
  
  return (
    <div>
      {config.widgets.map(widget => renderWidget(widget))}
    </div>
  );
};
```

---

### 4. ProtectedRoute Mejorado (con roles)

```typescript
import { RutaProtegida, ROLES } from "@/features/auth";

// Solo admins
<RutaProtegida allowedRoles={[ROLES.ADMIN]}>
  <AdminPanel />
</RutaProtegida>

// Solo clientes
<RutaProtegida allowedRoles={[ROLES.CLIENT]}>
  <ClientDashboard />
</RutaProtegida>
```

---

### 5. Estructura de Features (nueva)

Usa este patrón para TODOS los nuevos features:

```
src/features/<feature>/
├── types/
│   └── <feature>.ts           # ✅ Tipos solamente
├── services/
│   └── <feature>Service.ts    # ✅ API calls solamente
├── hooks/
│   └── use<Feature>.ts        # ✅ Lógica de negocio solamente
├── components/
│   └── <Feature>Table.tsx     # ✅ UI solamente
├── views/
│   └── <Feature>View.tsx      # ✅ Composición
└── index.ts                   # ✅ Exports públicos
```

**Importante**: Cada carpeta tiene una responsabilidad clara. NO mezcles.

---

### 6. Crear un Nuevo Feature (paso a paso)

#### Paso 1: Estructuras de carpetas y tipos

```typescript
// src/features/myfeature/types/myfeature.ts
export interface MyData {
  id: string;
  name: string;
}
```

#### Paso 2: Servicio (API calls / datos)

```typescript
// src/features/myfeature/services/myfeatureService.ts
class MyFeatureService {
  async getAll(): Promise<MyData[]> {
    // const response = await fetch('/api/myfeature');
    // return response.json();
    return [];
  }
}

export const myfeatureService = new MyFeatureService();
```

#### Paso 3: Hook (lógica de negocio)

```typescript
// src/features/myfeature/hooks/useMyFeature.ts
import { useQuery } from "@tanstack/react-query";
import { myfeatureService } from "../services/myfeatureService";

export const useMyFeature = () => {
  return useQuery({
    queryKey: ["myfeature"],
    queryFn: () => myfeatureService.getAll(),
  });
};
```

#### Paso 4: Componentes (UI)

```typescript
// src/features/myfeature/components/MyFeatureTable.tsx
import { useMyFeature } from "../hooks/useMyFeature";

export const MyFeatureTable = () => {
  const { data, isLoading } = useMyFeature();
  
  if (isLoading) return <div>Cargando...</div>;
  
  return (
    <table>
      <tbody>
        {data?.map(item => (
          <tr key={item.id}>
            <td>{item.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```

#### Paso 5: Vista (composición)

```typescript
// src/features/myfeature/views/MyFeatureView.tsx
import { MyFeatureTable } from "../components/MyFeatureTable";
import { usePermissions } from "@/features/auth";

export const MyFeatureView = () => {
  const { tienePermiso } = usePermissions();
  
  if (!tienePermiso("ver_myfeature")) {
    return <div>Sin permisos</div>;
  }
  
  return (
    <div>
      <h1>Mi Feature</h1>
      <MyFeatureTable />
    </div>
  );
};
```

#### Paso 6: Index.ts (exports públicos)

```typescript
// src/features/myfeature/index.ts
export * from "./types/myfeature";
export { myfeatureService } from "./services/myfeatureService";
export { MyFeatureTable } from "./components/MyFeatureTable";
export { MyFeatureView } from "./views/MyFeatureView";
export { useMyFeature } from "./hooks/useMyFeature";
```

#### Paso 7: Usarlo en otros módulos

```typescript
// src/pages/SomeOtherPage.tsx
import { MyFeatureTable } from "@/features/myfeature";

export default function Page() {
  return <MyFeatureTable />;
}
```

---

## Resumen de Cambios

| Aspecto | Antes | Ahora |
|--------|-------|-------|
| Importaciones | Largas y específicas | Cortas via `index.ts` |
| Permisos | Implícitos | Explícitos con `usePermissions()` |
| Dashboard por rol | Archivos separados | Configuración dinámica |
| Protección de rutas | Solo autenticación | Autenticación + roles |
| Escalabilidad | Media | Alta |

---

## Errores Comunes a Evitar

### ❌ NO hagas esto:

```typescript
// ❌ NO importar directamente de carpetas internas
import MyService from "@/features/payments/services/paymentsService";

// ❌ NO mezclar responsabilidades
export const MyComponent = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    // ❌ API calls en componente
    fetch('/api/data').then(r => setData(r));
  }, []);
  
  // ❌ Lógica de negocio en componente
  const filtered = data.filter(d => d.active);
  
  // ❌ Verificación de roles hardcodeada
  if (user.role === 'admin') { /* ... */ }
  
  return <table>{/* ... */}</table>;
};

// ❌ NO crear dashboards/configs separados por rol
// dashboardAdmin.ts ← ELIMINAR
// dashboardClient.ts ← ELIMINAR
```

### ✅ HAZ esto en su lugar:

```typescript
// ✅ Importar desde index.ts
import { paymentsService, PaymentsTable } from "@/features/payments";

// ✅ Separar responsabilidades
// services/paymentsService.ts → API calls
// hooks/usePayments.ts → Lógica de negocio
// components/PaymentsTable.tsx → UI pura
// views/PaymentsView.tsx → Composición

// ✅ Usar usePermissions para roles
const { tienePermiso } = usePermissions();
if (!tienePermiso("ver_payments")) return <NoAccess />;

// ✅ Usar useDashboard para configuración dinámica
const config = useDashboard();
```

---

## Checklist para Nueva Funcionalidad

- [ ] ¿Necesitas un nuevo feature?
  - [ ] Creé `src/features/myfeature/` con estructura completa
  - [ ] Separé: types → services → hooks → components → views
  - [ ] Creé `index.ts` con exports públicos
  
- [ ] ¿Necesitas proteger una ruta?
  - [ ] [ ] Usé `RutaProtegida` con `allowedRoles` si aplica
  - [ ] Verifiqué que la ruta esté en `src/config/routes.tsx`
  
- [ ] ¿Necesitas verificar permisos en componente?
  - [ ] Usé `usePermissions()` hook
  - [ ] Agregué el permiso en `src/features/auth/permissions.ts`
  
- [ ] ¿Necesitas importar de otro feature?
  - [ ] Importé desde el `index.ts` del feature
  - [ ] NO importé directamente de carpetas internas
  
- [ ] ¿Testeaste que funciona?
  - [ ] Compilación: `npm run build`
  - [ ] Runtime: `npm run dev`
  - [ ] Permisos: Probé con diferentes roles

---

## Documentación Relacionada

- [REFACTORING_COMPLETE.md](./REFACTORING_COMPLETE.md) - Visión general completa
- [EJEMPLOS_USO.tsx](./EJEMPLOS_USO.tsx) - Código de ejemplo funcional
- [src/features/ARCHITECTURE.md](./src/features/ARCHITECTURE.md) - Detalles técnicos

---

¡Bienvenido a la nueva arquitectura! 🚀
