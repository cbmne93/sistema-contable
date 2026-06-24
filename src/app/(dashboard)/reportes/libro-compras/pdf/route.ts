import { NextRequest } from "next/server";

import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";
import { getLibroComprasAction } from "@/features/reportes/libro-compras/actions";
import { createReportPdfBuffer } from "@/features/reportes/pdf";
import { prisma } from "@/lib/prisma";

import type {
    Content,
    TableCell,
    TDocumentDefinitions,
} from "pdfmake/interfaces";

export const runtime = "nodejs";

function formatDate(value: Date | string) {
    return new Intl.DateTimeFormat("es-PY", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "UTC",
    }).format(new Date(value));
}

function formatCurrency(value: number) {
    return `Gs. ${new Intl.NumberFormat("es-PY", {
        maximumFractionDigits: 0,
    }).format(Number(value ?? 0))}`;
}

function formatFileDate() {
    return new Date().toISOString().slice(0, 10);
}

function getMonthLabel(month: string) {
    const labels: Record<string, string> = {
        "1": "Enero",
        "2": "Febrero",
        "3": "Marzo",
        "4": "Abril",
        "5": "Mayo",
        "6": "Junio",
        "7": "Julio",
        "8": "Agosto",
        "9": "Septiembre",
        "10": "Octubre",
        "11": "Noviembre",
        "12": "Diciembre",
        all: "Todo el periodo",
    };

    return labels[month] ?? month;
}

function formatEmpresaRuc(empresa: { ruc: string | null; dv: string | null }) {
    if (!empresa.ruc) {
        return "-";
    }

    return `${empresa.ruc}${empresa.dv ? `-${empresa.dv}` : ""}`;
}

function tableHeader(text: string): TableCell {
    return {
        text,
        style: "tableHeader",
        alignment: "center",
    };
}

function textCell(text: string): TableCell {
    return {
        text,
        style: "tableCell",
    };
}

function numberCell(value: number): TableCell {
    return {
        text: formatCurrency(value),
        style: "tableCell",
        alignment: "right",
    };
}

function totalTextCell(text: string): TableCell {
    return {
        text,
        style: "totalCell",
    };
}

function totalNumberCell(value: number): TableCell {
    return {
        text: formatCurrency(value),
        style: "totalCell",
        alignment: "right",
    };
}

function buildEmpresaHeader({
    empresa,
}: {
    empresa: {
        razonSocial: string | null;
        nombreFantasia: string | null;
        ruc: string | null;
        dv: string | null;
        direccion: string | null;
    } | null;
}): Content[] {
    const nombreEmpresa =
        empresa?.razonSocial ?? empresa?.nombreFantasia ?? "Empresa";

    return [
        {
            text: nombreEmpresa,
            style: "empresaNombre",
            alignment: "center",
        },
        {
            text: `RUC: ${empresa ? formatEmpresaRuc(empresa) : "-"}`,
            style: "empresaDato",
            alignment: "center",
            margin: [0, 3, 0, 0],
        },
        {
            text: `Dirección: ${empresa?.direccion ?? "-"}`,
            style: "empresaDato",
            alignment: "center",
            margin: [0, 3, 0, 14],
        },
        {
            text: "LIBRO DE COMPRAS",
            style: "reportTitle",
            alignment: "center",
            margin: [0, 0, 0, 14],
        },
    ];
}

function buildFiltros({
    month,
    fechaDesde,
    fechaHasta,
    comprobantes,
}: {
    month: string;
    fechaDesde: string;
    fechaHasta: string;
    comprobantes: number;
}): Content {
    return {
        table: {
            widths: ["auto", "*", "auto", "*", "auto", "*", "auto", "*"],
            body: [
                [
                    { text: "Mes", style: "filterLabel" },
                    { text: getMonthLabel(month), style: "filterValue" },
                    { text: "Desde", style: "filterLabel" },
                    { text: fechaDesde || "-", style: "filterValue" },
                    { text: "Hasta", style: "filterLabel" },
                    { text: fechaHasta || "-", style: "filterValue" },
                    { text: "Comprobantes", style: "filterLabel" },
                    { text: String(comprobantes), style: "filterValue" },
                ],
            ],
        },
        layout: "lightHorizontalLines",
        margin: [0, 0, 0, 12],
    };
}

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;

    const month = searchParams.get("month") ?? "all";
    const proveedorId = searchParams.get("proveedorId") ?? "";
    const fechaDesde = searchParams.get("fechaDesde") ?? "";
    const fechaHasta = searchParams.get("fechaHasta") ?? "";

    const empresaId = await getEmpresaActivaIdOrThrow();

    const empresa = await prisma.empresa.findUnique({
        where: {
            id: empresaId,
        },
        select: {
            razonSocial: true,
            nombreFantasia: true,
            ruc: true,
            dv: true,
            direccion: true,
        },
    });

    const response = await getLibroComprasAction({
        page: 1,
        limit: 10000,
        search: "",
        month: month as "all" | `${number}`,
        proveedorId,
        fechaDesde,
        fechaHasta,
    });

    if (!response.ok) {
        return new Response(response.message, {
            status: 400,
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
            },
        });
    }

    const body: TableCell[][] = [
        [
            tableHeader("Fecha"),
            tableHeader("Factura"),
            tableHeader("Timbrado"),
            tableHeader("Proveedor"),
            tableHeader("Documento"),
            tableHeader("Exenta"),
            tableHeader("Grav. 5%"),
            tableHeader("IVA 5%"),
            tableHeader("Grav. 10%"),
            tableHeader("IVA 10%"),
            tableHeader("Total"),
        ],
        ...response.registros.map((registro) => [
            textCell(formatDate(registro.fechaEmision)),
            textCell(registro.facturaNumero),
            textCell(registro.numeroTimbrado),
            textCell(registro.proveedorNombre),
            textCell(registro.proveedorDocumento),
            numberCell(registro.exenta),
            numberCell(registro.gravada5),
            numberCell(registro.iva5),
            numberCell(registro.gravada10),
            numberCell(registro.iva10),
            numberCell(registro.total),
        ]),
        [
            totalTextCell(""),
            totalTextCell(""),
            totalTextCell(""),
            totalTextCell(""),
            totalTextCell("TOTALES"),
            totalNumberCell(response.totales.exenta),
            totalNumberCell(response.totales.gravada5),
            totalNumberCell(response.totales.iva5),
            totalNumberCell(response.totales.gravada10),
            totalNumberCell(response.totales.iva10),
            totalNumberCell(response.totales.total),
        ],
    ];

    const docDefinition: TDocumentDefinitions = {
        pageSize: "A4",
        pageOrientation: "landscape",
        pageMargins: [24, 138, 24, 34],

        defaultStyle: {
            font: "Helvetica",
            fontSize: 8,
            color: "#0F172A",
        },

        header: () => ({
            stack: [
                ...buildEmpresaHeader({ empresa }),
                buildFiltros({
                    month,
                    fechaDesde,
                    fechaHasta,
                    comprobantes: response.resumen.cantidadComprobantes,
                }),
            ],
            margin: [24, 24, 24, 0],
        }),

        footer: (currentPage, pageCount) => ({
            text: `Página ${currentPage} de ${pageCount}`,
            alignment: "right",
            margin: [0, 8, 24, 0],
            fontSize: 8,
            color: "#64748B",
        }),

        content: [
            {
                table: {
                    headerRows: 1,
                    widths: [
                        48,
                        70,
                        52,
                        118,
                        62,
                        58,
                        58,
                        52,
                        58,
                        52,
                        62,
                    ],
                    body,
                },
                layout: {
                    fillColor: (rowIndex) => {
                        if (rowIndex === 0) return "#0F172A";
                        if (rowIndex === body.length - 1) return "#F8FAFC";
                        return null;
                    },
                    hLineColor: () => "#E2E8F0",
                    vLineColor: () => "#E2E8F0",
                    hLineWidth: () => 0.5,
                    vLineWidth: () => 0.5,
                    paddingLeft: () => 4,
                    paddingRight: () => 4,
                    paddingTop: () => 4,
                    paddingBottom: () => 4,
                },
            },
        ],

        styles: {
            empresaNombre: {
                fontSize: 12,
                bold: true,
                color: "#0F172A",
            },
            empresaDato: {
                fontSize: 9,
                color: "#334155",
            },
            reportTitle: {
                fontSize: 15,
                bold: true,
                color: "#0F172A",
            },
            filterLabel: {
                bold: true,
                fontSize: 8,
                fillColor: "#F1F5F9",
                color: "#0F172A",
            },
            filterValue: {
                fontSize: 8,
                color: "#334155",
            },
            tableHeader: {
                bold: true,
                fontSize: 7,
                color: "#FFFFFF",
            },
            tableCell: {
                fontSize: 7,
                color: "#0F172A",
            },
            totalCell: {
                bold: true,
                fontSize: 7,
                color: "#0F172A",
            },
        },
    };

    const pdfBuffer = await createReportPdfBuffer(docDefinition);

    const fileName = `libro-compras-${getMonthLabel(month)
        .toLowerCase()
        .replaceAll(" ", "-")}-${formatFileDate()}.pdf`;

    return new Response(new Uint8Array(pdfBuffer), {
        status: 200,
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${fileName}"`,
        },
    });
}