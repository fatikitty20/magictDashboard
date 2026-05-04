# ESLint y Calidad de Codigo

Este documento explica que se agrego para limpiar el codigo, donde se modifico y como usarlo sin perderse.

## Que es ESLint

ESLint no es un framework. Es una herramienta de analisis estatico: revisa el codigo antes de ejecutarlo y avisa si encuentra errores de sintaxis, malas practicas, imports duplicados, variables sin usar o tipos demasiado abiertos como `any`.

Una analogia sencilla: TypeScript revisa que las piezas encajen, Vitest prueba que algunas piezas funcionen, y ESLint es como una lista de inspeccion que revisa estilo, orden y errores comunes antes de que el proyecto llegue a GitHub.

## Archivos modificados para ESLint

| Archivo | Que se modifico | Para que sirve |
| --- | --- | --- |
| `eslint.config.js` | Se agregaron reglas de calidad y carpetas ignoradas. | Centraliza las reglas que debe cumplir el codigo. |
| `package.json` | Se agregaron scripts `lint`, `lint:fix`, `typecheck` y `check`. | Permite ejecutar revisiones con comandos simples. |
| `.github/workflows/ci.yml` | Se agrego lint y typecheck al pipeline. | GitHub valida el codigo cuando se sube o se abre un PR. |
| `src/shared/api/apiClient.ts` | Se quito el uso inseguro de errores sin tipo claro. | Evita depender de `any` y mejora manejo de errores. |
| `src/features/payments/api/paymentsApi.ts` | Se tiparon respuestas, estados y errores del backend. | Reduce errores al consumir endpoints de pagos. |
| `src/features/auth/authService.test.ts` | Se ajustaron pruebas para funciones async. | Las pruebas respetan el flujo real de autenticacion. |
| `src/i18next.d.ts` | Se uso `import type`. | Separa tipos de codigo ejecutable. |
| Componentes de dashboard | Se limpiaron imports duplicados. | Evita deuda tecnica y warnings repetidos. |
| `src/shared/layouts/Sidebar.tsx` | Se corrigio import de iconos y estructura de callbacks. | Evita errores visuales y de lint. |
| `tsconfig.json` | Se convirtio en archivo indice con referencias. | VS Code deja de leer la app sin configuracion JSX. |
| `tsconfig.app.json` | Se dejo la configuracion real de React/Vite y se quito `baseUrl`. | Evita el error rojo de JSX y el aviso de deprecacion de TypeScript. |
| `src/features/*/api|domain|hooks|mappers` | Se agregaron archivos preparados en features con mock. | Documentan donde entrara la API sin romper la funcionalidad actual. |

## Reglas importantes

| Regla | Que evita | Ejemplo de problema |
| --- | --- | --- |
| `curly` | `if` sin llaves. | Codigo ambiguo al agregar nuevas lineas. |
| `eqeqeq` | Comparaciones flojas. | `1 == "1"` puede dar resultados inesperados. |
| `no-duplicate-imports` | Imports repetidos del mismo archivo. | Codigo desordenado y dificil de mantener. |
| `prefer-const` | Variables `let` que nunca cambian. | Hace menos claro que datos son mutables. |
| `no-var` | Uso de `var`. | Evita problemas de scope antiguo. |
| `@typescript-eslint/no-explicit-any` | Uso de `any`. | Obliga a tipar mejor datos de API y errores. |
| `@typescript-eslint/consistent-type-imports` | Mezclar tipos con imports normales. | Ayuda a que el build sea mas limpio. |

## Comandos

```bash
npm run lint
```

Revisa errores de ESLint.

```bash
npm run lint:fix
```

Corrige automaticamente lo que ESLint pueda arreglar.

```bash
npm run typecheck
```

Revisa que TypeScript no tenga errores de tipos.

```bash
npm run check
```

Ejecuta la revision completa: lint, typecheck, tests y build.

```bash
npx tsc -p tsconfig.json --noEmit
```

Valida que el `tsconfig.json` raiz que lee VS Code no provoque errores falsos de TypeScript.

## Errores rojos de VS Code

Si VS Code marca muchos errores como:

```text
Cannot use JSX unless the '--jsx' flag is provided
```

no significa necesariamente que el codigo este mal. Ese error aparece cuando el editor lee una configuracion de TypeScript sin `jsx`.

Para evitarlo se dejo esta estructura:

- `tsconfig.json`: indice principal que apunta a los configs reales.
- `tsconfig.app.json`: configuracion de la app React con `jsx: "react-jsx"`.
- `tsconfig.node.json`: configuracion para archivos de Node/Vite.

Si el editor sigue mostrando errores despues del arreglo, cerrar y abrir VS Code normalmente refresca el servidor de TypeScript.

## Como leer un error de ESLint

Un error normalmente dice:

```text
archivo.tsx
linea:columna  error  descripcion del problema  nombre-de-la-regla
```

La parte mas importante es:

- Archivo: donde esta el problema.
- Linea: donde revisar.
- Regla: que criterio se rompio.

## Que se recomienda al equipo

Antes de hacer commit:

```bash
npm run check
```

Si falla lint:

```bash
npm run lint:fix
npm run check
```

Si despues de `lint:fix` sigue fallando, entonces el problema necesita una correccion manual.

## Limite de ESLint

ESLint ayuda mucho, pero no reemplaza seguridad real. Puede detectar malas practicas en frontend, pero no puede garantizar que un usuario no vea datos ajenos si el backend no valida permisos, roles y alcance de datos.

## Archivos preparados con solo comentarios

Algunos archivos nuevos dentro de `clients`, `orders`, `reports` y `transactions` existen para explicar arquitectura futura. Tienen comentarios y `export {}` para que TypeScript los trate como modulos validos.

Esto es intencional: permite que el equipo vea donde implementar API, dominio, hooks y mappers despues, sin conectar codigo incompleto ni romper las vistas que actualmente usan mock.
