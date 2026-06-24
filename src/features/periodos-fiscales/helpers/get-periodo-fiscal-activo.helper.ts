import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";

function getInicioAnio(anio: number) {
    return new Date(Date.UTC(anio, 0, 1, 0, 0, 0, 0));
}

function getFinAnio(anio: number) {
    return new Date(Date.UTC(anio, 11, 31, 23, 59, 59, 999));
}

export async function getOrCreatePeriodoFiscalActivo(empresaId: string) {
    const anioActual = new Date().getFullYear();

    const periodoExistente = await prisma.periodoFiscal.findFirst({
        where: {
            empresaId,
            anio: anioActual,
        },
    });

    if (periodoExistente) {
        return periodoExistente;
    }

    return prisma.periodoFiscal.create({
        data: {
            empresaId,
            anio: anioActual,
            descripcion: `Periodo Fiscal ${anioActual}`,
            fechaInicio: getInicioAnio(anioActual),
            fechaFin: getFinAnio(anioActual),
            estado: "ABIERTO",
        },
    });
}

export async function getPeriodoFiscalActivoOrThrow(empresaId: string) {
    const cookieStore = await cookies();
    const periodoFiscalActivoId = cookieStore.get(
        "periodoFiscalActivoId"
    )?.value;

    if (periodoFiscalActivoId) {
        const periodoFiscal = await prisma.periodoFiscal.findFirst({
            where: {
                id: periodoFiscalActivoId,
                empresaId,
            },
        });

        if (periodoFiscal) {
            return periodoFiscal;
        }
    }

    return getOrCreatePeriodoFiscalActivo(empresaId);
}