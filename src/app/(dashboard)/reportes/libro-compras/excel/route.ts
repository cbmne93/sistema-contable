import { NextRequest } from "next/server";
import ExcelJS from "exceljs";

import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";
import { getLibroComprasAction } from "@/features/reportes/libro-compras/actions";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function formatDate(value: Date | string) {
    return new Intl.DateTimeFormat("es-PY", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "UTC",
    }).format(new Date(value));
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

function applyBorder(cell: ExcelJS.Cell) {
    cell.border = {
        top: { style: "thin", color: { argb: "FFE2E8F0" } },
        left: { style: "thin", color: { argb: "FFE2E8F0" } },
        bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
        right: { style: "thin", color: { argb: "FFE2E8F0" } },
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

    const workbook = new ExcelJS.Workbook();

    workbook.creator = "Sistema Contable";
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet("Libro de compras", {
        views: [{ state: "frozen", ySplit: 9 }],
        pageSetup: {
            orientation: "landscape",
            fitToPage: true,
            fitToWidth: 1,
            fitToHeight: 0,
        },
    });

    worksheet.mergeCells("A1:K1");
    worksheet.getCell("A1").value =
        empresa?.razonSocial ?? empresa?.nombreFantasia ?? "Empresa";
    worksheet.getCell("A1").font = {
        bold: true,
        size: 14,
        color: { argb: "FF0F172A" },
    };
    worksheet.getCell("A1").alignment = {
        horizontal: "center",
        vertical: "middle",
    };

    worksheet.mergeCells("A2:K2");
    worksheet.getCell("A2").value = `RUC: ${empresa ? formatEmpresaRuc(empresa) : "-"
        }`;
    worksheet.getCell("A2").font = {
        size: 11,
        color: { argb: "FF334155" },
    };
    worksheet.getCell("A2").alignment = {
        horizontal: "center",
    };

    worksheet.mergeCells("A3:K3");
    worksheet.getCell("A3").value = `Dirección: ${empresa?.direccion ?? "-"}`;
    worksheet.getCell("A3").font = {
        size: 11,
        color: { argb: "FF334155" },
    };
    worksheet.getCell("A3").alignment = {
        horizontal: "center",
    };

    worksheet.mergeCells("A5:K5");
    worksheet.getCell("A5").value = "LIBRO DE COMPRAS";
    worksheet.getCell("A5").font = {
        bold: true,
        size: 16,
        color: { argb: "FF0F172A" },
    };
    worksheet.getCell("A5").alignment = {
        horizontal: "center",
        vertical: "middle",
    };

    worksheet.getCell("A7").value = "Mes";
    worksheet.getCell("B7").value = getMonthLabel(month);

    worksheet.getCell("D7").value = "Desde";
    worksheet.getCell("E7").value = fechaDesde || "-";

    worksheet.getCell("G7").value = "Hasta";
    worksheet.getCell("H7").value = fechaHasta || "-";

    worksheet.getCell("J7").value = "Comprobantes";
    worksheet.getCell("K7").value = response.resumen.cantidadComprobantes;

    ["A7", "D7", "G7", "J7"].forEach((cellRef) => {
        worksheet.getCell(cellRef).font = { bold: true };
    });

    const headerRow = worksheet.getRow(9);

    headerRow.values = [
        "Fecha",
        "Factura",
        "Timbrado",
        "Proveedor",
        "Documento",
        "Exenta",
        "Gravada 5%",
        "IVA 5%",
        "Gravada 10%",
        "IVA 10%",
        "Total",
    ];

    headerRow.font = {
        bold: true,
        color: { argb: "FF0F172A" },
    };

    headerRow.alignment = {
        horizontal: "center",
        vertical: "middle",
    };

    headerRow.height = 22;

    response.registros.forEach((registro) => {
        worksheet.addRow([
            formatDate(registro.fechaEmision),
            registro.facturaNumero,
            registro.numeroTimbrado,
            registro.proveedorNombre,
            registro.proveedorDocumento,
            registro.exenta,
            registro.gravada5,
            registro.iva5,
            registro.gravada10,
            registro.iva10,
            registro.total,
        ]);
    });

    const totalRow = worksheet.addRow([
        "",
        "",
        "",
        "",
        "TOTALES",
        response.totales.exenta,
        response.totales.gravada5,
        response.totales.iva5,
        response.totales.gravada10,
        response.totales.iva10,
        response.totales.total,
    ]);

    totalRow.font = {
        bold: true,
        color: { argb: "FF0F172A" },
    };

    worksheet.columns = [
        { key: "fecha", width: 13 },
        { key: "factura", width: 18 },
        { key: "timbrado", width: 14 },
        { key: "proveedor", width: 32 },
        { key: "documento", width: 16 },
        { key: "exenta", width: 15 },
        { key: "gravada5", width: 15 },
        { key: "iva5", width: 15 },
        { key: "gravada10", width: 15 },
        { key: "iva10", width: 15 },
        { key: "total", width: 16 },
    ];

    worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, colNumber) => {
            applyBorder(cell);

            if (rowNumber >= 10 && colNumber >= 6) {
                cell.numFmt = "#,##0";
                cell.alignment = {
                    horizontal: "right",
                    vertical: "middle",
                };
            }

            if (rowNumber >= 10 && colNumber < 6) {
                cell.alignment = {
                    horizontal: "left",
                    vertical: "middle",
                };
            }
        });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    const fileName = `libro-compras-${getMonthLabel(month)
        .toLowerCase()
        .replaceAll(" ", "-")}-${formatFileDate()}.xlsx`;

    return new Response(buffer as BodyInit, {
        status: 200,
        headers: {
            "Content-Type":
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": `attachment; filename="${fileName}"`,
        },
    });
}