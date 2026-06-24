"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import type {
    FieldErrors,
    Resolver,
    SubmitErrorHandler,
    SubmitHandler,
} from "react-hook-form";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import {
    createAsientoContableAction,
    updateAsientoContableAction,
} from "../actions";
import type { AsientoContableFormOptions } from "../interfaces";
import {
    asientoContableSchema,
    type AsientoContableFormValues,
} from "../validations";
import {
    asientoContableDefaultValues,
    calculateAsientoTotales,
} from "../utils";

import { AsientoContableActions } from "./AsientoContableActions";
import { AsientoContableDatos } from "./AsientoContableDatos";
import { AsientoContableDetalle } from "./AsientoContableDetalle";
import { AsientoContableTotales } from "./AsientoContableTotales";

interface AsientoContableFormProps {
    options: AsientoContableFormOptions;
    asientoId?: string;
    initialData?: AsientoContableFormValues | null;
}

function formatCurrency(value: number) {
    return new Intl.NumberFormat("es-PY", {
        style: "currency",
        currency: "PYG",
        maximumFractionDigits: 0,
    }).format(value || 0);
}

function getFirstErrorMessage(errors: FieldErrors<AsientoContableFormValues>) {
    if (errors.fecha?.message) {
        return errors.fecha.message;
    }

    if (errors.concepto?.message) {
        return errors.concepto.message;
    }

    if (errors.sucursalId?.message) {
        return errors.sucursalId.message;
    }

    if (errors.detalles?.message) {
        return errors.detalles.message;
    }

    if (Array.isArray(errors.detalles)) {
        for (const detalleError of errors.detalles) {
            if (detalleError?.cuentaContableId?.message) {
                return detalleError.cuentaContableId.message;
            }

            if (detalleError?.debe?.message) {
                return detalleError.debe.message;
            }

            if (detalleError?.haber?.message) {
                return detalleError.haber.message;
            }

            if (detalleError?.descripcion?.message) {
                return detalleError.descripcion.message;
            }
        }
    }

    return "Verifique los datos del asiento contable.";
}

export function AsientoContableForm({
    options,
    asientoId,
    initialData,
}: AsientoContableFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const isEditMode = !!asientoId;

    const {
        register,
        handleSubmit,
        watch,
        control,
        formState: { errors },
    } = useForm<AsientoContableFormValues>({
        resolver: zodResolver(
            asientoContableSchema
        ) as unknown as Resolver<AsientoContableFormValues>,
        defaultValues: initialData ?? asientoContableDefaultValues,
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "detalles",
    });

    const detalles = watch("detalles");
    const totales = calculateAsientoTotales(detalles);

    const handleAddLine = () => {
        append({
            cuentaContableId: "",
            descripcion: "",
            debe: 0,
            haber: 0,
        });
    };

    const handleRemoveLine = (index: number) => {
        if (fields.length <= 2) {
            return;
        }

        remove(index);
    };

    const onSubmit: SubmitHandler<AsientoContableFormValues> = (values) => {
        startTransition(async () => {
            const response =
                isEditMode && asientoId
                    ? await updateAsientoContableAction(asientoId, values)
                    : await createAsientoContableAction(values);

            if (!response.ok) {
                toast.error(response.message);
                return;
            }

            toast.success(response.message);

            router.push("/asientos-contables");
            router.refresh();
        });
    };

    const onInvalid: SubmitErrorHandler<AsientoContableFormValues> = (
        formErrors
    ) => {
        if (
            totales.totalDebe > 0 &&
            totales.totalHaber > 0 &&
            totales.totalDebe !== totales.totalHaber
        ) {
            toast.error(
                `El asiento no está balanceado. La diferencia entre Debe y Haber es ${formatCurrency(
                    Math.abs(totales.diferencia)
                )}.`
            );
            return;
        }

        toast.error(getFirstErrorMessage(formErrors));
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit, onInvalid)}
            className="space-y-6"
        >
            <AsientoContableDatos
                register={register}
                errors={errors}
                sucursales={options.sucursales}
            />

            <AsientoContableDetalle
                fields={fields}
                cuentas={options.cuentas}
                control={control}
                register={register}
                errors={errors}
                onAddLine={handleAddLine}
                onRemoveLine={handleRemoveLine}
            />

            <AsientoContableTotales
                totalDebe={totales.totalDebe}
                totalHaber={totales.totalHaber}
                diferencia={totales.diferencia}
                balanceado={totales.balanceado}
            />

            <AsientoContableActions
                isPending={isPending}
                submitLabel={
                    isEditMode ? "Actualizar asiento" : "Guardar asiento"
                }
                pendingLabel={isEditMode ? "Actualizando..." : "Guardando..."}
            />
        </form>
    );
}