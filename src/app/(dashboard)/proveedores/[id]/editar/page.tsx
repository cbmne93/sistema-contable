import { notFound } from "next/navigation";

import { getProveedorByIdAction } from "@/features/proveedores/actions";
import { ProveedorForm } from "@/features/proveedores/components";

interface EditarProveedorPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditarProveedorPage({
    params,
}: EditarProveedorPageProps) {
    const { id } = await params;

    const { proveedor } = await getProveedorByIdAction({ id });

    if (!proveedor) {
        notFound();
    }

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Editar proveedor</h1>
                <p className="text-sm text-muted-foreground">
                    Modifique los datos del proveedor seleccionado.
                </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <ProveedorForm proveedor={proveedor} />
            </div>
        </div>
    );
}