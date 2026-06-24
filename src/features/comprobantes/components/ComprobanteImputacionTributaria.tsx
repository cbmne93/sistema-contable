"use client";

import { Check } from "lucide-react";

type ImputacionField =
    | "imputaIva"
    | "imputaIre"
    | "imputaIrpRsp"
    | "noImputa";

interface ComprobanteImputacionTributariaProps {
    imputaIva: boolean;
    imputaIre: boolean;
    imputaIrpRsp: boolean;
    noImputa?: boolean;

    mostrarIva: boolean;
    mostrarIre: boolean;
    mostrarIrpRsp: boolean;
    mostrarNoImputa?: boolean;

    error?: string;

    onChange: (field: ImputacionField, value: boolean) => void;
}

const opciones = [
    {
        field: "imputaIva",
        label: "IVA GENERAL",
    },
    {
        field: "imputaIre",
        label: "IRE",
    },
    {
        field: "imputaIrpRsp",
        label: "IRP-RSP",
    },
    {
        field: "noImputa",
        label: "NO IMPUTAR",
    },
] as const;

export function ComprobanteImputacionTributaria({
    imputaIva,
    imputaIre,
    imputaIrpRsp,
    noImputa = false,
    mostrarIva,
    mostrarIre,
    mostrarIrpRsp,
    mostrarNoImputa = false,
    error,
    onChange,
}: ComprobanteImputacionTributariaProps) {
    const values = {
        imputaIva,
        imputaIre,
        imputaIrpRsp,
        noImputa,
    };

    const opcionesVisibles = opciones.filter((opcion) => {
        if (opcion.field === "imputaIva") return mostrarIva;
        if (opcion.field === "imputaIre") return mostrarIre;
        if (opcion.field === "imputaIrpRsp") return mostrarIrpRsp;
        if (opcion.field === "noImputa") return mostrarNoImputa;

        return false;
    });

    return (
        <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
                {opcionesVisibles.map((opcion) => {
                    const checked = values[opcion.field];

                    return (
                        <div
                            key={opcion.field}
                            className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                        >
                            <span className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                                {opcion.label}
                            </span>

                            <button
                                type="button"
                                onClick={() =>
                                    onChange(opcion.field, !checked)
                                }
                                className={
                                    checked
                                        ? "inline-flex h-6 w-11 items-center justify-end rounded-full bg-slate-900 p-1 transition"
                                        : "inline-flex h-6 w-11 items-center justify-start rounded-full bg-slate-200 p-1 transition"
                                }
                                aria-label={opcion.label}
                            >
                                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-white shadow-sm">
                                    {checked && (
                                        <Check className="h-3 w-3 text-slate-900" />
                                    )}
                                </span>
                            </button>
                        </div>
                    );
                })}
            </div>

            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </section>
    );
}