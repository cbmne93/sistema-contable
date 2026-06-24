import { SucursalForm } from "@/features/sucursales/components";

export default function NuevaSucursalPage() {
    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Nueva sucursal</h1>
                <p className="text-sm text-muted-foreground">
                    Complete los datos para registrar una nueva sucursal.
                </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <SucursalForm />
            </div>
        </div>
    );
}