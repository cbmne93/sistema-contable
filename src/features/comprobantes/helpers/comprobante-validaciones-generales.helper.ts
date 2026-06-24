export function limpiarTexto(value?: string | null) {
    const texto = value?.trim();

    return texto && texto.length > 0 ? texto : null;
}

export function validarTresDigitos(value?: string | null) {
    if (!value) {
        return false;
    }

    return /^\d{3}$/.test(value.trim());
}

export function validarNumeroComprobante(value?: string | null) {
    if (!value) {
        return false;
    }

    return /^\d{7}$/.test(value.trim());
}

export function validarImputacionTributaria(data: {
    imputaIva: boolean;
    imputaIre: boolean;
    imputaIrpRsp: boolean;
}) {
    return data.imputaIva || data.imputaIre || data.imputaIrpRsp;
}