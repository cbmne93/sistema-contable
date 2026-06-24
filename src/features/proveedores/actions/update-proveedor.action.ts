
"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";
import type { UpdateProveedorInput } from "../interfaces";

export async function updateProveedorAction(data: UpdateProveedorInput) {
    try {
        const empresaId = await getEmpresaActivaIdOrThrow();

        const proveedorExistente = await prisma.proveedor.findFirst({
            where: {
                id: data.id,
                empresaId,
            },
        });

        if (!proveedorExistente) {
            return {
                ok: false,
                proveedor: null,
                message: "Proveedor no encontrado.",
            };
        }

        const nombre = data.nombre.trim();

        const proveedorConMismoNombre = await prisma.proveedor.findFirst({
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

        if (proveedorConMismoNombre) {
            return {
                ok: false,
                proveedor: null,
                message: "Ya existe otro proveedor con ese nombre en esta empresa.",
            };
        }

        const proveedor = await prisma.proveedor.update({
            where: {
                id: data.id,
            },
            data: {
                nombre,
                tipoDocumento: data.tipoDocumento,
                numeroDocumento: data.numeroDocumento.trim(),
                dv: data.dv?.trim() || null,
                tipoPersona: data.tipoPersona,
                direccion: data.direccion?.trim() || null,
                telefono: data.telefono?.trim() || null,
                email: data.email?.trim() || null,
                estado: data.estado,
            },
        });

        revalidatePath("/proveedores");
        revalidatePath(`/proveedores/${data.id}/editar`);

        return {
            ok: true,
            proveedor,
            message: "Proveedor actualizado correctamente.",
        };
    } catch (error) {
        console.error("Error al actualizar proveedor:", error);

        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === "P2002"
        ) {
            return {
                ok: false,
                proveedor: null,
                message:
                    "Ya existe otro proveedor con ese nombre o documento en esta empresa.",
            };
        }

        return {
            ok: false,
            proveedor: null,
            message:
                "No se pudo actualizar el proveedor. Verifique los datos ingresados.",
        };
    }
}