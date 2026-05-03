/**
 * NUEVA ARQUITECTURA DE FEATURES - REFERENCIA
 * 
 * Estructura estandarizada para cada feature del proyecto
 * 
 * src/features/<feature>/
 *   ├── types/
 *   │   └── <feature>.ts           # Modelos TypeScript únicamente
 *   ├── services/
 *   │   └── <feature>Service.ts    # Llamadas a APIs, lógica de datos
 *   ├── hooks/
 *   │   └── use<Feature>.ts        # Lógica de negocio reutilizable
 *   ├── components/
 *   │   ├── <Feature>Stats.tsx     # Componentes específicos del feature
 *   │   └── <Feature>Table.tsx     # Componentes específicos del feature
 *   ├── views/
 *   │   └── <Feature>View.tsx      # Página completa (composición de componentes)
 *   └── index.ts                   # Exports públicos
 * 
 * REGLAS IMPORTANTES:
 * 
 * 1. SEPARATION OF CONCERNS:
 *    - types/: SOLO modelos TypeScript, sin lógica
 *    - services/: SOLO llamadas a API/datos, sin UI
 *    - hooks/: SOLO lógica de negocio (estado, cálculos, etc.)
 *    - components/: SOLO UI, importan hooks y types
 *    - views/: SOLO composición de componentes locales
 * 
 * 2. NO MEZCLAR RESPONSABILIDADES:
 *    ❌ NO poner lógica de negocio en componentes
 *    ❌ NO poner API calls directamente en componentes
 *    ❌ NO poner tipos en archivos de lógica
 *    ✅ SÍ centralizar en services/hooks/types
 * 
 * 3. IMPORTACIONES RECOMENDADAS:
 *    - Componentes: importan types/ + hooks/ + components/ locales
 *    - Hooks: importan types/ + services/
 *    - Services: importan types/ solamente
 *    - Views: importan componentes + hooks
 * 
 * 4. ARCHIVOS POR ROL:
 *    ❌ NO crear dashboardAdmin.ts, dashboardClient.ts
 *    ✅ SÍ usar obtenerConfigDashboard(role) en config/dashboardConfig.ts
 *    ✅ SÍ verificar permisos en componentes si es necesario
 * 
 * 5. REUTILIZACIÓN:
 *    - Componentes ui/ globales (StatusPill, Tooltip, etc.)
 *    - Componentes feature-specific en <feature>/components/
 *    - Hooks globales en lib/ o reutilizables en features/
 */

// Este archivo es solo documentación de referencia
export const ARCHITECTURE_DOCS = "Ver comentarios en este archivo";
