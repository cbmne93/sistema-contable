"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";

interface DeleteEmpresaParams {
    id: string;
}

export async function deleteEmpresaAction({ id }: DeleteEmpresaParams) {
    try {
        const cookieStore = await cookies();
        const empresaActivaId = cookieStore.get("empresaActivaId")?.value;
        const isEmpresaActiva = empresaActivaId === id;

        const empresa = await prisma.empresa.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                razonSocial: true,
            },
        });

        if (!empresa) {
            return {
                ok: false,
                deletedActiveCompany: false,
                message: "No se encontró la empresa.",
            };
        }

        await prisma.$transaction(async (tx) => {
            await tx.asientoDetalle.deleteMany({
                where: {
                    asiento: {
                        empresaId: id,
                    },
                },
            });

            await tx.asientoContable.deleteMany({
                where: {
                    empresaId: id,
                },
            });

            await tx.comprobanteDetalle.deleteMany({
                where: {
                    comprobante: {
                        empresaId: id,
                    },
                },
            });

            await tx.comprobante.deleteMany({
                where: {
                    empresaId: id,
                },
            });

            await tx.timbrado.deleteMany({
                where: {
                    empresaId: id,
                },
            });

            await tx.cliente.deleteMany({
                where: {
                    empresaId: id,
                },
            });

            await tx.proveedor.deleteMany({
                where: {
                    empresaId: id,
                },
            });

            await tx.sucursal.deleteMany({
                where: {
                    empresaId: id,
                },
            });

            await tx.periodoFiscal.deleteMany({
                where: {
                    empresaId: id,
                },
            });

            await tx.configuracionContable.deleteMany({
                where: {
                    empresaId: id,
                },
            });

            await tx.cuentaContable.deleteMany({
                where: {
                    empresaId: id,
                },
            });

            await tx.usuarioEmpresa.deleteMany({
                where: {
                    empresaId: id,
                },
            });

            await tx.empresa.delete({
                where: {
                    id,
                },
            });
        });

        if (isEmpresaActiva) {
            cookieStore.delete("empresaActivaId");
        }

        revalidatePath("/empresas");
        revalidatePath("/seleccionar-empresa");
        revalidatePath("/dashboard");

        return {
            ok: true,
            deletedActiveCompany: isEmpresaActiva,
            message: "Empresa eliminada definitivamente.",
        };
    } catch (error) {
        console.error("Error al eliminar empresa:", error);

        return {
            ok: false,
            deletedActiveCompany: false,
            message:
                "No se pudo eliminar la empresa. Verifique si existen relaciones pendientes.",
        };
    }
}