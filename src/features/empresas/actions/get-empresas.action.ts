"use server";

import { auth } from "../../../../auth";
import { prisma } from "@/lib/prisma";

export async function getEmpresasAction() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return {
                ok: false,
                empresas: [],
                message: "No hay una sesión activa.",
            };
        }

        const empresas = await prisma.empresa.findMany({
            where: {
                usuarios: {
                    some: {
                        usuarioId: session.user.id,
                        activo: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return {
            ok: true,
            empresas,
            message: "Empresas obtenidas correctamente.",
        };
    } catch (error) {
        console.error("Error al obtener empresas:", error);

        return {
            ok: false,
            empresas: [],
            message: "No se pudieron obtener las empresas.",
        };
    }
}