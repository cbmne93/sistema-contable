export interface CuentaContable {
    id: string;
    codigo: string;
    nombre: string;
    descripcion: string | null;
    tipo: string;
    naturaleza: string;
    nivel: number;
    aceptaMovimiento: boolean;
    moneda: string;
    requiereAjusteCambio: boolean;
    estado: string;
    cuentaPadre: {
        id: string;
        codigo: string;
        nombre: string;
    } | null;
}

export interface CuentaContableOption {
    id: string;
    codigo: string;
    nombre: string;
    tipo: string;
    naturaleza: string;
    nivel: number;
    aceptaMovimiento: boolean;
}