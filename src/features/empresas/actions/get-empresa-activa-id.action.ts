"use server";

import { cookies } from "next/headers";

export async function getEmpresaActivaIdAction() {
    const cookieStore = await cookies();

    return cookieStore.get("empresaActivaId")?.value ?? null;
}