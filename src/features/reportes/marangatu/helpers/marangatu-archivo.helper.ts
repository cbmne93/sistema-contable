interface MarangatuFileNameParams {
    ruc: string;
    anio: number;
    mes: number;
    codigo: string;
    extension: "csv" | "txt" | "zip";
}

export function getRucSinDv(ruc: string) {
    const value = ruc.trim();

    if (value.includes("-")) {
        return value.split("-")[0].replace(/\D/g, "");
    }

    return value.replace(/\D/g, "");
}

export function getPeriodoMensualMarangatu(anio: number, mes: number) {
    return `${String(mes).padStart(2, "0")}${anio}`;
}

export function getMarangatuBaseFileName({
    ruc,
    anio,
    mes,
    codigo,
}: Omit<MarangatuFileNameParams, "extension">) {
    const rucSinDv = getRucSinDv(ruc);
    const periodo = getPeriodoMensualMarangatu(anio, mes);

    return `${rucSinDv}_REG_${periodo}_${codigo}`;
}

export function getMarangatuFileName({
    ruc,
    anio,
    mes,
    codigo,
    extension,
}: MarangatuFileNameParams) {
    return `${getMarangatuBaseFileName({
        ruc,
        anio,
        mes,
        codigo,
    })}.${extension}`;
}