import type { LucideIcon } from "lucide-react";
import {
    BarChart3,
    Building2,
    CalendarDays,
    FileText,
    Home,
    Landmark,
    ReceiptText,
    Settings2,
    Store,
    UserRound,
    Users,
} from "lucide-react";

export const SIDEBAR_COLLAPSED_KEY = "sidebar_collapsed";
export const SIDEBAR_OPEN_SECTIONS_KEY = "sidebar_open_sections";

export interface SidebarMenuItem {
    title: string;
    href: string;
    icon: LucideIcon;
}

export interface SidebarMenuSection {
    title: string;
    items: SidebarMenuItem[];
}

export const menuSections: SidebarMenuSection[] = [
    {
        title: "General",
        items: [
            {
                title: "Dashboard",
                href: "/dashboard",
                icon: Home,
            },
        ],
    },
    {
        title: "Administración",
        items: [
            {
                title: "Empresa",
                href: "/empresas",
                icon: Building2,
            },
            {
                title: "Sucursales",
                href: "/sucursales",
                icon: Store,
            },
            {
                title: "Periodos fiscales",
                href: "/periodos-fiscales",
                icon: CalendarDays,
            },
        ],
    },
    {
        title: "Contactos",
        items: [
            {
                title: "Clientes",
                href: "/clientes",
                icon: Users,
            },
            {
                title: "Proveedores",
                href: "/proveedores",
                icon: UserRound,
            },
        ],
    },
    {
        title: "Comprobantes",
        items: [
            {
                title: "Timbrados",
                href: "/timbrados",
                icon: FileText,
            },
            {
                title: "Facturas de venta",
                href: "/facturas-venta",
                icon: ReceiptText,
            },
            {
                title: "Facturas de compra",
                href: "/facturas-compra",
                icon: ReceiptText,
            },
        ],
    },
    {
        title: "Contabilidad",
        items: [
            {
                title: "Plan de cuentas",
                href: "/plan-cuentas",
                icon: FileText,
            },
            {
                title: "Asientos contables",
                href: "/asientos-contables",
                icon: Landmark,
            },
            {
                title: "Configuración contable",
                href: "/configuracion-contable",
                icon: Settings2,
            },
        ],
    },
    {
        title: "Reportes",
        items: [
            {
                title: "Reportes",
                href: "/reportes",
                icon: BarChart3,
            },
        ],
    },
];