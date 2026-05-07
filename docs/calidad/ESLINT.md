# Calidad de Codigo

## Comandos

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run check
```

`npm run check` ejecuta todo el flujo de validacion.

## Reglas del proyecto

- Componentes visuales sin llamadas directas a `fetch`.
- Endpoints centralizados en `apiConfig.ts`.
- Llamadas HTTP solo desde `api/` o servicios equivalentes.
- Reglas de negocio en `domain/`.
- Transformacion de DTOs en `mappers/`.
- Tipos compartidos en `types/`.
- Comentarios cortos solo donde conectan piezas importantes.

## Limpieza aplicada

- Documentacion antigua se resumio para evitar contradicciones.
- `authService` ahora exige rol real desde backend/JWT.
- El sidebar puede ocultar items sin eliminar rutas.
- No se eliminaron dependencias en uso.
