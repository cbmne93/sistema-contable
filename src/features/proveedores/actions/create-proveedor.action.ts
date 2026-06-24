
"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";
import type { CreateProveedorInput } from "../interfaces";

export async function createProveedorAction(data: CreateProveedorInput) {
    try {
        const empresaId = await getEmpresaActivaIdOrThrow();

        const nombre = data.nombre.trim();

        const proveedorConMismoNombre = await prisma.proveedor.findFirst({
            where: {
                empresaId,
                nombre: {
                    equals: nombre,
                    mode: "insensitive",
                },
            },
        });

        if (proveedorConMismoNombre) {
            return {
                ok: false,
                proveedor: null,
                message: "Ya existe un proveedor con ese nombre en esta empresa.",
            };
        }

        const proveedor = await prisma.proveedor.create({
            data: {
                empresaId,
                nombre,
                tipoDocumento: data.tipoDocumento,
                numeroDocumento: data.numeroDocumento.trim(),
                dv: data.dv?.trim() || null,
                tipoPersona: data.tipoPersona,
                direccion: data.direccion?.trim() || null,
                telefono: data.telefono?.trim() || null,
                email: data.email?.trim() || null,
            },
        });

        revalidatePath("/proveedores");

        return {
            ok: true,
            proveedor,
            message: "Proveedor creado correctamente.",
        };
    } catch (error) {
        console.error("Error al crear proveedor:", error);

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
                    "Ya existe un proveedor con ese nombre o documento en esta empresa.",
            };
        }

        if (error instanceof Error && error.message.includes("empresa activa")) {
            return {
                ok: false,
                proveedor: null,
                message:
                    "Debe seleccionar una empresa activa antes de crear proveedores.",
            };
        }

        return {
            ok: false,
            proveedor: null,
            message:
                "No se pudo crear el proveedor. Verifique los datos ingresados.",
        };
    }
}