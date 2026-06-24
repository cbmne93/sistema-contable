import type { ReactNode } from "react";

interface ComprobanteInfoCardProps {
    title: string;
    icon?: ReactNode;
    children: ReactNode;
}

export function ComprobanteInfoCard({
    title,
    icon,
    children,
}: ComprobanteInfoCardProps) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
                {icon && (
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                        {icon}
                    </div>
                )}

                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    {title}
                </h2>
            </div>

            <div className="space-y-2 text-sm">{children}</div>
        </div>
    );
}