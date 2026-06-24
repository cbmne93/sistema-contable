export interface AsientoContableCuentaOption {
    id: string;
    codigo: string;
    nombre: string;
}

export interface AsientoContableSucursalOption {
    id: string;
    nombre: string;
}

export interface AsientoContableFormOptions {
    cuentas: AsientoContableCuentaOption[];
    sucursales: AsientoContableSucursalOption[];
}