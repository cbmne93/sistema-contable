import type { CuentaContableOption } from "../interfaces";
import type { CuentaContableFormValues } from "../validations";

export const cuentaContableDefaultValues: CuentaContableFormValues = {
    cuentaPadreId: "",
    codigo: "",
    nombre: "",
    descripcion: "",
    tipo: "ACTIVO",
    naturaleza: "DEUDORA",
    nivel: 1,
    aceptaMovimiento: true,
    moneda: "LOCAL",
    requiereAjusteCambio: false,
};

export const TIPO_CUENTA_OPTIONS = [
    { value: "ACTIVO", label: "Activo" },
    { value: "PASIVO", label: "Pasivo" },
    { value: "PATRIMONIO", label: "Patrimonio" },
    { value: "INGRESO", label: "Ingreso" },
    { value: "EGRESO", label: "Egreso" },
] as const;

export const NATURALEZA_CUENTA_OPTIONS = [
    { value: "DEUDORA", label: "Deudora" },
    { value: "ACREEDORA", label: "Acreedora" },
] as const;

export const MONEDA_CUENTA_OPTIONS = [
    { value: "LOCAL", label: "Local" },
    { value: "EXTRANJERA", label: "Extranjera" },
] as const;

export function getTipoByCodigo(
    codigo: string
): CuentaContableFormValues["tipo"] {
    if (codigo.startsWith("1")) return "ACTIVO";
    if (codigo.startsWith("2")) return "PASIVO";
    if (codigo.startsWith("3")) return "PATRIMONIO";
    if (codigo.startsWith("4")) return "INGRESO";
    if (codigo.startsWith("5")) return "EGRESO";

    return "ACTIVO";
}

export function getNaturalezaByTipo(
    tipo: CuentaContableFormValues["tipo"]
): CuentaContableFormValues["naturaleza"] {
    if (tipo === "ACTIVO" || tipo === "EGRESO") {
        return "DEUDORA";
    }

    return "ACREEDORA";
}

export function getTipoLabel(tipo: string) {
    return (
        TIPO_CUENTA_OPTIONS.find((option) => option.value === tipo)?.label ??
        tipo
    );
}

export function getNaturalezaLabel(naturaleza: string) {
    return (
        NATURALEZA_CUENTA_OPTIONS.find(
            (option) => option.value === naturaleza
        )?.label ?? naturaleza
    );
}

export function findCuentaPadreByCodigo({
    codigo,
    cuentasPadre,
}: {
    codigo: string;
    cuentasPadre: CuentaContableOption[];
}) {
    const codigoLimpio = codigo.trim();

    if (!codigoLimpio) {
        return undefined;
    }

    return cuentasPadre
        .filter(
            (cuenta) =>
                codigoLimpio.startsWith(cuenta.codigo) &&
                codigoLimpio !== cuenta.codigo
        )
        .sort((a, b) => b.codigo.length - a.codigo.length)[0];
}

export function getCodigoSufijo({
    codigo,
    codigoPadre,
}: {
    codigo: string;
    codigoPadre: string;
}) {
    if (!codigo.startsWith(codigoPadre)) {
        return "";
    }

    return codigo.slice(codigoPadre.length);
}