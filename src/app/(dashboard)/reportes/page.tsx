import Link from "next/link";
import {
    ArrowRight,
    BookOpenText,
    FileSpreadsheet,
    Landmark,
} from "lucide-react";

const reportes = [
    {
        title: "Libro de compras",
        description:
            "Consulte compras por mes, proveedor o rango de fechas. Incluye exportación Excel y PDF.",
        href: "/reportes/libro-compras",
        icon: BookOpenText,
        badge: "Compras",
    },
    {
        title: "Libro de ventas",
        description:
            "Consulte ventas por mes, cliente o rango de fechas para control interno.",
        href: "/reportes/libro-ventas",
        icon: FileSpreadsheet,
        badge: "Ventas",
    },
    {
        title: "Registro de comprobantes - DNIT",
        description:
            "Genere versiones para importar comprobantes en Marangatu por compras, ventas o todos.",
        href: "/reportes/marangatu",
        icon: Landmark,
        badge: "Marangatu",
    },
];

export default function ReportesPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
                    <BookOpenText className="h-5 w-5" />
                </div>

                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Reportes
                    </h1>

                    <p className="text-sm text-slate-500">
                        Consulte libros, exportaciones y registros para DNIT.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {reportes.map((reporte) => {
                    const Icon = reporte.icon;

                    return (
                        <Link
                            key={reporte.href}
                            href={reporte.href}
                            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition group-hover:bg-slate-900 group-hover:text-white">
                                    <Icon className="h-5 w-5" />
                                </div>

                                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
                                    {reporte.badge}
                                </span>
                            </div>

                            <div className="mt-5">
                                <h2 className="text-base font-semibold text-slate-900">
                                    {reporte.title}
                                </h2>

                                <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                                    {reporte.description}
                                </p>
                            </div>

                            <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition group-hover:text-slate-950">
                                Abrir reporte
                                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}