"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { ComprobanteImputacionTributaria } from "@/features/comprobantes/components";

import {
    createFacturaVentaAction,
    updateFacturaVentaAction,
} from "../actions";
import {
    facturaVentaSchema,
    type FacturaVentaFormValues,
} from "../validations";
import {
    calcularTotales,
    getTodayInputValue,
} from "../utils/factura-calculos";
import { FacturaVentaDatosGenerales } from "./FacturaVentaDatosGenerales";
import { FacturaVentaDetalleTable } from "./FacturaVentaDetalleTable";
import { FacturaVentaTotales } from "./FacturaVentaTotales";
import type {
    ClienteOption,
    CuentaContableOption,
    EmpresaObligacionesVentaOption,
    SucursalOption,
    TimbradoOption,
} from "../interfaces";

interface FacturaVentaFormProps {
    clientes: ClienteOption[];
    sucursales: SucursalOption[];
    timbrados: TimbradoOption[];
    cuentasContables: CuentaContableOption[];
    empresaObligaciones?: EmpresaObligacionesVentaOption;
    facturaId?: string;
    initialValues?: FacturaVentaFormValues;
}

const defaultEmpresaObligaciones: EmpresaObligacionesVentaOption = {
    obligacionIvaGeneral: true,
    tieneIre: false,
    tieneIrpRsp: false,
};

function getDefaultValues(
    initialValues?: FacturaVentaFormValues,
    empresaObligaciones: EmpresaObligacionesVentaOption = defaultEmpresaObligaciones
): FacturaVentaFormValues {
    if (initialValues) {
        return initialValues;
    }

    return {
        clienteId: "",
        sucursalId: "",
        timbradoId: "",
        numeroComprobante: "",
        fechaEmision: getTodayInputValue(),
        fechaVencimiento: "",
        condicion: "CONTADO",
        moneda: "PYG",
        cotizacion: 1,
        concepto: "",
        imputaIva: empresaObligaciones.obligacionIvaGeneral,
        imputaIre: empresaObligaciones.tieneIre,
        imputaIrpRsp: empresaObligaciones.tieneIrpRsp,
        detalles: [
            {
                cuentaContableId: "",
                descripcion: "",
                cantidad: 1,
                precioUnitario: 0,
                ivaTipo: "IVA_10",
            },
        ],
    };
}

export function FacturaVentaForm({
    clientes,
    sucursales,
    timbrados,
    cuentasContables,
    empresaObligaciones = defaultEmpresaObligaciones,
    facturaId,
    initialValues,
}: FacturaVentaFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [formError, setFormError] = useState<string | null>(null);

    const isEditMode = Boolean(facturaId);

    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<FacturaVentaFormValues>({
        resolver: zodResolver(facturaVentaSchema) as Resolver<FacturaVentaFormValues>,
        defaultValues: getDefaultValues(initialValues, empresaObligaciones),
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "detalles",
    });

    const sucursalId = watch("sucursalId");
    const timbradoId = watch("timbradoId");
    const condicion = watch("condicion");
    const moneda = watch("moneda");
    const detalles = watch("detalles");

    const imputaIva = watch("imputaIva");
    const imputaIre = watch("imputaIre");
    const imputaIrpRsp = watch("imputaIrpRsp");

    useEffect(() => {
        if (moneda === "PYG") {
            setValue("cotizacion", 1);
        }
    }, [moneda, setValue]);

    useEffect(() => {
        if (condicion === "CONTADO") {
            setValue("fechaVencimiento", "");
        }
    }, [condicion, setValue]);

    useEffect(() => {
        if (!empresaObligaciones.obligacionIvaGeneral) {
            setValue("imputaIva", false);
        }

        if (!empresaObligaciones.tieneIre) {
            setValue("imputaIre", false);
        }

        if (!empresaObligaciones.tieneIrpRsp) {
            setValue("imputaIrpRsp", false);
        }
    }, [empresaObligaciones, setValue]);

    const timbradosFiltrados = useMemo(() => {
        if (!sucursalId) {
            return timbrados;
        }

        return timbrados.filter(
            (timbrado) => timbrado.sucursalId === sucursalId
        );
    }, [sucursalId, timbrados]);

    const timbradoSeleccionado = timbrados.find(
        (timbrado) => timbrado.id === timbradoId
    );

    const totales = calcularTotales(detalles);

    const onSubmit = (values: FacturaVentaFormValues) => {
        setFormError(null);

        startTransition(async () => {
            const response =
                isEditMode && facturaId
                    ? await updateFacturaVentaAction(facturaId, values)
                    : await createFacturaVentaAction(values);

            if (!response.ok) {
                setFormError(response.message);
                return;
            }

            toast.success(response.message);

            router.push("/facturas-venta");
            router.refresh();
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {formError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {formError}
                </div>
            )}

            <FacturaVentaDatosGenerales
                clientes={clientes}
                sucursales={sucursales}
                timbrados={timbrados}
                timbradosFiltrados={timbradosFiltrados}
                timbradoSeleccionado={timbradoSeleccionado}
                condicion={condicion}
                moneda={moneda}
                control={control}
                register={register}
                setValue={setValue}
                errors={errors}
            />

            <ComprobanteImputacionTributaria
                imputaIva={imputaIva}
                imputaIre={imputaIre}
                imputaIrpRsp={imputaIrpRsp}
                mostrarIva={empresaObligaciones.obligacionIvaGeneral}
                mostrarIre={empresaObligaciones.tieneIre}
                mostrarIrpRsp={empresaObligaciones.tieneIrpRsp}
                mostrarNoImputa={false}
                error={errors.imputaIva?.message}
                onChange={(field, value) => {
                    if (field === "noImputa") {
                        return;
                    }

                    setValue(field, value, {
                        shouldDirty: true,
                        shouldValidate: true,
                    });
                }}
            />

            <FacturaVentaDetalleTable
                fields={fields}
                detalles={detalles}
                moneda={moneda}
                control={control}
                register={register}
                errors={errors}
                cuentasContables={cuentasContables}
                append={append}
                remove={remove}
            />

            <FacturaVentaTotales totales={totales} moneda={moneda} />

            <div className="flex items-center justify-end gap-3">
                <button
                    type="button"
                    onClick={() =>
                        router.push(
                            isEditMode && facturaId
                                ? `/facturas-venta/${facturaId}`
                                : "/facturas-venta"
                        )
                    }
                    disabled={isPending}
                    className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    Cancelar
                </button>

                <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isPending
                        ? "Guardando..."
                        : isEditMode
                            ? "Guardar cambios"
                            : "Guardar factura"}
                </button>
            </div>
        </form>
    );
}