import { z } from "zod";

export const clienteFormSchema = z.object({
    nombre: z.string().min(1, "El nombre es obligatorio"),

    tipoDocumento: z.enum([
        "RUC",
        "CEDULA_IDENTIDAD",
        "PASAPORTE",
        "DOCUMENTO_EXTRANJERO",
    ]),

    numeroDocumento: z.string().min(1, "El número de documento es obligatorio"),

    dv: z.string().optional().nullable(),

    tipoPersona: z.enum(["FISICA", "JURIDICA"]),

    direccion: z.string().optional().nullable(),
    telefono: z.string().optional().nullable(),

    email: z
        .string()
        .email("Ingrese un email válido")
        .optional()
        .or(z.literal(""))
        .nullable(),

    estado: z.enum(["ACTIVO", "INACTIVO"]).optional(),
});

export type ClienteFormValues = z.infer<typeof clienteFormSchema>;