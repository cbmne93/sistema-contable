const CONNECTOR_WORDS = new Set([
    "a",
    "al",
    "ante",
    "bajo",
    "con",
    "contra",
    "de",
    "del",
    "desde",
    "durante",
    "e",
    "el",
    "en",
    "entre",
    "hacia",
    "hasta",
    "la",
    "las",
    "los",
    "o",
    "para",
    "por",
    "segun",
    "sin",
    "sobre",
    "tras",
    "u",
    "y",
]);

const ACCENTED_WORDS: Record<string, string> = {
    transito: "Tránsito",
    regimen: "Régimen",
    mercaderias: "Mercaderías",
    credito: "Crédito",
    creditos: "Créditos",
    depositos: "Depósitos",
    deposito: "Depósito",
    garantia: "Garantía",
    informatica: "Informática",
    utiles: "Útiles",
    articulos: "Artículos",
    perdida: "Pérdida",
    perdidas: "Pérdidas",
    capacitacion: "Capacitación",
    retencion: "Retención",
    retenciones: "Retenciones",
    depreciacion: "Depreciación",
    depreciaciones: "Depreciaciones",
    comision: "Comisión",
    comisiones: "Comisiones",
    contribucion: "Contribución",
    contribuciones: "Contribuciones",
    telefono: "Teléfono",
};

const UPPERCASE_WORDS = new Set([
    "iva",
    "i.v.a.",
    "ips",
    "i.p.s.",
    "dgr",
    "iracis",
    "gnd",
    "cta",
    "sa",
    "s.a.",
    "srl",
    "s.r.l.",
]);

function normalizeSpaces(value: string) {
    return value.trim().replace(/\s+/g, " ");
}

function capitalizeWord(word: string) {
    if (!word) return word;

    const lower = word.toLowerCase();

    if (UPPERCASE_WORDS.has(lower)) {
        return lower.toUpperCase();
    }

    if (ACCENTED_WORDS[lower]) {
        return ACCENTED_WORDS[lower];
    }

    return lower.charAt(0).toUpperCase() + lower.slice(1);
}

function formatMovimientoNombre(nombre: string) {
    const normalized = normalizeSpaces(nombre);

    return normalized
        .split(" ")
        .map((word, index) => {
            const lower = word.toLowerCase();

            if (index > 0 && CONNECTOR_WORDS.has(lower)) {
                return lower;
            }

            return capitalizeWord(word);
        })
        .join(" ");
}

function formatAgrupadoraNombre(nombre: string) {
    return normalizeSpaces(nombre).toUpperCase();
}

export function formatCuentaContableNombre({
    nombre,
    aceptaMovimiento,
}: {
    nombre: string;
    aceptaMovimiento: boolean;
}) {
    if (aceptaMovimiento) {
        return formatMovimientoNombre(nombre);
    }

    return formatAgrupadoraNombre(nombre);
}