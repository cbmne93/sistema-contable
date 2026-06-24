"use server";

import { EstadoRegistro } from "@/generated/prisma/enums";
import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";
import { prisma } from "@/lib/prisma";

import type { AsientoContableFormOptions } from "../interfaces";

export async function getAsientoContableFormOptionsAction() {
    try {
        const empresaId = await getEmpresaActivaIdOrThrow();

        const [cuentas, sucursales] = await Promise.all([
            prisma.cuentaContable.findMany({
                where: {
                    empresaId,
                    estado: EstadoRegistro.ACTIVO,
                    aceptaMovimiento: true,
                },
                select: {
                    id: true,
                    codigo: true,
                    nombre: true,
                },
                orderBy: {
                    codigo: "asc",
                },
            }),

            prisma.sucursal.findMany({
                where: {
                    empresaId,
                    estado: EstadoRegistro.ACTIVO,
                },
                select: {
                    id: true,
                    nombre: true,
                },
                orderBy: {
                    nombre: "asc",
                },
            }),
        ]);

        const options: AsientoContableFormOptions = {
            cuentas,
            sucursales,
        };

        return {
            ok: true,
            options,
            message: "Opciones obtenidas correctamente.",
        };
    } catch (error) {
        console.error("Error al obtener opciones del asiento contable:", error);

        return {
            ok: false,
            options: {
                cuentas: [],
                sucursales: [],
            },
            message: "No se pudieron obtener las opciones del formulario.",
        };
    }
}