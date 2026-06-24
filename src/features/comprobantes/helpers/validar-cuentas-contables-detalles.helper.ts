import { prisma } from "@/lib/prisma";

export interface DetalleConCuentaContable {
    cuentaContableId?: string | null;
}

export function limpiarCuentaContableId(value?: string | null) {
    const cuentaId = value?.trim();

    return cuentaId && cuentaId.length > 0 ? cuentaId : null;
}

export async function getGenerarAsientosAutomaticos(empresaId: string) {
    const configuracion = await prisma.configuracionContable.findUnique({
        where: {
            empresaId,
        },
        select: {
            generarAsientosAutomaticos: true,
        },
    });

    return configuracion?.generarAsientosAutomaticos ?? false;
}

export async function validarCuentasContablesDetalles({
    empresaId,
    detalles,
    generarAsientosAutomaticos,
}: {
    empresaId: string;
    detalles: DetalleConCuentaContable[];
    generarAsientosAutomaticos: boolean;
}) {
    const cuentaIds = Array.from(
        new Set(
            detalles
                .map((detalle) =>
                    limpiarCuentaContableId(detalle.cuentaContableId)
                )
                .filter((cuentaId): cuentaId is string => Boolean(cuentaId))
        )
    );

    if (generarAsientosAutomaticos && cuentaIds.length !== detalles.length) {
        return {
            ok: false,
            message:
                "Debe seleccionar una cuenta contable en cada detalle porque la empresa genera asientos automáticos.",
        };
    }

    if (cuentaIds.length === 0) {
        return {
            ok: true,
            message: "",
        };
    }

    const cuentasValidas = await prisma.cuentaContable.count({
        where: {
            empresaId,
            id: {
                in: cuentaIds,
            },
            estado: "ACTIVO",
            aceptaMovimiento: true,
        },
    });

    if (cuentasValidas !== cuentaIds.length) {
        return {
            ok: false,
            message:
                "Una o más cuentas contables seleccionadas no son válidas o no aceptan movimiento.",
        };
    }

    return {
        ok: true,
        message: "",
    };
}