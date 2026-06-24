"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { AlertTriangle, Ban, Loader2, Trash2 } from "lucide-react";
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

import { deleteClienteAction } from "../actions";

interface DeleteClienteButtonProps {
    clienteId: string;
    clienteNombre: string;
    tieneMovimientos?: boolean;
    estado?: "ACTIVO" | "INACTIVO";
}

export function DeleteClienteButton({
    clienteId,
    clienteNombre,
    tieneMovimientos = false,
    estado = "ACTIVO",
}: DeleteClienteButtonProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const estaInactivo = estado === "INACTIVO";
    const accion = tieneMovimientos ? "desactivar" : "eliminar";
    const titulo = tieneMovimientos ? "Desactivar cliente" : "Eliminar cliente";
    const botonTexto = tieneMovimientos ? "Desactivar" : "Eliminar";
    const botonConfirmar = tieneMovimientos
        ? "Sí, desactivar"
        : "Sí, eliminar";

    const handleAction = () => {
        if (isPending || estaInactivo) {
            return;
        }

        startTransition(async () => {
            const response = await deleteClienteAction({ id: clienteId });

            if (!response.ok) {
                toast.error(response.message);
                return;
            }

            toast.success(response.message);
            setOpen(false);
            router.refresh();
        });
    };

    if (estaInactivo) {
        return (
            <Button
                type="button"
                variant="outline"
                disabled
                className="h-9 min-w-28 justify-center gap-1.5 border-slate-200 text-slate-400"
            >
                <Ban className="h-4 w-4" />
                Desactivado
            </Button>
        );
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    disabled={isPending}
                    className={
                        tieneMovimientos
                            ? "h-9 min-w-28 justify-center gap-1.5 border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800 disabled:cursor-not-allowed disabled:opacity-50"
                            : "h-9 min-w-28 justify-center gap-1.5 border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-50"
                    }
                >
                    {tieneMovimientos ? (
                        <Ban className="h-4 w-4" />
                    ) : (
                        <Trash2 className="h-4 w-4" />
                    )}

                    {isPending ? "Procesando..." : botonTexto}
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                    <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                    </div>

                    <AlertDialogTitle>{titulo}</AlertDialogTitle>

                    <AlertDialogDescription className="space-y-3 text-sm leading-6">
                        <span className="block">
                            ¿Está seguro que desea {accion} el cliente{" "}
                            <span className="font-semibold text-slate-900">
                                {clienteNombre}
                            </span>
                            ?
                        </span>

                        {tieneMovimientos ? (
                            <span className="block">
                                Este cliente ya tiene comprobantes asociados, por
                                eso no se eliminará de la base de datos. Solo
                                quedará marcado como inactivo.
                            </span>
                        ) : (
                            <span className="block">
                                Este cliente no tiene comprobantes asociados, por
                                eso se eliminará definitivamente.
                            </span>
                        )}

                        {!tieneMovimientos && (
                            <span className="block font-semibold text-red-600">
                                Esta acción no se puede deshacer.
                            </span>
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>
                        Cancelar
                    </AlertDialogCancel>

                    <Button
                        type="button"
                        onClick={handleAction}
                        disabled={isPending}
                        className="bg-red-600 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}

                        {isPending ? "Procesando..." : botonConfirmar}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}