/*
  Warnings:

  - You are about to drop the column `fechaInicio` on the `Timbrado` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[empresaId,origen,numero,tipoComprobante,sucursalId,proveedorId]` on the table `Timbrado` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `origen` to the `Timbrado` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrigenTimbrado" AS ENUM ('PROPIO', 'PROVEEDOR');

-- DropForeignKey
ALTER TABLE "Timbrado" DROP CONSTRAINT "Timbrado_sucursalId_fkey";

-- DropIndex
DROP INDEX "Timbrado_empresaId_numero_establecimiento_puntoExpedicion_t_key";

-- AlterTable
ALTER TABLE "Timbrado" DROP COLUMN "fechaInicio",
ADD COLUMN     "origen" "OrigenTimbrado" NOT NULL,
ADD COLUMN     "proveedorId" TEXT,
ALTER COLUMN "sucursalId" DROP NOT NULL,
ALTER COLUMN "establecimiento" DROP NOT NULL,
ALTER COLUMN "puntoExpedicion" DROP NOT NULL,
ALTER COLUMN "numeroDesde" DROP NOT NULL,
ALTER COLUMN "numeroActual" DROP NOT NULL,
ALTER COLUMN "numeroActual" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "Timbrado_proveedorId_idx" ON "Timbrado"("proveedorId");

-- CreateIndex
CREATE INDEX "Timbrado_origen_idx" ON "Timbrado"("origen");

-- CreateIndex
CREATE UNIQUE INDEX "Timbrado_empresaId_origen_numero_tipoComprobante_sucursalId_key" ON "Timbrado"("empresaId", "origen", "numero", "tipoComprobante", "sucursalId", "proveedorId");

-- AddForeignKey
ALTER TABLE "Timbrado" ADD CONSTRAINT "Timbrado_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "Sucursal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Timbrado" ADD CONSTRAINT "Timbrado_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "Proveedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
