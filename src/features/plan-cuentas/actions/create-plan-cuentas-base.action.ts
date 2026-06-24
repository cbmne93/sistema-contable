"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";
import { PLAN_CUENTAS_BASE, type PlanCuentaBaseItem } from "../data";

function getTipoCuenta(codigo: string) {
    if (codigo.startsWith("1")) return "ACTIVO";
    if (codigo.startsWith("2")) return "PASIVO";
    if (codigo.startsWith("3")) return "PATRIMONIO";
    if (codigo.startsWith("4")) return "INGRESO";
    if (codigo.startsWith("5")) return "EGRESO";

    return "ACTIVO";
}

function getNaturalezaCuenta(naturaleza: PlanCuentaBaseItem["naturaleza"]) {
    return naturaleza === "D" ? "DEUDORA" : "ACREEDORA";
}

function getMonedaCuenta(moneda: PlanCuentaBaseItem["moneda"]) {
    return moneda === "C" ? "LOCAL" : "EXTRANJERA";
}

function findCuentaPadreId({
    item,
    cuentasPorNivel,
}: {
    item: PlanCuentaBaseItem;
    cuentasPorNivel: Map<number, string>;
}) {
    for (let nivel = item.nivel - 1; nivel >= 1; nivel--) {
        const cuentaPadreId = cuentasPorNivel.get(nivel);

        if (cuentaPadreId) {
            return cuentaPadreId;
        }
    }

    return null;
}

export async function createPlanCuentasBaseAction() {
    try {
        const empresaId = await getEmpresaActivaIdOrThrow();

        const cantidadCuentas = await prisma.cuentaContable.count({
            where: {
                empresaId,
            },
        });

        if (cantidadCuentas > 0) {
            return {
                ok: false,
                message:
                    "La empresa activa ya tiene cuentas contables registradas.",
            };
        }

        const cuentasPorNivel = new Map<number, string>();

        await prisma.$transaction(async (tx) => {
            for (const item of PLAN_CUENTAS_BASE) {
                const cuentaPadreId = findCuentaPadreId({
                    item,
                    cuentasPorNivel,
                });

                const cuenta = await tx.cuentaContable.create({
                    data: {
                        empresaId,
                        cuentaPadreId,

                        codigo: item.codigo,
                        nombre: item.nombre,
                        descripcion: null,

                        tipo: getTipoCuenta(item.codigo),
                        naturaleza: getNaturalezaCuenta(item.naturaleza),

                        nivel: item.nivel,
                        aceptaMovimiento: item.aceptaAsiento === "S",

                        moneda: getMonedaCuenta(item.moneda),
                        requiereAjusteCambio:
                            item.requiereAjusteCambio === "S",

                        estado: "ACTIVO",
                    },
                    select: {
                        id: true,
                    },
                });

                cuentasPorNivel.set(item.nivel, cuenta.id);

                for (let nivel = item.nivel + 1; nivel <= 10; nivel++) {
                    cuentasPorNivel.delete(nivel);
                }
            }
        });

        revalidatePath("/plan-cuentas");

        return {
            ok: true,
            message: "Plan de cuentas base cargado correctamente.",
        };
    } catch (error) {
        console.error("Error al cargar plan de cuentas base:", error);

        if (error instanceof Error && error.message.includes("empresa activa")) {
            return {
                ok: false,
                message:
                    "Debe seleccionar una empresa activa antes de cargar el plan de cuentas.",
            };
        }

        return {
            ok: false,
            message: "No se pudo cargar el plan de cuentas base.",
        };
    }
}