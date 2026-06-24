"use server";

import { cookies } from "next/headers";

import { auth } from "../../../../auth";
import { prisma } from "@/lib/prisma";
import { getOrCreatePeriodoFiscalActivo } from "@/features/periodos-fiscales/helpers";

export async function setEmpresaActivaAction(empresaId: string) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return {
                ok: false,
                message: "No hay una sesión activa.",
            };
        }

        const usuarioEmpresa = await prisma.usuarioEmpresa.findFirst({
            where: {
                usuarioId: session.user.id,
                empresaId,
                activo: true,
                empresa: {
                    estado: "ACTIVO",
                },
            },
            select: {
                id: true,
            },
        });

        if (!usuarioEmpresa) {
            return {
                ok: false,
                message: "No tiene permiso para seleccionar esta empresa.",
            };
        }

        const cookieStore = await cookies();

        const periodoFiscal = await getOrCreatePeriodoFiscalActivo(empresaId);

        cookieStore.set("empresaActivaId", empresaId, {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 30,
        });

        cookieStore.set("periodoFiscalActivoId", periodoFiscal.id, {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 30,
        });

        return {
            ok: true,
            message: "Empresa y periodo fiscal seleccionados correctamente.",
        };
    } catch (error) {
        console.error("Error al seleccionar empresa activa:", error);

        return {
            ok: false,
            message: "No se pudo seleccionar la empresa activa.",
        };
    }
}