import { notFound } from "next/navigation";

import { getSucursalByIdAction } from "@/features/sucursales/actions";
import { SucursalForm } from "@/features/sucursales/components";

interface EditarSucursalPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditarSucursalPage({
    params,
}: EditarSucursalPageProps) {
    const { id } = await params;

    const { sucursal } = await getSucursalByIdAction({ id });

    if (!sucursal) {
        notFound();
    }

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Editar sucursal</h1>
                <p className="text-sm text-muted-foreground">
                    Modifique los datos de la sucursal seleccionada.
                </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <SucursalForm sucursal={sucursal} />
            </div>
        </div>
    );
}