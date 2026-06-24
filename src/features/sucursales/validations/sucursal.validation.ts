import { z } from "zod";

export const sucursalFormSchema = z.object({
    codigo: z
        .string()
        .min(1, "El código es obligatorio")
        .max(3, "El código no puede superar 3 caracteres"),

    nombre: z.string().min(1, "El nombre es obligatorio"),

    direccion: z.string().optional().nullable(),
    telefono: z.string().optional().nullable(),

    estado: z.enum(["ACTIVO", "INACTIVO"]).optional(),
});

export type SucursalFormValues = z.infer<typeof sucursalFormSchema>;