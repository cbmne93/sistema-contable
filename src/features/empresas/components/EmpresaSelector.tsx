"use client";

import { useMemo, useState } from "react";
import { Building2 } from "lucide-react";

import type { Empresa } from "../interfaces";

interface EmpresaSelectorProps {
    empresas: Empresa[];
}

const EMPRESA_ACTIVA_KEY = "empresaActivaId";

function getInitialEmpresaActivaId(empresasActivas: Empresa[]) {
    if (empresasActivas.length === 0) return "";

    if (typeof window === "undefined") {
        return empresasActivas[0].id;
    }

    const storedEmpresaId = window.localStorage.getItem(EMPRESA_ACTIVA_KEY);

    if (storedEmpresaId) {
        const empresaExiste = empresasActivas.some(
            (empresa) => empresa.id === storedEmpresaId
        );

        if (empresaExiste) {
            return storedEmpresaId;
        }
    }

    const primeraEmpresaId = empresasActivas[0].id;

    window.localStorage.setItem(EMPRESA_ACTIVA_KEY, primeraEmpresaId);

    return primeraEmpresaId;
}

export function EmpresaSelector({ empresas }: EmpresaSelectorProps) {
    const empresasActivas = useMemo(() => {
        return empresas.filter((empresa) => empresa.estado === "ACTIVO");
    }, [empresas]);

    const [empresaActivaId, setEmpresaActivaId] = useState(() =>
        getInitialEmpresaActivaId(empresasActivas)
    );

    const empresaActiva = empresasActivas.find(
        (empresa) => empresa.id === empresaActivaId
    );

    const handleChangeEmpresa = (empresaId: string) => {
        window.localStorage.setItem(EMPRESA_ACTIVA_KEY, empresaId);
        setEmpresaActivaId(empresaId);

        window.dispatchEvent(
            new CustomEvent("empresa-activa-change", {
                detail: {
                    empresaId,
                },
            })
        );
    };

    if (empresasActivas.length === 0) {
        return (
            <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                <Building2 className="h-4 w-4" />
                No hay empresas activas
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Empresa activa
            </label>

            <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                    <Building2 className="h-4 w-4 text-slate-600" />
                </div>

                <select
                    value={empresaActivaId}
                    onChange={(event) => handleChangeEmpresa(event.target.value)}
                    className="h-9 min-w-5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-slate-400"
                >
                    {empresasActivas.map((empresa) => (
                        <option key={empresa.id} value={empresa.id}>
                            {empresa.razonSocial}
                        </option>
                    ))}
                </select>
            </div>

            {empresaActiva && (
                <p className="text-xs text-slate-500">
                    RUC: {empresaActiva.ruc}-{empresaActiva.dv}
                </p>
            )}
        </div>
    );
}