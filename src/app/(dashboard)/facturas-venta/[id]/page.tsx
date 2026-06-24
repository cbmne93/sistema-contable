import Link from "next/link";
import { AlertCircle } from "lucide-react";

import { getFacturaVentaByIdAction } from "@/features/facturas-venta/actions";
import { FacturaVentaDetalle } from "@/features/facturas-venta/components";

interface FacturaVentaDetallePageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function FacturaVentaDetallePage({
    params,
}: FacturaVentaDetallePageProps) {
    const { id } = await params;

    const response = await getFacturaVentaByIdAction(id);

    if (!response.ok || !response.factura) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 text-red-600" />

                    <div>
                        <h1 className="text-base font-semibold text-red-800">
                            No se pudo cargar la factura
                        </h1>

                        <p className="mt-1 text-sm text-red-700">
                            {response.message}
                        </p>

                        <Link
                            href="/facturas-venta"
                            className="mt-4 inline-flex h-9 items-center justify-center rounded-lg border border-red-200 bg-white px-3 text-sm font-medium text-red-700 transition hover:bg-red-100"
                        >
                            Volver a facturas
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return <FacturaVentaDetalle factura={response.factura} />;
}