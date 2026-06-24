import type {
    EstadoRegistro,
    OrigenTimbrado,
    TipoComprobante,
} from "@/generated/prisma/enums";

export interface CreateTimbradoInput {
    origen: OrigenTimbrado;
    tipoComprobante: TipoComprobante;

    numero: string;
    fechaFin?: string | Date | null;

    sucursalId?: string | null;
    proveedorId?: string | null;

    establecimiento?: string | null;
    puntoExpedicion?: string | null;

    numeroDesde?: number | null;
    numeroHasta?: number | null;
    numeroActual?: number | null;

    estado?: EstadoRegistro;
}

export interface UpdateTimbradoInput extends CreateTimbradoInput {
    id: string;
}

export interface Timbrado {
    id: string;
    origen: OrigenTimbrado;
    tipoComprobante: TipoComprobante;

    numero: string;
    fechaFin: Date | null;

    sucursalId: string | null;
    proveedorId: string | null;

    establecimiento: string | null;
    puntoExpedicion: string | null;

    numeroDesde: number | null;
    numeroHasta: number | null;
    numeroActual: number | null;

    estado: EstadoRegistro;

    tieneMovimientos?: boolean;

    sucursal: {
        id: string;
        nombre: string;
    } | null;

    proveedor: {
        id: string;
        nombre: string;
        numeroDocumento: string;
    } | null;
}