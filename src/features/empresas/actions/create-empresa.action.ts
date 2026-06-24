"use server";

import { revalidatePath } from "next/cache";

import { auth } from "../../../../auth";
import { prisma } from "@/lib/prisma";
import type { CreateEmpresaInput } from "../interfaces";

export async function createEmpresaAction(data: CreateEmpresaInput) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return {
                ok: false,
                empresa: null,
                message: "No hay una sesión activa.",
            };
        }

        const razonSocial = data.razonSocial.trim();
        const ruc = data.ruc.trim();
        const dv = data.dv.trim();

        const empresaConMismoRuc = await prisma.empresa.findFirst({
            where: {
                ruc,
            },
        });

        if (empresaConMismoRuc) {
            return {
                ok: false,
                empresa: null,
                message: "Ya existe una empresa con ese RUC.",
            };
        }

        const empresaConMismaRazonSocial = await prisma.empresa.findFirst({
            where: {
                razonSocial: {
                    equals: razonSocial,
                    mode: "insensitive",
                },
            },
        });

        if (empresaConMismaRazonSocial) {
            return {
                ok: false,
                empresa: null,
                message: "Ya existe una empresa con esa razón social.",
            };
        }

        const empresa = await prisma.$transaction(async (tx) => {
            const nuevaEmpresa = await tx.empresa.create({
                data: {
                    razonSocial,
                    ruc,
                    dv,
                    direccion: data.direccion?.trim() || null,
                    telefono: data.telefono?.trim() || null,
                    email: data.email?.trim() || null,

                    obligacionIvaGeneral: data.obligacionIvaGeneral ?? true,
                    obligacionIrpServicios:
                        data.obligacionIrpServicios ?? false,
                    obligacionIrpCapital: data.obligacionIrpCapital ?? false,
                    obligacionIreGeneral: data.obligacionIreGeneral ?? false,
                    obligacionIreSimple: data.obligacionIreSimple ?? false,
                    obligacionIreResimple:
                        data.obligacionIreResimple ?? false,
                    obligacionIdu: data.obligacionIdu ?? false,
                    obligacionInr: data.obligacionInr ?? false,
                },
            });

            await tx.usuarioEmpresa.create({
                data: {
                    usuarioId: session.user.id,
                    empresaId: nuevaEmpresa.id,
                    rol: "ADMIN_EMPRESA",
                    activo: true,
                },
            });

            return nuevaEmpresa;
        });

        revalidatePath("/empresas");
        revalidatePath("/seleccionar-empresa");

        return {
            ok: true,
            empresa,
            message: "Empresa creada correctamente.",
        };
    } catch (error) {
        console.error("Error al crear empresa:", error);

        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === "P2002"
        ) {
            return {
                ok: false,
                empresa: null,
                message: "Ya existe una empresa con ese RUC o razón social.",
            };
        }

        return {
            ok: false,
            empresa: null,
            message:
                "No se pudo crear la empresa. Verifique los datos ingresados.",
        };
    }
}