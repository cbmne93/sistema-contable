export const MONTH_OPTIONS = [
    { value: "1", label: "Enero" },
    { value: "2", label: "Febrero" },
    { value: "3", label: "Marzo" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Mayo" },
    { value: "6", label: "Junio" },
    { value: "7", label: "Julio" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Septiembre" },
    { value: "10", label: "Octubre" },
    { value: "11", label: "Noviembre" },
    { value: "12", label: "Diciembre" },
    { value: "all", label: "Todo el periodo" },
];

export function getValidPage(value?: string) {
    const page = Number(value ?? 1);

    if (!Number.isInteger(page) || page < 1) {
        return 1;
    }

    return page;
}

export function getValidMonth(value?: string) {
    if (value === "all") {
        return "all";
    }

    const month = Number(value ?? new Date().getMonth() + 1);

    if (!Number.isInteger(month) || month < 1 || month > 12) {
        return String(new Date().getMonth() + 1);
    }

    return String(month);
}

export function getValidDate(value?: string) {
    if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return "";
    }

    return value;
}

export function formatReportCurrency(value: number) {
    return new Intl.NumberFormat("es-PY", {
        style: "currency",
        currency: "PYG",
        maximumFractionDigits: 0,
    }).format(value || 0);
}