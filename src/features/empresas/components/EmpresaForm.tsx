"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
    createEmpresaAction,
    setEmpresaActivaAction,
    updateEmpresaAction,
} from "../actions";
import { empresaFormSchema, type EmpresaFormValues } from "../validations";
import type { Empresa } from "../interfaces";

import { EmpresaObligacionesTributarias } from "./EmpresaObligacionesTributarias";

interface EmpresaFormProps {
    empresa?: Empresa | null;
    seleccionarAlCrear?: boolean;
    redirectAfterSave?: string;
    cancelHref?: string;
}

export function EmpresaForm({
    empresa,
    seleccionarAlCrear = false,
    redirectAfterSave = "/empresas",
    cancelHref = "/empresas",
}: EmpresaFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [formError, setFormError] = useState<string | null>(null);

    const isEditing = Boolean(empresa);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<EmpresaFormValues>({
        resolver: zodResolver(
            empresaFormSchema
        ) as unknown as Resolver<EmpresaFormValues>,
        defaultValues: {
            razonSocial: empresa?.razonSocial ?? "",
            ruc: empresa?.ruc ?? "",
            dv: empresa?.dv ?? "",
            direccion: empresa?.direccion ?? "",
            telefono: empresa?.telefono ?? "",
            email: empresa?.email ?? "",
            estado: empresa?.estado ?? "ACTIVO",

            obligacionIvaGeneral: empresa?.obligacionIvaGeneral ?? true,
            obligacionIrpServicios: empresa?.obligacionIrpServicios ?? false,
            obligacionIrpCapital: empresa?.obligacionIrpCapital ?? false,
            obligacionIreGeneral: empresa?.obligacionIreGeneral ?? false,
            obligacionIreSimple: empresa?.obligacionIreSimple ?? false,
            obligacionIreResimple: empresa?.obligacionIreResimple ?? false,
            obligacionIdu: empresa?.obligacionIdu ?? false,
            obligacionInr: empresa?.obligacionInr ?? false,
        },
    });

    const onSubmit = (values: EmpresaFormValues) => {
        setFormError(null);

        startTransition(async () => {
            const response = isEditing
                ? await updateEmpresaAction({
                    id: empresa!.id,
                    ...values,
                })
                : await createEmpresaAction(values);

            if (!response.ok) {
                setFormError(response.message);
                return;
            }

            if (!isEditing && seleccionarAlCrear && response.empresa?.id) {
                const empresaActivaResponse = await setEmpresaActivaAction(
                    response.empresa.id
                );

                if (!empresaActivaResponse.ok) {
                    setFormError(empresaActivaResponse.message);
                    return;
                }
            }

            toast.success(response.message);

            router.push(redirectAfterSave);
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
                <label className="mb-1 block text-sm font-medium">
                    Razón social
                </label>

                <input
                    type="text"
                    {...register("razonSocial")}
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    placeholder="Ej: Empresa Demo S.A."
                />

                {errors.razonSocial && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.razonSocial.message}
                    </p>
                )}
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_120px]">
                <div>
                    <label className="mb-1 block text-sm font-medium">
                        RUC
                    </label>

                    <input
                        type="text"
                        {...register("ruc")}
                        className="w-full rounded-md border px-3 py-2 text-sm"
                        placeholder="Ej: 80012345"
                    />

                    {errors.ruc && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.ruc.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">
                        DV
                    </label>

                    <input
                        type="text"
                        {...register("dv")}
                        className="w-full rounded-md border px-3 py-2 text-sm"
                        placeholder="Ej: 1"
                    />

                    {errors.dv && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.dv.message}
                        </p>
                    )}
                </div>
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium">
                    Dirección
                </label>

                <input
                    type="text"
                    {...register("direccion")}
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    placeholder="Dirección de la empresa"
                />

                {errors.direccion && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.direccion.message}
                    </p>
                )}
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium">
                    Teléfono
                </label>

                <input
                    type="text"
                    {...register("telefono")}
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    placeholder="Ej: 0981 123456"
                />

                {errors.telefono && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.telefono.message}
                    </p>
                )}
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium">
                    Email
                </label>

                <input
                    type="email"
                    {...register("email")}
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    placeholder="empresa@email.com"
                />

                {errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                        {errors.email.message}
                    </p>
                )}
            </div>

            <EmpresaObligacionesTributarias
                register={register}
                watch={watch}
                setValue={setValue}
            />

            {isEditing && (
                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Estado
                    </label>

                    <select
                        {...register("estado")}
                        className="w-full rounded-md border px-3 py-2 text-sm"
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

            <div className="flex items-center justify-end gap-3">
                <button
                    type="button"
                    onClick={() => router.push(cancelHref)}
                    className="rounded-md border px-4 py-2 text-sm"
                    disabled={isPending}
                >
                    Cancelar
                </button>

                <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-md bg-black px-4 py-2 text-sm text-white disabled:opacity-60"
                >
                    {isPending
                        ? "Guardando..."
                        : isEditing
                            ? "Actualizar empresa"
                            : "Crear empresa"}
                </button>
            </div>
        </form>
    );
}