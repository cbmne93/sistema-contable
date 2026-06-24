/*
  Warnings:

  - A unique constraint covering the columns `[empresaId,tipoMovimiento,tipoComprobante,establecimiento,puntoExpedicion,numeroComprobante]` on the table `Comprobante` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "EstadoComprobante" AS ENUM ('BORRADOR', 'EMITIDO', 'ANULADO');

-- AlterTable
ALTER TABLE "Comprobante" ADD COLUMN     "estado" "EstadoComprobante" NOT NULL DEFAULT 'EMITIDO';

-- CreateIndex
CREATE UNIQUE INDEX "Comprobante_empresaId_tipoMovimiento_tipoComprobante_establ_key" ON "Comprobante"("empresaId", "tipoMovimiento", "tipoComprobante", "establecimiento", "puntoExpedicion", "numeroComprobante");
