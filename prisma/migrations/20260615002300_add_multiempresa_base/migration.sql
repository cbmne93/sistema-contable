-- CreateEnum
CREATE TYPE "RolEmpresa" AS ENUM ('ADMIN_EMPRESA', 'CONTADOR', 'OPERADOR', 'LECTURA');

-- CreateTable
CREATE TABLE "UsuarioEmpresa" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "rol" "RolEmpresa" NOT NULL DEFAULT 'OPERADOR',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UsuarioEmpresa_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UsuarioEmpresa_usuarioId_idx" ON "UsuarioEmpresa"("usuarioId");

-- CreateIndex
CREATE INDEX "UsuarioEmpresa_empresaId_idx" ON "UsuarioEmpresa"("empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioEmpresa_usuarioId_empresaId_key" ON "UsuarioEmpresa"("usuarioId", "empresaId");

-- CreateIndex
CREATE INDEX "AsientoContable_empresaId_idx" ON "AsientoContable"("empresaId");

-- CreateIndex
CREATE INDEX "AsientoContable_fecha_idx" ON "AsientoContable"("fecha");

-- CreateIndex
CREATE INDEX "Cliente_empresaId_idx" ON "Cliente"("empresaId");

-- CreateIndex
CREATE INDEX "Comprobante_fechaEmision_idx" ON "Comprobante"("fechaEmision");

-- CreateIndex
CREATE INDEX "CuentaContable_empresaId_idx" ON "CuentaContable"("empresaId");

-- CreateIndex
CREATE INDEX "Proveedor_empresaId_idx" ON "Proveedor"("empresaId");

-- CreateIndex
CREATE INDEX "Sucursal_empresaId_idx" ON "Sucursal"("empresaId");

-- CreateIndex
CREATE INDEX "Timbrado_empresaId_idx" ON "Timbrado"("empresaId");

-- CreateIndex
CREATE INDEX "Timbrado_sucursalId_idx" ON "Timbrado"("sucursalId");

-- AddForeignKey
ALTER TABLE "UsuarioEmpresa" ADD CONSTRAINT "UsuarioEmpresa_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioEmpresa" ADD CONSTRAINT "UsuarioEmpresa_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
