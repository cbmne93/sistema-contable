import JSZip from "jszip";
import { type NextRequest } from "next/server";

import { getEmpresaActivaIdOrThrow } from "@/features/empresas/helpers";
import { getMarangatuFileName } from "@/features/reportes/marangatu/helpers";
import { prisma } from "@/lib/prisma";

interface RouteParams {
    params: Promise<{
        id: string;
    }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
    const { id } = await params;

    try {
        const empresaId = await getEmpresaActivaIdOrThrow();

        const registro = await prisma.marangatuRegistro.findFirst({
            where: {
                id,
                empresaId,
            },
            select: {
                codigo: true,
                anio: true,
                mes: true,
                estado: true,
                empresa: {
                    select: {
                        ruc: true,
                    },
                },
                detalles: {
                    select: {
                        lineaCsv: true,
                    },
                    orderBy: {
                        numeroLinea: "asc",
                    },
                },
            },
        });

        if (!registro) {
            return new Response("No se encontró la versión generada.", {
                status: 404,
            });
        }

        if (registro.estado === "ANULADO") {
            return new Response("No se puede descargar un registro anulado.", {
                status: 400,
            });
        }

        if (registro.detalles.length === 0) {
            return new Response("El registro no tiene líneas para descargar.", {
                status: 400,
            });
        }

        const csvFileName = getMarangatuFileName({
            ruc: registro.empresa.ruc,
            anio: registro.anio,
            mes: registro.mes,
            codigo: registro.codigo,
            extension: "csv",
        });

        const zipFileName = getMarangatuFileName({
            ruc: registro.empresa.ruc,
            anio: registro.anio,
            mes: registro.mes,
            codigo: registro.codigo,
            extension: "zip",
        });

        const content = `${registro.detalles
            .map((detalle) => detalle.lineaCsv)
            .join("\r\n")}\r\n`;

        const zip = new JSZip();

        zip.file(csvFileName, content);

        const zipContent = await zip.generateAsync({
            type: "arraybuffer",
            compression: "DEFLATE",
            compressionOptions: {
                level: 9,
            },
        });

        return new Response(zipContent, {
            headers: {
                "Content-Type": "application/zip",
                "Content-Disposition": `attachment; filename="${zipFileName}"`,
                "Cache-Control": "no-store",
            },
        });
    } catch (error) {
        console.error("Error al descargar ZIP CSV Marangatu:", error);

        return new Response("No se pudo descargar el archivo ZIP CSV.", {
            status: 500,
        });
    }
}