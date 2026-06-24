import { ChevronDown } from "lucide-react";

import type { SidebarMenuSection } from "./app-sidebar.constants";
import { isItemActive, SidebarNavItem } from "./SidebarNavItem";

interface SidebarSectionProps {
    section: SidebarMenuSection;
    pathname: string;
    isCollapsed: boolean;
    isOpen: boolean;
    onToggle: (title: string) => void;
}

export function SidebarSection({
    section,
    pathname,
    isCollapsed,
    isOpen,
    onToggle,
}: SidebarSectionProps) {
    const hasActiveItem = section.items.some((item) =>
        isItemActive(pathname, item.href)
    );

    const shouldShowItems = isCollapsed || isOpen || hasActiveItem;

    return (
        <div className="space-y-1 border-b border-slate-100 pb-2 last:border-b-0">
            {!isCollapsed && (
                <button
                    type="button"
                    onClick={() => onToggle(section.title)}
                    className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left transition hover:bg-slate-50"
                >
                    <span
                        className={
                            hasActiveItem
                                ? "text-[10px] font-bold uppercase tracking-wide text-slate-700"
                                : "text-[10px] font-semibold uppercase tracking-wide text-slate-400"
                        }
                    >
                        {section.title}
                    </span>

                    <ChevronDown
                        className={
                            shouldShowItems
                                ? "h-3.5 w-3.5 text-slate-400 transition-transform rotate-180"
                                : "h-3.5 w-3.5 text-slate-400 transition-transform"
                        }
                    />
                </button>
            )}

            {shouldShowItems && (
                <div className="space-y-1">
                    {section.items.map((item) => (
                        <SidebarNavItem
                            key={item.href}
                            item={item}
                            pathname={pathname}
                            isCollapsed={isCollapsed}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}