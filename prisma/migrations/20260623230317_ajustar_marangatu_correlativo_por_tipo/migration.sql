/*
  Warnings:

  - A unique constraint covering the columns `[empresaId,anio,mes,tipoInforme,version]` on the table `MarangatuRegistro` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "MarangatuRegistro_empresaId_anio_mes_version_key";

-- CreateIndex
CREATE UNIQUE INDEX "MarangatuRegistro_empresaId_anio_mes_tipoInforme_version_key" ON "MarangatuRegistro"("empresaId", "anio", "mes", "tipoInforme", "version");
