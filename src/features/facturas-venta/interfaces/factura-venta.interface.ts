export type MonedaComprobante = "PYG" | "USD" | "BRL" | "ARS";

export interface FacturaVentaDetalleInput {
    cuentaContableId?: string | null;
    descripcion: string;
    cantidad: number;
    precioUnitario: number;
    ivaTipo: "EXENTA" | "IVA_5" | "IVA_10";
}

export interface CreateFacturaVentaInput {
    clienteId: string;
    sucursalId: string;
    timbradoId: string;

    numeroComprobante?: string | null;

    fechaEmision: string | Date;
    fechaVencimiento?: string | Date | null;

    condicion: "CONTADO" | "CREDITO";

    moneda: MonedaComprobante;
    cotizacion: number;

    concepto?: string | null;

    imputaIva: boolean;
    imputaIre: boolean;
    imputaIrpRsp: boolean;

    detalles: FacturaVentaDetalleInput[];
}

export interface FacturaVenta {
    id: string;

    tipoMovimiento: string;
    tipoComprobante: string;
    condicion: string;
    estado: string;

    clienteId: string | null;
    sucursalId: string;
    timbradoId: string | null;

    numeroTimbrado: string | null;
    establecimiento: string | null;
    puntoExpedicion: string | null;
    numeroComprobante: string;

    fechaEmision: Date;
    fechaVencimiento: Date | null;

    moneda: string;
    cotizacion: unknown;

    exenta: unknown;
    gravada5: unknown;
    iva5: unknown;
    gravada10: unknown;
    iva10: unknown;
    total: unknown;

    imputaIva: boolean;
    imputaIre: boolean;
    imputaIrpRsp: boolean;
    noImputa: boolean;

    concepto: string | null;

    cliente: {
        id: string;
        nombre: string;
        numeroDocumento: string;
        dv: string | null;
    } | null;

    sucursal: {
        id: string;
        nombre: string;
    };

    timbrado: {
        id: string;
        numero: string;
        establecimiento: string | null;
        puntoExpedicion: string | null;
    } | null;

    asiento: {
        id: string;
        numero: number;
        origen: string;
        estado: string;
    } | null;
}
