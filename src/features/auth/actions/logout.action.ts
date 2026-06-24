"use server";

import { cookies } from "next/headers";

export async function clearSystemSessionCookiesAction() {
    const cookieStore = await cookies();

    cookieStore.delete("empresaActivaId");
    cookieStore.delete("periodoFiscalActivoId");

    return {
        ok: true,
        message: "Sesión local limpiada correctamente.",
    };
}