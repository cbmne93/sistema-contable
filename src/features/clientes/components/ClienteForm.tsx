"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";

import {
    createClienteAction,
    updateClienteAction,
} from "../actions";

import {
    clienteFormSchema,
    type ClienteFormValues,
} from "../validations";

import type { Cliente } from "../interfaces";

interface ClienteFormProps {
    cliente?: Cliente | null;
}

export function ClienteForm({ cliente }: ClienteFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [formError, setFormError] = useState<string | null>(null);

    const isEditing = Boolean(cliente);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ClienteFormValues>({
        resolver: zodResolver(clienteFormSchema),
        defaultValues: {
            nombre: cliente?.nombre ?? "",
            tipoDocumento: cliente?.tipoDocumento ?? "RUC",
            numeroDocumento: cliente?.numeroDocumento ?? "",
            dv: cliente?.dv ?? "",
            tipoPersona: cliente?.tipoPersona ?? "JURIDICA",
            direccion: cliente?.direccion ?? "",
            telefono: cliente?.telefono ?? "",
            email: cliente?.email ?? "",
            estado: cliente?.estado ?? "ACTIVO",
        },
    });

    const onSubmit = (values: ClienteFormValues) => {
        setFormError(null);

        startTransition(async () => {
            const response = isEditing
                ? await updateClienteAction({
                    id: cliente!.id,
                    ...values,
                })
                : await createClienteAction(values);

            if (!response.ok) {
                setFormError(response.message);
                return;
            }

            toast.success(response.message);

            router.push("/clientes");
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
            <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                    Nombre / Razón social
                </label>

                <input
                    type="text"
                    {...register("nombre")}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
                    placeholder="Ej: Cliente Demo S.A."
                />

                {errors.nombre && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.nombre.message}
                    </p>
                )}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                        Tipo documento
                    </label>

                    <select
                        {...register("tipoDocumento")}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
                    >
                        <option value="RUC">RUC</option>
                        <option value="CEDULA_IDENTIDAD">Cédula de identidad</option>
                        <option value="PASAPORTE">Pasaporte</option>
                        <option value="DOCUMENTO_EXTRANJERO">
                            Documento extranjero
                        </option>
                    </select>

                    {errors.tipoDocumento && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.tipoDocumento.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                        Número documento
                    </label>

                    <input
                        type="text"
                        {...register("numeroDocumento")}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
                        placeholder="Ej: 80012345"
                    />

                    {errors.numeroDocumento && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.numeroDocumento.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                        DV
                    </label>

                    <input
                        type="text"
                        {...register("dv")}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
                        placeholder="Ej: 6"
                    />

                    {errors.dv && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.dv.message}
                        </p>
                    )}
                </div>
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                    Tipo persona
                </label>

                <select
                    {...register("tipoPersona")}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
                >
                    <option value="JURIDICA">Jurídica</option>
                    <option value="FISICA">Física</option>
                </select>

                {errors.tipoPersona && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.tipoPersona.message}
                    </p>
                )}
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                    Dirección
                </label>

                <input
                    type="text"
                    {...register("direccion")}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
                    placeholder="Dirección del cliente"
                />

                {errors.direccion && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.direccion.message}
                    </p>
                )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                        Teléfono
                    </label>

                    <input
                        type="text"
                        {...register("telefono")}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
                        placeholder="Ej: 0981 123456"
                    />

                    {errors.telefono && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.telefono.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                        Email
                    </label>

                    <input
                        type="email"
                        {...register("email")}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
                        placeholder="cliente@email.com"
                    />

                    {errors.email && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.email.message}
                        </p>
                    )}
                </div>
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
                    onClick={() => router.push("/clientes")}
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
                            ? "Actualizar cliente"
                            : "Crear cliente"}
                </button>
            </div>
        </form>
    );
}