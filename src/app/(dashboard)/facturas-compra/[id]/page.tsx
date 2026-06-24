import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { getFacturaCompraByIdAction } from "@/features/facturas-compra/actions";
import { FacturaCompraDetalle } from "@/features/facturas-compra/components/FacturaCompraDetalle";

interface FacturaCompraDetallePageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function FacturaCompraDetallePage({
    params,
}: FacturaCompraDetallePageProps) {
    const { id } = await params;

    const response = await getFacturaCompraByIdAction(id);

    if (!response.ok || !response.factura) {
        return (
            <div className="space-y-4">
                <Link
                    href="/facturas-compra"
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver a facturas de compra
                </Link>

                <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
                    <p className="font-semibold">
                        No se pudo abrir la factura de compra.
                    </p>

                    <p className="mt-1">{response.message}</p>
                </div>
            </div>
        );
    }

    return <FacturaCompraDetalle factura={response.factura} />;
}