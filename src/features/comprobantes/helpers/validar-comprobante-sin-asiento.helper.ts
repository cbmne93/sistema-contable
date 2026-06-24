import { prisma } from "@/lib/prisma";

type AccionComprobante = "editar" | "eliminar" | "anular";

interface ValidarComprobanteSinAsientoParams {
    empresaId: string;
    comprobanteId: string;
    accion: AccionComprobante;
}

function getMensajeAccion(accion: AccionComprobante) {
    if (accion === "editar") {
        return "editarla";
    }

    if (accion === "eliminar") {
        return "procesar la eliminación";
    }

    return "anularla";
}

export async function validarComprobanteSinAsientoRelacionado({
    empresaId,
    comprobanteId,
    accion,
}: ValidarComprobanteSinAsientoParams) {
    const asientoRelacionado = await prisma.asientoContable.findFirst({
        where: {
            empresaId,
            comprobanteId,
        },
        select: {
            id: true,
            numero: true,
            estado: true,
            origen: true,
        },
    });

    if (!asientoRelacionado) {
        return {
            ok: true,
            message: "",
            asiento: null,
        };
    }

    return {
        ok: false,
        message: `Esta factura ya tiene generado el asiento N° ${asientoRelacionado.numero}. Primero debe eliminar o revertir ese asiento para poder ${getMensajeAccion(
            accion
        )}.`,
        asiento: asientoRelacionado,
    };
}