
"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";
import type { UpdateSucursalInput } from "../interfaces";

export async function updateSucursalAction(data: UpdateSucursalInput) {
    try {
        const empresaId = await getEmpresaActivaIdOrThrow();

        const sucursalExistente = await prisma.sucursal.findFirst({
            where: {
                id: data.id,
                empresaId,
            },
        });

        if (!sucursalExistente) {
            return {
                ok: false,
                sucursal: null,
                message: "Sucursal no encontrada.",
            };
        }

        const codigo = data.codigo.trim();
        const nombre = data.nombre.trim();

        const sucursalConMismoCodigo = await prisma.sucursal.findFirst({
            where: {
                empresaId,
                codigo,
                NOT: {
                    id: data.id,
                },
            },
        });

        if (sucursalConMismoCodigo) {
            return {
                ok: false,
                sucursal: null,
                message: "Ya existe otra sucursal con ese código en esta empresa.",
            };
        }

        const sucursalConMismoNombre = await prisma.sucursal.findFirst({
            where: {
                empresaId,
                nombre: {
                    equals: nombre,
                    mode: "insensitive",
                },
                NOT: {
                    id: data.id,
                },
            },
        });

        if (sucursalConMismoNombre) {
            return {
                ok: false,
                sucursal: null,
                message: "Ya existe otra sucursal con ese nombre en esta empresa.",
            };
        }

        const sucursal = await prisma.sucursal.update({
            where: {
                id: data.id,
            },
            data: {
                codigo,
                nombre,
                direccion: data.direccion?.trim() || null,
                telefono: data.telefono?.trim() || null,
                estado: data.estado,
            },
        });

        revalidatePath("/sucursales");
        revalidatePath(`/sucursales/${data.id}/editar`);

        return {
            ok: true,
            sucursal,
            message: "Sucursal actualizada correctamente.",
        };
    } catch (error) {
        console.error("Error al actualizar sucursal:", error);

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
                    "Ya existe otra sucursal con ese código o nombre en esta empresa.",
            };
        }

        return {
            ok: false,
            sucursal: null,
            message:
                "No se pudo actualizar la sucursal. Verifique los datos ingresados.",
        };
    }
}