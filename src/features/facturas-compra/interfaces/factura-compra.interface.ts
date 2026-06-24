export type MonedaComprobante = "PYG" | "USD" | "BRL" | "ARS";

export interface FacturaCompraDetalleInput {
    cuentaContableId?: string | null;
    descripcion: string;
    cantidad: number;
    precioUnitario: number;
    ivaTipo: "EXENTA" | "IVA_5" | "IVA_10";
}

export interface CreateFacturaCompraInput {
    proveedorId: string;
    sucursalId: string;
    timbradoId: string;

    establecimiento?: string | null;
    puntoExpedicion?: string | null;
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
    noImputa: boolean;

    detalles: FacturaCompraDetalleInput[];
}

export interface FacturaCompra {
    id: string;

    tipoMovimiento: string;
    tipoComprobante: string;
    condicion: string;
    estado: string;

    proveedorId: string | null;
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

    proveedor: {
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

export interface FacturaCompraDetalleViewData {
    id: string;

    tipoMovimiento: string;
    tipoComprobante: string;
    condicion: string;
    estado: string;

    proveedorId: string | null;
    sucursalId: string;
    timbradoId: string | null;

    numeroTimbrado: string | null;
    establecimiento: string | null;
    puntoExpedicion: string | null;
    numeroComprobante: string;

    fechaEmision: Date;
    fechaVencimiento: Date | null;

    moneda: string;
    cotizacion: number;

    exenta: number;
    gravada5: number;
    iva5: number;
    gravada10: number;
    iva10: number;
    total: number;

    imputaIva: boolean;
    imputaIre: boolean;
    imputaIrpRsp: boolean;
    noImputa: boolean;

    concepto: string | null;

    proveedor: {
        id: string;
        nombre: string;
        tipoDocumento: string;
        numeroDocumento: string;
        dv: string | null;
        direccion: string | null;
        telefono: string | null;
        email: string | null;
    } | null;

    sucursal: {
        id: string;
        codigo: string;
        nombre: string;
        direccion: string | null;
        telefono: string | null;
    };

    timbrado: {
        id: string;
        numero: string;
        proveedorId: string | null;
        establecimiento: string | null;
        puntoExpedicion: string | null;
        fechaFin: Date | null;
    } | null;

    asiento: {
        id: string;
        numero: number;
        origen: string;
        estado: string;
    } | null;

    detalles: {
        id: string;
        cuentaContableId: string | null;
        descripcion: string;
        tipoImpuesto: string;
        cantidad: number;
        precioUnitario: number;
        exenta: number;
        gravada5: number;
        iva5: number;
        gravada10: number;
        iva10: number;
        total: number;
        cuentaContable: {
            id: string;
            codigo: string;
            nombre: string;
        } | null;
    }[];
}