-- CreateEnum
CREATE TYPE "EstadoPeriodoFiscal" AS ENUM ('ABIERTO', 'CERRADO');

-- CreateTable
CREATE TABLE "PeriodoFiscal" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "anio" INTEGER NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "estado" "EstadoPeriodoFiscal" NOT NULL DEFAULT 'ABIERTO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PeriodoFiscal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PeriodoFiscal_empresaId_idx" ON "PeriodoFiscal"("empresaId");

-- CreateIndex
CREATE INDEX "PeriodoFiscal_estado_idx" ON "PeriodoFiscal"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "PeriodoFiscal_empresaId_anio_key" ON "PeriodoFiscal"("empresaId", "anio");

-- AddForeignKey
ALTER TABLE "PeriodoFiscal" ADD CONSTRAINT "PeriodoFiscal_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;
