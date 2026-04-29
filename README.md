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

- Login mock con persistencia local segura.
- Rutas protegidas para vistas privadas.
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
  pages/
```

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
demo@magict.com
demo1234
```

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
