import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    providers: [
        Credentials({
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                },
                password: {
                    label: "Contraseña",
                    type: "password",
                },
            },
            async authorize(credentials) {
                const email = String(credentials?.email ?? "")
                    .trim()
                    .toLowerCase();

                const password = String(credentials?.password ?? "");

                if (!email || !password) {
                    return null;
                }

                const usuario = await prisma.usuario.findUnique({
                    where: {
                        email,
                    },
                    select: {
                        id: true,
                        nombre: true,
                        email: true,
                        password: true,
                        rol: true,
                        activo: true,
                    },
                });

                if (!usuario || !usuario.activo) {
                    return null;
                }

                const passwordValido = await bcrypt.compare(
                    password,
                    usuario.password
                );

                if (!passwordValido) {
                    return null;
                }

                return {
                    id: usuario.id,
                    name: usuario.nombre,
                    email: usuario.email,
                    rol: usuario.rol,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.rol = user.rol;
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = String(token.id);
                session.user.rol = String(token.rol);
            }

            return session;
        },
    },
});