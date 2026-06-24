"use client";

import { useRouter, useSearchParams } from "next/navigation";

const MONTHS = [
    { value: "all", label: "Todos los meses" },
    { value: "1", label: "Enero" },
    { value: "2", label: "Febrero" },
    { value: "3", label: "Marzo" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Mayo" },
    { value: "6", label: "Junio" },
    { value: "7", label: "Julio" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Septiembre" },
    { value: "10", label: "Octubre" },
    { value: "11", label: "Noviembre" },
    { value: "12", label: "Diciembre" },
];

interface MonthFilterProps {
    basePath: string;
    value: string;
}

export function MonthFilter({ basePath, value }: MonthFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleChange = (month: string) => {
        const params = new URLSearchParams(searchParams.toString());

        params.set("month", month);
        params.delete("page");

        router.push(`${basePath}?${params.toString()}`);
    };

    return (
        <div className="flex items-center gap-2">
            <label
                htmlFor="month-filter"
                className="text-sm font-medium text-slate-600"
            >
                Mes
            </label>

            <select
                id="month-filter"
                value={value}
                onChange={(event) => handleChange(event.target.value)}
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-slate-400"
            >
                {MONTHS.map((month) => (
                    <option key={month.value} value={month.value}>
                        {month.label}
                    </option>
                ))}
            </select>
        </div>
    );
}