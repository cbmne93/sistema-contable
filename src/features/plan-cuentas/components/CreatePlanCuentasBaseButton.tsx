"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { BookOpenCheck } from "lucide-react";
import { toast } from "sonner";

import { createPlanCuentasBaseAction } from "../actions";

export function CreatePlanCuentasBaseButton() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleCreate = () => {
        startTransition(async () => {
            const response = await createPlanCuentasBaseAction();

            if (!response.ok) {
                toast.error(response.message);
                return;
            }

            toast.success(response.message);

            router.refresh();
        });
    };

    return (
        <button
            type="button"
            onClick={handleCreate}
            disabled={isPending}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
            <BookOpenCheck className="h-4 w-4" />
            {isPending ? "Cargando..." : "Cargar plan base"}
        </button>
    );
}