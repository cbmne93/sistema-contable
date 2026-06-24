import { z } from "zod";

export const facturaCompraSchema = z
    .object({
        proveedorId: z.string().min(1, "Seleccione un proveedor."),
        sucursalId: z.string().min(1, "Seleccione una sucursal."),
        timbradoId: z.string().min(1, "Seleccione un timbrado."),

        establecimiento: z
            .string()
            .trim()
            .regex(/^\d{3}$/, "El establecimiento debe tener 3 dígitos."),

        puntoExpedicion: z
            .string()
            .trim()
            .regex(/^\d{3}$/, "El punto de expedición debe tener 3 dígitos."),

        numeroComprobante: z
            .string()
            .trim()
            .regex(/^\d{7}$/, "El número de comprobante debe tener 7 dígitos."),

        fechaEmision: z.string().min(1, "Ingrese la fecha de emisión."),

        fechaVencimiento: z.string().optional().nullable(),

        condicion: z.enum(["CONTADO", "CREDITO"], {
            message: "Seleccione la condición.",
        }),

        moneda: z.enum(["PYG", "USD", "BRL", "ARS"], {
            message: "Seleccione la moneda.",
        }),

        cotizacion: z.coerce
            .number()
            .positive("La cotización debe ser mayor a cero."),

        concepto: z.string().optional().nullable(),

        imputaIva: z.boolean().default(true),
        imputaIre: z.boolean().default(false),
        imputaIrpRsp: z.boolean().default(false),
        noImputa: z.boolean().default(false),

        detalles: z
            .array(
                z.object({
                    cuentaContableId: z.string().optional().nullable(),

                    descripcion: z.string().optional().default(""),

                    cantidad: z.coerce
                        .number()
                        .positive("La cantidad debe ser mayor a cero."),

                    precioUnitario: z.coerce
                        .number()
                        .positive("El importe debe ser mayor a cero."),

                    ivaTipo: z.enum(["EXENTA", "IVA_5", "IVA_10"], {
                        message: "Seleccione el impuesto.",
                    }),
                })
            )
            .min(1, "Debe agregar al menos un detalle."),
    })
    .superRefine((data, ctx) => {
        if (data.condicion === "CREDITO" && !data.fechaVencimiento) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["fechaVencimiento"],
                message: "Ingrese el vencimiento del pago.",
            });
        }

        const tieneImputacion =
            data.imputaIva || data.imputaIre || data.imputaIrpRsp;

        if (!tieneImputacion) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["imputaIva"],
                message:
                    "Debe imputar el comprobante al menos a IVA, IRE o IRP-RSP.",
            });
        }
    });

export type FacturaCompraFormValues = z.infer<typeof facturaCompraSchema>;