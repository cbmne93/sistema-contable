/*
  Warnings:

  - A unique constraint covering the columns `[empresaId,nombre]` on the table `Proveedor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Proveedor_empresaId_nombre_key" ON "Proveedor"("empresaId", "nombre");
