# Magict Dashboard - Panel Administrativo PSP

Dashboard administrativo para gestionar una tienda conectada a un flujo PSP. La aplicacion permite visualizar metricas generales, pedidos, pagos, reportes y clientes desde una interfaz moderna construida con React, TypeScript, Vite y TailwindCSS.

---

## Descripcion

Magict Dashboard es una plataforma web orientada a la administracion comercial y operativa de una tienda online. Su objetivo es centralizar la informacion clave del negocio en vistas claras, dinamicas y faciles de consultar.

El proyecto incluye autenticacion mock, rutas protegidas, modo claro/oscuro y secciones especializadas para revisar ventas, ordenes, transacciones, reportes de rendimiento y clientes.

---

## Objetivos del proyecto

- Facilitar el control de ventas, pagos y pedidos desde un solo panel.
- Visualizar metricas importantes para tomar decisiones rapidas.
- Mantener una interfaz limpia, responsiva y coherente entre vistas.
- Preparar una base escalable para conectar servicios reales en el futuro.
- Mejorar la experiencia administrativa con filtros, tablas y paneles dinamicos.

---

## Vistas principales

### Dashboard

Panel general con metricas, grafico de rendimiento, progreso, recordatorios, equipo y actividad reciente.

### Pedidos

Vista dinamica para revisar ordenes, filtrar por estado y consultar el detalle administrativo de cada pedido.

### Pagos

Modulo para monitorear transacciones, estados de cobro, conciliacion y totales procesados.

### Reportes

Seccion con filtros por periodo, grafico dinamico por metrica, analisis por canal y tabla de productos destacados.

### Clientes

Vista para explorar clientes, filtrar por estado o segmento, buscar por datos principales y revisar un panel detallado por cliente.

---

## Tecnologias utilizadas

### Frontend

- React 18
- TypeScript
- Vite
- TailwindCSS
- React Router
- TanStack Query
- lucide-react
- Radix Tooltip

### Calidad y pruebas

- ESLint
- Vitest
- Testing Library
- TypeScript strict mode

### Control de versiones

- Git
- GitHub

---

## Caracteristicas del sistema

- Login mock con sesion en memoria para evitar guardar roles en `localStorage`.
- Rutas protegidas para vistas privadas.
- Permisos por rol para separar vistas de administrador y cliente.
- Tema claro y oscuro.
- Componentes reutilizables con TailwindCSS.
- Datos simulados mediante servicios async.
- Tablas responsivas con filtros dinamicos.
- Paneles de detalle para pedidos y clientes.
- Diseno consistente entre dashboard, pagos, pedidos, reportes y clientes.
- Estructura por dominios dentro de `src/features`.

---

## Estructura del proyecto

```text
docs/
  analisis/
  arquitectura/
  calidad/
  features/
  seguridad/
  tickets/
src/
  App.tsx
  main.tsx
  index.css
  components/
    ui/
  features/
    auth/
    clients/
    dashboard/
    orders/
    payments/
    reports/
    theme/
    transactions/
  pages/
```

Nota: `payments` ya usa capas completas `api`, `domain`, `hooks` y `mappers` porque consume backend. `orders`, `clients`, `reports` y `transactions` ya tienen esas carpetas preparadas, pero por ahora siguen usando datos mock desde `services/` y `data/`.

---

## Documentacion tecnica

- [Indice de documentacion](docs/README.md)
- [Arquitectura general](docs/arquitectura/ARCHITECTURE.md)
- [Arquitectura por features](docs/arquitectura/FEATURES_ARCHITECTURE.md)
- [Analisis global del proyecto](docs/analisis/ANALISIS_GLOBAL_PROYECTO.md)
- [Tickets accionables](docs/tickets/TICKETS_ACCIONABLES.md)
- [ESLint y calidad de codigo](docs/calidad/ESLINT.md)
- [Patrones de seguridad](docs/seguridad/PATRONES_SEGURIDAD.md)
- [Revision por features](docs/features/REVISION_FEATURES.md)

---

## Instalacion y uso

Clonar el repositorio:

```bash
git clone https://github.com/fatikitty20/magictDashboard.git
cd magictDashboard
```

Instalar dependencias:

```bash
npm install
```

Levantar el servidor de desarrollo:

```bash
npm run dev
```

Ejecutar build de produccion:

```bash
npm run build
```

Ejecutar pruebas:

```bash
npm run test
```

Revisar lint:

```bash
npm run lint
```

---

## Acceso de prueba

Puedes iniciar sesion con cualquier correo valido y una contrasena no vacia.

```text
demo@magictronic.com
demo1234
```

Para probar el rol administrador, usa un correo que contenga la palabra `admin`.

```text
admin@magictronic.com
demo1234
```

## Seguridad

- Las rutas privadas redirigen a `/login` si no existe sesion activa.
- La vista de transacciones queda limitada al rol administrador.
- La sesion mock no se persiste en `localStorage`; al recargar, se debe iniciar sesion otra vez.
- El repositorio incluye CI con lint, pruebas, build y auditoria de vulnerabilidades altas o criticas.
- Dependabot revisa dependencias de npm y GitHub Actions semanalmente.
- Los headers de seguridad base estan definidos en `public/_headers` para hosts que soportan ese archivo.

---

## Estado actual

- Dashboard principal terminado.
- Vistas de pagos y pedidos implementadas.
- Vistas de reportes y clientes agregadas.
- Modo claro/oscuro disponible.
- Autenticacion mock lista para ser reemplazada por una API real.
- Proyecto preparado para seguir escalando por modulos.

---

## Autores

Proyecto desarrollado como dashboard administrativo para gestion de tienda, pagos, pedidos, reportes y clientes.
