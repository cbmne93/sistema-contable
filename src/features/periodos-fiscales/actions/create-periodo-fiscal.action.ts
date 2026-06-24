"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";

function getInicioAnio(anio: number) {
    return new Date(Date.UTC(anio, 0, 1, 0, 0, 0, 0));
}

function getFinAnio(anio: number) {
    return new Date(Date.UTC(anio, 11, 31, 23, 59, 59, 999));
}

function buildErrorUrl(message: string) {
    return `/periodos-fiscales/nuevo?error=${encodeURIComponent(message)}`;
}

export async function createPeriodoFiscalAction(formData: FormData) {
    const anioValue = formData.get("anio")?.toString() ?? "";
    const anio = Number(anioValue);

    if (!Number.isInteger(anio) || anio < 2000 || anio > 2100) {
        redirect(buildErrorUrl("Ingrese un año válido."));
    }

    try {
        const empresaId = await getEmpresaActivaIdOrThrow();

        const existePeriodo = await prisma.periodoFiscal.findFirst({
            where: {
                empresaId,
                anio,
            },
            select: {
                id: true,
            },
        });

        if (existePeriodo) {
            redirect(
                buildErrorUrl(
                    `Ya existe un periodo fiscal para el año ${anio}.`
                )
            );
        }

        const periodoFiscal = await prisma.periodoFiscal.create({
            data: {
                empresaId,
                anio,
                descripcion: `Periodo Fiscal ${anio}`,
                fechaInicio: getInicioAnio(anio),
                fechaFin: getFinAnio(anio),
                estado: "ABIERTO",
            },
            select: {
                id: true,
            },
        });

        const cookieStore = await cookies();

        cookieStore.set("periodoFiscalActivoId", periodoFiscal.id, {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 30,
        });

        revalidatePath("/periodos-fiscales");
        revalidatePath("/facturas-venta");
    } catch (error) {
        console.error("Error al crear periodo fiscal:", error);

        redirect(buildErrorUrl("No se pudo crear el periodo fiscal."));
    }

    redirect("/periodos-fiscales");
}