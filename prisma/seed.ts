import { loadEnvConfig } from "@next/env";
import bcrypt from "bcryptjs";

loadEnvConfig(process.cwd());

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

import {
    CondicionComprobante,
    EstadoAsientoContable,
    EstadoComprobante,
    EstadoPeriodoFiscal,
    EstadoRegistro,
    MonedaCuentaContable,
    NaturalezaCuentaContable,
    OrigenAsientoContable,
    OrigenTimbrado,
    RolEmpresa,
    RolUsuario,
    TipoComprobante,
    TipoCuentaContable,
    TipoDocumento,
    TipoImpuesto,
    TipoMovimiento,
    TipoPersona,
} from "../src/generated/prisma/enums";

import { PLAN_CUENTAS_BASE } from "../src/features/plan-cuentas/data/plan-cuentas-base";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
    adapter,
});

const TOTAL_CLIENTES = 15;
const TOTAL_PROVEEDORES = 15;
const TOTAL_TIMBRADOS_PROPIOS = 5;
const TOTAL_TIMBRADOS_PROVEEDOR = 10;
const TOTAL_FACTURAS_COMPRA = 25;
const TOTAL_FACTURAS_VENTA = 25;

function padNumber(value: number, length: number) {
    return String(value).padStart(length, "0");
}

function getTipoCuentaByCodigo(codigo: string) {
    const primerDigito = codigo.charAt(0);

    if (primerDigito === "1") return TipoCuentaContable.ACTIVO;
    if (primerDigito === "2") return TipoCuentaContable.PASIVO;
    if (primerDigito === "3") return TipoCuentaContable.PATRIMONIO;
    if (primerDigito === "4") return TipoCuentaContable.INGRESO;

    return TipoCuentaContable.EGRESO;
}

function getNaturaleza(value: "D" | "A") {
    return value === "D"
        ? NaturalezaCuentaContable.DEUDORA
        : NaturalezaCuentaContable.ACREEDORA;
}

function getMoneda(value: "C" | "01") {
    return value === "01"
        ? MonedaCuentaContable.EXTRANJERA
        : MonedaCuentaContable.LOCAL;
}

function getCuentaPadreCodigo({
    codigo,
    nivel,
}: {
    codigo: string;
    nivel: number;
}) {
    const posiblesPadres = PLAN_CUENTAS_BASE.filter(
        (cuenta) =>
            cuenta.nivel === nivel - 1 &&
            codigo.startsWith(cuenta.codigo) &&
            cuenta.codigo !== codigo
    ).sort((a, b) => b.codigo.length - a.codigo.length);

    return posiblesPadres[0]?.codigo ?? null;
}

async function seedPlanCuentas(empresaId: string) {
    const cuentasOrdenadas = [...PLAN_CUENTAS_BASE].sort((a, b) => {
        if (a.nivel !== b.nivel) return a.nivel - b.nivel;
        return a.codigo.length - b.codigo.length;
    });

    const cuentasCreadas = new Map<string, string>();

    for (const cuenta of cuentasOrdenadas) {
        const cuentaPadreCodigo = getCuentaPadreCodigo({
            codigo: cuenta.codigo,
            nivel: cuenta.nivel,
        });

        const cuentaPadreId = cuentaPadreCodigo
            ? cuentasCreadas.get(cuentaPadreCodigo) ?? null
            : null;

        const cuentaGuardada = await prisma.cuentaContable.upsert({
            where: {
                empresaId_codigo: {
                    empresaId,
                    codigo: cuenta.codigo,
                },
            },
            update: {
                cuentaPadreId,
                nombre: cuenta.nombre,
                tipo: getTipoCuentaByCodigo(cuenta.codigo),
                naturaleza: getNaturaleza(cuenta.naturaleza),
                nivel: cuenta.nivel,
                aceptaMovimiento: cuenta.aceptaAsiento === "S",
                moneda: getMoneda(cuenta.moneda),
                requiereAjusteCambio: cuenta.requiereAjusteCambio === "S",
                estado: EstadoRegistro.ACTIVO,
            },
            create: {
                empresaId,
                cuentaPadreId,
                codigo: cuenta.codigo,
                nombre: cuenta.nombre,
                tipo: getTipoCuentaByCodigo(cuenta.codigo),
                naturaleza: getNaturaleza(cuenta.naturaleza),
                nivel: cuenta.nivel,
                aceptaMovimiento: cuenta.aceptaAsiento === "S",
                moneda: getMoneda(cuenta.moneda),
                requiereAjusteCambio: cuenta.requiereAjusteCambio === "S",
                estado: EstadoRegistro.ACTIVO,
            },
        });

        cuentasCreadas.set(cuenta.codigo, cuentaGuardada.id);
    }
}

async function upsertCliente({
    empresaId,
    nombre,
    numeroDocumento,
    dv,
    index,
}: {
    empresaId: string;
    nombre: string;
    numeroDocumento: string;
    dv: string;
    index: number;
}) {
    const clienteActual = await prisma.cliente.findFirst({
        where: {
            empresaId,
            OR: [
                { nombre },
                {
                    tipoDocumento: TipoDocumento.RUC,
                    numeroDocumento,
                },
            ],
        },
    });

    const data = {
        nombre,
        tipoDocumento: TipoDocumento.RUC,
        numeroDocumento,
        dv,
        tipoPersona: TipoPersona.JURIDICA,
        direccion: `Dirección Cliente ${padNumber(index, 2)}, Asunción`,
        telefono: `021${padNumber(100000 + index, 6)}`,
        email: `cliente${padNumber(index, 2)}@demo.com`,
        estado: EstadoRegistro.ACTIVO,
    };

    if (clienteActual) {
        return prisma.cliente.update({
            where: {
                id: clienteActual.id,
            },
            data,
        });
    }

    return prisma.cliente.create({
        data: {
            empresaId,
            ...data,
        },
    });
}

async function upsertProveedor({
    empresaId,
    nombre,
    numeroDocumento,
    dv,
    index,
}: {
    empresaId: string;
    nombre: string;
    numeroDocumento: string;
    dv: string;
    index: number;
}) {
    const proveedorActual = await prisma.proveedor.findFirst({
        where: {
            empresaId,
            OR: [
                { nombre },
                {
                    tipoDocumento: TipoDocumento.RUC,
                    numeroDocumento,
                },
            ],
        },
    });

    const data = {
        nombre,
        tipoDocumento: TipoDocumento.RUC,
        numeroDocumento,
        dv,
        tipoPersona: TipoPersona.JURIDICA,
        direccion: `Dirección Proveedor ${padNumber(index, 2)}, Asunción`,
        telefono: `021${padNumber(200000 + index, 6)}`,
        email: `proveedor${padNumber(index, 2)}@demo.com`,
        estado: EstadoRegistro.ACTIVO,
    };

    if (proveedorActual) {
        return prisma.proveedor.update({
            where: {
                id: proveedorActual.id,
            },
            data,
        });
    }

    return prisma.proveedor.create({
        data: {
            empresaId,
            ...data,
        },
    });
}

async function upsertTimbrado({
    empresaId,
    sucursalId,
    proveedorId,
    origen,
    numero,
    establecimiento,
    puntoExpedicion,
    numeroDesde,
    numeroHasta,
    numeroActual,
}: {
    empresaId: string;
    sucursalId?: string;
    proveedorId?: string;
    origen: OrigenTimbrado;
    numero: string;
    establecimiento?: string;
    puntoExpedicion?: string;
    numeroDesde?: number;
    numeroHasta?: number;
    numeroActual?: number;
}) {
    const timbradoActual = await prisma.timbrado.findFirst({
        where: {
            empresaId,
            origen,
            numero,
            tipoComprobante: TipoComprobante.FACTURA,
            sucursalId: sucursalId ?? null,
            proveedorId: proveedorId ?? null,
        },
    });

    const data = {
        empresaId,
        sucursalId: sucursalId ?? null,
        proveedorId: proveedorId ?? null,
        origen,
        tipoComprobante: TipoComprobante.FACTURA,
        numero,
        fechaFin: new Date("2026-12-30T00:00:00.000Z"),
        establecimiento: establecimiento ?? null,
        puntoExpedicion: puntoExpedicion ?? null,
        numeroDesde: numeroDesde ?? null,
        numeroHasta: numeroHasta ?? null,
        numeroActual: numeroActual ?? null,
        estado: EstadoRegistro.ACTIVO,
    };

    if (timbradoActual) {
        return prisma.timbrado.update({
            where: {
                id: timbradoActual.id,
            },
            data,
        });
    }

    return prisma.timbrado.create({
        data,
    });
}

async function getCuentaId(empresaId: string, codigo: string) {
    const cuenta = await prisma.cuentaContable.findFirst({
        where: {
            empresaId,
            codigo,
        },
        select: {
            id: true,
        },
    });

    return cuenta?.id ?? null;
}

async function createComprobanteIfNotExists({
    empresaId,
    sucursalId,
    clienteId,
    proveedorId,
    timbradoId,
    tipoMovimiento,
    establecimiento,
    puntoExpedicion,
    numeroComprobante,
    numeroTimbrado,
    fechaEmision,
    concepto,
    detalles,
}: {
    empresaId: string;
    sucursalId: string;
    clienteId?: string;
    proveedorId?: string;
    timbradoId?: string;
    tipoMovimiento: TipoMovimiento;
    establecimiento: string;
    puntoExpedicion: string;
    numeroComprobante: string;
    numeroTimbrado: string;
    fechaEmision: Date;
    concepto: string;
    detalles: {
        descripcion: string;
        tipoImpuesto: TipoImpuesto;
        cuentaContableId?: string | null;
        exenta?: number;
        gravada5?: number;
        iva5?: number;
        gravada10?: number;
        iva10?: number;
        total: number;
    }[];
}) {
    const comprobanteActual = await prisma.comprobante.findFirst({
        where: {
            empresaId,
            tipoMovimiento,
            tipoComprobante: TipoComprobante.FACTURA,
            establecimiento,
            puntoExpedicion,
            numeroComprobante,
        },
    });

    if (comprobanteActual) {
        return comprobanteActual;
    }

    const totales = detalles.reduce(
        (acc, item) => ({
            exenta: acc.exenta + (item.exenta ?? 0),
            gravada5: acc.gravada5 + (item.gravada5 ?? 0),
            iva5: acc.iva5 + (item.iva5 ?? 0),
            gravada10: acc.gravada10 + (item.gravada10 ?? 0),
            iva10: acc.iva10 + (item.iva10 ?? 0),
            total: acc.total + item.total,
        }),
        {
            exenta: 0,
            gravada5: 0,
            iva5: 0,
            gravada10: 0,
            iva10: 0,
            total: 0,
        }
    );

    return prisma.comprobante.create({
        data: {
            empresaId,
            sucursalId,
            clienteId: clienteId ?? null,
            proveedorId: proveedorId ?? null,
            timbradoId: timbradoId ?? null,
            tipoMovimiento,
            tipoComprobante: TipoComprobante.FACTURA,
            condicion: CondicionComprobante.CONTADO,
            estado: EstadoComprobante.EMITIDO,
            numeroTimbrado,
            establecimiento,
            puntoExpedicion,
            numeroComprobante,
            fechaEmision,
            moneda: "PYG",
            cotizacion: 1,
            exenta: totales.exenta,
            gravada5: totales.gravada5,
            iva5: totales.iva5,
            gravada10: totales.gravada10,
            iva10: totales.iva10,
            total: totales.total,
            concepto,
            detalles: {
                create: detalles.map((item) => ({
                    cuentaContableId: item.cuentaContableId ?? null,
                    descripcion: item.descripcion,
                    tipoImpuesto: item.tipoImpuesto,
                    cantidad: 1,
                    precioUnitario: item.total,
                    exenta: item.exenta ?? 0,
                    gravada5: item.gravada5 ?? 0,
                    iva5: item.iva5 ?? 0,
                    gravada10: item.gravada10 ?? 0,
                    iva10: item.iva10 ?? 0,
                    total: item.total,
                })),
            },
        },
    });
}

function buildDetalleCompra(index: number, cuentaMercaderiasId: string | null) {
    const tipo = index % 3;

    if (tipo === 0) {
        const exenta = 50000 + index * 2500;

        return [
            {
                descripcion: "Compra exenta para pruebas",
                tipoImpuesto: TipoImpuesto.EXENTA,
                cuentaContableId: cuentaMercaderiasId,
                exenta,
                total: exenta,
            },
        ];
    }

    if (tipo === 1) {
        const gravada5 = 80000 + index * 3500;
        const iva5 = Math.round(gravada5 * 0.05);

        return [
            {
                descripcion: "Compra gravada 5% para pruebas",
                tipoImpuesto: TipoImpuesto.IVA_5,
                cuentaContableId: cuentaMercaderiasId,
                gravada5,
                iva5,
                total: gravada5 + iva5,
            },
        ];
    }

    const gravada10 = 100000 + index * 5000;
    const iva10 = Math.round(gravada10 * 0.1);

    return [
        {
            descripcion: "Compra gravada 10% para pruebas",
            tipoImpuesto: TipoImpuesto.IVA_10,
            cuentaContableId: cuentaMercaderiasId,
            gravada10,
            iva10,
            total: gravada10 + iva10,
        },
    ];
}

function buildDetalleVenta(index: number, cuentaVentasId: string | null) {
    const tipo = index % 3;

    if (tipo === 0) {
        const exenta = 90000 + index * 3000;

        return [
            {
                descripcion: "Venta exenta para pruebas",
                tipoImpuesto: TipoImpuesto.EXENTA,
                cuentaContableId: cuentaVentasId,
                exenta,
                total: exenta,
            },
        ];
    }

    if (tipo === 1) {
        const gravada5 = 120000 + index * 4500;
        const iva5 = Math.round(gravada5 * 0.05);

        return [
            {
                descripcion: "Venta gravada 5% para pruebas",
                tipoImpuesto: TipoImpuesto.IVA_5,
                cuentaContableId: cuentaVentasId,
                gravada5,
                iva5,
                total: gravada5 + iva5,
            },
        ];
    }

    const gravada10 = 180000 + index * 7000;
    const iva10 = Math.round(gravada10 * 0.1);

    return [
        {
            descripcion: "Venta gravada 10% para pruebas",
            tipoImpuesto: TipoImpuesto.IVA_10,
            cuentaContableId: cuentaVentasId,
            gravada10,
            iva10,
            total: gravada10 + iva10,
        },
    ];
}

async function createAsientoManualIfNotExists({
    empresaId,
    periodoFiscalId,
    sucursalId,
    cuentaDebeId,
    cuentaHaberId,
}: {
    empresaId: string;
    periodoFiscalId: string;
    sucursalId: string;
    cuentaDebeId: string;
    cuentaHaberId: string;
}) {
    const asientoActual = await prisma.asientoContable.findFirst({
        where: {
            empresaId,
            periodoFiscalId,
            numero: 1,
        },
    });

    if (asientoActual) {
        return asientoActual;
    }

    return prisma.asientoContable.create({
        data: {
            empresaId,
            periodoFiscalId,
            sucursalId,
            numero: 1,
            fecha: new Date("2026-01-02T00:00:00.000Z"),
            concepto: "Asiento manual de apertura para pruebas",
            origen: OrigenAsientoContable.MANUAL,
            estado: EstadoAsientoContable.CONFIRMADO,
            totalDebe: 1000000,
            totalHaber: 1000000,
            detalles: {
                create: [
                    {
                        cuentaContableId: cuentaDebeId,
                        descripcion: "Caja inicial",
                        debe: 1000000,
                        haber: 0,
                    },
                    {
                        cuentaContableId: cuentaHaberId,
                        descripcion: "Capital inicial",
                        debe: 0,
                        haber: 1000000,
                    },
                ],
            },
        },
    });
}

async function main() {
    const passwordHash = await bcrypt.hash("admin123", 10);

    const usuario = await prisma.usuario.upsert({
        where: {
            email: "admin@demo.com",
        },
        update: {
            nombre: "Administrador",
            password: passwordHash,
            rol: RolUsuario.ADMIN,
            activo: true,
        },
        create: {
            nombre: "Administrador",
            email: "admin@demo.com",
            password: passwordHash,
            rol: RolUsuario.ADMIN,
            activo: true,
        },
    });

    const empresa = await prisma.empresa.upsert({
        where: {
            ruc: "80021940",
        },
        update: {
            razonSocial: "Empresa Demo SA",
            nombreFantasia: "Empresa Demo SA",
            dv: "6",
            direccion: "Avda. Demo 123, Asunción",
            telefono: "021000000",
            email: "empresa@demo.com",
            estado: EstadoRegistro.ACTIVO,
        },
        create: {
            razonSocial: "Empresa Demo SA",
            nombreFantasia: "Empresa Demo SA",
            ruc: "80021940",
            dv: "6",
            direccion: "Avda. Demo 123, Asunción",
            telefono: "021000000",
            email: "empresa@demo.com",
            estado: EstadoRegistro.ACTIVO,
        },
    });

    await prisma.usuarioEmpresa.upsert({
        where: {
            usuarioId_empresaId: {
                usuarioId: usuario.id,
                empresaId: empresa.id,
            },
        },
        update: {
            rol: RolEmpresa.ADMIN_EMPRESA,
            activo: true,
        },
        create: {
            usuarioId: usuario.id,
            empresaId: empresa.id,
            rol: RolEmpresa.ADMIN_EMPRESA,
            activo: true,
        },
    });

    const periodoFiscal = await prisma.periodoFiscal.upsert({
        where: {
            empresaId_anio: {
                empresaId: empresa.id,
                anio: 2026,
            },
        },
        update: {
            descripcion: "Periodo Fiscal 2026",
            fechaInicio: new Date("2026-01-01T00:00:00.000Z"),
            fechaFin: new Date("2026-12-31T23:59:59.999Z"),
            estado: EstadoPeriodoFiscal.ABIERTO,
        },
        create: {
            empresaId: empresa.id,
            anio: 2026,
            descripcion: "Periodo Fiscal 2026",
            fechaInicio: new Date("2026-01-01T00:00:00.000Z"),
            fechaFin: new Date("2026-12-31T23:59:59.999Z"),
            estado: EstadoPeriodoFiscal.ABIERTO,
        },
    });

    const sucursal = await prisma.sucursal.upsert({
        where: {
            empresaId_codigo: {
                empresaId: empresa.id,
                codigo: "001",
            },
        },
        update: {
            nombre: "Casa Matriz",
            direccion: "Avda. Demo 123, Asunción",
            telefono: "021000000",
            estado: EstadoRegistro.ACTIVO,
        },
        create: {
            empresaId: empresa.id,
            codigo: "001",
            nombre: "Casa Matriz",
            direccion: "Avda. Demo 123, Asunción",
            telefono: "021000000",
            estado: EstadoRegistro.ACTIVO,
        },
    });

    const clientes = [];
    const proveedores = [];

    for (let index = 1; index <= TOTAL_CLIENTES; index++) {
        const cliente = await upsertCliente({
            empresaId: empresa.id,
            nombre: `Cliente Demo ${padNumber(index, 2)} SA`,
            numeroDocumento: String(80012000 + index),
            dv: String(index % 10),
            index,
        });

        clientes.push(cliente);
    }

    for (let index = 1; index <= TOTAL_PROVEEDORES; index++) {
        const proveedor = await upsertProveedor({
            empresaId: empresa.id,
            nombre: `Proveedor Demo ${padNumber(index, 2)} SA`,
            numeroDocumento: String(8653000 + index),
            dv: String(index % 10),
            index,
        });

        proveedores.push(proveedor);
    }

    await seedPlanCuentas(empresa.id);

    const cuentaMercaderiasId = await getCuentaId(empresa.id, "11302");
    const cuentaVentasId = await getCuentaId(empresa.id, "443");
    const cuentaCajaId = await getCuentaId(empresa.id, "11111");
    const cuentaCapitalId = await getCuentaId(empresa.id, "331");

    const timbradosPropios = [];
    const timbradosProveedor = [];

    for (let index = 1; index <= TOTAL_TIMBRADOS_PROPIOS; index++) {
        const establecimiento = padNumber(index, 3);
        const numeroTimbrado = String(17580000 + index);

        const timbrado = await upsertTimbrado({
            empresaId: empresa.id,
            sucursalId: sucursal.id,
            origen: OrigenTimbrado.PROPIO,
            numero: numeroTimbrado,
            establecimiento,
            puntoExpedicion: "001",
            numeroDesde: 1,
            numeroHasta: 9999999,
            numeroActual: 30,
        });

        timbradosPropios.push(timbrado);
    }

    for (let index = 1; index <= TOTAL_TIMBRADOS_PROVEEDOR; index++) {
        const proveedor = proveedores[index - 1];
        const numeroTimbrado = String(17585000 + index);

        const timbrado = await upsertTimbrado({
            empresaId: empresa.id,
            proveedorId: proveedor.id,
            origen: OrigenTimbrado.PROVEEDOR,
            numero: numeroTimbrado,
        });

        timbradosProveedor.push(timbrado);
    }

    for (let index = 1; index <= TOTAL_FACTURAS_COMPRA; index++) {
        const proveedor = proveedores[(index - 1) % proveedores.length];
        const timbrado = timbradosProveedor[(index - 1) % timbradosProveedor.length];

        await createComprobanteIfNotExists({
            empresaId: empresa.id,
            sucursalId: sucursal.id,
            proveedorId: proveedor.id,
            timbradoId: timbrado.id,
            tipoMovimiento: TipoMovimiento.EGRESO,
            establecimiento: padNumber(100 + index, 3),
            puntoExpedicion: padNumber(((index - 1) % 5) + 1, 3),
            numeroComprobante: padNumber(1000000 + index, 7),
            numeroTimbrado: timbrado.numero,
            fechaEmision: new Date(`2026-06-${padNumber(((index - 1) % 25) + 1, 2)}T00:00:00.000Z`),
            concepto: `Compra de prueba ${padNumber(index, 2)}`,
            detalles: buildDetalleCompra(index, cuentaMercaderiasId),
        });
    }

    for (let index = 1; index <= TOTAL_FACTURAS_VENTA; index++) {
        const cliente = clientes[(index - 1) % clientes.length];
        const timbrado = timbradosPropios[(index - 1) % timbradosPropios.length];

        await createComprobanteIfNotExists({
            empresaId: empresa.id,
            sucursalId: sucursal.id,
            clienteId: cliente.id,
            timbradoId: timbrado.id,
            tipoMovimiento: TipoMovimiento.INGRESO,
            establecimiento: timbrado.establecimiento ?? "001",
            puntoExpedicion: timbrado.puntoExpedicion ?? "001",
            numeroComprobante: padNumber(index, 7),
            numeroTimbrado: timbrado.numero,
            fechaEmision: new Date(`2026-06-${padNumber(((index - 1) % 25) + 1, 2)}T00:00:00.000Z`),
            concepto: `Venta de prueba ${padNumber(index, 2)}`,
            detalles: buildDetalleVenta(index, cuentaVentasId),
        });
    }

    if (cuentaCajaId && cuentaCapitalId) {
        await createAsientoManualIfNotExists({
            empresaId: empresa.id,
            periodoFiscalId: periodoFiscal.id,
            sucursalId: sucursal.id,
            cuentaDebeId: cuentaCajaId,
            cuentaHaberId: cuentaCapitalId,
        });
    }

    console.log("Seed ejecutado correctamente.");
    console.log("Usuario: admin@demo.com");
    console.log("Contraseña: admin123");
    console.log(`Empresa: ${empresa.razonSocial}`);
    console.log(`Clientes: ${TOTAL_CLIENTES}`);
    console.log(`Proveedores: ${TOTAL_PROVEEDORES}`);
    console.log(`Timbrados: ${TOTAL_TIMBRADOS_PROPIOS + TOTAL_TIMBRADOS_PROVEEDOR}`);
    console.log(`Facturas de compra: ${TOTAL_FACTURAS_COMPRA}`);
    console.log(`Facturas de venta: ${TOTAL_FACTURAS_VENTA}`);
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
