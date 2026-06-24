"use client";

import { FormEvent, useState } from "react";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface SearchInputProps {
    basePath: string;
    placeholder?: string;
    extraParams?: Record<string, string | undefined>;
}

export function SearchInput({
    basePath,
    placeholder = "Buscar...",
    extraParams,
}: SearchInputProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentSearch = searchParams.get("search") ?? "";
    const [search, setSearch] = useState(currentSearch);

    const appendExtraParams = (params: URLSearchParams) => {
        if (!extraParams) {
            return;
        }

        Object.entries(extraParams).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            }
        });
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const params = new URLSearchParams();

        appendExtraParams(params);

        if (search.trim()) {
            params.set("search", search.trim());
        }

        params.set("page", "1");

        const queryString = params.toString();

        router.push(queryString ? `${basePath}?${queryString}` : basePath);
    };

    const handleClear = () => {
        setSearch("");

        const params = new URLSearchParams();

        appendExtraParams(params);

        const queryString = params.toString();

        router.push(queryString ? `${basePath}?${queryString}` : basePath);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full sm:max-w-xl">
            <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder={placeholder}
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-10 text-sm text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400"
                />

                {currentSearch && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                        title="Limpiar búsqueda"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
        </form>
    );
}