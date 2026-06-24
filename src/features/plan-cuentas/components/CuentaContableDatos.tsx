import type { ChangeEvent } from "react";
import type {
    FieldErrors,
    UseFormRegister,
    UseFormSetValue,
    UseFormWatch,
} from "react-hook-form";

import type { CuentaContableOption } from "../interfaces";
import type { CuentaContableFormValues } from "../validations";
import {
    getCodigoSufijo,
    getNaturalezaLabel,
    getTipoLabel,
    MONEDA_CUENTA_OPTIONS,
    NATURALEZA_CUENTA_OPTIONS,
    TIPO_CUENTA_OPTIONS,
} from "../utils";

interface CuentaContableDatosProps {
    cuentasPadre: CuentaContableOption[];
    cuentaPadreSeleccionada?: CuentaContableOption;
    register: UseFormRegister<CuentaContableFormValues>;
    watch: UseFormWatch<CuentaContableFormValues>;
    setValue: UseFormSetValue<CuentaContableFormValues>;
    errors: FieldErrors<CuentaContableFormValues>;
}

const inputClassName =
    "h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200";

const selectClassName =
    "h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200";

function disabledSelectClassName(isDisabled: boolean) {
    return `${inputClassName} ${isDisabled
        ? "pointer-events-none bg-slate-100 text-slate-600"
        : "bg-white"
        }`;
}

export function CuentaContableDatos({
    cuentasPadre,
    cuentaPadreSeleccionada,
    register,
    watch,
    setValue,
    errors,
}: CuentaContableDatosProps) {
    const codigo = watch("codigo");
    const tipo = watch("tipo");
    const naturaleza = watch("naturaleza");
    const aceptaMovimiento = watch("aceptaMovimiento");

    const isFromParent = !!cuentaPadreSeleccionada;

    const codigoPadre = cuentaPadreSeleccionada?.codigo ?? "";
    const codigoSufijo = cuentaPadreSeleccionada
        ? getCodigoSufijo({
            codigo,
            codigoPadre,
        })
        : "";

    const handleCodigoSufijoChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.replace(/\D/g, "");

        if (!cuentaPadreSeleccionada) {
            setValue("codigo", "", {
                shouldValidate: true,
                shouldDirty: true,
            });

            return;
        }

        setValue("codigo", `${cuentaPadreSeleccionada.codigo}${value}`, {
            shouldValidate: true,
            shouldDirty: true,
        });
    };

    const handleUsoCuentaChange = (value: boolean) => {
        setValue("aceptaMovimiento", value, {
            shouldValidate: true,
            shouldDirty: true,
        });
    };

    return (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
                <h2 className="text-base font-semibold text-slate-900">
                    Datos de la cuenta
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Complete los datos para registrar una nueva cuenta contable
                    o agrupadora.
                </p>
            </div>

            <div className="grid gap-5 p-5 md:grid-cols-2">
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Cuenta padre
                    </label>

                    <select
                        {...register("cuentaPadreId")}
                        className={selectClassName}
                    >
                        <option value="">Seleccione una cuenta padre</option>

                        {cuentasPadre.map((cuenta) => (
                            <option key={cuenta.id} value={cuenta.id}>
                                {cuenta.codigo} - {cuenta.nombre}
                            </option>
                        ))}
                    </select>

                    {errors.cuentaPadreId?.message && (
                        <p className="mt-1 text-xs text-red-600">
                            {errors.cuentaPadreId.message}
                        </p>
                    )}

                    {cuentaPadreSeleccionada && (
                        <p className="mt-1 text-xs text-slate-500">
                            Se tomará el tipo, naturaleza y nivel según la
                            cuenta padre seleccionada.
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Código
                    </label>

                    <div className="flex h-10 overflow-hidden rounded-lg border border-slate-300 bg-white transition focus-within:border-slate-900 focus-within:ring-2 focus-within:ring-slate-200">
                        <div className="flex min-w-19 items-center border-r border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700">
                            {cuentaPadreSeleccionada
                                ? cuentaPadreSeleccionada.codigo
                                : "----"}
                        </div>

                        <input
                            type="text"
                            inputMode="numeric"
                            value={codigoSufijo}
                            onChange={handleCodigoSufijoChange}
                            disabled={!cuentaPadreSeleccionada}
                            className="h-full min-w-0 flex-1 px-3 text-sm outline-none disabled:bg-slate-50 disabled:text-slate-400"
                            placeholder={
                                cuentaPadreSeleccionada
                                    ? "Agregue 1, 2, 3..."
                                    : "Seleccione primero una cuenta padre"
                            }
                        />
                    </div>

                    {errors.codigo?.message && (
                        <p className="mt-1 text-xs text-red-600">
                            {errors.codigo.message}
                        </p>
                    )}

                    {cuentaPadreSeleccionada && (
                        <p className="mt-1 text-xs text-slate-500">
                            Código final:{" "}
                            <span className="font-medium text-slate-700">
                                {codigo}
                            </span>
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Nombre
                    </label>

                    <input
                        type="text"
                        {...register("nombre")}
                        className={inputClassName}
                        placeholder={
                            aceptaMovimiento
                                ? "Ej: Nombre de la cuenta"
                                : "Ej: Nombre de la agrupadora"
                        }
                    />

                    {errors.nombre?.message ? (
                        <p className="mt-1 text-xs text-red-600">
                            {errors.nombre.message}
                        </p>
                    ) : (
                        <p className="mt-1 text-xs text-slate-500">
                            {aceptaMovimiento
                                ? "Esta cuenta podrá usarse en asientos contables."
                                : "Esta cuenta servirá para ordenar otras cuentas."}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Uso de la cuenta
                    </label>

                    <div className="grid gap-3 sm:grid-cols-2">
                        <label
                            className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition ${!aceptaMovimiento
                                ? "border-slate-900 bg-slate-50"
                                : "border-slate-200 bg-white hover:bg-slate-50"
                                }`}
                        >
                            <input
                                type="radio"
                                checked={!aceptaMovimiento}
                                onChange={() => handleUsoCuentaChange(false)}
                                className="mt-1 h-4 w-4 border-slate-300"
                            />

                            <span>
                                <span className="block text-sm font-medium text-slate-800">
                                    Agrupadora
                                </span>
                                <span className="block text-xs text-slate-500">
                                    Sirve como padre de otras cuentas. No se usa
                                    en asientos.
                                </span>
                            </span>
                        </label>

                        <label
                            className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition ${aceptaMovimiento
                                ? "border-slate-900 bg-slate-50"
                                : "border-slate-200 bg-white hover:bg-slate-50"
                                }`}
                        >
                            <input
                                type="radio"
                                checked={aceptaMovimiento}
                                onChange={() => handleUsoCuentaChange(true)}
                                className="mt-1 h-4 w-4 border-slate-300"
                            />

                            <span>
                                <span className="block text-sm font-medium text-slate-800">
                                    Movimiento
                                </span>
                                <span className="block text-xs text-slate-500">
                                    Se puede usar directamente en asientos
                                    contables.
                                </span>
                            </span>
                        </label>
                    </div>
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Tipo
                    </label>

                    <select
                        {...register("tipo")}
                        tabIndex={isFromParent ? -1 : undefined}
                        aria-readonly={isFromParent}
                        className={disabledSelectClassName(isFromParent)}
                    >
                        {TIPO_CUENTA_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    {errors.tipo?.message && (
                        <p className="mt-1 text-xs text-red-600">
                            {errors.tipo.message}
                        </p>
                    )}

                    {cuentaPadreSeleccionada && (
                        <p className="mt-1 text-xs text-slate-500">
                            Definido por la cuenta padre: {getTipoLabel(tipo)}.
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Naturaleza
                    </label>

                    <select
                        {...register("naturaleza")}
                        tabIndex={isFromParent ? -1 : undefined}
                        aria-readonly={isFromParent}
                        className={disabledSelectClassName(isFromParent)}
                    >
                        {NATURALEZA_CUENTA_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    {errors.naturaleza?.message && (
                        <p className="mt-1 text-xs text-red-600">
                            {errors.naturaleza.message}
                        </p>
                    )}

                    {cuentaPadreSeleccionada && (
                        <p className="mt-1 text-xs text-slate-500">
                            Definida por la cuenta padre:{" "}
                            {getNaturalezaLabel(naturaleza)}.
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Nivel
                    </label>

                    <input
                        type="number"
                        min={1}
                        max={10}
                        {...register("nivel")}
                        readOnly
                        className={`${inputClassName} bg-slate-100 text-slate-600`}
                    />

                    {errors.nivel?.message && (
                        <p className="mt-1 text-xs text-red-600">
                            {errors.nivel.message}
                        </p>
                    )}

                    {cuentaPadreSeleccionada && (
                        <p className="mt-1 text-xs text-slate-500">
                            Nivel sugerido según la cuenta padre.
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Moneda
                    </label>

                    <select {...register("moneda")} className={selectClassName}>
                        {MONEDA_CUENTA_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    {errors.moneda?.message && (
                        <p className="mt-1 text-xs text-red-600">
                            {errors.moneda.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Descripción
                    </label>

                    <input
                        type="text"
                        {...register("descripcion")}
                        className={inputClassName}
                        placeholder="Opcional"
                    />

                    {errors.descripcion?.message && (
                        <p className="mt-1 text-xs text-red-600">
                            {errors.descripcion.message}
                        </p>
                    )}
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 md:col-span-2">
                    <label className="flex items-start gap-3">
                        <input
                            type="checkbox"
                            {...register("requiereAjusteCambio")}
                            className="mt-1 h-4 w-4 rounded border-slate-300"
                        />

                        <span>
                            <span className="block text-sm font-medium text-slate-800">
                                Requiere ajuste de cambio
                            </span>
                            <span className="block text-xs text-slate-500">
                                Usar para cuentas que requieran ajuste por
                                diferencia de cambio.
                            </span>
                        </span>
                    </label>
                </div>
            </div>
        </div>
    );
}