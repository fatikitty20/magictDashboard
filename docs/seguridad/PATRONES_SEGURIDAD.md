# Seguridad y Autenticacion

## Principio principal

El frontend ayuda a guiar la experiencia, pero la seguridad real debe vivir tambien en backend. Ocultar un boton no protege datos si el endpoint no valida token, rol y alcance.

## Flujo de login

```text
LoginView
  -> useAuth
    -> authService
      -> apiClient
        -> POST /auth/login
          -> tokenManager
          -> authStore
```

## Token

El token se guarda solo en memoria mediante `tokenManager`. No se guarda en `localStorage`.

Ventaja: reduce exposicion ante XSS.
Costo: al recargar la pagina se pierde la sesion si no hay refresh token funcional.

## Roles

El rol se obtiene desde el JWT o desde la respuesta del backend.

No se permite asignar rol por email, nombre o texto visible.
Si backend no devuelve rol valido, `authService` rechaza el login.

## Rutas protegidas

`src/config/routes.tsx` define que rutas son privadas y que roles pueden entrar.
`src/features/auth/ProtectedRoute.tsx` aplica la validacion.

| Ruta | Roles |
| --- | --- |
| `/dashboard` | usuario autenticado |
| `/payments` | admin, client |
| `/orders` | admin, client |
| `/reports` | admin, client |
| `/clients` | admin, client |
| `/transactions` | admin |

## Pendientes de seguridad

- Confirmar contrato real de `/auth/refresh` y `/auth/logout`.
- Manejar 401 globalmente: limpiar token, limpiar sesion y redirigir a login.
- Validar respuestas con schema runtime, por ejemplo Zod.
- Backend debe filtrar por usuario, rol, merchant/company y permisos.
- Agregar rate limiting al login en backend.
- Evitar exponer PAN, CVV o datos sensibles en frontend.
