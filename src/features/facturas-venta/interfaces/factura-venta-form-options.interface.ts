export interface ClienteOption {
    id: string;
    nombre: string;
    numeroDocumento: string;
    dv: string | null;
}

export interface SucursalOption {
    id: string;
    nombre: string;
}

export interface TimbradoOption {
    id: string;
    numero: string;
    sucursalId: string | null;
    establecimiento: string | null;
    puntoExpedicion: string | null;
    numeroDesde: number | null;
    numeroHasta: number | null;
    numeroActual: number | null;
    fechaFin: Date | string | null;
    sucursal: {
        id: string;
        nombre: string;
    } | null;
}

export interface CuentaContableOption {
    id: string;
    codigo: string;
    nombre: string;
    tipo: string;
    naturaleza: string;
}

export interface EmpresaObligacionesVentaOption {
    obligacionIvaGeneral: boolean;
    tieneIre: boolean;
    tieneIrpRsp: boolean;
}
