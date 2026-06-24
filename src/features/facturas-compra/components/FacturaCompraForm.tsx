"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
    type Resolver,
    type SubmitHandler,
    useFieldArray,
    useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { ComprobanteImputacionTributaria } from "@/features/comprobantes/components";

import {
    createFacturaCompraAction,
    updateFacturaCompraAction,
} from "../actions";
import {
    facturaCompraSchema,
    type FacturaCompraFormValues,
} from "../validations";
import { calcularTotalesCompra, getTodayInputValue } from "../utils";
import type {
    CuentaContableOption,
    CreateFacturaCompraInput,
    EmpresaObligacionesCompraOption,
    ProveedorOption,
    SucursalOption,
    TimbradoProveedorOption,
} from "../interfaces";

import { FacturaCompraDatosGenerales } from "./FacturaCompraDatosGenerales";
import { FacturaCompraDetalleTable } from "./FacturaCompraDetalleTable";
import { FacturaCompraTotales } from "./FacturaCompraTotales";
import { FacturaCompraActions } from "./FacturaCompraActions";

interface FacturaCompraFormProps {
    proveedores: ProveedorOption[];
    sucursales: SucursalOption[];
    timbrados: TimbradoProveedorOption[];
    cuentasContables: CuentaContableOption[];
    empresaObligaciones?: EmpresaObligacionesCompraOption;
    facturaId?: string;
    initialData?: CreateFacturaCompraInput | null;
}

const defaultEmpresaObligaciones: EmpresaObligacionesCompraOption = {
    obligacionIvaGeneral: true,
    tieneIre: false,
    tieneIrpRsp: false,
};

function getDateInputValue(value: string | Date | null | undefined) {
    if (!value) {
        return "";
    }

    if (typeof value === "string") {
        return value;
    }

    const year = value.getUTCFullYear();
    const month = String(value.getUTCMonth() + 1).padStart(2, "0");
    const day = String(value.getUTCDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function getDefaultValues(
    initialData?: CreateFacturaCompraInput | null,
    empresaObligaciones: EmpresaObligacionesCompraOption = defaultEmpresaObligaciones
): FacturaCompraFormValues {
    if (initialData) {
        return {
            proveedorId: initialData.proveedorId,
            sucursalId: initialData.sucursalId,
            timbradoId: initialData.timbradoId,

            establecimiento: initialData.establecimiento ?? "",
            puntoExpedicion: initialData.puntoExpedicion ?? "",
            numeroComprobante: initialData.numeroComprobante ?? "",

            fechaEmision: getDateInputValue(initialData.fechaEmision),
            fechaVencimiento: getDateInputValue(initialData.fechaVencimiento),

            condicion: initialData.condicion,
            moneda: initialData.moneda,
            cotizacion: initialData.cotizacion,

            concepto: initialData.concepto ?? "",

            imputaIva: initialData.imputaIva,
            imputaIre: initialData.imputaIre,
            imputaIrpRsp: initialData.imputaIrpRsp,
            noImputa: initialData.noImputa,

            detalles:
                initialData.detalles.length > 0
                    ? initialData.detalles
                    : [
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

    return {
        proveedorId: "",
        sucursalId: "",
        timbradoId: "",
        establecimiento: "",
        puntoExpedicion: "",
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
        noImputa: false,

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

export function FacturaCompraForm({
    proveedores,
    sucursales,
    timbrados,
    cuentasContables,
    empresaObligaciones = defaultEmpresaObligaciones,
    facturaId,
    initialData,
}: FacturaCompraFormProps) {
    const router = useRouter();

    const isEditMode = Boolean(facturaId);
    const proveedorInicialRef = useRef(initialData?.proveedorId ?? "");
    const timbradoInicialRef = useRef(initialData?.timbradoId ?? "");

    const [isPending, startTransition] = useTransition();
    const [formError, setFormError] = useState<string | null>(null);

    const form = useForm<FacturaCompraFormValues>({
        resolver: zodResolver(
            facturaCompraSchema
        ) as unknown as Resolver<FacturaCompraFormValues>,
        defaultValues: getDefaultValues(initialData, empresaObligaciones),
    });

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = form;

    const { fields, append, remove } = useFieldArray<
        FacturaCompraFormValues,
        "detalles"
    >({
        control: form.control,
        name: "detalles",
    });

    const proveedorId = watch("proveedorId");
    const timbradoId = watch("timbradoId");
    const moneda = watch("moneda");
    const condicion = watch("condicion");
    const detalles = watch("detalles");

    const imputaIva = watch("imputaIva");
    const imputaIre = watch("imputaIre");
    const imputaIrpRsp = watch("imputaIrpRsp");
    const noImputa = watch("noImputa");

    const timbradosFiltrados = useMemo(() => {
        if (!proveedorId) {
            return [];
        }

        return timbrados.filter(
            (timbrado) => timbrado.proveedorId === proveedorId
        );
    }, [proveedorId, timbrados]);

    const timbradoSeleccionado = useMemo(() => {
        return timbrados.find((timbrado) => timbrado.id === timbradoId);
    }, [timbradoId, timbrados]);

    const totales = calcularTotalesCompra(detalles);

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

    useEffect(() => {
        if (!timbradoSeleccionado) {
            return;
        }

        if (
            isEditMode &&
            timbradoSeleccionado.id === timbradoInicialRef.current
        ) {
            return;
        }

        if (timbradoSeleccionado.establecimiento) {
            setValue("establecimiento", timbradoSeleccionado.establecimiento);
        }

        if (timbradoSeleccionado.puntoExpedicion) {
            setValue("puntoExpedicion", timbradoSeleccionado.puntoExpedicion);
        }
    }, [isEditMode, timbradoSeleccionado, setValue]);

    useEffect(() => {
        if (!proveedorId) {
            return;
        }

        if (isEditMode && proveedorId === proveedorInicialRef.current) {
            return;
        }

        setValue("timbradoId", "");
        setValue("establecimiento", "");
        setValue("puntoExpedicion", "");
        setValue("numeroComprobante", "");
    }, [isEditMode, proveedorId, setValue]);

    const onSubmit: SubmitHandler<FacturaCompraFormValues> = (values) => {
        setFormError(null);

        startTransition(async () => {
            const response =
                isEditMode && facturaId
                    ? await updateFacturaCompraAction(facturaId, values)
                    : await createFacturaCompraAction(values);

            if (!response.ok) {
                setFormError(response.message);
                return;
            }

            toast.success(response.message);

            router.push("/facturas-compra");
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

            <FacturaCompraDatosGenerales
                register={register}
                control={form.control}
                errors={errors}
                proveedores={proveedores}
                sucursales={sucursales}
                timbradosFiltrados={timbradosFiltrados}
                proveedorId={proveedorId}
                moneda={moneda}
                condicion={condicion}
            />

            <ComprobanteImputacionTributaria
                imputaIva={imputaIva}
                imputaIre={imputaIre}
                imputaIrpRsp={imputaIrpRsp}
                noImputa={noImputa}
                mostrarIva={empresaObligaciones.obligacionIvaGeneral}
                mostrarIre={empresaObligaciones.tieneIre}
                mostrarIrpRsp={empresaObligaciones.tieneIrpRsp}
                mostrarNoImputa
                error={errors.imputaIva?.message}
                onChange={(field, value) => {
                    setValue(field, value, {
                        shouldDirty: true,
                        shouldValidate: true,
                    });
                }}
            />

            <FacturaCompraDetalleTable
                fields={fields}
                control={form.control}
                register={register}
                errors={errors}
                detalles={detalles}
                moneda={moneda}
                cuentasContables={cuentasContables}
                append={append}
                remove={remove}
            />

            <FacturaCompraTotales totales={totales} moneda={moneda} />

            <FacturaCompraActions
                isPending={isPending}
                submitLabel={
                    isEditMode ? "Actualizar factura" : "Guardar factura"
                }
            />
        </form>
    );
}