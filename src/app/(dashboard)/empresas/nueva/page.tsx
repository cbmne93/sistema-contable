import { EmpresaForm } from "@/features/empresas/components";

export default function NuevaEmpresaPage() {
    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Nueva empresa</h1>
                <p className="text-sm text-muted-foreground">
                    Complete los datos para registrar una nueva empresa.
                </p>
            </div>

            <div className="rounded-lg border bg-white p-6">
                <EmpresaForm />
            </div>
        </div>
    );
}