export type EstadoRegistro = "ACTIVO" | "INACTIVO";

export type TipoDocumento =
    | "RUC"
    | "CEDULA_IDENTIDAD"
    | "PASAPORTE"
    | "DOCUMENTO_EXTRANJERO";

export type TipoPersona = "FISICA" | "JURIDICA";

export interface Proveedor {
    id: string;
    empresaId: string;

    nombre: string;
    tipoDocumento: TipoDocumento;
    numeroDocumento: string;
    dv?: string | null;
    tipoPersona: TipoPersona;
    direccion?: string | null;
    telefono?: string | null;
    email?: string | null;
    estado: EstadoRegistro;

    tieneMovimientos?: boolean;

    createdAt: Date;
    updatedAt: Date;
}

export interface CreateProveedorInput {
    nombre: string;
    tipoDocumento: TipoDocumento;
    numeroDocumento: string;
    dv?: string | null;
    tipoPersona: TipoPersona;
    direccion?: string | null;
    telefono?: string | null;
    email?: string | null;
}

export interface UpdateProveedorInput {
    id: string;
    nombre: string;
    tipoDocumento: TipoDocumento;
    numeroDocumento: string;
    dv?: string | null;
    tipoPersona: TipoPersona;
    direccion?: string | null;
    telefono?: string | null;
    email?: string | null;
    estado?: EstadoRegistro;
}