import { z } from "zod";

export const empresaFormSchema = z
    .object({
        razonSocial: z.string().min(1, "La razón social es obligatoria"),
        ruc: z.string().min(1, "El RUC es obligatorio"),
        dv: z.string().min(1, "El DV es obligatorio"),

        direccion: z.string().optional().nullable(),
        telefono: z.string().optional().nullable(),
        email: z
            .string()
            .email("Ingrese un email válido")
            .optional()
            .or(z.literal(""))
            .nullable(),

        estado: z.enum(["ACTIVO", "INACTIVO"]).optional(),

        obligacionIvaGeneral: z.boolean().default(true),
        obligacionIrpServicios: z.boolean().default(false),
        obligacionIrpCapital: z.boolean().default(false),
        obligacionIreGeneral: z.boolean().default(false),
        obligacionIreSimple: z.boolean().default(false),
        obligacionIreResimple: z.boolean().default(false),
        obligacionIdu: z.boolean().default(false),
        obligacionInr: z.boolean().default(false),
    })
    .superRefine((values, ctx) => {
        const cantidadIreSeleccionados = [
            values.obligacionIreGeneral,
            values.obligacionIreSimple,
            values.obligacionIreResimple,
        ].filter(Boolean).length;

        if (cantidadIreSeleccionados > 1) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["obligacionIreGeneral"],
                message: "Solo puede seleccionar un tipo de I.R.E.",
            });
        }
    });

export type EmpresaFormValues = z.infer<typeof empresaFormSchema>;