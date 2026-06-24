import { MONTH_OPTIONS } from "@/features/reportes/helpers";

interface LibroVentasFiltersProps {
    month: string;
    clienteId: string;
    fechaDesde: string;
    fechaHasta: string;
    clientes: {
        id: string;
        nombre: string;
        numeroDocumento: string;
        dv: string | null;
    }[];
}

export function LibroVentasFilters({
    month,
    clienteId,
    fechaDesde,
    fechaHasta,
    clientes,
}: LibroVentasFiltersProps) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <form>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[180px_280px_160px_160px_auto] xl:items-end">
                    <div>
                        <label
                            htmlFor="month"
                            className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500"
                        >
                            Mes
                        </label>

                        <select
                            id="month"
                            name="month"
                            defaultValue={month}
                            className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                        >
                            {MONTH_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="clienteId"
                            className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500"
                        >
                            Cliente
                        </label>

                        <select
                            id="clienteId"
                            name="clienteId"
                            defaultValue={clienteId}
                            className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                        >
                            <option value="">Todos los clientes</option>

                            {clientes.map((cliente) => (
                                <option key={cliente.id} value={cliente.id}>
                                    {cliente.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="fechaDesde"
                            className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500"
                        >
                            Desde
                        </label>

                        <input
                            id="fechaDesde"
                            name="fechaDesde"
                            type="date"
                            defaultValue={fechaDesde}
                            className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="fechaHasta"
                            className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500"
                        >
                            Hasta
                        </label>

                        <input
                            id="fechaHasta"
                            name="fechaHasta"
                            type="date"
                            defaultValue={fechaHasta}
                            className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                        />
                    </div>

                    <button
                        type="submit"
                        className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
                    >
                        Generar
                    </button>
                </div>
            </form>
        </div>
    );
}