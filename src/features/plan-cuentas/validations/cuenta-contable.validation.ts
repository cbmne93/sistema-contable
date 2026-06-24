import { z } from "zod";

export const cuentaContableSchema = z.object({
    cuentaPadreId: z
        .string()
        .trim()
        .min(1, "Seleccione una cuenta padre."),

    codigo: z
        .string()
        .trim()
        .min(1, "Ingrese el código de la cuenta.")
        .max(30, "El código no puede superar 30 caracteres."),

    nombre: z
        .string()
        .trim()
        .min(1, "Ingrese el nombre de la cuenta.")
        .max(120, "El nombre no puede superar 120 caracteres."),

    descripcion: z.string().trim().optional().nullable(),

    tipo: z.enum(["ACTIVO", "PASIVO", "PATRIMONIO", "INGRESO", "EGRESO"], {
        message: "Seleccione el tipo de cuenta.",
    }),

    naturaleza: z.enum(["DEUDORA", "ACREEDORA"], {
        message: "Seleccione la naturaleza de la cuenta.",
    }),

    nivel: z.coerce
        .number({
            message: "Ingrese el nivel de la cuenta.",
        })
        .int("El nivel debe ser un número entero.")
        .min(1, "El nivel mínimo es 1.")
        .max(10, "El nivel máximo permitido es 10."),

    aceptaMovimiento: z.boolean(),

    moneda: z.enum(["LOCAL", "EXTRANJERA"], {
        message: "Seleccione la moneda.",
    }),

    requiereAjusteCambio: z.boolean(),
});

export type CuentaContableFormValues = z.infer<typeof cuentaContableSchema>;