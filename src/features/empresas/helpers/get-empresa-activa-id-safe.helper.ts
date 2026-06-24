import { cookies } from "next/headers";

export async function getEmpresaActivaIdSafe() {
    const cookieStore = await cookies();

    return cookieStore.get("empresaActivaId")?.value ?? null;
}