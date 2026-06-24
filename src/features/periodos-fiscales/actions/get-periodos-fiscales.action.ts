"use server";

import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";
import { getPeriodoFiscalActivoOrThrow } from "../helpers";

export async function getPeriodosFiscalesAction() {
    try {
        const empresaId = await getEmpresaActivaIdOrThrow();
        const cookieStore = await cookies();

        const periodoFiscalActivo =
            await getPeriodoFiscalActivoOrThrow(empresaId);

        const periodosFiscales = await prisma.periodoFiscal.findMany({
            where: {
                empresaId,
            },
            orderBy: {
                anio: "desc",
            },
        });

        const periodoFiscalActivoId =
            cookieStore.get("periodoFiscalActivoId")?.value ??
            periodoFiscalActivo.id;

        return {
            ok: true,
            periodosFiscales,
            periodoFiscalActivoId,
            message: "Periodos fiscales obtenidos correctamente.",
        };
    } catch (error) {
        console.error("Error al obtener periodos fiscales:", error);

        return {
            ok: false,
            periodosFiscales: [],
            periodoFiscalActivoId: null,
            message: "No se pudieron obtener los periodos fiscales.",
        };
    }
}