"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";

export async function setPeriodoFiscalActivoAction(formData: FormData) {
    const periodoFiscalId = formData.get("periodoFiscalId")?.toString();

    if (!periodoFiscalId) {
        redirect("/periodos-fiscales");
    }

    try {
        const empresaId = await getEmpresaActivaIdOrThrow();

        const periodoFiscal = await prisma.periodoFiscal.findFirst({
            where: {
                id: periodoFiscalId,
                empresaId,
            },
            select: {
                id: true,
            },
        });

        if (!periodoFiscal) {
            redirect("/periodos-fiscales");
        }

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
        console.error("Error al seleccionar periodo fiscal:", error);
        redirect("/periodos-fiscales");
    }

    redirect("/periodos-fiscales");
}