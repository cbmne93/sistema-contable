export interface AsientoContable {
    id: string;
    numero: number;
    fecha: string;
    concepto: string;
    origen: string;
    estado: string;
    totalDebe: number;
    totalHaber: number;
    cantidadDetalles: number;
    sucursal: {
        id: string;
        nombre: string;
    } | null;
    comprobante: {
        id: string;
        tipoComprobante: string;
        numeroComprobante: string;
        establecimiento: string | null;
        puntoExpedicion: string | null;
    } | null;
}

export interface AsientoContableDetalleItem {
    id: string;
    descripcion: string | null;
    debe: number;
    haber: number;
    cuentaContable: {
        id: string;
        codigo: string;
        nombre: string;
    };
}

export interface AsientoContableDetalle {
    id: string;
    numero: number;
    fecha: string;
    concepto: string;
    origen: string;
    estado: string;
    totalDebe: number;
    totalHaber: number;
    sucursal: {
        id: string;
        nombre: string;
    } | null;
    comprobante: {
        id: string;
        tipoComprobante: string;
        numeroComprobante: string;
        establecimiento: string | null;
        puntoExpedicion: string | null;
    } | null;
    detalles: AsientoContableDetalleItem[];
}

export interface AsientosContablesPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}