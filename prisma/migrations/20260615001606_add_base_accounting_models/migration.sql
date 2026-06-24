/*
  Warnings:

  - The values [CEDULA] on the enum `TipoDocumento` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `timbrado` on the `Empresa` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[empresaId,tipoDocumento,numeroDocumento]` on the table `Cliente` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[empresaId,codigo]` on the table `CuentaContable` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[empresaId,tipoDocumento,numeroDocumento]` on the table `Proveedor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `empresaId` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `empresaId` to the `CuentaContable` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dv` to the `Empresa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `empresaId` to the `Proveedor` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TipoMovimiento" AS ENUM ('INGRESO', 'EGRESO');

-- CreateEnum
CREATE TYPE "TipoComprobante" AS ENUM ('FACTURA', 'NOTA_CREDITO', 'NOTA_DEBITO', 'RECIBO', 'AUTOFACTURA', 'TICKET', 'OTRO');

-- CreateEnum
CREATE TYPE "CondicionComprobante" AS ENUM ('CONTADO', 'CREDITO');

-- CreateEnum
CREATE TYPE "TipoImpuesto" AS ENUM ('EXENTA', 'IVA_5', 'IVA_10');

-- AlterEnum
BEGIN;
CREATE TYPE "TipoDocumento_new" AS ENUM ('RUC', 'CEDULA_IDENTIDAD', 'PASAPORTE', 'DOCUMENTO_EXTRANJERO');
ALTER TABLE "public"."Cliente" ALTER COLUMN "tipoDocumento" DROP DEFAULT;
ALTER TABLE "public"."Proveedor" ALTER COLUMN "tipoDocumento" DROP DEFAULT;
ALTER TABLE "Cliente" ALTER COLUMN "tipoDocumento" TYPE "TipoDocumento_new" USING ("tipoDocumento"::text::"TipoDocumento_new");
ALTER TABLE "Proveedor" ALTER COLUMN "tipoDocumento" TYPE "TipoDocumento_new" USING ("tipoDocumento"::text::"TipoDocumento_new");
ALTER TYPE "TipoDocumento" RENAME TO "TipoDocumento_old";
ALTER TYPE "TipoDocumento_new" RENAME TO "TipoDocumento";
DROP TYPE "public"."TipoDocumento_old";
ALTER TABLE "Cliente" ALTER COLUMN "tipoDocumento" SET DEFAULT 'RUC';
ALTER TABLE "Proveedor" ALTER COLUMN "tipoDocumento" SET DEFAULT 'RUC';
COMMIT;

-- DropIndex
DROP INDEX "Cliente_tipoDocumento_numeroDocumento_key";

-- DropIndex
DROP INDEX "CuentaContable_codigo_key";

-- DropIndex
DROP INDEX "Proveedor_tipoDocumento_numeroDocumento_key";

-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN     "dv" TEXT,
ADD COLUMN     "empresaId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CuentaContable" ADD COLUMN     "empresaId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Empresa" DROP COLUMN "timbrado",
ADD COLUMN     "dv" TEXT NOT NULL,
ADD COLUMN     "estado" "EstadoRegistro" NOT NULL DEFAULT 'ACTIVO';

-- AlterTable
ALTER TABLE "Proveedor" ADD COLUMN     "dv" TEXT,
ADD COLUMN     "empresaId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Sucursal" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT,
    "telefono" TEXT,
    "estado" "EstadoRegistro" NOT NULL DEFAULT 'ACTIVO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sucursal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Timbrado" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "sucursalId" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "establecimiento" TEXT NOT NULL,
    "puntoExpedicion" TEXT NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3),
    "numeroDesde" INTEGER NOT NULL,
    "numeroHasta" INTEGER,
    "numeroActual" INTEGER NOT NULL DEFAULT 0,
    "tipoComprobante" "TipoComprobante" NOT NULL,
    "estado" "EstadoRegistro" NOT NULL DEFAULT 'ACTIVO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Timbrado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comprobante" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "sucursalId" TEXT NOT NULL,
    "tipoMovimiento" "TipoMovimiento" NOT NULL,
    "tipoComprobante" "TipoComprobante" NOT NULL,
    "condicion" "CondicionComprobante" NOT NULL DEFAULT 'CONTADO',
    "clienteId" TEXT,
    "proveedorId" TEXT,
    "timbradoId" TEXT,
    "numeroTimbrado" TEXT,
    "establecimiento" TEXT,
    "puntoExpedicion" TEXT,
    "numeroComprobante" TEXT NOT NULL,
    "fechaEmision" TIMESTAMP(3) NOT NULL,
    "fechaVencimiento" TIMESTAMP(3),
    "moneda" TEXT NOT NULL DEFAULT 'PYG',
    "cotizacion" DECIMAL(18,2) NOT NULL DEFAULT 1,
    "exenta" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "gravada5" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "iva5" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "gravada10" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "iva10" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "concepto" TEXT,
    "cdc" TEXT,
    "estadoSifen" TEXT,
    "xmlUrl" TEXT,
    "kudeUrl" TEXT,
    "qrUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comprobante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComprobanteDetalle" (
    "id" TEXT NOT NULL,
    "comprobanteId" TEXT NOT NULL,
    "cuentaContableId" TEXT,
    "descripcion" TEXT NOT NULL,
    "tipoImpuesto" "TipoImpuesto" NOT NULL,
    "cantidad" DECIMAL(18,2) NOT NULL DEFAULT 1,
    "precioUnitario" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "exenta" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "gravada5" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "iva5" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "gravada10" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "iva10" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ComprobanteDetalle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AsientoContable" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "comprobanteId" TEXT,
    "numero" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AsientoContable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AsientoDetalle" (
    "id" TEXT NOT NULL,
    "asientoId" TEXT NOT NULL,
    "cuentaContableId" TEXT NOT NULL,
    "descripcion" TEXT,
    "debe" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "haber" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AsientoDetalle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sucursal_empresaId_codigo_key" ON "Sucursal"("empresaId", "codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Timbrado_empresaId_numero_establecimiento_puntoExpedicion_t_key" ON "Timbrado"("empresaId", "numero", "establecimiento", "puntoExpedicion", "tipoComprobante");

-- CreateIndex
CREATE INDEX "Comprobante_empresaId_idx" ON "Comprobante"("empresaId");

-- CreateIndex
CREATE INDEX "Comprobante_sucursalId_idx" ON "Comprobante"("sucursalId");

-- CreateIndex
CREATE INDEX "Comprobante_clienteId_idx" ON "Comprobante"("clienteId");

-- CreateIndex
CREATE INDEX "Comprobante_proveedorId_idx" ON "Comprobante"("proveedorId");

-- CreateIndex
CREATE INDEX "Comprobante_timbradoId_idx" ON "Comprobante"("timbradoId");

-- CreateIndex
CREATE INDEX "ComprobanteDetalle_comprobanteId_idx" ON "ComprobanteDetalle"("comprobanteId");

-- CreateIndex
CREATE INDEX "ComprobanteDetalle_cuentaContableId_idx" ON "ComprobanteDetalle"("cuentaContableId");

-- CreateIndex
CREATE UNIQUE INDEX "AsientoContable_comprobanteId_key" ON "AsientoContable"("comprobanteId");

-- CreateIndex
CREATE UNIQUE INDEX "AsientoContable_empresaId_numero_key" ON "AsientoContable"("empresaId", "numero");

-- CreateIndex
CREATE INDEX "AsientoDetalle_asientoId_idx" ON "AsientoDetalle"("asientoId");

-- CreateIndex
CREATE INDEX "AsientoDetalle_cuentaContableId_idx" ON "AsientoDetalle"("cuentaContableId");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_empresaId_tipoDocumento_numeroDocumento_key" ON "Cliente"("empresaId", "tipoDocumento", "numeroDocumento");

-- CreateIndex
CREATE UNIQUE INDEX "CuentaContable_empresaId_codigo_key" ON "CuentaContable"("empresaId", "codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Proveedor_empresaId_tipoDocumento_numeroDocumento_key" ON "Proveedor"("empresaId", "tipoDocumento", "numeroDocumento");

-- AddForeignKey
ALTER TABLE "Sucursal" ADD CONSTRAINT "Sucursal_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Timbrado" ADD CONSTRAINT "Timbrado_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Timbrado" ADD CONSTRAINT "Timbrado_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "Sucursal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Proveedor" ADD CONSTRAINT "Proveedor_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CuentaContable" ADD CONSTRAINT "CuentaContable_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comprobante" ADD CONSTRAINT "Comprobante_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comprobante" ADD CONSTRAINT "Comprobante_sucursalId_fkey" FOREIGN KEY ("sucursalId") REFERENCES "Sucursal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comprobante" ADD CONSTRAINT "Comprobante_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comprobante" ADD CONSTRAINT "Comprobante_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "Proveedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comprobante" ADD CONSTRAINT "Comprobante_timbradoId_fkey" FOREIGN KEY ("timbradoId") REFERENCES "Timbrado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComprobanteDetalle" ADD CONSTRAINT "ComprobanteDetalle_comprobanteId_fkey" FOREIGN KEY ("comprobanteId") REFERENCES "Comprobante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComprobanteDetalle" ADD CONSTRAINT "ComprobanteDetalle_cuentaContableId_fkey" FOREIGN KEY ("cuentaContableId") REFERENCES "CuentaContable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsientoContable" ADD CONSTRAINT "AsientoContable_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsientoContable" ADD CONSTRAINT "AsientoContable_comprobanteId_fkey" FOREIGN KEY ("comprobanteId") REFERENCES "Comprobante"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsientoDetalle" ADD CONSTRAINT "AsientoDetalle_asientoId_fkey" FOREIGN KEY ("asientoId") REFERENCES "AsientoContable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsientoDetalle" ADD CONSTRAINT "AsientoDetalle_cuentaContableId_fkey" FOREIGN KEY ("cuentaContableId") REFERENCES "CuentaContable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
