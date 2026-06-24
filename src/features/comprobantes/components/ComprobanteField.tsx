import type { ReactNode } from "react";

interface ComprobanteFieldProps {
    label: string;
    value: ReactNode;
}

export function ComprobanteField({ label, value }: ComprobanteFieldProps) {
    return (
        <p>
            <span className="font-medium text-slate-500">{label}:</span>{" "}
            <span className="text-slate-900">{value || "-"}</span>
        </p>
    );
}