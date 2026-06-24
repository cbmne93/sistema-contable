import { cookies } from "next/headers";

export async function getEmpresaActivaIdOrThrow() {
    const cookieStore = await cookies();
    const empresaActivaId = cookieStore.get("empresaActivaId")?.value;

    if (!empresaActivaId) {
        throw new Error("No hay empresa activa seleccionada.");
    }

    return empresaActivaId;
}