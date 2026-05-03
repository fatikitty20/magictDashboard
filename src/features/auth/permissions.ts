/**
 * Sistema de permisos basado en roles (RBAC)
 * Define qué acciones puede realizar cada rol
 */

import type { RolUsuario } from "./roles";
import { ROLES } from "./roles";

export type Permiso =
  | "ver_dashboard_admin"
  | "ver_payments"
  | "ver_orders"
  | "ver_reports"
  | "ver_clients"
  | "gestionar_usuarios"
  | "exportar_datos";

export const PERMISOS_POR_ROL: Record<RolUsuario, Permiso[]> = {
  [ROLES.ADMIN]: [
    "ver_dashboard_admin",
    "ver_payments",
    "ver_orders",
    "ver_reports",
    "ver_clients",
    "gestionar_usuarios",
    "exportar_datos",
  ],
  [ROLES.CLIENT]: [
    "ver_payments",
    "ver_orders",
    "ver_reports",
    "ver_clients",
    "exportar_datos",
  ],
};

/**
 * Verifica si un rol tiene un permiso específico
 */
export const tienePermiso = (rol: RolUsuario, permiso: Permiso): boolean => {
  return PERMISOS_POR_ROL[rol]?.includes(permiso) ?? false;
};

/**
 * Verifica si un rol tiene TODOS los permisos especificados
 */
export const tienePermisos = (rol: RolUsuario, permisos: Permiso[]): boolean => {
  return permisos.every((permiso) => tienePermiso(rol, permiso));
};
