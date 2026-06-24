/*
  Warnings:

  - You are about to drop the column `cuentaComprasExentasId` on the `ConfiguracionContable` table. All the data in the column will be lost.
  - You are about to drop the column `cuentaComprasGravadas10Id` on the `ConfiguracionContable` table. All the data in the column will be lost.
  - You are about to drop the column `cuentaComprasGravadas5Id` on the `ConfiguracionContable` table. All the data in the column will be lost.
  - You are about to drop the column `cuentaIvaCreditoFiscalId` on the `ConfiguracionContable` table. All the data in the column will be lost.
  - You are about to drop the column `cuentaIvaDebitoFiscalId` on the `ConfiguracionContable` table. All the data in the column will be lost.
  - You are about to drop the column `cuentaVentasExentasId` on the `ConfiguracionContable` table. All the data in the column will be lost.
  - You are about to drop the column `cuentaVentasGravadas10Id` on the `ConfiguracionContable` table. All the data in the column will be lost.
  - You are about to drop the column `cuentaVentasGravadas5Id` on the `ConfiguracionContable` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ConfiguracionContable" DROP CONSTRAINT "ConfiguracionContable_cuentaComprasExentasId_fkey";

-- DropForeignKey
ALTER TABLE "ConfiguracionContable" DROP CONSTRAINT "ConfiguracionContable_cuentaComprasGravadas10Id_fkey";

-- DropForeignKey
ALTER TABLE "ConfiguracionContable" DROP CONSTRAINT "ConfiguracionContable_cuentaComprasGravadas5Id_fkey";

-- DropForeignKey
ALTER TABLE "ConfiguracionContable" DROP CONSTRAINT "ConfiguracionContable_cuentaIvaCreditoFiscalId_fkey";

-- DropForeignKey
ALTER TABLE "ConfiguracionContable" DROP CONSTRAINT "ConfiguracionContable_cuentaIvaDebitoFiscalId_fkey";

-- DropForeignKey
ALTER TABLE "ConfiguracionContable" DROP CONSTRAINT "ConfiguracionContable_cuentaVentasExentasId_fkey";

-- DropForeignKey
ALTER TABLE "ConfiguracionContable" DROP CONSTRAINT "ConfiguracionContable_cuentaVentasGravadas10Id_fkey";

-- DropForeignKey
ALTER TABLE "ConfiguracionContable" DROP CONSTRAINT "ConfiguracionContable_cuentaVentasGravadas5Id_fkey";

-- DropIndex
DROP INDEX "ConfiguracionContable_cuentaComprasExentasId_idx";

-- DropIndex
DROP INDEX "ConfiguracionContable_cuentaComprasGravadas10Id_idx";

-- DropIndex
DROP INDEX "ConfiguracionContable_cuentaComprasGravadas5Id_idx";

-- DropIndex
DROP INDEX "ConfiguracionContable_cuentaIvaCreditoFiscalId_idx";

-- DropIndex
DROP INDEX "ConfiguracionContable_cuentaIvaDebitoFiscalId_idx";

-- DropIndex
DROP INDEX "ConfiguracionContable_cuentaVentasExentasId_idx";

-- DropIndex
DROP INDEX "ConfiguracionContable_cuentaVentasGravadas10Id_idx";

-- DropIndex
DROP INDEX "ConfiguracionContable_cuentaVentasGravadas5Id_idx";

-- AlterTable
ALTER TABLE "ConfiguracionContable" DROP COLUMN "cuentaComprasExentasId",
DROP COLUMN "cuentaComprasGravadas10Id",
DROP COLUMN "cuentaComprasGravadas5Id",
DROP COLUMN "cuentaIvaCreditoFiscalId",
DROP COLUMN "cuentaIvaDebitoFiscalId",
DROP COLUMN "cuentaVentasExentasId",
DROP COLUMN "cuentaVentasGravadas10Id",
DROP COLUMN "cuentaVentasGravadas5Id",
ADD COLUMN     "cuentaIvaCreditoFiscal10Id" TEXT,
ADD COLUMN     "cuentaIvaCreditoFiscal5Id" TEXT,
ADD COLUMN     "cuentaIvaDebitoFiscal10Id" TEXT,
ADD COLUMN     "cuentaIvaDebitoFiscal5Id" TEXT;

-- CreateIndex
CREATE INDEX "ConfiguracionContable_cuentaIvaDebitoFiscal5Id_idx" ON "ConfiguracionContable"("cuentaIvaDebitoFiscal5Id");

-- CreateIndex
CREATE INDEX "ConfiguracionContable_cuentaIvaDebitoFiscal10Id_idx" ON "ConfiguracionContable"("cuentaIvaDebitoFiscal10Id");

-- CreateIndex
CREATE INDEX "ConfiguracionContable_cuentaIvaCreditoFiscal5Id_idx" ON "ConfiguracionContable"("cuentaIvaCreditoFiscal5Id");

-- CreateIndex
CREATE INDEX "ConfiguracionContable_cuentaIvaCreditoFiscal10Id_idx" ON "ConfiguracionContable"("cuentaIvaCreditoFiscal10Id");

-- AddForeignKey
ALTER TABLE "ConfiguracionContable" ADD CONSTRAINT "ConfiguracionContable_cuentaIvaDebitoFiscal5Id_fkey" FOREIGN KEY ("cuentaIvaDebitoFiscal5Id") REFERENCES "CuentaContable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfiguracionContable" ADD CONSTRAINT "ConfiguracionContable_cuentaIvaDebitoFiscal10Id_fkey" FOREIGN KEY ("cuentaIvaDebitoFiscal10Id") REFERENCES "CuentaContable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfiguracionContable" ADD CONSTRAINT "ConfiguracionContable_cuentaIvaCreditoFiscal5Id_fkey" FOREIGN KEY ("cuentaIvaCreditoFiscal5Id") REFERENCES "CuentaContable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfiguracionContable" ADD CONSTRAINT "ConfiguracionContable_cuentaIvaCreditoFiscal10Id_fkey" FOREIGN KEY ("cuentaIvaCreditoFiscal10Id") REFERENCES "CuentaContable"("id") ON DELETE SET NULL ON UPDATE CASCADE;
