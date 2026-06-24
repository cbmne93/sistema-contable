"use server";

import { revalidatePath } from "next/cache";

import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";
import { prisma } from "@/lib/prisma";

export async function anularMarangatuRegistroAction(id: string) {
    try {
        const empresaId = await getEmpresaActivaIdOrThrow();

        const registro = await prisma.marangatuRegistro.findFirst({
            where: {
                id,
                empresaId,
            },
            select: {
                id: true,
                codigo: true,
                estado: true,
            },
        });

        if (!registro) {
            return {
                ok: false,
                message: "No se encontró el registro.",
            };
        }

        if (registro.estado === "ANULADO") {
            return {
                ok: false,
                message: "El registro ya se encuentra anulado.",
            };
        }

        await prisma.$transaction(async (tx) => {
            await tx.marangatuRegistroArchivo.deleteMany({
                where: {
                    registroId: registro.id,
                },
            });

            await tx.marangatuRegistroDetalle.deleteMany({
                where: {
                    registroId: registro.id,
                },
            });

            await tx.marangatuRegistro.update({
                where: {
                    id: registro.id,
                },
                data: {
                    estado: "ANULADO",
                    registrosCompra: 0,
                    registrosVenta: 0,
                    registrosEgreso: 0,
                    registrosIngreso: 0,
                    fechaAnulacion: new Date(),
                    motivoAnulacion: "Anulado por el usuario.",
                },
            });
        });

        revalidatePath("/reportes/marangatu");
        revalidatePath(`/reportes/marangatu/${registro.id}`);

        return {
            ok: true,
            message: `Registro ${registro.codigo} anulado correctamente.`,
        };
    } catch (error) {
        console.error("Error al anular registro Marangatu:", error);

        return {
            ok: false,
            message:
                error instanceof Error
                    ? error.message
                    : "No se pudo anular el registro.",
        };
    }
}