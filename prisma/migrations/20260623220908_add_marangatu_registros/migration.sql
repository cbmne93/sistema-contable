-- CreateEnum
CREATE TYPE "TipoInformeMarangatu" AS ENUM ('TODOS', 'COMPRAS', 'VENTAS', 'EGRESOS', 'INGRESOS');

-- CreateEnum
CREATE TYPE "EstadoMarangatuRegistro" AS ENUM ('GENERADO', 'ANULADO');

-- CreateEnum
CREATE TYPE "TipoRegistroMarangatu" AS ENUM ('VENTA', 'COMPRA', 'INGRESO', 'EGRESO');

-- CreateEnum
CREATE TYPE "FormatoArchivoMarangatu" AS ENUM ('ZIP_CSV', 'ZIP_TXT', 'EXCEL');

-- CreateTable
CREATE TABLE "MarangatuRegistro" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "periodoFiscalId" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "anio" INTEGER NOT NULL,
    "mes" INTEGER NOT NULL,
    "tipoInforme" "TipoInformeMarangatu" NOT NULL,
    "estado" "EstadoMarangatuRegistro" NOT NULL DEFAULT 'GENERADO',
    "registrosCompra" INTEGER NOT NULL DEFAULT 0,
    "registrosVenta" INTEGER NOT NULL DEFAULT 0,
    "registrosEgreso" INTEGER NOT NULL DEFAULT 0,
    "registrosIngreso" INTEGER NOT NULL DEFAULT 0,
    "fechaGeneracion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaAnulacion" TIMESTAMP(3),
    "motivoAnulacion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarangatuRegistro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarangatuRegistroDetalle" (
    "id" TEXT NOT NULL,
    "registroId" TEXT NOT NULL,
    "comprobanteId" TEXT,
    "tipoRegistro" "TipoRegistroMarangatu" NOT NULL,
    "numeroLinea" INTEGER NOT NULL,
    "fechaEmision" TIMESTAMP(3),
    "tipoDocumentoCodigo" TEXT,
    "numeroDocumento" TEXT,
    "nombrePersona" TEXT,
    "tipoComprobanteCodigo" TEXT,
    "numeroTimbrado" TEXT,
    "numeroComprobante" TEXT,
    "gravada10" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "gravada5" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "exenta" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "condicionCodigo" TEXT,
    "monedaExtranjera" BOOLEAN NOT NULL DEFAULT false,
    "imputaIva" BOOLEAN NOT NULL DEFAULT false,
    "imputaIre" BOOLEAN NOT NULL DEFAULT false,
    "imputaIrpRsp" BOOLEAN NOT NULL DEFAULT false,
    "noImputa" BOOLEAN NOT NULL DEFAULT false,
    "numeroComprobanteAsociado" TEXT,
    "timbradoAsociado" TEXT,
    "lineaCsv" TEXT NOT NULL,
    "lineaTxt" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarangatuRegistroDetalle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarangatuRegistroArchivo" (
    "id" TEXT NOT NULL,
    "registroId" TEXT NOT NULL,
    "formato" "FormatoArchivoMarangatu" NOT NULL,
    "nombreArchivo" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "contenidoBase64" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarangatuRegistroArchivo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MarangatuRegistro_empresaId_idx" ON "MarangatuRegistro"("empresaId");

-- CreateIndex
CREATE INDEX "MarangatuRegistro_periodoFiscalId_idx" ON "MarangatuRegistro"("periodoFiscalId");

-- CreateIndex
CREATE INDEX "MarangatuRegistro_anio_mes_idx" ON "MarangatuRegistro"("anio", "mes");

-- CreateIndex
CREATE INDEX "MarangatuRegistro_tipoInforme_idx" ON "MarangatuRegistro"("tipoInforme");

-- CreateIndex
CREATE INDEX "MarangatuRegistro_estado_idx" ON "MarangatuRegistro"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "MarangatuRegistro_empresaId_codigo_key" ON "MarangatuRegistro"("empresaId", "codigo");

-- CreateIndex
CREATE UNIQUE INDEX "MarangatuRegistro_empresaId_anio_mes_version_key" ON "MarangatuRegistro"("empresaId", "anio", "mes", "version");

-- CreateIndex
CREATE INDEX "MarangatuRegistroDetalle_registroId_idx" ON "MarangatuRegistroDetalle"("registroId");

-- CreateIndex
CREATE INDEX "MarangatuRegistroDetalle_comprobanteId_idx" ON "MarangatuRegistroDetalle"("comprobanteId");

-- CreateIndex
CREATE INDEX "MarangatuRegistroDetalle_tipoRegistro_idx" ON "MarangatuRegistroDetalle"("tipoRegistro");

-- CreateIndex
CREATE UNIQUE INDEX "MarangatuRegistroDetalle_registroId_numeroLinea_key" ON "MarangatuRegistroDetalle"("registroId", "numeroLinea");

-- CreateIndex
CREATE INDEX "MarangatuRegistroArchivo_registroId_idx" ON "MarangatuRegistroArchivo"("registroId");

-- CreateIndex
CREATE INDEX "MarangatuRegistroArchivo_formato_idx" ON "MarangatuRegistroArchivo"("formato");

-- AddForeignKey
ALTER TABLE "MarangatuRegistro" ADD CONSTRAINT "MarangatuRegistro_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarangatuRegistro" ADD CONSTRAINT "MarangatuRegistro_periodoFiscalId_fkey" FOREIGN KEY ("periodoFiscalId") REFERENCES "PeriodoFiscal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarangatuRegistroDetalle" ADD CONSTRAINT "MarangatuRegistroDetalle_registroId_fkey" FOREIGN KEY ("registroId") REFERENCES "MarangatuRegistro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarangatuRegistroDetalle" ADD CONSTRAINT "MarangatuRegistroDetalle_comprobanteId_fkey" FOREIGN KEY ("comprobanteId") REFERENCES "Comprobante"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarangatuRegistroArchivo" ADD CONSTRAINT "MarangatuRegistroArchivo_registroId_fkey" FOREIGN KEY ("registroId") REFERENCES "MarangatuRegistro"("id") ON DELETE CASCADE ON UPDATE CASCADE;
