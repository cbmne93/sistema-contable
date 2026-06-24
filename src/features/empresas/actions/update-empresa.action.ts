"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import type { UpdateEmpresaInput } from "../interfaces";

export async function updateEmpresaAction(data: UpdateEmpresaInput) {
    try {
        const razonSocial = data.razonSocial.trim();
        const ruc = data.ruc.trim();
        const dv = data.dv.trim();

        const empresaExistente = await prisma.empresa.findUnique({
            where: {
                id: data.id,
            },
        });

        if (!empresaExistente) {
            return {
                ok: false,
                empresa: null,
                message: "Empresa no encontrada.",
            };
        }

        const empresaConMismoRuc = await prisma.empresa.findFirst({
            where: {
                ruc,
                NOT: {
                    id: data.id,
                },
            },
        });

        if (empresaConMismoRuc) {
            return {
                ok: false,
                empresa: null,
                message: "Ya existe otra empresa con ese RUC.",
            };
        }

        const empresaConMismaRazonSocial = await prisma.empresa.findFirst({
            where: {
                razonSocial: {
                    equals: razonSocial,
                    mode: "insensitive",
                },
                NOT: {
                    id: data.id,
                },
            },
        });

        if (empresaConMismaRazonSocial) {
            return {
                ok: false,
                empresa: null,
                message: "Ya existe otra empresa con esa razón social.",
            };
        }

        const empresa = await prisma.empresa.update({
            where: {
                id: data.id,
            },
            data: {
                razonSocial,
                ruc,
                dv,
                direccion: data.direccion?.trim() || null,
                telefono: data.telefono?.trim() || null,
                email: data.email?.trim() || null,
                estado: data.estado,

                obligacionIvaGeneral: data.obligacionIvaGeneral ?? false,
                obligacionIrpServicios: data.obligacionIrpServicios ?? false,
                obligacionIrpCapital: data.obligacionIrpCapital ?? false,
                obligacionIreGeneral: data.obligacionIreGeneral ?? false,
                obligacionIreSimple: data.obligacionIreSimple ?? false,
                obligacionIreResimple: data.obligacionIreResimple ?? false,
                obligacionIdu: data.obligacionIdu ?? false,
                obligacionInr: data.obligacionInr ?? false,
            },
        });

        revalidatePath("/empresas");
        revalidatePath(`/empresas/${data.id}/editar`);
        revalidatePath("/facturas-compra");
        revalidatePath("/facturas-venta");

        return {
            ok: true,
            empresa,
            message: "Empresa actualizada correctamente.",
        };
    } catch (error) {
        console.error("Error al actualizar empresa:", error);

        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === "P2002"
        ) {
            return {
                ok: false,
                empresa: null,
                message: "Ya existe otra empresa con ese RUC o razón social.",
            };
        }

        return {
            ok: false,
            empresa: null,
            message:
                "No se pudo actualizar la empresa. Verifique los datos ingresados.",
        };
    }
}