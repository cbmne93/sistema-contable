import type {
    UseFormRegister,
    UseFormSetValue,
    UseFormWatch,
} from "react-hook-form";

import type { EmpresaFormValues } from "../validations";

interface EmpresaObligacionesTributariasProps {
    register: UseFormRegister<EmpresaFormValues>;
    watch: UseFormWatch<EmpresaFormValues>;
    setValue: UseFormSetValue<EmpresaFormValues>;
}

const obligaciones = [
    {
        name: "obligacionIvaGeneral",
        label: "Contribuyente IVA General",
        grupo: "IVA",
    },
    {
        name: "obligacionIrpServicios",
        label: "I.R.P. - Prestación de servicios",
        grupo: "IRP",
    },
    {
        name: "obligacionIreGeneral",
        label: "I.R.E. (General)",
        grupo: "IRE",
    },
    {
        name: "obligacionIrpCapital",
        label: "I.R.P. - Renta y Ganancia de Capital",
        grupo: "IRP",
    },
    {
        name: "obligacionIreSimple",
        label: "I.R.E. (Simple)",
        grupo: "IRE",
    },
    {
        name: "obligacionIdu",
        label: "I.D.U.",
        grupo: "OTROS",
    },
    {
        name: "obligacionIreResimple",
        label: "I.R.E. (Resimple)",
        grupo: "IRE",
    },
    {
        name: "obligacionInr",
        label: "I.N.R. (Empresas extranjeras)",
        grupo: "OTROS",
    },
] as const;

const ireFields = [
    "obligacionIreGeneral",
    "obligacionIreSimple",
    "obligacionIreResimple",
] as const;

export function EmpresaObligacionesTributarias({
    register,
    watch,
    setValue,
}: EmpresaObligacionesTributariasProps) {
    const values = watch();

    const handleIreChange = (
        fieldName: (typeof ireFields)[number],
        checked: boolean
    ) => {
        if (!checked) {
            setValue(fieldName, false, {
                shouldDirty: true,
                shouldValidate: true,
            });

            return;
        }

        ireFields.forEach((ireField) => {
            setValue(ireField, ireField === fieldName, {
                shouldDirty: true,
                shouldValidate: true,
            });
        });
    };

    return (
        <section className="rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-4 py-3">
                <h2 className="text-sm font-semibold text-slate-900">
                    Tipo de contribuyente
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                    Seleccione las obligaciones tributarias de la empresa.
                </p>
            </div>

            <div className="grid gap-2 p-4 md:grid-cols-2">
                {obligaciones.map((obligacion) => {
                    const isIre = obligacion.grupo === "IRE";
                    const fieldName = obligacion.name;

                    return (
                        <label
                            key={fieldName}
                            className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
                        >
                            <input
                                type="checkbox"
                                {...register(fieldName)}
                                checked={Boolean(values[fieldName])}
                                onChange={(event) => {
                                    if (isIre) {
                                        handleIreChange(
                                            fieldName as (typeof ireFields)[number],
                                            event.target.checked
                                        );

                                        return;
                                    }

                                    setValue(fieldName, event.target.checked, {
                                        shouldDirty: true,
                                        shouldValidate: true,
                                    });
                                }}
                                className="h-4 w-4 rounded border-slate-300 text-slate-900"
                            />

                            <span>{obligacion.label}</span>
                        </label>
                    );
                })}
            </div>
        </section>
    );
}