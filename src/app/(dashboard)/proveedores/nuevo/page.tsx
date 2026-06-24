import { ProveedorForm } from "@/features/proveedores/components";

export default function NuevoProveedorPage() {
    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Nuevo proveedor</h1>
                <p className="text-sm text-muted-foreground">
                    Complete los datos para registrar un nuevo proveedor.
                </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <ProveedorForm />
            </div>
        </div>
    );
}