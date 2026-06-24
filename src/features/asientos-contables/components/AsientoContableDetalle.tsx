import type {
    Control,
    FieldArrayWithId,
    FieldErrors,
    UseFormRegister,
} from "react-hook-form";
import { Controller } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";

import type { AsientoContableCuentaOption } from "../interfaces";
import type { AsientoContableFormValues } from "../validations";
import { CuentaContableCombobox } from "@/components/shared";


interface AsientoContableDetalleProps {
    fields: FieldArrayWithId<AsientoContableFormValues, "detalles", "id">[];
    cuentas: AsientoContableCuentaOption[];
    control: Control<AsientoContableFormValues>;
    register: UseFormRegister<AsientoContableFormValues>;
    errors: FieldErrors<AsientoContableFormValues>;
    onAddLine: () => void;
    onRemoveLine: (index: number) => void;
}

const inputClassName =
    "h-9 w-full rounded-lg border border-slate-300 bg-white px-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200";

const headerCellClassName =
    "px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500";

const rowGridStyle = {
    gridTemplateColumns:
        "minmax(380px, 2fr) 150px 150px minmax(220px, 1fr) 72px",
};

export function AsientoContableDetalle({
    fields,
    cuentas,
    control,
    register,
    errors,
    onAddLine,
    onRemoveLine,
}: AsientoContableDetalleProps) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-base font-semibold text-slate-900">
                        Detalle del asiento
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Agregue las cuentas contables con importes en debe o
                        haber.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onAddLine}
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                    <Plus className="h-4 w-4" />
                    Agregar línea
                </button>
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-250">
                    <div
                        className="grid border-b border-slate-200 bg-slate-50"
                        style={rowGridStyle}
                    >
                        <div className={headerCellClassName}>Cuenta</div>

                        <div className={headerCellClassName}>Debe</div>

                        <div className={headerCellClassName}>Haber</div>

                        <div className={headerCellClassName}>Descripción</div>

                        <div className={`${headerCellClassName} text-right`}>
                            Acción
                        </div>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {fields.map((field, index) => (
                            <div
                                key={field.id}
                                className="grid items-start"
                                style={rowGridStyle}
                            >
                                <div className="px-3 py-3">
                                    <Controller
                                        control={control}
                                        name={`detalles.${index}.cuentaContableId`}
                                        render={({ field }) => (
                                            <CuentaContableCombobox
                                                value={field.value}
                                                cuentas={cuentas}
                                                onChange={field.onChange}
                                                error={
                                                    errors.detalles?.[index]
                                                        ?.cuentaContableId
                                                        ?.message
                                                }
                                            />
                                        )}
                                    />
                                </div>

                                <div className="px-3 py-3">
                                    <input
                                        type="number"
                                        min="0"
                                        step="1"
                                        {...register(`detalles.${index}.debe`)}
                                        className={`${inputClassName} text-right`}
                                        placeholder="0"
                                    />

                                    {errors.detalles?.[index]?.debe
                                        ?.message && (
                                            <p className="mt-1 text-xs text-red-600">
                                                {
                                                    errors.detalles[index]?.debe
                                                        ?.message
                                                }
                                            </p>
                                        )}
                                </div>

                                <div className="px-3 py-3">
                                    <input
                                        type="number"
                                        min="0"
                                        step="1"
                                        {...register(`detalles.${index}.haber`)}
                                        className={`${inputClassName} text-right`}
                                        placeholder="0"
                                    />

                                    {errors.detalles?.[index]?.haber
                                        ?.message && (
                                            <p className="mt-1 text-xs text-red-600">
                                                {
                                                    errors.detalles[index]?.haber
                                                        ?.message
                                                }
                                            </p>
                                        )}
                                </div>

                                <div className="px-3 py-3">
                                    <input
                                        type="text"
                                        {...register(
                                            `detalles.${index}.descripcion`
                                        )}
                                        className={inputClassName}
                                        placeholder="Detalle opcional"
                                    />
                                </div>

                                <div className="px-3 py-3 text-right">
                                    <button
                                        type="button"
                                        onClick={() => onRemoveLine(index)}
                                        disabled={fields.length <= 2}
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300 disabled:hover:bg-white"
                                        title="Eliminar línea"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {errors.detalles?.message && (
                <div className="border-t border-red-100 bg-red-50 px-5 py-3 text-sm text-red-700">
                    {errors.detalles.message}
                </div>
            )}
        </div>
    );
}