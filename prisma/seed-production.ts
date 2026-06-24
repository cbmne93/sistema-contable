import { loadEnvConfig } from "@next/env";
import bcrypt from "bcryptjs";

loadEnvConfig(process.cwd());

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { RolUsuario } from "../src/generated/prisma/enums";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
    adapter,
});

async function main() {
    const nombre = process.env.SEED_ADMIN_NAME;
    const email = process.env.SEED_ADMIN_EMAIL;
    const password = process.env.SEED_ADMIN_PASSWORD;

    if (!nombre) {
        throw new Error("Falta SEED_ADMIN_NAME en el archivo .env");
    }

    if (!email) {
        throw new Error("Falta SEED_ADMIN_EMAIL en el archivo .env");
    }

    if (!password) {
        throw new Error("Falta SEED_ADMIN_PASSWORD en el archivo .env");
    }

    if (password.length < 10) {
        throw new Error(
            "SEED_ADMIN_PASSWORD debe tener al menos 10 caracteres."
        );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const usuario = await prisma.usuario.upsert({
        where: {
            email,
        },
        update: {
            nombre,
            password: hashedPassword,
            rol: RolUsuario.ADMIN,
            activo: true,
        },
        create: {
            nombre,
            email,
            password: hashedPassword,
            rol: RolUsuario.ADMIN,
            activo: true,
        },
    });

    console.log("Usuario administrador listo:");
    console.log(`- Nombre: ${usuario.nombre}`);
    console.log(`- Email: ${usuario.email}`);
    console.log("- Rol: ADMIN");
}

main()
    .catch((error) => {
        console.error("Error al crear usuario administrador:");
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });