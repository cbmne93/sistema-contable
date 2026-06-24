export type EstadoRegistro = "ACTIVO" | "INACTIVO";

export interface Sucursal {
    id: string;
    empresaId: string;

    codigo: string;
    nombre: string;
    direccion?: string | null;
    telefono?: string | null;
    estado: EstadoRegistro;

    tieneMovimientos?: boolean;

    createdAt: Date;
    updatedAt: Date;
}

export interface CreateSucursalInput {
    codigo: string;
    nombre: string;
    direccion?: string | null;
    telefono?: string | null;
}

export interface UpdateSucursalInput {
    id: string;
    codigo: string;
    nombre: string;
    direccion?: string | null;
    telefono?: string | null;
    estado?: EstadoRegistro;
}