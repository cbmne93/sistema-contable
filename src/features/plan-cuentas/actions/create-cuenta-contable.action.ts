"use server";

import { revalidatePath } from "next/cache";

import {
    EstadoRegistro,
    MonedaCuentaContable,
    NaturalezaCuentaContable,
    TipoCuentaContable,
} from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";

import {
    cuentaContableSchema,
    type CuentaContableFormValues,
} from "../validations";
import { formatCuentaContableNombre } from "../utils";

export async function createCuentaContableAction(
    values: CuentaContableFormValues
) {
    try {
        const empresaId = await getEmpresaActivaIdOrThrow();

        const parsed = cuentaContableSchema.safeParse(values);

        if (!parsed.success) {
            return {
                ok: false,
                message: parsed.error.issues[0]?.message ?? "Datos inválidos.",
            };
        }

        const data = parsed.data;

        const nombreFormateado = formatCuentaContableNombre({
            nombre: data.nombre,
            aceptaMovimiento: data.aceptaMovimiento,
        });

        const existeCodigo = await prisma.cuentaContable.findFirst({
            where: {
                empresaId,
                codigo: data.codigo,
            },
            select: {
                id: true,
            },
        });

        if (existeCodigo) {
            return {
                ok: false,
                message:
                    "Ya existe una cuenta contable con este código en la empresa activa.",
            };
        }

        let cuentaPadre: {
            id: string;
            codigo: string;
            nivel: number;
            tipo: TipoCuentaContable;
            naturaleza: NaturalezaCuentaContable;
        } | null = null;

        if (data.cuentaPadreId) {
            cuentaPadre = await prisma.cuentaContable.findFirst({
                where: {
                    id: data.cuentaPadreId,
                    empresaId,
                    estado: EstadoRegistro.ACTIVO,
                    aceptaMovimiento: false,
                },
                select: {
                    id: true,
                    codigo: true,
                    nivel: true,
                    tipo: true,
                    naturaleza: true,
                },
            });

            if (!cuentaPadre) {
                return {
                    ok: false,
                    message:
                        "La cuenta padre seleccionada no existe o no es una cuenta agrupadora.",
                };
            }

            if (!data.codigo.startsWith(cuentaPadre.codigo)) {
                return {
                    ok: false,
                    message:
                        "El código de la cuenta debe iniciar con el código de la cuenta padre.",
                };
            }

            if (data.codigo === cuentaPadre.codigo) {
                return {
                    ok: false,
                    message:
                        "El código de la nueva cuenta no puede ser igual al código de la cuenta padre.",
                };
            }

            if (data.nivel !== cuentaPadre.nivel + 1) {
                return {
                    ok: false,
                    message:
                        "El nivel de la cuenta debe ser el siguiente nivel de la cuenta padre.",
                };
            }

            if (data.tipo !== cuentaPadre.tipo) {
                return {
                    ok: false,
                    message:
                        "El tipo de la cuenta debe coincidir con el tipo de la cuenta padre.",
                };
            }

            if (data.naturaleza !== cuentaPadre.naturaleza) {
                return {
                    ok: false,
                    message:
                        "La naturaleza de la cuenta debe coincidir con la naturaleza de la cuenta padre.",
                };
            }
        }

        await prisma.$transaction(async (tx) => {
            if (cuentaPadre) {
                await tx.cuentaContable.update({
                    where: {
                        id: cuentaPadre.id,
                    },
                    data: {
                        aceptaMovimiento: false,
                    },
                });
            }

            await tx.cuentaContable.create({
                data: {
                    empresaId,
                    cuentaPadreId: data.cuentaPadreId || null,

                    codigo: data.codigo,
                    nombre: nombreFormateado,
                    descripcion: data.descripcion || null,

                    tipo: data.tipo as TipoCuentaContable,
                    naturaleza: data.naturaleza as NaturalezaCuentaContable,
                    nivel: data.nivel,

                    aceptaMovimiento: data.aceptaMovimiento,

                    moneda: data.moneda as MonedaCuentaContable,
                    requiereAjusteCambio: data.requiereAjusteCambio,

                    estado: EstadoRegistro.ACTIVO,
                },
            });
        });

        revalidatePath("/plan-cuentas");

        return {
            ok: true,
            message: "Cuenta contable creada correctamente.",
        };
    } catch (error) {
        console.error("Error al crear cuenta contable:", error);

        return {
            ok: false,
            message: "No se pudo crear la cuenta contable.",
        };
    }
}