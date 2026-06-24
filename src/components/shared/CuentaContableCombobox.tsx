"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronsUpDown, Search, X } from "lucide-react";

export interface CuentaContableComboboxOption {
    id: string;
    codigo: string;
    nombre: string;
}

interface CuentaContableComboboxProps {
    value: string;
    cuentas: CuentaContableComboboxOption[];
    error?: string;
    placeholder?: string;
    onChange: (value: string) => void;
}

interface DropdownPosition {
    top: number;
    left: number;
    width: number;
}

function normalizeText(value: string) {
    return value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

export function CuentaContableCombobox({
    value,
    cuentas,
    error,
    placeholder = "Buscar cuenta...",
    onChange,
}: CuentaContableComboboxProps) {
    const buttonRef = useRef<HTMLDivElement | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [position, setPosition] = useState<DropdownPosition>({
        top: 0,
        left: 0,
        width: 0,
    });

    const selectedCuenta = useMemo(() => {
        return cuentas.find((cuenta) => cuenta.id === value) ?? null;
    }, [cuentas, value]);

    const filteredCuentas = useMemo(() => {
        const searchValue = normalizeText(search);

        if (!searchValue) {
            return cuentas.slice(0, 40);
        }

        return cuentas
            .filter((cuenta) => {
                const codigo = normalizeText(cuenta.codigo);
                const nombre = normalizeText(cuenta.nombre);
                const fullText = normalizeText(
                    `${cuenta.codigo} ${cuenta.nombre}`
                );

                return (
                    codigo.startsWith(searchValue) ||
                    nombre.includes(searchValue) ||
                    fullText.includes(searchValue)
                );
            })
            .slice(0, 40);
    }, [cuentas, search]);

    const updatePosition = () => {
        const button = buttonRef.current;

        if (!button) {
            return;
        }

        const rect = button.getBoundingClientRect();

        setPosition({
            top: rect.bottom + 6,
            left: rect.left,
            width: rect.width,
        });
    };

    const closeDropdown = () => {
        setIsOpen(false);
        setSearch("");
    };

    const handleOpen = () => {
        updatePosition();
        setIsOpen(true);
    };

    const handleToggle = () => {
        if (isOpen) {
            closeDropdown();
            return;
        }

        handleOpen();
    };

    const handleSelect = (cuentaId: string) => {
        onChange(cuentaId);
        closeDropdown();
    };

    const handleClear = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        onChange("");
        setSearch("");
    };

    const handleKeyDownButton = (
        event: React.KeyboardEvent<HTMLDivElement>
    ) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleToggle();
        }

        if (event.key === "Escape") {
            closeDropdown();
        }
    };

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            if (
                buttonRef.current?.contains(target) ||
                dropdownRef.current?.contains(target)
            ) {
                return;
            }

            closeDropdown();
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                closeDropdown();
            }
        };

        const handleScrollOrResize = () => {
            updatePosition();
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);
        window.addEventListener("resize", handleScrollOrResize);
        window.addEventListener("scroll", handleScrollOrResize, true);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("resize", handleScrollOrResize);
            window.removeEventListener("scroll", handleScrollOrResize, true);
        };
    }, [isOpen]);

    const dropdown =
        isOpen && typeof document !== "undefined"
            ? createPortal(
                <div
                    ref={dropdownRef}
                    className="fixed z-50 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
                    style={{
                        top: position.top,
                        left: position.left,
                        width: Math.max(position.width, 420),
                    }}
                >
                    <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2">
                        <Search className="h-4 w-4 shrink-0 text-slate-400" />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            autoFocus
                            placeholder="Buscar por código o nombre..."
                            className="h-8 w-full border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                        />
                    </div>

                    <div className="max-h-72 overflow-y-auto py-1">
                        {filteredCuentas.length === 0 ? (
                            <div className="px-3 py-3 text-sm text-slate-500">
                                No se encontraron cuentas.
                            </div>
                        ) : (
                            filteredCuentas.map((cuenta) => {
                                const isSelected = cuenta.id === value;

                                return (
                                    <button
                                        key={cuenta.id}
                                        type="button"
                                        onClick={() =>
                                            handleSelect(cuenta.id)
                                        }
                                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition hover:bg-slate-50"
                                    >
                                        <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                                            {isSelected && (
                                                <Check className="h-4 w-4 text-emerald-600" />
                                            )}
                                        </span>

                                        <span className="min-w-0 truncate">
                                            <span className="font-mono font-semibold text-slate-900">
                                                {cuenta.codigo}
                                            </span>

                                            <span className="text-slate-500">
                                                {" "}
                                                -{" "}
                                            </span>

                                            <span className="text-slate-700">
                                                {cuenta.nombre}
                                            </span>
                                        </span>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>,
                document.body
            )
            : null;

    return (
        <div>
            <div
                ref={buttonRef}
                role="button"
                tabIndex={0}
                onClick={handleToggle}
                onKeyDown={handleKeyDownButton}
                className={
                    error
                        ? "flex h-9 w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-red-300 bg-white px-2 text-left text-sm text-slate-900 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
                        : "flex h-9 w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-slate-300 bg-white px-2 text-left text-sm text-slate-900 outline-none transition hover:bg-slate-50 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                }
            >
                <span
                    className={
                        selectedCuenta
                            ? "min-w-0 truncate text-slate-900"
                            : "min-w-0 truncate text-slate-500"
                    }
                >
                    {selectedCuenta
                        ? `${selectedCuenta.codigo} - ${selectedCuenta.nombre}`
                        : placeholder}
                </span>

                <span className="flex shrink-0 items-center gap-1">
                    {selectedCuenta && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            title="Limpiar cuenta"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}

                    <ChevronsUpDown className="h-4 w-4 text-slate-400" />
                </span>
            </div>

            {dropdown}

            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
}