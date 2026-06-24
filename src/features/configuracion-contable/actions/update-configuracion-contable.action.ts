"use server";

import { revalidatePath } from "next/cache";

import { EstadoRegistro } from "@/generated/prisma/enums";
import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";
import { prisma } from "@/lib/prisma";

import {
    configuracionContableSchema,
    type ConfiguracionContableFormValues,
} from "../validations";

function normalizeCuentaId(value?: string | null) {
    return value && value.trim() !== "" ? value : null;
}

export async function updateConfiguracionContableAction(
    values: ConfiguracionContableFormValues
) {
    try {
        const empresaId = await getEmpresaActivaIdOrThrow();

        const parsed = configuracionContableSchema.safeParse(values);

        if (!parsed.success) {
            return {
                ok: false,
                message: parsed.error.issues[0]?.message ?? "Datos inválidos.",
            };
        }

        const data = {
            generarAsientosAutomaticos:
                parsed.data.generarAsientosAutomaticos ?? false,

            cuentaClientesId: normalizeCuentaId(parsed.data.cuentaClientesId),
            cuentaProveedoresId: normalizeCuentaId(
                parsed.data.cuentaProveedoresId
            ),

            cuentaCajaId: normalizeCuentaId(parsed.data.cuentaCajaId),
            cuentaBancoId: normalizeCuentaId(parsed.data.cuentaBancoId),

            cuentaIvaDebitoFiscal5Id: normalizeCuentaId(
                parsed.data.cuentaIvaDebitoFiscal5Id
            ),
            cuentaIvaDebitoFiscal10Id: normalizeCuentaId(
                parsed.data.cuentaIvaDebitoFiscal10Id
            ),

            cuentaIvaCreditoFiscal5Id: normalizeCuentaId(
                parsed.data.cuentaIvaCreditoFiscal5Id
            ),
            cuentaIvaCreditoFiscal10Id: normalizeCuentaId(
                parsed.data.cuentaIvaCreditoFiscal10Id
            ),
        };

        const cuentaIds = Array.from(
            new Set(
                Object.entries(data)
                    .filter(([key]) => key !== "generarAsientosAutomaticos")
                    .map(([, value]) => value)
                    .filter((value): value is string => Boolean(value))
            )
        );

        if (cuentaIds.length > 0) {
            const cuentasValidas = await prisma.cuentaContable.count({
                where: {
                    empresaId,
                    id: {
                        in: cuentaIds,
                    },
                    estado: EstadoRegistro.ACTIVO,
                    aceptaMovimiento: true,
                },
            });

            if (cuentasValidas !== cuentaIds.length) {
                return {
                    ok: false,
                    message:
                        "Una o más cuentas seleccionadas no existen, están inactivas o no aceptan movimiento.",
                };
            }
        }

        await prisma.configuracionContable.upsert({
            where: {
                empresaId,
            },
            create: {
                empresaId,
                ...data,
            },
            update: data,
        });

        revalidatePath("/configuracion-contable");
        revalidatePath("/facturas-compra");
        revalidatePath("/facturas-venta");

        return {
            ok: true,
            message: "Configuración contable actualizada correctamente.",
        };
    } catch (error) {
        console.error("Error al actualizar configuración contable:", error);

        return {
            ok: false,
            message: "No se pudo actualizar la configuración contable.",
        };
    }
}