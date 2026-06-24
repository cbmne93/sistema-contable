-- AlterTable
ALTER TABLE "Comprobante" ADD COLUMN     "imputaIre" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "imputaIrpRsp" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "imputaIva" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "noImputa" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Empresa" ADD COLUMN     "obligacionIdu" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "obligacionInr" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "obligacionIreGeneral" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "obligacionIreResimple" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "obligacionIreSimple" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "obligacionIrpCapital" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "obligacionIrpServicios" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "obligacionIvaGeneral" BOOLEAN NOT NULL DEFAULT true;
