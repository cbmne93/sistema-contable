"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";
import type { UpdateClienteInput } from "../interfaces";

export async function updateClienteAction(data: UpdateClienteInput) {
    try {
        const empresaId = await getEmpresaActivaIdOrThrow();

        const clienteExistente = await prisma.cliente.findFirst({
            where: {
                id: data.id,
                empresaId,
            },
        });

        if (!clienteExistente) {
            return {
                ok: false,
                cliente: null,
                message: "Cliente no encontrado.",
            };
        }

        const nombre = data.nombre.trim();

        const clienteConMismoNombre = await prisma.cliente.findFirst({
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

        if (clienteConMismoNombre) {
            return {
                ok: false,
                cliente: null,
                message: "Ya existe otro cliente con ese nombre en esta empresa.",
            };
        }

        const cliente = await prisma.cliente.update({
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

        revalidatePath("/clientes");
        revalidatePath(`/clientes/${data.id}/editar`);

        return {
            ok: true,
            cliente,
            message: "Cliente actualizado correctamente.",
        };
    } catch (error) {
        console.error("Error al actualizar cliente:", error);

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
                    "Ya existe otro cliente con ese nombre o documento en esta empresa.",
            };
        }

        return {
            ok: false,
            cliente: null,
            message: "No se pudo actualizar el cliente. Verifique los datos ingresados.",
        };
    }
}