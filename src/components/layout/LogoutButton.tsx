"use client";

import { useTransition } from "react";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { clearSystemSessionCookiesAction } from "@/features/auth/actions/logout.action";

export function LogoutButton() {
    const [isPending, startTransition] = useTransition();

    const handleLogout = () => {
        startTransition(async () => {
            await clearSystemSessionCookiesAction();

            toast.success("Sesión cerrada correctamente.");

            await signOut({
                callbackUrl: "/login",
            });
        });
    };

    return (
        <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleLogout}
            disabled={isPending}
            className="gap-2"
        >
            <LogOut className="h-4 w-4" />
            {isPending ? "Saliendo..." : "Salir"}
        </Button>
    );
}