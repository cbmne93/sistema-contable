"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import {
    menuSections,
    SIDEBAR_COLLAPSED_KEY,
    SIDEBAR_OPEN_SECTIONS_KEY,
    SidebarHeader,
    SidebarSection,
} from "./sidebar";

const DEFAULT_OPEN_SECTIONS = ["General"];

function getStoredCollapsedValue() {
    if (typeof window === "undefined") return false;

    return window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true";
}

function getStoredOpenSections() {
    if (typeof window === "undefined") return DEFAULT_OPEN_SECTIONS;

    const storedOpenSections = window.localStorage.getItem(
        SIDEBAR_OPEN_SECTIONS_KEY
    );

    if (!storedOpenSections) return DEFAULT_OPEN_SECTIONS;

    try {
        const parsedSections = JSON.parse(storedOpenSections);

        if (Array.isArray(parsedSections)) {
            return parsedSections.filter(
                (section): section is string => typeof section === "string"
            );
        }

        return DEFAULT_OPEN_SECTIONS;
    } catch {
        return DEFAULT_OPEN_SECTIONS;
    }
}

function getActiveSectionTitles(pathname: string) {
    return menuSections
        .filter((section) =>
            section.items.some((item) => {
                if (item.href === "/dashboard") {
                    return pathname === item.href;
                }

                return (
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`)
                );
            })
        )
        .map((section) => section.title);
}

export function AppSidebar() {
    const pathname = usePathname();

    const [isCollapsed, setIsCollapsed] = useState(getStoredCollapsedValue);
    const [openSections, setOpenSections] = useState(getStoredOpenSections);

    const activeSectionTitles = useMemo(
        () => getActiveSectionTitles(pathname),
        [pathname]
    );

    const visibleOpenSections = useMemo(() => {
        return Array.from(new Set([...openSections, ...activeSectionTitles]));
    }, [openSections, activeSectionTitles]);

    const toggleSidebar = () => {
        setIsCollapsed((currentValue) => {
            const nextValue = !currentValue;

            window.localStorage.setItem(
                SIDEBAR_COLLAPSED_KEY,
                String(nextValue)
            );

            return nextValue;
        });
    };

    const toggleSection = (title: string) => {
        setOpenSections((currentSections) => {
            const isCurrentlyOpen = currentSections.includes(title);

            const nextSections = isCurrentlyOpen
                ? currentSections.filter(
                    (sectionTitle) => sectionTitle !== title
                )
                : [...currentSections, title];

            window.localStorage.setItem(
                SIDEBAR_OPEN_SECTIONS_KEY,
                JSON.stringify(nextSections)
            );

            return nextSections;
        });
    };

    return (
        <aside
            className={
                isCollapsed
                    ? "sticky top-0 hidden h-screen w-20 shrink-0 overflow-y-auto border-r border-slate-200 bg-white transition-all duration-200 lg:block"
                    : "sticky top-0 hidden h-screen w-72 shrink-0 overflow-y-auto border-r border-slate-200 bg-white transition-all duration-200 lg:block"
            }
        >
            <SidebarHeader
                isCollapsed={isCollapsed}
                onToggle={toggleSidebar}
            />

            <nav className="space-y-3 p-3">
                {menuSections.map((section) => (
                    <SidebarSection
                        key={section.title}
                        section={section}
                        pathname={pathname}
                        isCollapsed={isCollapsed}
                        isOpen={visibleOpenSections.includes(section.title)}
                        onToggle={toggleSection}
                    />
                ))}
            </nav>
        </aside>
    );
}