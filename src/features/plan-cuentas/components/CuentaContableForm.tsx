"use client";

import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver, SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
    createCuentaContableAction,
    updateCuentaContableAction,
} from "../actions";
import type { CuentaContableOption } from "../interfaces";
import {
    cuentaContableSchema,
    type CuentaContableFormValues,
} from "../validations";
import { cuentaContableDefaultValues } from "../utils";

import { CuentaContableActions } from "./CuentaContableActions";
import { CuentaContableDatos } from "./CuentaContableDatos";

interface CuentaContableFormProps {
    cuentasPadre: CuentaContableOption[];
    cuentaId?: string;
    initialData?: CuentaContableFormValues | null;
}

export function CuentaContableForm({
    cuentasPadre,
    cuentaId,
    initialData,
}: CuentaContableFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const isEditMode = !!cuentaId;

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<CuentaContableFormValues>({
        resolver: zodResolver(
            cuentaContableSchema
        ) as unknown as Resolver<CuentaContableFormValues>,
        defaultValues: initialData ?? cuentaContableDefaultValues,
    });

    const cuentaPadreId = watch("cuentaPadreId");
    const codigo = watch("codigo");

    const cuentaPadreSeleccionada = cuentasPadre.find(
        (cuenta) => cuenta.id === cuentaPadreId
    );

    useEffect(() => {
        if (!cuentaPadreSeleccionada) {
            if (!isEditMode) {
                setValue("codigo", "", {
                    shouldValidate: true,
                    shouldDirty: true,
                });
            }

            return;
        }

        setValue(
            "tipo",
            cuentaPadreSeleccionada.tipo as CuentaContableFormValues["tipo"],
            {
                shouldValidate: true,
                shouldDirty: true,
            }
        );

        setValue(
            "naturaleza",
            cuentaPadreSeleccionada.naturaleza as CuentaContableFormValues["naturaleza"],
            {
                shouldValidate: true,
                shouldDirty: true,
            }
        );

        setValue("nivel", cuentaPadreSeleccionada.nivel + 1, {
            shouldValidate: true,
            shouldDirty: true,
        });

        const codigoActual = codigo.trim();

        if (
            !codigoActual ||
            !codigoActual.startsWith(cuentaPadreSeleccionada.codigo)
        ) {
            setValue("codigo", cuentaPadreSeleccionada.codigo, {
                shouldValidate: true,
                shouldDirty: true,
            });
        }
    }, [cuentaPadreSeleccionada, codigo, isEditMode, setValue]);

    const onSubmit: SubmitHandler<CuentaContableFormValues> = (values) => {
        startTransition(async () => {
            const response =
                isEditMode && cuentaId
                    ? await updateCuentaContableAction(cuentaId, values)
                    : await createCuentaContableAction(values);

            if (!response.ok) {
                toast.error(response.message);
                return;
            }

            toast.success(response.message);
            router.push("/plan-cuentas");
            router.refresh();
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <CuentaContableDatos
                cuentasPadre={cuentasPadre}
                cuentaPadreSeleccionada={cuentaPadreSeleccionada}
                register={register}
                watch={watch}
                setValue={setValue}
                errors={errors}
            />

            <CuentaContableActions
                isPending={isPending}
                submitLabel={
                    isEditMode ? "Actualizar cuenta" : "Guardar cuenta"
                }
                pendingLabel={isEditMode ? "Actualizando..." : "Guardando..."}
            />
        </form>
    );
}