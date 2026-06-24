import type { ConfiguracionContableFormValues } from "../validations";

export interface ConfiguracionContableCuentaOption {
    id: string;
    codigo: string;
    nombre: string;
    tipo: string;
    naturaleza: string;
}

export interface ConfiguracionContableData
    extends ConfiguracionContableFormValues {
    id?: string;
}

export interface ConfiguracionContableOptions {
    cuentas: ConfiguracionContableCuentaOption[];
}