export function getFechaInputAsUTC(dateValue: string | Date) {
    if (dateValue instanceof Date) {
        return new Date(
            Date.UTC(
                dateValue.getUTCFullYear(),
                dateValue.getUTCMonth(),
                dateValue.getUTCDate(),
                0,
                0,
                0,
                0
            )
        );
    }

    return new Date(`${dateValue}T00:00:00.000Z`);
}

export function isFechaDentroDelPeriodo(
    fecha: Date,
    periodoFiscal: {
        fechaInicio: Date;
        fechaFin: Date;
    }
) {
    return fecha >= periodoFiscal.fechaInicio && fecha <= periodoFiscal.fechaFin;
}