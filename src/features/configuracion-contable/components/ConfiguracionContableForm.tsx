"use client";

import { type ReactNode, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Building2, ReceiptText, Save, WalletCards } from "lucide-react";
import { toast } from "sonner";

import { updateConfiguracionContableAction } from "../actions";
import type {
    ConfiguracionContableData,
    ConfiguracionContableOptions,
} from "../interfaces";
import type { ConfiguracionContableFormValues } from "../validations";

import { ConfiguracionContableCuentaSelect } from "./ConfiguracionContableCuentaSelect";

interface ConfiguracionContableFormProps {
    configuracion: ConfiguracionContableData | null;
    options: ConfiguracionContableOptions;
}

const defaultValues: ConfiguracionContableFormValues = {
    generarAsientosAutomaticos: false,

    cuentaClientesId: "",
    cuentaProveedoresId: "",

    cuentaCajaId: "",
    cuentaBancoId: "",

    cuentaIvaDebitoFiscal5Id: "",
    cuentaIvaDebitoFiscal10Id: "",

    cuentaIvaCreditoFiscal5Id: "",
    cuentaIvaCreditoFiscal10Id: "",
};

function normalizeInitialValues(
    configuracion: ConfiguracionContableData | null
): ConfiguracionContableFormValues {
    if (!configuracion) {
        return defaultValues;
    }

    return {
        generarAsientosAutomaticos:
            configuracion.generarAsientosAutomaticos ?? false,

        cuentaClientesId: configuracion.cuentaClientesId ?? "",
        cuentaProveedoresId: configuracion.cuentaProveedoresId ?? "",

        cuentaCajaId: configuracion.cuentaCajaId ?? "",
        cuentaBancoId: configuracion.cuentaBancoId ?? "",

        cuentaIvaDebitoFiscal5Id:
            configuracion.cuentaIvaDebitoFiscal5Id ?? "",
        cuentaIvaDebitoFiscal10Id:
            configuracion.cuentaIvaDebitoFiscal10Id ?? "",

        cuentaIvaCreditoFiscal5Id:
            configuracion.cuentaIvaCreditoFiscal5Id ?? "",
        cuentaIvaCreditoFiscal10Id:
            configuracion.cuentaIvaCreditoFiscal10Id ?? "",
    };
}

function SectionCard({
    title,
    description,
    icon,
    children,
}: {
    title: string;
    description: string;
    icon: ReactNode;
    children: ReactNode;
}) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    {icon}
                </div>

                <div>
                    <h2 className="text-base font-semibold text-slate-900">
                        {title}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        {description}
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">{children}</div>
        </section>
    );
}

export function ConfiguracionContableForm({
    configuracion,
    options,
}: ConfiguracionContableFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [values, setValues] = useState<ConfiguracionContableFormValues>(() =>
        normalizeInitialValues(configuracion)
    );

    const updateValue = (
        key: keyof ConfiguracionContableFormValues,
        value: string | boolean
    ) => {
        setValues((currentValues) => ({
            ...currentValues,
            [key]: value,
        }));
    };

    const handleSubmit = () => {
        startTransition(async () => {
            const response = await updateConfiguracionContableAction(values);

            if (!response.ok) {
                toast.error(response.message);
                return;
            }

            toast.success(response.message);
            router.refresh();
        });
    };

    return (
        <div className="space-y-5">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <label className="flex cursor-pointer items-start gap-3">
                    <input
                        type="checkbox"
                        checked={values.generarAsientosAutomaticos}
                        onChange={(event) =>
                            updateValue(
                                "generarAsientosAutomaticos",
                                event.target.checked
                            )
                        }
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                    />

                    <span>
                        <span className="block text-sm font-semibold text-slate-900">
                            Generar asientos automáticos
                        </span>

                        <span className="mt-1 block text-sm text-slate-500">
                            Si está activado, las facturas de compra y venta
                            exigirán cuenta contable en cada detalle. Si está
                            desactivado, la cuenta contable será opcional.
                        </span>
                    </span>
                </label>
            </section>

            <SectionCard
                title="Cuentas principales"
                description="Defina las cuentas base que se usarán según la condición del comprobante."
                icon={<Building2 className="h-5 w-5" />}
            >
                <ConfiguracionContableCuentaSelect
                    label="Cuenta clientes"
                    description="Se usará en ventas a crédito."
                    value={values.cuentaClientesId}
                    cuentas={options.cuentas}
                    onChange={(value) =>
                        updateValue("cuentaClientesId", value)
                    }
                />

                <ConfiguracionContableCuentaSelect
                    label="Cuenta proveedores"
                    description="Se usará en compras a crédito."
                    value={values.cuentaProveedoresId}
                    cuentas={options.cuentas}
                    onChange={(value) =>
                        updateValue("cuentaProveedoresId", value)
                    }
                />

                <ConfiguracionContableCuentaSelect
                    label="Cuenta caja"
                    description="Se usará en ventas o compras al contado."
                    value={values.cuentaCajaId}
                    cuentas={options.cuentas}
                    onChange={(value) => updateValue("cuentaCajaId", value)}
                />

                <ConfiguracionContableCuentaSelect
                    label="Cuenta banco"
                    description="Reservada para futuros pagos y cobranzas bancarias."
                    value={values.cuentaBancoId}
                    cuentas={options.cuentas}
                    onChange={(value) => updateValue("cuentaBancoId", value)}
                />
            </SectionCard>

            <SectionCard
                title="IVA ventas"
                description="Configure las cuentas del IVA débito fiscal generado por facturas de venta."
                icon={<ReceiptText className="h-5 w-5" />}
            >
                <ConfiguracionContableCuentaSelect
                    label="IVA débito fiscal 5%"
                    value={values.cuentaIvaDebitoFiscal5Id}
                    cuentas={options.cuentas}
                    onChange={(value) =>
                        updateValue("cuentaIvaDebitoFiscal5Id", value)
                    }
                />

                <ConfiguracionContableCuentaSelect
                    label="IVA débito fiscal 10%"
                    value={values.cuentaIvaDebitoFiscal10Id}
                    cuentas={options.cuentas}
                    onChange={(value) =>
                        updateValue("cuentaIvaDebitoFiscal10Id", value)
                    }
                />
            </SectionCard>

            <SectionCard
                title="IVA compras"
                description="Configure las cuentas del IVA crédito fiscal generado por facturas de compra."
                icon={<WalletCards className="h-5 w-5" />}
            >
                <ConfiguracionContableCuentaSelect
                    label="IVA crédito fiscal 5%"
                    value={values.cuentaIvaCreditoFiscal5Id}
                    cuentas={options.cuentas}
                    onChange={(value) =>
                        updateValue("cuentaIvaCreditoFiscal5Id", value)
                    }
                />

                <ConfiguracionContableCuentaSelect
                    label="IVA crédito fiscal 10%"
                    value={values.cuentaIvaCreditoFiscal10Id}
                    cuentas={options.cuentas}
                    onChange={(value) =>
                        updateValue("cuentaIvaCreditoFiscal10Id", value)
                    }
                />
            </SectionCard>

            <div className="sticky bottom-4 flex justify-end">
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isPending}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <Save className="h-4 w-4" />
                    {isPending ? "Guardando..." : "Guardar configuración"}
                </button>
            </div>
        </div>
    );
}