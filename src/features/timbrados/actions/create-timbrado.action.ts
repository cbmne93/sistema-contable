"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";
import type { CreateTimbradoInput } from "../interfaces";

export async function createTimbradoAction(data: CreateTimbradoInput) {
    try {
        const empresaId = await getEmpresaActivaIdOrThrow();

        const numero = data.numero.trim();

        if (!/^\d{8}$/.test(numero)) {
            return {
                ok: false,
                timbrado: null,
                message: "El número de timbrado debe tener exactamente 8 dígitos.",
            };
        }

        const fechaFin =
            data.fechaFin && data.fechaFin !== ""
                ? new Date(data.fechaFin)
                : null;

        const sucursalId = data.sucursalId || null;
        const proveedorId = data.proveedorId || null;

        const establecimiento = data.establecimiento?.trim() || null;
        const puntoExpedicion = data.puntoExpedicion?.trim() || null;

        if (data.origen === "PROPIO") {
            if (!sucursalId) {
                return {
                    ok: false,
                    timbrado: null,
                    message: "Debe seleccionar una sucursal para el timbrado propio.",
                };
            }

            if (!establecimiento) {
                return {
                    ok: false,
                    timbrado: null,
                    message: "El establecimiento es obligatorio para timbrados propios.",
                };
            }

            if (!puntoExpedicion) {
                return {
                    ok: false,
                    timbrado: null,
                    message: "El punto de expedición es obligatorio para timbrados propios.",
                };
            }

            if (!data.numeroDesde || data.numeroDesde <= 0) {
                return {
                    ok: false,
                    timbrado: null,
                    message: "El número desde debe ser mayor a cero.",
                };
            }

            if (!data.numeroHasta || data.numeroHasta <= 0) {
                return {
                    ok: false,
                    timbrado: null,
                    message: "El número hasta debe ser mayor a cero.",
                };
            }

            if (data.numeroHasta < data.numeroDesde) {
                return {
                    ok: false,
                    timbrado: null,
                    message: "El número hasta debe ser mayor o igual al número desde.",
                };
            }

            if (!data.numeroActual || data.numeroActual <= 0) {
                return {
                    ok: false,
                    timbrado: null,
                    message: "El número actual debe ser mayor a cero.",
                };
            }

            if (
                data.numeroActual < data.numeroDesde ||
                data.numeroActual > data.numeroHasta
            ) {
                return {
                    ok: false,
                    timbrado: null,
                    message: "El número actual debe estar entre desde y hasta.",
                };
            }

            const timbradoExistente = await prisma.timbrado.findFirst({
                where: {
                    empresaId,
                    origen: "PROPIO",
                    numero,
                    tipoComprobante: data.tipoComprobante,
                    sucursalId,
                    establecimiento,
                    puntoExpedicion,
                },
            });

            if (timbradoExistente) {
                return {
                    ok: false,
                    timbrado: null,
                    message: "Ya existe un timbrado propio con esos datos.",
                };
            }
        }

        if (data.origen === "PROVEEDOR") {
            if (!proveedorId) {
                return {
                    ok: false,
                    timbrado: null,
                    message: "Debe seleccionar un proveedor para el timbrado de proveedor.",
                };
            }

            const timbradoExistente = await prisma.timbrado.findFirst({
                where: {
                    empresaId,
                    origen: "PROVEEDOR",
                    numero,
                    tipoComprobante: data.tipoComprobante,
                    proveedorId,
                },
            });

            if (timbradoExistente) {
                return {
                    ok: false,
                    timbrado: null,
                    message: "Ya existe un timbrado con ese número para este proveedor.",
                };
            }
        }

        const timbrado = await prisma.timbrado.create({
            data: {
                empresaId,
                origen: data.origen,
                tipoComprobante: data.tipoComprobante,

                numero,
                fechaFin,

                sucursalId,
                proveedorId,

                establecimiento: data.origen === "PROPIO" ? establecimiento : null,
                puntoExpedicion: data.origen === "PROPIO" ? puntoExpedicion : null,

                numeroDesde: data.origen === "PROPIO" ? data.numeroDesde : null,
                numeroHasta: data.origen === "PROPIO" ? data.numeroHasta : null,
                numeroActual: data.origen === "PROPIO" ? data.numeroActual : null,

                estado: data.estado || "ACTIVO",
            },
        });

        revalidatePath("/timbrados");

        return {
            ok: true,
            timbrado,
            message: "Timbrado creado correctamente.",
        };
    } catch (error) {
        console.error("Error al crear timbrado:", error);

        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === "P2002"
        ) {
            return {
                ok: false,
                timbrado: null,
                message: "Ya existe un timbrado con esos datos.",
            };
        }

        if (error instanceof Error && error.message.includes("empresa activa")) {
            return {
                ok: false,
                timbrado: null,
                message: "Debe seleccionar una empresa activa antes de crear timbrados.",
            };
        }

        return {
            ok: false,
            timbrado: null,
            message: "No se pudo crear el timbrado. Verifique los datos ingresados.",
        };
    }
}