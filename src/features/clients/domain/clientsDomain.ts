/**
 * Capa de dominio futura para Clientes.
 *
 * Aqui entrarian reglas de negocio que no pertenecen a la UI:
 *
 * - filtrar clientes por estado o segmento;
 * - calcular estadisticas de cartera;
 * - decidir si la paginacion viene del backend o se arma localmente;
 * - preparar parametros antes de llamar a `clientsApi`.
 *
 * Por ahora la logica vive en `views/Clients.tsx` porque los datos son mock.
 */
export {};
