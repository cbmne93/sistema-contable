"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronsUpDown, Search, X } from "lucide-react";

interface ClienteComboboxOption {
    id: string;
    nombre: string;
    numeroDocumento: string;
    dv: string | null;
}

interface ClienteComboboxProps {
    value: string;
    clientes: ClienteComboboxOption[];
    error?: string;
    disabled?: boolean;
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

function getClienteDocumento(cliente: ClienteComboboxOption) {
    if (!cliente.numeroDocumento) {
        return "";
    }

    return `${cliente.numeroDocumento}${cliente.dv ? `-${cliente.dv}` : ""}`;
}

function getClienteLabel(cliente: ClienteComboboxOption) {
    const documento = getClienteDocumento(cliente);

    if (!documento) {
        return cliente.nombre;
    }

    return `${cliente.nombre} - ${documento}`;
}

export function ClienteCombobox({
    value,
    clientes,
    error,
    disabled = false,
    onChange,
}: ClienteComboboxProps) {
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const searchInputRef = useRef<HTMLInputElement | null>(null);

    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);
    const [position, setPosition] = useState<DropdownPosition>({
        top: 0,
        left: 0,
        width: 0,
    });

    const selectedCliente = clientes.find((cliente) => cliente.id === value);

    const filteredClientes = useMemo(() => {
        const searchValue = normalizeText(search);

        if (!searchValue) {
            return clientes.slice(0, 50);
        }

        return clientes
            .filter((cliente) => {
                const nombre = normalizeText(cliente.nombre);
                const documento = normalizeText(getClienteDocumento(cliente));
                const textoCompleto = normalizeText(
                    `${cliente.nombre} ${getClienteDocumento(cliente)}`
                );

                return (
                    nombre.includes(searchValue) ||
                    documento.includes(searchValue) ||
                    textoCompleto.includes(searchValue)
                );
            })
            .slice(0, 50);
    }, [clientes, search]);

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

    const handleOpen = () => {
        if (disabled) {
            return;
        }

        updatePosition();
        setIsOpen(true);
        setActiveIndex(0);
    };

    const handleToggle = () => {
        if (disabled) {
            return;
        }

        if (isOpen) {
            setIsOpen(false);
            return;
        }

        handleOpen();
    };

    const handleSelect = (clienteId: string) => {
        onChange(clienteId);
        setIsOpen(false);
        setSearch("");
        setActiveIndex(0);
    };

    const handleClear = () => {
        onChange("");
        setSearch("");
        setActiveIndex(0);
        setIsOpen(false);
    };



    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const timer = window.setTimeout(() => {
            searchInputRef.current?.focus();
        }, 0);

        return () => window.clearTimeout(timer);
    }, [isOpen]);



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

            setIsOpen(false);
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
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
                        width: position.width,
                    }}
                >
                    <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2">
                        <Search className="h-4 w-4 shrink-0 text-slate-400" />

                        <input
                            ref={searchInputRef}
                            type="text"
                            value={search}
                            onChange={(event) => {
                                setSearch(event.target.value);
                                setActiveIndex(0);
                            }}
                            onKeyDown={(event) => {
                                if (event.key === "ArrowDown") {
                                    event.preventDefault();

                                    setActiveIndex((current) =>
                                        Math.min(
                                            current + 1,
                                            filteredClientes.length - 1
                                        )
                                    );
                                }

                                if (event.key === "ArrowUp") {
                                    event.preventDefault();

                                    setActiveIndex((current) =>
                                        Math.max(current - 1, 0)
                                    );
                                }

                                if (event.key === "Enter") {
                                    event.preventDefault();

                                    const cliente =
                                        filteredClientes[activeIndex];

                                    if (cliente) {
                                        handleSelect(cliente.id);
                                    }
                                }
                            }}
                            placeholder="Buscar por nombre o RUC..."
                            className="h-8 w-full border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                        />
                    </div>

                    <div className="max-h-72 overflow-y-auto py-1">
                        {filteredClientes.length === 0 ? (
                            <div className="px-3 py-3 text-sm text-slate-500">
                                No se encontraron clientes.
                            </div>
                        ) : (
                            filteredClientes.map((cliente, index) => {
                                const isSelected = cliente.id === value;
                                const isActive = index === activeIndex;
                                const documento = getClienteDocumento(cliente);

                                return (
                                    <button
                                        key={cliente.id}
                                        type="button"
                                        onMouseEnter={() =>
                                            setActiveIndex(index)
                                        }
                                        onClick={() =>
                                            handleSelect(cliente.id)
                                        }
                                        className={
                                            isActive
                                                ? "flex w-full items-center gap-2 bg-slate-50 px-3 py-2 text-left text-sm transition"
                                                : "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition hover:bg-slate-50"
                                        }
                                    >
                                        <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                                            {isSelected && (
                                                <Check className="h-4 w-4 text-emerald-600" />
                                            )}
                                        </span>

                                        <span className="min-w-0">
                                            <span className="block truncate font-medium text-slate-900">
                                                {cliente.nombre}
                                            </span>

                                            {documento && (
                                                <span className="block truncate text-xs text-slate-500">
                                                    RUC {documento}
                                                </span>
                                            )}
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
            <div className="relative">
                <button
                    ref={buttonRef}
                    type="button"
                    onClick={handleToggle}
                    disabled={disabled}
                    className={
                        error
                            ? "flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-red-300 bg-white px-3 text-left text-sm text-slate-900 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                            : "flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-slate-300 bg-white px-3 text-left text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100"
                    }
                >
                    <span className="min-w-0 truncate">
                        {selectedCliente
                            ? getClienteLabel(selectedCliente)
                            : "Seleccione un cliente"}
                    </span>

                    <span className="flex shrink-0 items-center gap-1">
                        {selectedCliente && !disabled && (
                            <span
                                role="button"
                                tabIndex={-1}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    handleClear();
                                }}
                                className="rounded-md p-0.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                            >
                                <X className="h-4 w-4" />
                            </span>
                        )}

                        <ChevronsUpDown className="h-4 w-4 text-slate-400" />
                    </span>
                </button>
            </div>

            {dropdown}

            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
}