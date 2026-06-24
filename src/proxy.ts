import { NextResponse } from "next/server";

import { auth } from "../auth";

const publicRoutes = ["/login"];

export default auth((req) => {
    const { pathname } = req.nextUrl;
    const isLoggedIn = !!req.auth;

    const isPublicRoute = publicRoutes.some((route) =>
        pathname.startsWith(route)
    );

    if (!isLoggedIn && !isPublicRoute) {
        const loginUrl = new URL("/login", req.nextUrl.origin);

        return NextResponse.redirect(loginUrl);
    }

    if (isLoggedIn && pathname === "/login") {
        const seleccionarEmpresaUrl = new URL(
            "/seleccionar-empresa",
            req.nextUrl.origin
        );

        return NextResponse.redirect(seleccionarEmpresaUrl);
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)",
    ],
};