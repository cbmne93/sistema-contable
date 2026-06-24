import { z } from "zod";

export const facturaVentaDetalleSchema = z.object({
    cuentaContableId: z.string().optional().nullable(),

    descripcion: z.string().trim(),

    cantidad: z
        .number({
            message: "La cantidad es obligatoria.",
        })
        .positive("La cantidad debe ser mayor a cero."),

    precioUnitario: z
        .number({
            message: "El importe es obligatorio.",
        })
        .min(0, "El importe no puede ser negativo."),

    ivaTipo: z.enum(["EXENTA", "IVA_5", "IVA_10"], {
        message: "Debe seleccionar el impuesto.",
    }),
});

export const facturaVentaSchema = z
    .object({
        clienteId: z.string().min(1, "Debe seleccionar un cliente."),

        sucursalId: z.string().min(1, "Debe seleccionar una sucursal."),

        timbradoId: z.string().min(1, "Debe seleccionar un timbrado."),

        numeroComprobante: z
            .string()
            .trim()
            .optional()
            .nullable()
            .refine(
                (value) => !value || /^\d{1,7}$/.test(value),
                "El número de comprobante debe tener hasta 7 dígitos numéricos."
            ),

        fechaEmision: z.string().min(1, "La fecha de emisión es obligatoria."),

        fechaVencimiento: z.string().optional().nullable(),

        condicion: z.enum(["CONTADO", "CREDITO"], {
            message: "Debe seleccionar la condición.",
        }),

        moneda: z.enum(["PYG", "USD", "BRL", "ARS"], {
            message: "Debe seleccionar una moneda.",
        }),

        cotizacion: z
            .number({
                message: "La cotización es obligatoria.",
            })
            .positive("La cotización debe ser mayor a cero."),

        concepto: z.string().optional().nullable(),

        imputaIva: z.boolean(),
        imputaIre: z.boolean(),
        imputaIrpRsp: z.boolean(),

        detalles: z
            .array(facturaVentaDetalleSchema)
            .min(1, "Debe agregar al menos un detalle."),
    })
    .superRefine((data, ctx) => {
        if (data.condicion === "CREDITO" && !data.fechaVencimiento) {
            ctx.addIssue({
                code: "custom",
                path: ["fechaVencimiento"],
                message:
                    "La fecha de vencimiento es obligatoria para facturas a crédito.",
            });
        }

        if (data.moneda === "PYG" && data.cotizacion !== 1) {
            ctx.addIssue({
                code: "custom",
                path: ["cotizacion"],
                message: "La cotización para guaraníes debe ser 1.",
            });
        }

        const tieneImputacion =
            data.imputaIva || data.imputaIre || data.imputaIrpRsp;

        if (!tieneImputacion) {
            ctx.addIssue({
                code: "custom",
                path: ["imputaIva"],
                message:
                    "Debe imputar el comprobante al menos a IVA, IRE o IRP-RSP.",
            });
        }

        const totalFactura = data.detalles.reduce((acc, detalle) => {
            return acc + detalle.cantidad * detalle.precioUnitario;
        }, 0);

        if (totalFactura <= 0) {
            ctx.addIssue({
                code: "custom",
                path: ["detalles"],
                message: "El total de la factura debe ser mayor a cero.",
            });
        }
    });

export type FacturaVentaFormValues = z.infer<typeof facturaVentaSchema>;
