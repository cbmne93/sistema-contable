"use client";

import type {
    Control,
    FieldArrayWithId,
    FieldErrors,
    UseFieldArrayAppend,
    UseFieldArrayRemove,
    UseFormRegister,
} from "react-hook-form";
import { Controller } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";

import { CuentaContableCombobox } from "@/components/shared";

import type { FacturaCompraFormValues } from "../validations";
import type { CuentaContableOption } from "../interfaces";
import { calcularDetalleCompra, formatCurrency } from "../utils";

interface FacturaCompraDetalleTableProps {
    fields: FieldArrayWithId<FacturaCompraFormValues, "detalles", "id">[];
    control: Control<FacturaCompraFormValues>;
    register: UseFormRegister<FacturaCompraFormValues>;
    errors: FieldErrors<FacturaCompraFormValues>;
    detalles: FacturaCompraFormValues["detalles"];
    moneda: string;
    cuentasContables: CuentaContableOption[];
    append: UseFieldArrayAppend<FacturaCompraFormValues, "detalles">;
    remove: UseFieldArrayRemove;
}

export function FacturaCompraDetalleTable({
    fields,
    control,
    register,
    errors,
    detalles,
    moneda,
    cuentasContables,
    append,
    remove,
}: FacturaCompraDetalleTableProps) {
    return (
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
                <div>
                    <h2 className="text-base font-semibold text-slate-900">
                        Detalle de la factura
                    </h2>

                    <p className="text-sm text-slate-500">
                        Cargue los importes, impuestos y la cuenta contable de
                        cada compra.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        append({
                            cuentaContableId: "",
                            descripcion: "",
                            cantidad: 1,
                            precioUnitario: 0,
                            ivaTipo: "IVA_10",
                        })
                    }
                    className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg bg-slate-900 px-3 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
                >
                    <Plus className="h-4 w-4" />
                    Agregar
                </button>
            </div>

            <div className="overflow-visible">
                <table className="w-full table-fixed text-sm">
                    <colgroup>
                        <col className="w-30" />
                        <col className="w-36" />
                        <col className="w-28" />
                        <col />
                        <col className="w-60" />
                        <col className="w-16" />
                    </colgroup>

                    <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                            <th className="px-3 py-3">Impuesto</th>
                            <th className="px-3 py-3 text-right">Importe</th>
                            <th className="px-3 py-3 text-right">IVA</th>
                            <th className="px-3 py-3">Cuenta contable</th>
                            <th className="px-3 py-3">Descripción</th>
                            <th className="px-3 py-3 text-center">Acción</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {fields.map((field, index) => {
                            const detalle = detalles[index];

                            const calculo = calcularDetalleCompra({
                                cantidad: detalle?.cantidad || 1,
                                precioUnitario: detalle?.precioUnitario || 0,
                                ivaTipo: detalle?.ivaTipo || "IVA_10",
                            });

                            const iva =
                                calculo.iva5 > 0 ? calculo.iva5 : calculo.iva10;

                            return (
                                <tr key={field.id}>
                                    <td className="px-3 py-3 align-top">
                                        <input
                                            type="hidden"
                                            {...register(
                                                `detalles.${index}.cantidad`
                                            )}
                                        />

                                        <select
                                            {...register(
                                                `detalles.${index}.ivaTipo`
                                            )}
                                            className="h-9 w-full rounded-lg border border-slate-300 bg-white px-2 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                                        >
                                            <option value="IVA_10">
                                                IVA 10%
                                            </option>
                                            <option value="IVA_5">IVA 5%</option>
                                            <option value="EXENTA">
                                                Exenta
                                            </option>
                                        </select>

                                        {errors.detalles?.[index]?.ivaTipo && (
                                            <p className="mt-1 text-xs text-red-600">
                                                {
                                                    errors.detalles[index]
                                                        ?.ivaTipo?.message
                                                }
                                            </p>
                                        )}
                                    </td>

                                    <td className="px-3 py-3 align-top">
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            {...register(
                                                `detalles.${index}.precioUnitario`
                                            )}
                                            className="h-9 w-full rounded-lg border border-slate-300 px-2 text-right text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                                        />

                                        {errors.detalles?.[index]
                                            ?.precioUnitario && (
                                                <p className="mt-1 text-xs text-red-600">
                                                    {
                                                        errors.detalles[index]
                                                            ?.precioUnitario
                                                            ?.message
                                                    }
                                                </p>
                                            )}
                                    </td>

                                    <td className="px-3 py-3 text-right align-top font-medium text-slate-700">
                                        <div className="flex h-9 items-center justify-end whitespace-nowrap">
                                            {formatCurrency(iva, moneda)}
                                        </div>
                                    </td>

                                    <td className="px-3 py-3 align-top">
                                        <Controller
                                            control={control}
                                            name={`detalles.${index}.cuentaContableId`}
                                            render={({ field }) => (
                                                <CuentaContableCombobox
                                                    value={field.value ?? ""}
                                                    cuentas={cuentasContables}
                                                    placeholder="Buscar cuenta..."
                                                    error={
                                                        errors.detalles?.[index]
                                                            ?.cuentaContableId
                                                            ?.message
                                                    }
                                                    onChange={field.onChange}
                                                />
                                            )}
                                        />
                                    </td>

                                    <td className="px-3 py-3 align-top">
                                        <input
                                            {...register(
                                                `detalles.${index}.descripcion`
                                            )}
                                            placeholder="Descripción"
                                            className="h-9 w-full rounded-lg border border-slate-300 px-2 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                                        />
                                    </td>

                                    <td className="px-3 py-3 text-center align-top">
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            disabled={fields.length === 1}
                                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-white text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                                            title="Eliminar detalle"
                                            aria-label="Eliminar detalle"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {errors.detalles?.root && (
                <div className="px-5 pb-4 text-sm text-red-600">
                    {errors.detalles.root.message}
                </div>
            )}
        </section>
    );
}