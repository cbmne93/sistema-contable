/*
  Warnings:

  - You are about to drop the column `descripcion` on the `AsientoContable` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[empresaId,periodoFiscalId,numero]` on the table `AsientoContable` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `concepto` to the `AsientoContable` table without a default value. This is not possible if the table is not empty.
  - Added the required column `periodoFiscalId` to the `AsientoContable` table without a default value. This is not possible if the table is not empty.
  - Added the required column `naturaleza` to the `CuentaContable` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nivel` to the `CuentaContable` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo` to the `CuentaContable` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TipoCuentaContable" AS ENUM ('ACTIVO', 'PASIVO', 'PATRIMONIO', 'INGRESO', 'EGRESO');

-- CreateEnum
CREATE TYPE "NaturalezaCuentaContable" AS ENUM ('DEUDORA', 'ACREEDORA');

-- CreateEnum
CREATE TYPE "MonedaCuentaContable" AS ENUM ('LOCAL', 'EXTRANJERA');

-- CreateEnum
CREATE TYPE "EstadoAsientoContable" AS ENUM ('BORRADOR', 'CONFIRMADO', 'ANULADO');

-- CreateEnum
CREATE TYPE "OrigenAsientoContable" AS ENUM ('MANUAL', 'VENTA', 'COMPRA', 'AJUSTE', 'CIERRE', 'APERTURA');

-- DropForeignKey
ALTER TABLE "AsientoContable" DROP CONSTRAINT "AsientoContable_empresaId_fkey";

-- DropForeignKey
ALTER TABLE "AsientoDetalle" DROP CONSTRAINT "AsientoDetalle_asientoId_fkey";

-- DropForeignKey
ALTER TABLE "ComprobanteDetalle" DROP CONSTRAINT "ComprobanteDetalle_comprobanteId_fkey";

-- DropForeignKey
ALTER TABLE "CuentaContable" DROP CONSTRAINT "CuentaContable_empresaId_fkey";

-- DropIndex
DROP INDEX "AsientoContable_empresaId_numero_key";

-- AlterTable
ALTER TABLE "AsientoContable" DROP COLUMN "descripcion",
ADD COLUMN     "concepto" TEXT NOT NULL,
ADD COLUMN     "estado" "EstadoAsientoContable" NOT NULL DEFAULT 'BORRADOR',
ADD COLUMN     "origen" "OrigenAsientoContable" NOT NULL DEFAULT 'MANUAL',
ADD COLUMN     "periodoFiscalId" TEXT NOT NULL,
ADD COLUMN     "sucursalId" TEXT,
ADD COLUMN     "totalDebe" DECIMAL(18,2) NOT NULL DEFAULT 0,
ADD COLUMN     "totalHaber" DECIMAL(18,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "CuentaContable" ADD COLUMN     "aceptaMovimiento" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "cuentaPadreId" TEXT,
ADD COLUMN     "moneda" "MonedaCuentaContable" NOT NULL DEFAULT 'LOCAL',
ADD COLUMN     "naturaleza" "NaturalezaCuentaContable" NOT NULL,
ADD COLUMN     "nivel" INTEGER NOT NULL,
ADD COLUMN     "requiereAjusteCambio" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tipo" "TipoCuentaContable" NOT NULL;

-- CreateIndex
CREATE INDEX "AsientoContable_periodoFiscalId_idx" ON "AsientoContable"("periodoFiscalId");

-- CreateIndex
CREATE INDEX "AsientoContable_sucursalId_idx" ON "AsientoContable"("sucursalId");

-- CreateIndex
CREATE INDEX "AsientoContable_origen_idx" ON "AsientoContable"("origen");

-- CreateIndex
CREATE INDEX "AsientoContable_estado_idx" ON "AsientoContable"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "AsientoContable_empresaId_periodoFiscalId_numero_key" ON "AsientoContable"("empresaId", "periodoFiscalId", "numero");

-- CreateIndex
CREATE INDEX "CuentaContable_cuentaPadreId_idx" ON "CuentaContable"("cuentaPadreId");

-- CreateIndex
CREATE INDEX "CuentaContable_tipo_idx" ON "CuentaContable"("tipo");

-- CreateIndex
CREATE INDEX "CuentaContable_estado_idx" ON "CuentaContable"("estado");

-- AddForeignKey
ALTER TABLE "CuentaContable" ADD CONSTRAINT "CuentaContable_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CuentaContable" ADD CONSTRAINT "CuentaContable_cuentaPadreId_fkey" FOREIGN KEY ("cuentaPadreId") REFERENCES "CuentaContable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComprobanteDetalle" ADD CONSTRAINT "ComprobanteDetalle_comprobanteId_fkey" FOREIGN KEY ("comprobanteId") REFERENCES "Comprobante"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsientoContable" ADD CONSTRAINT "AsientoContable_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsientoContable" ADD CONSTRAINT "AsientoContable_periodoFiscalId_fkey" FOREIGN KEY ("periodoFiscalId") REFERENCES "PeriodoFiscal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsientoContable" ADD CONSTRAINT "AsientoContable_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "Sucursal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsientoDetalle" ADD CONSTRAINT "AsientoDetalle_asientoId_fkey" FOREIGN KEY ("asientoId") REFERENCES "AsientoContable"("id") ON DELETE CASCADE ON UPDATE CASCADE;
