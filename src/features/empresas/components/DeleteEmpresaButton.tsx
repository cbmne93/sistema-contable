"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { deleteEmpresaAction } from "../actions";

interface DeleteEmpresaButtonProps {
    empresaId: string;
    empresaNombre: string;
    disabled?: boolean;
}

export function DeleteEmpresaButton({
    empresaId,
    empresaNombre,
    disabled = false,
}: DeleteEmpresaButtonProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [confirmText, setConfirmText] = useState("");
    const [isPending, startTransition] = useTransition();

    const canDelete = confirmText.trim().toUpperCase() === "ELIMINAR";

    const handleDelete = () => {
        if (!canDelete || isPending) {
            return;
        }

        startTransition(async () => {
            const response = await deleteEmpresaAction({ id: empresaId });

            if (!response.ok) {
                toast.error(response.message);
                return;
            }

            toast.success(response.message);
            setOpen(false);
            setConfirmText("");

            if (response.deletedActiveCompany) {
                router.push("/seleccionar-empresa");
                router.refresh();
                return;
            }

            router.refresh();
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    disabled={disabled || isPending}
                    className="h-9 min-w-28 justify-center gap-1.5 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Trash2 className="h-4 w-4" />
                    {isPending ? "Eliminando..." : "Eliminar"}
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="max-w-lg">
                <AlertDialogHeader>
                    <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                    </div>

                    <AlertDialogTitle>
                        Eliminar empresa definitivamente
                    </AlertDialogTitle>

                    <AlertDialogDescription className="space-y-3 text-sm leading-6">
                        <span className="block">
                            Esta acción eliminará la empresa{" "}
                            <span className="font-semibold text-slate-900">
                                {empresaNombre}
                            </span>{" "}
                            y todos sus datos asociados.
                        </span>

                        <span className="block">
                            Se eliminarán clientes, proveedores, sucursales,
                            timbrados, facturas, asientos, plan de cuentas,
                            periodos fiscales y configuraciones contables.
                        </span>

                        <span className="block font-semibold text-red-600">
                            Esta acción no se puede deshacer.
                        </span>
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-2">
                    <Label htmlFor={`confirm-delete-${empresaId}`}>
                        Para confirmar, escriba{" "}
                        <span className="font-semibold text-slate-900">
                            ELIMINAR
                        </span>
                    </Label>

                    <Input
                        id={`confirm-delete-${empresaId}`}
                        value={confirmText}
                        onChange={(event) => setConfirmText(event.target.value)}
                        disabled={isPending}
                        placeholder="ELIMINAR"
                        className="uppercase"
                    />
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel
                        disabled={isPending}
                        onClick={() => setConfirmText("")}
                    >
                        Cancelar
                    </AlertDialogCancel>

                    <Button
                        type="button"
                        onClick={handleDelete}
                        disabled={!canDelete || isPending}
                        className="bg-red-600 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}

                        {isPending ? "Eliminando..." : "Sí, eliminar"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}