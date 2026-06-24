import Link from "next/link";
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    Download,
    FileArchive,
    FileText,
    Hash,
    ReceiptText,
    XCircle,
} from "lucide-react";

import { getMarangatuRegistroByIdAction } from "@/features/reportes/marangatu/actions";

interface MarangatuDetallePageProps {
    params: Promise<{
        id: string;
    }>;
}

const MONTH_LABELS = [
    "",
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
];

function formatDate(value: string) {
    return new Intl.DateTimeFormat("es-PY", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
}

function formatTipoInforme(value: string) {
    if (value === "TODOS") return "Todos";
    if (value === "COMPRAS") return "Compras";
    if (value === "VENTAS") return "Ventas";
    if (value === "EGRESOS") return "Egresos";
    if (value === "INGRESOS") return "Ingresos";

    return value;
}

export default async function MarangatuDetallePage({
    params,
}: MarangatuDetallePageProps) {
    const { id } = await params;

    const response = await getMarangatuRegistroByIdAction(id);

    if (!response.ok || !response.registro) {
        return (
            <div className="space-y-5">
                <Link
                    href="/reportes/marangatu"
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver
                </Link>

                <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                    {response.message}
                </div>
            </div>
        );
    }

    const registro = response.registro;
    const isAnulado = registro.estado === "ANULADO";

    return (
        <div className="space-y-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <Link
                        href="/reportes/marangatu"
                        className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver
                    </Link>

                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
                            <FileArchive className="h-5 w-5" />
                        </div>

                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                    Archivo versión{" "}
                                    {String(registro.version).padStart(3, "0")}
                                </h1>

                                <span
                                    className={
                                        isAnulado
                                            ? "inline-flex rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700"
                                            : "inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"
                                    }
                                >
                                    {isAnulado ? "Anulado" : "Generado"}
                                </span>
                            </div>

                            <p className="text-sm text-slate-500">
                                {registro.codigo} ·{" "}
                                {MONTH_LABELS[registro.mes]} {registro.anio} ·{" "}
                                {formatTipoInforme(registro.tipoInforme)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
                <div className="space-y-5">
                    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Código
                                    </p>
                                    <p className="mt-2 text-2xl font-bold text-slate-900">
                                        {registro.codigo}
                                    </p>
                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                                    <Hash className="h-4 w-4" />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Periodo
                                    </p>
                                    <p className="mt-2 text-2xl font-bold text-slate-900">
                                        {String(registro.mes).padStart(2, "0")}/
                                        {registro.anio}
                                    </p>
                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                                    <CalendarDays className="h-4 w-4" />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Compras
                                    </p>
                                    <p className="mt-2 text-2xl font-bold text-slate-900">
                                        {registro.registrosCompra}
                                    </p>
                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                                    <ReceiptText className="h-4 w-4" />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Ventas
                                    </p>
                                    <p className="mt-2 text-2xl font-bold text-slate-900">
                                        {registro.registrosVenta}
                                    </p>
                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                                    <FileText className="h-4 w-4" />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-start gap-3">
                            <div
                                className={
                                    isAnulado
                                        ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-700"
                                        : "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"
                                }
                            >
                                {isAnulado ? (
                                    <XCircle className="h-5 w-5" />
                                ) : (
                                    <CheckCircle2 className="h-5 w-5" />
                                )}
                            </div>

                            <div>
                                <h2 className="text-base font-semibold text-slate-900">
                                    {isAnulado
                                        ? "Registro anulado"
                                        : "Información generada correctamente"}
                                </h2>

                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                    {isAnulado ? (
                                        <>
                                            Esta versión fue anulada. Sus líneas
                                            generadas fueron eliminadas y los
                                            comprobantes quedaron disponibles
                                            para una nueva generación.
                                        </>
                                    ) : (
                                        <>
                                            Esta versión contiene{" "}
                                            <span className="font-semibold text-slate-900">
                                                {registro.totalLineas}
                                            </span>{" "}
                                            líneas generadas y guardadas. Las
                                            líneas no se muestran en pantalla
                                            para mantener la vista rápida y
                                            evitar cargar datos innecesarios.
                                        </>
                                    )}
                                </p>

                                <p className="mt-3 text-sm text-slate-500">
                                    Generado el{" "}
                                    <span className="font-medium text-slate-700">
                                        {formatDate(registro.fechaGeneracion)}
                                    </span>
                                    {registro.fechaAnulacion
                                        ? ` · Anulado el ${formatDate(
                                            registro.fechaAnulacion
                                        )}`
                                        : ""}
                                </p>
                            </div>
                        </div>
                    </section>
                </div>

                <aside className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-5 py-4">
                        <h2 className="text-base font-semibold text-slate-900">
                            Archivos disponibles
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            {isAnulado
                                ? "Este registro ya no tiene archivos disponibles."
                                : "Genere el archivo ZIP para importar en Marangatu."}
                        </p>
                    </div>

                    <div className="space-y-3 p-5">
                        {!isAnulado ? (
                            <>
                                <a
                                    href={`/reportes/marangatu/${registro.id}/zip-csv`}
                                    className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
                                >
                                    <Download className="h-4 w-4" />
                                    Generar ZIP CSV
                                </a>

                                <a
                                    href={`/reportes/marangatu/${registro.id}/zip-txt`}
                                    className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                                >
                                    <Download className="h-4 w-4" />
                                    Generar ZIP TXT
                                </a>

                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-500">
                                    El ZIP usa el formato oficial:{" "}
                                    <span className="font-semibold text-slate-700">
                                        RUC_REG_MMAAAA_ID.zip
                                    </span>
                                    . Dentro se incluye el archivo CSV o TXT con
                                    codificación UTF-8.
                                </div>
                            </>
                        ) : (
                            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-700">
                                Este registro fue anulado. No hay archivos
                                disponibles para descargar.
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
}