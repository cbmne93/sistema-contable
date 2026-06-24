"use server";

import { prisma } from "@/lib/prisma";
import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";

const emptyEmpresaObligaciones = {
    obligacionIvaGeneral: true,
    tieneIre: false,
    tieneIrpRsp: false,
};

export async function getFacturaVentaFormOptionsAction() {
    try {
        const empresaId = await getEmpresaActivaIdOrThrow();

        const [empresa, clientes, sucursales, timbrados, cuentasContables] =
            await Promise.all([
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

                prisma.cliente.findMany({
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
                        origen: "PROPIO",
                        estado: "ACTIVO",
                        tipoComprobante: "FACTURA",
                        numeroActual: {
                            not: null,
                        },
                        numeroHasta: {
                            not: null,
                        },
                    },
                    select: {
                        id: true,
                        numero: true,
                        sucursalId: true,
                        establecimiento: true,
                        puntoExpedicion: true,
                        numeroDesde: true,
                        numeroHasta: true,
                        numeroActual: true,
                        fechaFin: true,
                        sucursal: {
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

        const timbradosDisponibles = timbrados.filter((timbrado) => {
            if (!timbrado.numeroActual || !timbrado.numeroHasta) {
                return false;
            }

            return timbrado.numeroActual <= timbrado.numeroHasta;
        });

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
            clientes,
            sucursales,
            timbrados: timbradosDisponibles,
            cuentasContables,
            empresaObligaciones,
            message: "Opciones obtenidas correctamente.",
        };
    } catch (error) {
        console.error("Error al obtener opciones de factura de venta:", error);

        if (error instanceof Error && error.message.includes("empresa activa")) {
            return {
                ok: false,
                clientes: [],
                sucursales: [],
                timbrados: [],
                cuentasContables: [],
                empresaObligaciones: emptyEmpresaObligaciones,
                message:
                    "Debe seleccionar una empresa activa para emitir facturas.",
            };
        }

        return {
            ok: false,
            clientes: [],
            sucursales: [],
            timbrados: [],
            cuentasContables: [],
            empresaObligaciones: emptyEmpresaObligaciones,
            message: "No se pudieron obtener las opciones del formulario.",
        };
    }
}
