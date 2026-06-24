import { FileText } from "lucide-react";

interface TimbradosTableEmptyProps {
    colSpan: number;
}

export function TimbradosTableEmpty({ colSpan }: TimbradosTableEmptyProps) {
    return (
        <tr>
            <td colSpan={colSpan} className="px-4 py-12">
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                        <FileText className="h-6 w-6 text-slate-400" />
                    </div>

                    <p className="text-sm font-medium text-slate-700">
                        No hay timbrados registrados
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                        Cree un nuevo timbrado para comenzar a operar.
                    </p>
                </div>
            </td>
        </tr>
    );
}