import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

interface SidebarHeaderProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

export function SidebarHeader({ isCollapsed, onToggle }: SidebarHeaderProps) {
    return (
        <div
            className={
                isCollapsed
                    ? "flex h-20 items-center justify-center border-b border-slate-200 px-3"
                    : "flex h-20 items-center justify-between gap-3 border-b border-slate-200 px-6"
            }
        >
            {!isCollapsed && (
                <div className="min-w-0">
                    <h1 className="truncate text-xl font-bold tracking-tight text-slate-950">
                        Sistema Contable
                    </h1>

                    <p className="truncate text-sm text-slate-500">
                        Administración general
                    </p>
                </div>
            )}

            <button
                type="button"
                onClick={onToggle}
                title={
                    isCollapsed
                        ? "Expandir menú lateral"
                        : "Contraer menú lateral"
                }
                aria-label={
                    isCollapsed
                        ? "Expandir menú lateral"
                        : "Contraer menú lateral"
                }
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
            >
                {isCollapsed ? (
                    <PanelLeftOpen className="h-4 w-4" />
                ) : (
                    <PanelLeftClose className="h-4 w-4" />
                )}
            </button>
        </div>
    );
}