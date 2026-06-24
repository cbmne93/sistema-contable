import { createRequire } from "node:module";

import type { TDocumentDefinitions } from "pdfmake/interfaces";

const require = createRequire(import.meta.url);

type PdfMakeFonts = Record<
    string,
    {
        normal: string;
        bold: string;
        italics: string;
        bolditalics: string;
    }
>;

type PdfKitDocument = {
    on(event: "data", listener: (chunk: Buffer) => void): PdfKitDocument;
    on(event: "end", listener: () => void): PdfKitDocument;
    on(event: "error", listener: (error: Error) => void): PdfKitDocument;
    end(): void;
};

type PdfPrinterConstructor = new (fonts: PdfMakeFonts) => {
    createPdfKitDocument: (
        docDefinition: TDocumentDefinitions
    ) => PdfKitDocument;
};

const PdfPrinter = require("pdfmake") as PdfPrinterConstructor;

const fonts: PdfMakeFonts = {
    Helvetica: {
        normal: "Helvetica",
        bold: "Helvetica-Bold",
        italics: "Helvetica-Oblique",
        bolditalics: "Helvetica-BoldOblique",
    },
};

export function createReportPdfBuffer(
    docDefinition: TDocumentDefinitions
): Promise<Buffer> {
    const printer = new PdfPrinter(fonts);
    const pdfDoc = printer.createPdfKitDocument(docDefinition);

    const chunks: Buffer[] = [];

    return new Promise((resolve, reject) => {
        pdfDoc.on("data", (chunk: Buffer) => {
            chunks.push(chunk);
        });

        pdfDoc.on("end", () => {
            resolve(Buffer.concat(chunks));
        });

        pdfDoc.on("error", reject);

        pdfDoc.end();
    });
}