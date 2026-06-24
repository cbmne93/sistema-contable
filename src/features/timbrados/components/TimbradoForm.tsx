"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { createTimbradoAction, updateTimbradoAction } from "../actions";

import { timbradoSchema, type TimbradoFormValues } from "../validations";

import type { Timbrado } from "../interfaces";

interface SucursalOption {
    id: string;
    nombre: string;
}

interface ProveedorOption {
    id: string;
    nombre: string;
    numeroDocumento: string;
}

interface TimbradoFormProps {
    timbrado?: Timbrado | null;
    sucursales: SucursalOption[];
    proveedores: ProveedorOption[];
}

function formatDateInput(fecha?: Date | string | null) {
    if (!fecha) {
        return "";
    }

    return new Date(fecha).toISOString().slice(0, 10);
}

function parseNumberInput(value: unknown) {
    if (value === "" || value === null || value === undefined) {
        return null;
    }

    const numberValue = Number(value);

    return Number.isNaN(numberValue) ? null : numberValue;
}

export function TimbradoForm({
    timbrado,
    sucursales,
    proveedores,
}: TimbradoFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [formError, setFormError] = useState<string | null>(null);

    const isEditing = Boolean(timbrado);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<TimbradoFormValues>({
        resolver: zodResolver(timbradoSchema),
        defaultValues: {
            origen: timbrado?.origen ?? "PROPIO",
            tipoComprobante: timbrado?.tipoComprobante ?? "FACTURA",
            numero: timbrado?.numero ?? "",
            fechaFin: formatDateInput(timbrado?.fechaFin),

            sucursalId: timbrado?.sucursalId ?? "",
            proveedorId: timbrado?.proveedorId ?? "",

            establecimiento: timbrado?.establecimiento ?? "",
            puntoExpedicion: timbrado?.puntoExpedicion ?? "",

            numeroDesde: timbrado?.numeroDesde ?? undefined,
            numeroHasta: timbrado?.numeroHasta ?? undefined,
            numeroActual: timbrado?.numeroActual ?? undefined,

            estado: timbrado?.estado ?? "ACTIVO",
        },
    });

    const origen = watch("origen");
    const esPropio = origen === "PROPIO";
    const esProveedor = origen === "PROVEEDOR";

    const onSubmit = (values: TimbradoFormValues) => {
        setFormError(null);

        startTransition(async () => {
            const response = isEditing
                ? await updateTimbradoAction({
                    id: timbrado!.id,
                    ...values,
                })
                : await createTimbradoAction(values);

            if (!response.ok) {
                setFormError(response.message);
                return;
            }

            toast.success(response.message);

            router.push("/timbrados");
            router.refresh();
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {formError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {formError}
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                        Origen
                    </label>

                    <select
                        {...register("origen")}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
                    >
                        <option value="PROPIO">Propio / Ventas</option>
                        <option value="PROVEEDOR">Proveedor / Compras</option>
                    </select>

                    {errors.origen && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.origen.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                        Tipo comprobante
                    </label>

                    <select
                        {...register("tipoComprobante")}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
                    >
                        <option value="FACTURA">Factura</option>
                        <option value="NOTA_CREDITO">Nota de crédito</option>
                        <option value="NOTA_DEBITO">Nota de débito</option>
                        <option value="RECIBO">Recibo</option>
                        <option value="AUTOFACTURA">Autofactura</option>
                        <option value="TICKET">Ticket</option>
                        <option value="OTRO">Otro</option>
                    </select>

                    {errors.tipoComprobante && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.tipoComprobante.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                        Número de timbrado
                    </label>

                    <input
                        type="text"
                        inputMode="numeric"
                        maxLength={8}
                        {...register("numero")}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
                        placeholder="Ej: 17585779"
                    />

                    {errors.numero && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.numero.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                        Vencimiento
                    </label>

                    <input
                        type="date"
                        {...register("fechaFin")}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
                    />

                    {errors.fechaFin && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.fechaFin.message}
                        </p>
                    )}

                    <p className="mt-1 text-xs text-slate-500">
                        Puede quedar vacío para comprobantes electrónicos si corresponde.
                    </p>
                </div>
            </div>

            {esPropio && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <h3 className="mb-4 text-sm font-semibold text-slate-800">
                        Datos para timbrado propio / ventas
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                Sucursal
                            </label>

                            <select
                                {...register("sucursalId")}
                                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400"
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

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">
                                    Establecimiento
                                </label>

                                <input
                                    type="text"
                                    maxLength={3}
                                    {...register("establecimiento")}
                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400"
                                    placeholder="Ej: 001"
                                />

                                {errors.establecimiento && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.establecimiento.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">
                                    Punto de expedición
                                </label>

                                <input
                                    type="text"
                                    maxLength={3}
                                    {...register("puntoExpedicion")}
                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400"
                                    placeholder="Ej: 001"
                                />

                                {errors.puntoExpedicion && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.puntoExpedicion.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">
                                    Número desde
                                </label>

                                <input
                                    type="number"
                                    min={1}
                                    {...register("numeroDesde", {
                                        setValueAs: parseNumberInput,
                                    })}
                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400"
                                    placeholder="Ej: 1"
                                />

                                {errors.numeroDesde && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.numeroDesde.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">
                                    Número hasta
                                </label>

                                <input
                                    type="number"
                                    min={1}
                                    {...register("numeroHasta", {
                                        setValueAs: parseNumberInput,
                                    })}
                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400"
                                    placeholder="Ej: 150"
                                />

                                {errors.numeroHasta && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.numeroHasta.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">
                                    Número actual
                                </label>

                                <input
                                    type="number"
                                    min={1}
                                    {...register("numeroActual", {
                                        setValueAs: parseNumberInput,
                                    })}
                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400"
                                    placeholder="Ej: 1"
                                />

                                {errors.numeroActual && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.numeroActual.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {esProveedor && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <h3 className="mb-4 text-sm font-semibold text-slate-800">
                        Datos para timbrado de proveedor / compras
                    </h3>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Proveedor
                        </label>

                        <select
                            {...register("proveedorId")}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-slate-400"
                        >
                            <option value="">Seleccione un proveedor</option>

                            {proveedores.map((proveedor) => (
                                <option key={proveedor.id} value={proveedor.id}>
                                    {proveedor.nombre}
                                    {proveedor.numeroDocumento
                                        ? ` - RUC ${proveedor.numeroDocumento}`
                                        : ""}
                                </option>
                            ))}
                        </select>

                        {errors.proveedorId && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.proveedorId.message}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {isEditing && (
                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                        Estado
                    </label>

                    <select
                        {...register("estado")}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
                    >
                        <option value="ACTIVO">Activo</option>
                        <option value="INACTIVO">Inactivo</option>
                    </select>

                    {errors.estado && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.estado.message}
                        </p>
                    )}
                </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
                <button
                    type="button"
                    onClick={() => router.push("/timbrados")}
                    disabled={isPending}
                    className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    Cancelar
                </button>

                <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex h-10 items-center justify-center rounded-lg bg-black px-4 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isPending
                        ? "Guardando..."
                        : isEditing
                            ? "Actualizar timbrado"
                            : "Crear timbrado"}
                </button>
            </div>
        </form>
    );
}