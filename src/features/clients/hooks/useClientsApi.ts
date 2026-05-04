/**
 * Hook futuro para conectar Clientes con backend.
 *
 * En Payments ya existe el patron `usePayments()` con TanStack Query.
 * Cuando Clientes deje de usar mock, esta capa deberia exponer algo similar:
 *
 * - data;
 * - isLoading;
 * - error;
 * - refetch;
 *
 * Asi la vista no llamaria servicios directamente.
 */
export {};
