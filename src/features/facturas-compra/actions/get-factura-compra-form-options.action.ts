"use server";

import { prisma } from "@/lib/prisma";
import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";

export async function getFacturaCompraFormOptionsAction() {
    try {
        const empresaId = await getEmpresaActivaIdOrThrow();

        const [
            empresa,
            proveedores,
            sucursales,
            timbrados,
            cuentasContables,
        ] = await Promise.all([
            prisma.empresa.findUnique({
                where: {
                    id: empresaId,
                },
                select: {
                    obligacionIvaGeneral: true,
                    obligacionIrpServicios: true,
                    obligacionIrpCapital: true,
                    obligacionIreGeneral: true,
                    obligacionIreSimple: true,
                    obligacionIreResimple: true,
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
                    dv: true,
                },
                orderBy: {
                    nombre: "asc",
                },
            }),

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

            prisma.timbrado.findMany({
                where: {
                    empresaId,
                    origen: "PROVEEDOR",
                    estado: "ACTIVO",
                    tipoComprobante: "FACTURA",
                },
                select: {
                    id: true,
                    numero: true,
                    proveedorId: true,
                    establecimiento: true,
                    puntoExpedicion: true,
                    numeroDesde: true,
                    numeroHasta: true,
                    numeroActual: true,
                    fechaFin: true,
                    proveedor: {
                        select: {
                            id: true,
                            nombre: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            }),

            prisma.cuentaContable.findMany({
                where: {
                    empresaId,
                    estado: "ACTIVO",
                    aceptaMovimiento: true,
                },
                select: {
                    id: true,
                    codigo: true,
                    nombre: true,
                    tipo: true,
                    naturaleza: true,
                },
                orderBy: {
                    codigo: "asc",
                },
            }),
        ]);

        const empresaObligaciones = {
            obligacionIvaGeneral: empresa?.obligacionIvaGeneral ?? true,
            tieneIre: Boolean(
                empresa?.obligacionIreGeneral ||
                empresa?.obligacionIreSimple ||
                empresa?.obligacionIreResimple
            ),
            tieneIrpRsp: Boolean(
                empresa?.obligacionIrpServicios ||
                empresa?.obligacionIrpCapital
            ),
        };

        return {
            ok: true,
            proveedores,
            sucursales,
            timbrados,
            cuentasContables,
            empresaObligaciones,
            message: "Opciones obtenidas correctamente.",
        };
    } catch (error) {
        console.error("Error al obtener opciones de factura de compra:", error);

        const emptyEmpresaObligaciones = {
            obligacionIvaGeneral: true,
            tieneIre: false,
            tieneIrpRsp: false,
        };

        if (error instanceof Error && error.message.includes("empresa activa")) {
            return {
                ok: false,
                proveedores: [],
                sucursales: [],
                timbrados: [],
                cuentasContables: [],
                empresaObligaciones: emptyEmpresaObligaciones,
                message:
                    "Debe seleccionar una empresa activa para cargar facturas de compra.",
            };
        }

        return {
            ok: false,
            proveedores: [],
            sucursales: [],
            timbrados: [],
            cuentasContables: [],
            empresaObligaciones: emptyEmpresaObligaciones,
            message: "No se pudieron obtener las opciones del formulario.",
        };
    }
}