import Link from "next/link";

import type { SidebarMenuItem } from "./app-sidebar.constants";

interface SidebarNavItemProps {
    item: SidebarMenuItem;
    pathname: string;
    isCollapsed: boolean;
}

export function isItemActive(pathname: string, href: string) {
    if (href === "/dashboard") {
        return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
}

export function SidebarNavItem({
    item,
    pathname,
    isCollapsed,
}: SidebarNavItemProps) {
    const Icon = item.icon;
    const isActive = isItemActive(pathname, item.href);

    return (
        <Link
            href={item.href}
            title={item.title}
            aria-label={item.title}
            className={
                isCollapsed
                    ? `flex h-10 w-full items-center justify-center rounded-lg text-sm font-medium transition-colors ${isActive
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`
                    : `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`
            }
        >
            <Icon className="h-4 w-4 shrink-0" />

            {!isCollapsed && <span className="truncate">{item.title}</span>}
        </Link>
    );
}