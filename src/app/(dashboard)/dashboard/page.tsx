import { redirect } from "next/navigation";
import {
    BarChart3,
    Building2,
    Landmark,
    Receipt,
    TrendingUp,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEmpresaActivaIdAction } from "@/features/empresas/actions";

const cards = [
    {
        title: "Empresas",
        value: "1",
        description: "Empresa registrada",
        icon: Building2,
    },
    {
        title: "Facturas",
        value: "0",
        description: "Facturas cargadas",
        icon: Receipt,
    },
    {
        title: "Asientos",
        value: "0",
        description: "Movimientos contables",
        icon: Landmark,
    },
    {
        title: "Reportes",
        value: "0",
        description: "Reportes generados",
        icon: BarChart3,
    },
];

export default async function DashboardPage() {
    const empresaActivaId = await getEmpresaActivaIdAction();

    if (!empresaActivaId) {
        redirect("/seleccionar-empresa");
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="mt-1 text-slate-500">
                    Resumen general del sistema contable.
                </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {cards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <Card key={card.title} className="rounded-2xl shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                <CardTitle className="text-sm font-medium text-slate-600">
                                    {card.title}
                                </CardTitle>

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                                    <Icon className="h-5 w-5 text-slate-700" />
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="text-3xl font-bold">{card.value}</div>
                                <p className="mt-1 text-sm text-slate-500">
                                    {card.description}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <Card className="rounded-2xl shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Actividad reciente
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="rounded-xl border border-dashed p-8 text-center">
                        <p className="font-medium text-slate-700">
                            Todavía no hay movimientos registrados.
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                            Cuando cargues facturas o asientos contables, aparecerán acá.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}