"use server";

import { prisma } from "@/lib/prisma";
import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";

export async function getTimbradoFormOptionsAction() {
    try {
        const empresaId = await getEmpresaActivaIdOrThrow();

        const [sucursales, proveedores] = await Promise.all([
            prisma.sucursal.findMany({
                where: {
                    empresaId,
                    estado: "ACTIVO",
                },
                select: {
                    id: true,
                    nombre: true,
                },
                orderBy: {
                    nombre: "asc",
                },
            }),

            prisma.proveedor.findMany({
                where: {
                    empresaId,
                    estado: "ACTIVO",
                },
                select: {
                    id: true,
                    nombre: true,
                    numeroDocumento: true,
                },
                orderBy: {
                    nombre: "asc",
                },
            }),
        ]);

        return {
            ok: true,
            sucursales,
            proveedores,
            message: "Opciones obtenidas correctamente.",
        };
    } catch (error) {
        console.error("Error al obtener opciones de timbrado:", error);

        return {
            ok: false,
            sucursales: [],
            proveedores: [],
            message: "No se pudieron obtener las opciones del formulario.",
        };
    }
}