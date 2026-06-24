
"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
    createSucursalAction,
    updateSucursalAction,
} from "../actions";

import {
    sucursalFormSchema,
    type SucursalFormValues,
} from "../validations";

import type { Sucursal } from "../interfaces";

interface SucursalFormProps {
    sucursal?: Sucursal | null;
}

export function SucursalForm({ sucursal }: SucursalFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [formError, setFormError] = useState<string | null>(null);

    const isEditing = Boolean(sucursal);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SucursalFormValues>({
        resolver: zodResolver(sucursalFormSchema),
        defaultValues: {
            codigo: sucursal?.codigo ?? "",
            nombre: sucursal?.nombre ?? "",
            direccion: sucursal?.direccion ?? "",
            telefono: sucursal?.telefono ?? "",
            estado: sucursal?.estado ?? "ACTIVO",
        },
    });

    const onSubmit = (values: SucursalFormValues) => {
        setFormError(null);

        startTransition(async () => {
            const response = isEditing
                ? await updateSucursalAction({
                    id: sucursal!.id,
                    ...values,
                })
                : await createSucursalAction(values);

            if (!response.ok) {
                setFormError(response.message);
                return;
            }

            toast.success(response.message);

            router.push("/sucursales");
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

            <div className="grid gap-4 md:grid-cols-[140px_1fr]">
                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                        Código
                    </label>

                    <input
                        type="text"
                        maxLength={3}
                        {...register("codigo")}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
                        placeholder="Ej: 001"
                    />

                    {errors.codigo && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.codigo.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                        Nombre
                    </label>

                    <input
                        type="text"
                        {...register("nombre")}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
                        placeholder="Ej: Casa matriz"
                    />

                    {errors.nombre && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.nombre.message}
                        </p>
                    )}
                </div>
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                    Dirección
                </label>

                <input
                    type="text"
                    {...register("direccion")}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
                    placeholder="Dirección de la sucursal"
                />

                {errors.direccion && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.direccion.message}
                    </p>
                )}
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                    Teléfono
                </label>

                <input
                    type="text"
                    {...register("telefono")}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
                    placeholder="Ej: 021 123456"
                />

                {errors.telefono && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.telefono.message}
                    </p>
                )}
            </div>

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
                    onClick={() => router.push("/sucursales")}
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
                            ? "Actualizar sucursal"
                            : "Crear sucursal"}
                </button>
            </div>
        </form>
    );
}