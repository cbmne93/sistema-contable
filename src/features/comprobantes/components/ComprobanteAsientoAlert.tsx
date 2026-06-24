interface ComprobanteAsientoAlertProps {
    numeroAsiento: number;
    acciones: string;
}

export function ComprobanteAsientoAlert({
    numeroAsiento,
    acciones,
}: ComprobanteAsientoAlertProps) {
    return (
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-800">
            Esta factura tiene generado el asiento contable N°{" "}
            <span className="font-semibold">{numeroAsiento}</span>. Para{" "}
            {acciones}, primero debe eliminar el asiento relacionado.
        </div>
    );
}