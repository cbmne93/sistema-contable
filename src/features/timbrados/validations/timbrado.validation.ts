import { z } from "zod";

export const timbradoSchema = z
    .object({
        origen: z.enum(["PROPIO", "PROVEEDOR"], {
            message: "El origen del timbrado es obligatorio.",
        }),

        tipoComprobante: z.enum(
            [
                "FACTURA",
                "NOTA_CREDITO",
                "NOTA_DEBITO",
                "RECIBO",
                "AUTOFACTURA",
                "TICKET",
                "OTRO",
            ],
            {
                message: "El tipo de comprobante es obligatorio.",
            }
        ),

        numero: z
            .string()
            .trim()
            .min(1, "El número de timbrado es obligatorio.")
            .regex(/^\d{8}$/, "El número de timbrado debe tener exactamente 8 dígitos."),

        fechaFin: z.string().optional().nullable(),

        sucursalId: z.string().optional().nullable(),
        proveedorId: z.string().optional().nullable(),

        establecimiento: z.string().optional().nullable(),
        puntoExpedicion: z.string().optional().nullable(),

        numeroDesde: z.number().optional().nullable(),
        numeroHasta: z.number().optional().nullable(),
        numeroActual: z.number().optional().nullable(),

        estado: z.enum(["ACTIVO", "INACTIVO"], {
            message: "El estado es obligatorio.",
        }),
    })
    .superRefine((data, ctx) => {
        const esPropio = data.origen === "PROPIO";
        const esProveedor = data.origen === "PROVEEDOR";

        if (esPropio) {
            if (!data.sucursalId) {
                ctx.addIssue({
                    code: "custom",
                    path: ["sucursalId"],
                    message: "La sucursal es obligatoria para timbrados propios.",
                });
            }

            if (!data.establecimiento) {
                ctx.addIssue({
                    code: "custom",
                    path: ["establecimiento"],
                    message: "El establecimiento es obligatorio.",
                });
            }

            if (data.establecimiento && data.establecimiento.length !== 3) {
                ctx.addIssue({
                    code: "custom",
                    path: ["establecimiento"],
                    message: "El establecimiento debe tener 3 dígitos.",
                });
            }

            if (!data.puntoExpedicion) {
                ctx.addIssue({
                    code: "custom",
                    path: ["puntoExpedicion"],
                    message: "El punto de expedición es obligatorio.",
                });
            }

            if (data.puntoExpedicion && data.puntoExpedicion.length !== 3) {
                ctx.addIssue({
                    code: "custom",
                    path: ["puntoExpedicion"],
                    message: "El punto de expedición debe tener 3 dígitos.",
                });
            }

            if (!data.numeroDesde || data.numeroDesde <= 0) {
                ctx.addIssue({
                    code: "custom",
                    path: ["numeroDesde"],
                    message: "El número desde debe ser mayor a cero.",
                });
            }

            if (!data.numeroHasta || data.numeroHasta <= 0) {
                ctx.addIssue({
                    code: "custom",
                    path: ["numeroHasta"],
                    message: "El número hasta debe ser mayor a cero.",
                });
            }

            if (
                data.numeroDesde &&
                data.numeroHasta &&
                data.numeroHasta < data.numeroDesde
            ) {
                ctx.addIssue({
                    code: "custom",
                    path: ["numeroHasta"],
                    message: "El número hasta debe ser mayor o igual al número desde.",
                });
            }

            if (!data.numeroActual || data.numeroActual <= 0) {
                ctx.addIssue({
                    code: "custom",
                    path: ["numeroActual"],
                    message: "El número actual debe ser mayor a cero.",
                });
            }

            if (
                data.numeroDesde &&
                data.numeroHasta &&
                data.numeroActual &&
                (data.numeroActual < data.numeroDesde ||
                    data.numeroActual > data.numeroHasta)
            ) {
                ctx.addIssue({
                    code: "custom",
                    path: ["numeroActual"],
                    message: "El número actual debe estar entre desde y hasta.",
                });
            }
        }

        if (esProveedor) {
            if (!data.proveedorId) {
                ctx.addIssue({
                    code: "custom",
                    path: ["proveedorId"],
                    message: "El proveedor es obligatorio para timbrados de proveedor.",
                });
            }
        }
    });

export type TimbradoFormValues = z.infer<typeof timbradoSchema>;