import type {
    FieldErrors,
    UseFormRegister,
} from "react-hook-form";

import type { AsientoContableSucursalOption } from "../interfaces";
import type { AsientoContableFormValues } from "../validations";

interface AsientoContableDatosProps {
    register: UseFormRegister<AsientoContableFormValues>;
    errors: FieldErrors<AsientoContableFormValues>;
    sucursales: AsientoContableSucursalOption[];
}

const inputClassName =
    "h-9 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200";

const labelClassName = "text-sm font-medium text-slate-700";

export function AsientoContableDatos({
    register,
    errors,
    sucursales,
}: AsientoContableDatosProps) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-5">
                <h2 className="text-base font-semibold text-slate-900">
                    Datos del asiento
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Complete la fecha, el concepto y la sucursal.
                </p>
            </div>

            <div className="grid gap-4 p-5 md:grid-cols-3">
                <div className="space-y-1.5">
                    <label className={labelClassName}>Fecha</label>

                    <input
                        type="date"
                        {...register("fecha")}
                        className={inputClassName}
                    />

                    {errors.fecha?.message && (
                        <p className="text-xs text-red-600">
                            {errors.fecha.message}
                        </p>
                    )}
                </div>

                <div className="space-y-1.5 md:col-span-2">
                    <label className={labelClassName}>Concepto</label>

                    <input
                        type="text"
                        {...register("concepto")}
                        className={inputClassName}
                        placeholder="Ej: Asiento de pago según recibo"
                    />

                    {errors.concepto?.message && (
                        <p className="text-xs text-red-600">
                            {errors.concepto.message}
                        </p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <label className={labelClassName}>Sucursal</label>

                    <select
                        {...register("sucursalId")}
                        className={inputClassName}
                    >
                        <option value="">Seleccione una sucursal</option>

                        {sucursales.map((sucursal) => (
                            <option key={sucursal.id} value={sucursal.id}>
                                {sucursal.nombre}
                            </option>
                        ))}
                    </select>

                    {errors.sucursalId?.message && (
                        <p className="text-xs text-red-600">
                            {errors.sucursalId.message}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}