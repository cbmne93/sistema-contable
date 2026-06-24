'use client';

import type {
    Control,
    FieldErrors,
    UseFormRegister,
    UseFormSetValue,
} from "react-hook-form";
import { Controller } from "react-hook-form";

import { ClienteCombobox } from "@/features/clientes/components";

import type { FacturaVentaFormValues } from "../validations";
import { formatNumero } from "../utils/factura-calculos";
import type {
    ClienteOption,
    SucursalOption,
    TimbradoOption,
} from "../interfaces";

interface FacturaVentaDatosGeneralesProps {
    clientes: ClienteOption[];
    sucursales: SucursalOption[];
    timbrados: TimbradoOption[];
    timbradosFiltrados: TimbradoOption[];
    timbradoSeleccionado?: TimbradoOption;
    condicion: "CONTADO" | "CREDITO";
    moneda: "PYG" | "USD" | "BRL" | "ARS";
    control: Control<FacturaVentaFormValues>;
    register: UseFormRegister<FacturaVentaFormValues>;
    setValue: UseFormSetValue<FacturaVentaFormValues>;
    errors: FieldErrors<FacturaVentaFormValues>;
}

export function FacturaVentaDatosGenerales({
    clientes,
    sucursales,
    timbrados,
    timbradosFiltrados,
    timbradoSeleccionado,
    condicion,
    moneda,
    control,
    register,
    setValue,
    errors,
}: FacturaVentaDatosGeneralesProps) {
    return (
        <>
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                        Cliente
                    </label>

                    <Controller
                        name="clienteId"
                        control={control}
                        render={({ field }) => (
                            <ClienteCombobox
                                value={field.value}
                                clientes={clientes}
                                error={errors.clienteId?.message}
                                onChange={field.onChange}
                            />
                        )}
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                        Sucursal
                    </label>

                    <select
                        {...register("sucursalId", {
                            onChange: () => {
                                setValue("timbradoId", "");
                                setValue("numeroComprobante", "");
                            },
                        })}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
                    >
                        <option value="">Seleccione una sucursal</option>

                        {sucursales.map((sucursal) => (
                            <option key={sucursal.id} value={sucursal.id}>
                                {sucursal.nombre}
                            </option>
                        ))}
                    </select>

                    {errors.sucursalId && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.sucursalId.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                        Timbrado
                    </label>

                    <select
                        {...register("timbradoId", {
                            onChange: (event) => {
                                const selectedTimbrado = timbrados.find(
                                    (timbrado) =>
                                        timbrado.id === event.target.value
                                );

                                setValue(
                                    "numeroComprobante",
                                    formatNumero(selectedTimbrado?.numeroActual)
                                );
                            },
                        })}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
                    >
                        <option value="">Seleccione un timbrado</option>

                        {timbradosFiltrados.map((timbrado) => (
                            <option key={timbrado.id} value={timbrado.id}>
                                {timbrado.numero}
                            </option>
                        ))}
                    </select>

                    {errors.timbradoId && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.timbradoId.message}
                        </p>
                    )}

                    {timbradoSeleccionado && (
                        <p className="mt-1 text-xs text-slate-500">
                            {timbradoSeleccionado.establecimiento ?? "---"}-
                            {timbradoSeleccionado.puntoExpedicion ?? "---"} |
                            Rango:{" "}
                            {formatNumero(timbradoSeleccionado.numeroDesde) ||
                                "-"}{" "}
                            /{" "}
                            {formatNumero(timbradoSeleccionado.numeroHasta) ||
                                "-"}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                        Nro. comprobante
                    </label>

                    <div className="flex h-10 overflow-hidden rounded-lg border border-slate-200 bg-white text-sm transition focus-within:border-slate-400">
                        <div className="flex items-center border-r border-slate-200 bg-slate-50 px-3 font-medium text-slate-600">
                            {timbradoSeleccionado?.establecimiento ?? "---"}-
                            {timbradoSeleccionado?.puntoExpedicion ?? "---"}-
                        </div>

                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength={7}
                            {...register("numeroComprobante")}
                            className="min-w-0 flex-1 px-3 py-2 text-sm outline-none"
                            placeholder="0000001"
                        />
                    </div>

                    {errors.numeroComprobante && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.numeroComprobante.message}
                        </p>
                    )}

                    <p className="mt-1 text-xs text-slate-500">
                        Puede dejar el número sugerido o modificarlo.
                    </p>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                        Condición
                    </label>

                    <select
                        {...register("condicion")}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
                    >
                        <option value="CONTADO">Contado</option>
                        <option value="CREDITO">Crédito</option>
                    </select>

                    {errors.condicion && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.condicion.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                        Fecha de emisión
                    </label>

                    <input
                        type="date"
                        {...register("fechaEmision")}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
                    />

                    {errors.fechaEmision && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.fechaEmision.message}
                        </p>
                    )}
                </div>

                {condicion === "CREDITO" && (
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Fecha de vencimiento
                        </label>

                        <input
                            type="date"
                            {...register("fechaVencimiento")}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
                        />

                        {errors.fechaVencimiento && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.fechaVencimiento.message}
                            </p>
                        )}
                    </div>
                )}

                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                        Moneda
                    </label>

                    <select
                        {...register("moneda")}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
                    >
                        <option value="PYG">Guaraníes</option>
                        <option value="USD">Dólares</option>
                        <option value="BRL">Reales</option>
                        <option value="ARS">Pesos argentinos</option>
                    </select>

                    {errors.moneda && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.moneda.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                        Cotización
                    </label>

                    <input
                        type="number"
                        min={0}
                        step="0.01"
                        disabled={moneda === "PYG"}
                        {...register("cotizacion", {
                            setValueAs: (value) => {
                                if (
                                    value === "" ||
                                    value === null ||
                                    value === undefined
                                ) {
                                    return 0;
                                }

                                const numberValue = Number(value);

                                return Number.isNaN(numberValue)
                                    ? 0
                                    : numberValue;
                            },
                        })}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400 disabled:bg-slate-100 disabled:text-slate-500"
                    />

                    {errors.cotizacion && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.cotizacion.message}
                        </p>
                    )}
                </div>
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                    Concepto general
                </label>

                <input
                    type="text"
                    {...register("concepto")}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
                    placeholder="Ej: Venta de mercaderías"
                />
            </div>
        </>
    );
}