import { notFound } from "next/navigation";

import { getAsientoContableByIdAction } from "@/features/asientos-contables/actions";
import { AsientoContableDetalleView } from "@/features/asientos-contables/components";

interface AsientoContableDetallePageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function AsientoContableDetallePage({
    params,
}: AsientoContableDetallePageProps) {
    const { id } = await params;

    const { ok, asiento } = await getAsientoContableByIdAction(id);

    if (!ok || !asiento) {
        notFound();
    }

    return <AsientoContableDetalleView asiento={asiento} />;
}