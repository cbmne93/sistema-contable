export type TipoInformeMarangatuInput = "TODOS" | "COMPRAS" | "VENTAS";

type CsvValue = string | number | null | undefined;

export function getMesValido(mes: number) {
    if (!Number.isInteger(mes) || mes < 1 || mes > 12) {
        return null;
    }

    return mes;
}

export function getFechaMesRange(anio: number, mes: number) {
    return {
        gte: new Date(Date.UTC(anio, mes - 1, 1, 0, 0, 0, 0)),
        lte: new Date(Date.UTC(anio, mes, 0, 23, 59, 59, 999)),
    };
}

export function getTiposAIncluir(tipoInforme: TipoInformeMarangatuInput) {
    return {
        incluirCompras: tipoInforme === "TODOS" || tipoInforme === "COMPRAS",
        incluirVentas: tipoInforme === "TODOS" || tipoInforme === "VENTAS",
    };
}

export function getCodigoPrefix(tipoInforme: TipoInformeMarangatuInput) {
    if (tipoInforme === "COMPRAS") return "C";
    if (tipoInforme === "VENTAS") return "V";

    return "T";
}

export function getNextCodigo(
    tipoInforme: TipoInformeMarangatuInput,
    numero: number
) {
    return `${getCodigoPrefix(tipoInforme)}${String(numero).padStart(4, "0")}`;
}

export function formatDateMarangatu(date: Date) {
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();

    return `${day}/${month}/${year}`;
}

export function toIntegerAmount(value: unknown) {
    return String(Math.round(Number(value ?? 0)));
}

export function toSiNo(value: boolean) {
    return value ? "S" : "N";
}

export function cleanText(value?: string | null) {
    return (value ?? "").replace(/\s+/g, " ").trim();
}

export function getCodigoTipoDocumento(tipoDocumento?: string | null) {
    if (tipoDocumento === "CEDULA_IDENTIDAD") return "12";
    if (tipoDocumento === "CEDULA_DE_IDENTIDAD") return "12";
    if (tipoDocumento === "PASAPORTE") return "13";
    if (tipoDocumento === "DOCUMENTO_EXTRANJERO") return "14";

    return "11";
}

export function getNumeroDocumentoMarangatu({
    tipoDocumento,
    numeroDocumento,
}: {
    tipoDocumento?: string | null;
    numeroDocumento?: string | null;
}) {
    const value = (numeroDocumento ?? "").trim();

    if (!value) return "";

    const isRuc =
        !tipoDocumento ||
        tipoDocumento === "RUC" ||
        tipoDocumento === "REGISTRO_UNICO_CONTRIBUYENTE";

    if (isRuc && value.includes("-")) {
        return value.split("-")[0].replace(/\D/g, "");
    }

    return value.replace(/\D/g, "");
}

export function getCodigoCondicion(condicion: string) {
    return condicion === "CREDITO" ? "2" : "1";
}

export function getCodigoTipoComprobante() {
    return "109";
}

export function formatNumeroComprobante({
    establecimiento,
    puntoExpedicion,
    numeroComprobante,
}: {
    establecimiento: string | null;
    puntoExpedicion: string | null;
    numeroComprobante: string;
}) {
    return `${establecimiento ?? "000"}-${puntoExpedicion ?? "000"}-${numeroComprobante}`;
}

function toCsvField(value: CsvValue) {
    const text = String(value ?? "");

    if (text.includes(",") || text.includes('"') || text.includes("\n")) {
        return `"${text.replaceAll('"', '""')}"`;
    }

    return text;
}

function toTxtField(value: CsvValue) {
    return String(value ?? "")
        .replace(/\t/g, " ")
        .replace(/\r/g, " ")
        .replace(/\n/g, " ");
}

export function createCsvLine(values: CsvValue[]) {
    return values.map(toCsvField).join(",");
}

export function createTxtLine(values: CsvValue[]) {
    return values.map(toTxtField).join("\t");
}