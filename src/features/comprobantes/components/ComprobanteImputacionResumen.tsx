interface ComprobanteImputacionResumenProps {
    imputaIva: boolean;
    imputaIre: boolean;
    imputaIrpRsp: boolean;
    noImputa?: boolean;
    mostrarNoImputa?: boolean;
}

export function ComprobanteImputacionResumen({
    imputaIva,
    imputaIre,
    imputaIrpRsp,
    noImputa = false,
    mostrarNoImputa = false,
}: ComprobanteImputacionResumenProps) {
    const opciones = [
        imputaIva ? "IVA GENERAL" : null,
        imputaIre ? "IRE" : null,
        imputaIrpRsp ? "IRP-RSP" : null,
        mostrarNoImputa && noImputa ? "NO IMPUTAR" : null,
    ].filter(Boolean);

    return (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Imputación
                </span>

                {opciones.length > 0 ? (
                    opciones.map((opcion) => (
                        <span
                            key={opcion}
                            className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700"
                        >
                            {opcion}
                        </span>
                    ))
                ) : (
                    <span className="text-sm text-slate-500">
                        Sin imputación
                    </span>
                )}
            </div>
        </div>
    );
}