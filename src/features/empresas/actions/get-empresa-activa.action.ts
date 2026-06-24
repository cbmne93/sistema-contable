"use server";

import { cookies } from "next/headers";

import { auth } from "../../../../auth";
import { prisma } from "@/lib/prisma";

export async function getEmpresaActivaAction() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return {
                ok: false,
                empresa: null,
                message: "No hay una sesión activa.",
            };
        }

        const cookieStore = await cookies();
        const empresaActivaId = cookieStore.get("empresaActivaId")?.value;

        if (!empresaActivaId) {
            return {
                ok: false,
                empresa: null,
                message: "No hay empresa activa seleccionada.",
            };
        }

        const empresa = await prisma.empresa.findFirst({
            where: {
                id: empresaActivaId,
                estado: "ACTIVO",
                usuarios: {
                    some: {
                        usuarioId: session.user.id,
                        activo: true,
                    },
                },
            },
        });

        if (!empresa) {
            return {
                ok: false,
                empresa: null,
                message: "La empresa activa no existe, está inactiva o no pertenece al usuario.",
            };
        }

        return {
            ok: true,
            empresa,
            message: "Empresa activa obtenida correctamente.",
        };
    } catch (error) {
        console.error("Error al obtener empresa activa:", error);

        return {
            ok: false,
            empresa: null,
            message: "No se pudo obtener la empresa activa.",
        };
    }
}