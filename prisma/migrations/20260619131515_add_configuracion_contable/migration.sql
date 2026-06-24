-- CreateTable
CREATE TABLE "ConfiguracionContable" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "cuentaClientesId" TEXT,
    "cuentaProveedoresId" TEXT,
    "cuentaCajaId" TEXT,
    "cuentaBancoId" TEXT,
    "cuentaVentasExentasId" TEXT,
    "cuentaVentasGravadas5Id" TEXT,
    "cuentaVentasGravadas10Id" TEXT,
    "cuentaComprasExentasId" TEXT,
    "cuentaComprasGravadas5Id" TEXT,
    "cuentaComprasGravadas10Id" TEXT,
    "cuentaIvaDebitoFiscalId" TEXT,
    "cuentaIvaCreditoFiscalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConfiguracionContable_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ConfiguracionContable_empresaId_key" ON "ConfiguracionContable"("empresaId");

-- CreateIndex
CREATE INDEX "ConfiguracionContable_empresaId_idx" ON "ConfiguracionContable"("empresaId");

-- CreateIndex
CREATE INDEX "ConfiguracionContable_cuentaClientesId_idx" ON "ConfiguracionContable"("cuentaClientesId");

-- CreateIndex
CREATE INDEX "ConfiguracionContable_cuentaProveedoresId_idx" ON "ConfiguracionContable"("cuentaProveedoresId");

-- CreateIndex
CREATE INDEX "ConfiguracionContable_cuentaCajaId_idx" ON "ConfiguracionContable"("cuentaCajaId");

-- CreateIndex
CREATE INDEX "ConfiguracionContable_cuentaBancoId_idx" ON "ConfiguracionContable"("cuentaBancoId");

-- CreateIndex
CREATE INDEX "ConfiguracionContable_cuentaVentasExentasId_idx" ON "ConfiguracionContable"("cuentaVentasExentasId");

-- CreateIndex
CREATE INDEX "ConfiguracionContable_cuentaVentasGravadas5Id_idx" ON "ConfiguracionContable"("cuentaVentasGravadas5Id");

-- CreateIndex
CREATE INDEX "ConfiguracionContable_cuentaVentasGravadas10Id_idx" ON "ConfiguracionContable"("cuentaVentasGravadas10Id");

-- CreateIndex
CREATE INDEX "ConfiguracionContable_cuentaComprasExentasId_idx" ON "ConfiguracionContable"("cuentaComprasExentasId");

-- CreateIndex
CREATE INDEX "ConfiguracionContable_cuentaComprasGravadas5Id_idx" ON "ConfiguracionContable"("cuentaComprasGravadas5Id");

-- CreateIndex
CREATE INDEX "ConfiguracionContable_cuentaComprasGravadas10Id_idx" ON "ConfiguracionContable"("cuentaComprasGravadas10Id");

-- CreateIndex
CREATE INDEX "ConfiguracionContable_cuentaIvaDebitoFiscalId_idx" ON "ConfiguracionContable"("cuentaIvaDebitoFiscalId");

-- CreateIndex
CREATE INDEX "ConfiguracionContable_cuentaIvaCreditoFiscalId_idx" ON "ConfiguracionContable"("cuentaIvaCreditoFiscalId");

-- AddForeignKey
ALTER TABLE "ConfiguracionContable" ADD CONSTRAINT "ConfiguracionContable_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfiguracionContable" ADD CONSTRAINT "ConfiguracionContable_cuentaClientesId_fkey" FOREIGN KEY ("cuentaClientesId") REFERENCES "CuentaContable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfiguracionContable" ADD CONSTRAINT "ConfiguracionContable_cuentaProveedoresId_fkey" FOREIGN KEY ("cuentaProveedoresId") REFERENCES "CuentaContable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfiguracionContable" ADD CONSTRAINT "ConfiguracionContable_cuentaCajaId_fkey" FOREIGN KEY ("cuentaCajaId") REFERENCES "CuentaContable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfiguracionContable" ADD CONSTRAINT "ConfiguracionContable_cuentaBancoId_fkey" FOREIGN KEY ("cuentaBancoId") REFERENCES "CuentaContable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfiguracionContable" ADD CONSTRAINT "ConfiguracionContable_cuentaVentasExentasId_fkey" FOREIGN KEY ("cuentaVentasExentasId") REFERENCES "CuentaContable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfiguracionContable" ADD CONSTRAINT "ConfiguracionContable_cuentaVentasGravadas5Id_fkey" FOREIGN KEY ("cuentaVentasGravadas5Id") REFERENCES "CuentaContable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfiguracionContable" ADD CONSTRAINT "ConfiguracionContable_cuentaVentasGravadas10Id_fkey" FOREIGN KEY ("cuentaVentasGravadas10Id") REFERENCES "CuentaContable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfiguracionContable" ADD CONSTRAINT "ConfiguracionContable_cuentaComprasExentasId_fkey" FOREIGN KEY ("cuentaComprasExentasId") REFERENCES "CuentaContable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfiguracionContable" ADD CONSTRAINT "ConfiguracionContable_cuentaComprasGravadas5Id_fkey" FOREIGN KEY ("cuentaComprasGravadas5Id") REFERENCES "CuentaContable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfiguracionContable" ADD CONSTRAINT "ConfiguracionContable_cuentaComprasGravadas10Id_fkey" FOREIGN KEY ("cuentaComprasGravadas10Id") REFERENCES "CuentaContable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfiguracionContable" ADD CONSTRAINT "ConfiguracionContable_cuentaIvaDebitoFiscalId_fkey" FOREIGN KEY ("cuentaIvaDebitoFiscalId") REFERENCES "CuentaContable"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfiguracionContable" ADD CONSTRAINT "ConfiguracionContable_cuentaIvaCreditoFiscalId_fkey" FOREIGN KEY ("cuentaIvaCreditoFiscalId") REFERENCES "CuentaContable"("id") ON DELETE SET NULL ON UPDATE CASCADE;
