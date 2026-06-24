
"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";
import type { CreateSucursalInput } from "../interfaces";

export async function createSucursalAction(data: CreateSucursalInput) {
    try {
        const empresaId = await getEmpresaActivaIdOrThrow();

        const codigo = data.codigo.trim();
        const nombre = data.nombre.trim();

        const sucursalConMismoCodigo = await prisma.sucursal.findFirst({
            where: {
                empresaId,
                codigo,
            },
        });

        if (sucursalConMismoCodigo) {
            return {
                ok: false,
                sucursal: null,
                message: "Ya existe una sucursal con ese código en esta empresa.",
            };
        }

        const sucursalConMismoNombre = await prisma.sucursal.findFirst({
            where: {
                empresaId,
                nombre: {
                    equals: nombre,
                    mode: "insensitive",
                },
            },
        });

        if (sucursalConMismoNombre) {
            return {
                ok: false,
                sucursal: null,
                message: "Ya existe una sucursal con ese nombre en esta empresa.",
            };
        }

        const sucursal = await prisma.sucursal.create({
            data: {
                empresaId,
                codigo,
                nombre,
                direccion: data.direccion?.trim() || null,
                telefono: data.telefono?.trim() || null,
            },
        });

        revalidatePath("/sucursales");

        return {
            ok: true,
            sucursal,
            message: "Sucursal creada correctamente.",
        };
    } catch (error) {
        console.error("Error al crear sucursal:", error);

        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === "P2002"
        ) {
            return {
                ok: false,
                sucursal: null,
                message:
                    "Ya existe una sucursal con ese código o nombre en esta empresa.",
            };
        }

        if (error instanceof Error && error.message.includes("empresa activa")) {
            return {
                ok: false,
                sucursal: null,
                message:
                    "Debe seleccionar una empresa activa antes de crear sucursales.",
            };
        }

        return {
            ok: false,
            sucursal: null,
            message:
                "No se pudo crear la sucursal. Verifique los datos ingresados.",
        };
    }
}