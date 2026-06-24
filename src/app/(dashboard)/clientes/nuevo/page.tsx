import { ClienteForm } from "@/features/clientes/components";

export default function NuevoClientePage() {
    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Nuevo cliente</h1>
                <p className="text-sm text-muted-foreground">
                    Complete los datos para registrar un nuevo cliente.
                </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <ClienteForm />
            </div>
        </div>
    );
}