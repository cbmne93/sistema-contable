/*
  Warnings:

  - A unique constraint covering the columns `[empresaId,nombre]` on the table `Cliente` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Cliente_empresaId_nombre_key" ON "Cliente"("empresaId", "nombre");
