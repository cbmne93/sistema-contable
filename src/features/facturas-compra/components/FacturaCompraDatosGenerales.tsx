import {
    Controller,
    type Control,
    type FieldErrors,
    type UseFormRegister,
} from "react-hook-form";

import { ProveedorCombobox } from "@/features/proveedores/components";

import type { FacturaCompraFormValues } from "../validations";
import type {
    ProveedorOption,
    SucursalOption,
    TimbradoProveedorOption,
} from "../interfaces";

interface FacturaCompraDatosGeneralesProps {
    register: UseFormRegister<FacturaCompraFormValues>;
    control: Control<FacturaCompraFormValues>;
    errors: FieldErrors<FacturaCompraFormValues>;
    proveedores: ProveedorOption[];
    sucursales: SucursalOption[];
    timbradosFiltrados: TimbradoProveedorOption[];
    proveedorId: string;
    moneda: string;
    condicion: "CONTADO" | "CREDITO";
}

export function FacturaCompraDatosGenerales({
    register,
    control,
    errors,
    proveedores,
    sucursales,
    timbradosFiltrados,
    proveedorId,
    moneda,
    condicion,
}: FacturaCompraDatosGeneralesProps) {
    return (
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
                <h2 className="text-base font-semibold text-slate-900">
                    Datos generales
                </h2>
                <p className="text-sm text-slate-500">
                    Información principal de la factura de compra.
                </p>
            </div>

            <div className="grid gap-4 p-5 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">
                        Proveedor
                    </label>

                    <Controller
                        name="proveedorId"
                        control={control}
                        render={({ field }) => (
                            <ProveedorCombobox
                                value={field.value}
                                proveedores={proveedores}
                                error={errors.proveedorId?.message}
                                onChange={field.onChange}
                            />
                        )}
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">
                        Sucursal
                    </label>

                    <select
                        {...register("sucursalId")}
                        className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                    >
                        <option value="">Seleccione una sucursal</option>

                        {sucursales.map((sucursal) => (
                            <option key={sucursal.id} value={sucursal.id}>
                                {sucursal.nombre}
                            </option>
                        ))}
                    </select>

                    {errors.sucursalId && (
                        <p className="text-xs text-red-600">
                            {errors.sucursalId.message}
                        </p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">
                        Timbrado proveedor
                    </label>

                    <select
                        {...register("timbradoId")}
                        disabled={!proveedorId}
                        className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100"
                    >
                        <option value="">
                            {proveedorId
                                ? "Seleccione un timbrado"
                                : "Seleccione primero un proveedor"}
                        </option>

                        {timbradosFiltrados.map((timbrado) => (
                            <option key={timbrado.id} value={timbrado.id}>
                                {timbrado.numero}
                            </option>
                        ))}
                    </select>

                    {errors.timbradoId && (
                        <p className="text-xs text-red-600">
                            {errors.timbradoId.message}
                        </p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">
                        Establecimiento
                    </label>

                    <input
                        {...register("establecimiento")}
                        placeholder="001"
                        maxLength={3}
                        className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                    />

                    {errors.establecimiento && (
                        <p className="text-xs text-red-600">
                            {errors.establecimiento.message}
                        </p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">
                        Punto expedición
                    </label>

                    <input
                        {...register("puntoExpedicion")}
                        placeholder="001"
                        maxLength={3}
                        className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                    />

                    {errors.puntoExpedicion && (
                        <p className="text-xs text-red-600">
                            {errors.puntoExpedicion.message}
                        </p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">
                        Número comprobante
                    </label>

                    <input
                        {...register("numeroComprobante")}
                        placeholder="0000001"
                        maxLength={7}
                        className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                    />

                    {errors.numeroComprobante && (
                        <p className="text-xs text-red-600">
                            {errors.numeroComprobante.message}
                        </p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">
                        Fecha emisión
                    </label>

                    <input
                        type="date"
                        {...register("fechaEmision")}
                        className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                    />

                    {errors.fechaEmision && (
                        <p className="text-xs text-red-600">
                            {errors.fechaEmision.message}
                        </p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">
                        Condición
                    </label>

                    <select
                        {...register("condicion")}
                        className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                    >
                        <option value="CONTADO">Contado</option>
                        <option value="CREDITO">Crédito</option>
                    </select>
                </div>

                {condicion === "CREDITO" && (
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">
                            Vencimiento del pago
                        </label>

                        <input
                            type="date"
                            {...register("fechaVencimiento")}
                            className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                        />

                        {errors.fechaVencimiento && (
                            <p className="text-xs text-red-600">
                                {errors.fechaVencimiento.message}
                            </p>
                        )}
                    </div>
                )}

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">
                        Moneda
                    </label>

                    <select
                        {...register("moneda")}
                        className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                    >
                        <option value="PYG">Guaraníes</option>
                        <option value="USD">Dólares</option>
                        <option value="BRL">Reales</option>
                        <option value="ARS">Pesos argentinos</option>
                    </select>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">
                        Cotización
                    </label>

                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        disabled={moneda === "PYG"}
                        {...register("cotizacion")}
                        className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100"
                    />

                    {errors.cotizacion && (
                        <p className="text-xs text-red-600">
                            {errors.cotizacion.message}
                        </p>
                    )}
                </div>
                <div className="space-y-1.5 md:col-span-2 lg:col-span-3">
                    <label className="text-sm font-medium text-slate-700">
                        Concepto
                    </label>

                    <input
                        {...register("concepto")}
                        placeholder="Ej: Compra de mercaderías"
                        className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                    />
                </div>
            </div>
        </section>
    );
}