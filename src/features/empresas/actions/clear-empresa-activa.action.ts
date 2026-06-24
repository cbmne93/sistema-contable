"use server";

import { cookies } from "next/headers";

export async function clearEmpresaActivaAction() {
    try {
        const cookieStore = await cookies();

        cookieStore.delete("empresaActivaId");

        return {
            ok: true,
            message: "Empresa activa limpiada correctamente.",
        };
    } catch (error) {
        console.error("Error al limpiar empresa activa:", error);

        return {
            ok: false,
            message: "No se pudo limpiar la empresa activa.",
        };
    }
}