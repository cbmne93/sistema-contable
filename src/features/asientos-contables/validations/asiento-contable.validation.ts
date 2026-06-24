import { z } from "zod";

const asientoDetalleSchema = z
    .object({
        cuentaContableId: z.string().min(1, "Seleccione una cuenta contable."),
        descripcion: z.string().optional().nullable(),
        debe: z.coerce
            .number({
                message: "Ingrese un importe válido.",
            })
            .min(0, "El debe no puede ser negativo."),
        haber: z.coerce
            .number({
                message: "Ingrese un importe válido.",
            })
            .min(0, "El haber no puede ser negativo."),
    })
    .superRefine((detalle, ctx) => {
        const debe = Number(detalle.debe || 0);
        const haber = Number(detalle.haber || 0);

        if (debe === 0 && haber === 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["debe"],
                message: "La línea debe tener importe en debe o haber.",
            });
        }

        if (debe > 0 && haber > 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["haber"],
                message: "No puede cargar debe y haber en la misma línea.",
            });
        }
    });

export const asientoContableSchema = z
    .object({
        fecha: z.string().min(1, "Ingrese la fecha del asiento."),
        concepto: z
            .string()
            .trim()
            .min(3, "Ingrese un concepto para el asiento."),
        sucursalId: z.string().min(1, "Seleccione una sucursal."),
        detalles: z
            .array(asientoDetalleSchema)
            .min(2, "El asiento debe tener al menos 2 líneas."),
    })
    .superRefine((values, ctx) => {
        const totalDebe = values.detalles.reduce(
            (total, detalle) => total + Number(detalle.debe || 0),
            0
        );

        const totalHaber = values.detalles.reduce(
            (total, detalle) => total + Number(detalle.haber || 0),
            0
        );

        if (totalDebe <= 0 || totalHaber <= 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["detalles"],
                message: "El asiento debe tener importes en debe y haber.",
            });
        }

        if (totalDebe !== totalHaber) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["detalles"],
                message: "El total del debe debe ser igual al total del haber.",
            });
        }
    });

export type AsientoContableFormValues = z.infer<typeof asientoContableSchema>;