"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";
import type { CreateClienteInput } from "../interfaces";

export async function createClienteAction(data: CreateClienteInput) {
    try {
        const empresaId = await getEmpresaActivaIdOrThrow();

        const nombre = data.nombre.trim();

        const clienteConMismoNombre = await prisma.cliente.findFirst({
            where: {
                empresaId,
                nombre: {
                    equals: nombre,
                    mode: "insensitive",
                },
            },
        });

        if (clienteConMismoNombre) {
            return {
                ok: false,
                cliente: null,
                message: "Ya existe un cliente con ese nombre en esta empresa.",
            };
        }

        const cliente = await prisma.cliente.create({
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

        revalidatePath("/clientes");

        return {
            ok: true,
            cliente,
            message: "Cliente creado correctamente.",
        };
    } catch (error) {
        console.error("Error al crear cliente:", error);

        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === "P2002"
        ) {
            return {
                ok: false,
                cliente: null,
                message:
                    "Ya existe un cliente con ese nombre o documento en esta empresa.",
            };
        }

        if (error instanceof Error && error.message.includes("empresa activa")) {
            return {
                ok: false,
                cliente: null,
                message: "Debe seleccionar una empresa activa antes de crear clientes.",
            };
        }

        return {
            ok: false,
            cliente: null,
            message: "No se pudo crear el cliente. Verifique los datos ingresados.",
        };
    }
}