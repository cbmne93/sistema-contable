# Sistema Contable con Next.js

Sistema administrativo contable desarrollado con **Next.js**, **TypeScript**, **Prisma** y **PostgreSQL**, orientado a la gestión contable de empresas en Paraguay.

El sistema está enfocado en una estructura **multiempresa**, con módulos para administración de empresas, sucursales, clientes, proveedores, timbrados, comprobantes, asientos contables, plan de cuentas, reportes y generación de archivos para **DNIT / Marangatu**.

---

## Stack principal

* Next.js 16
* React 19
* TypeScript
* Prisma ORM
* PostgreSQL
* Docker
* shadcn/ui
* Tailwind CSS
* lucide-react
* React Hook Form
* Zod
* ExcelJS
* pdfmake
* JSZip
* NextAuth

---

## Objetivo del proyecto

El objetivo del sistema es administrar la información contable y tributaria básica de una o varias empresas, permitiendo registrar comprobantes de compra y venta, generar asientos contables, consultar reportes y preparar archivos compatibles con el registro de comprobantes de la **DNIT / Marangatu**.

---

## Funcionalidades principales

### Multiempresa

* Registro de empresas.
* Selección de empresa activa.
* Trabajo separado por empresa.
* Validación de datos por empresa.
* Gestión de obligaciones tributarias.

### Periodos fiscales

* Creación de periodos fiscales.
* Activación de periodo fiscal.
* Validación de fechas según periodo activo.

### Clientes y proveedores

* Gestión de clientes.
* Gestión de proveedores.
* Validación de documentos.
* Datos separados por empresa.

### Sucursales

* Administración de sucursales por empresa.
* Uso de sucursal en módulos donde corresponde.

### Timbrados

* Gestión de timbrados propios.
* Gestión de timbrados de proveedores.
* Validación de número de timbrado.
* Control por empresa, tipo de comprobante y origen.

### Facturas de venta

* Registro de facturas de venta.
* Condición contado o crédito.
* Moneda y cotización.
* Cálculo de gravadas, exentas e IVA.
* Estado del comprobante: emitido o anulado.
* Anulación de facturas de venta.
* Generación opcional de asiento contable automático.

### Facturas de compra

* Registro de facturas de compra.
* Condición contado o crédito.
* Moneda y cotización.
* Cálculo de gravadas, exentas e IVA.
* Edición y eliminación.
* Generación opcional de asiento contable automático.

### Plan de cuentas

* Plan de cuentas por empresa.
* Cuentas agrupadoras y cuentas de movimiento.
* Validaciones para evitar modificaciones incorrectas.
* Activación y desactivación de cuentas.
* Creación de plan base.

### Asientos contables

* Registro de asientos manuales.
* Asientos generados desde compras y ventas.
* Validación de debe y haber.
* Control de origen del asiento.
* Edición y eliminación según reglas contables.

### Configuración contable

* Configuración de cuentas contables usadas para asientos automáticos.
* Activación o desactivación de generación automática de asientos.

### Reportes

* Libro de compras.
* Libro de ventas.
* Registro de comprobantes - DNIT.
* Exportación a Excel.
* Exportación a PDF.

### DNIT / Marangatu

* Generación de registros de comprobantes.
* Tipos: compras, ventas y total.
* Correlativos independientes por tipo.
* Generación de ZIP con CSV o TXT.
* Formato de nombre compatible con DNIT / Marangatu.
* Control de comprobantes pendientes.
* Anulación de registros generados.
* Eliminación de registros anulados.

---

## Estructura general del proyecto

```txt
src
├── app
├── components
├── features
├── generated
├── lib
└── types
```

### `src/app`

Contiene las rutas principales de Next.js App Router.

```txt
src/app
├── (auth)
├── (dashboard)
├── api
├── crear-empresa
└── seleccionar-empresa
```

### `src/features`

Contiene los módulos funcionales del sistema.

```txt
src/features
├── asientos-contables
├── auth
├── clientes
├── comprobantes
├── configuracion-contable
├── empresas
├── facturas-compra
├── facturas-venta
├── periodos-fiscales
├── plan-cuentas
├── proveedores
├── reportes
├── sucursales
└── timbrados
```

### `src/components`

Contiene componentes globales reutilizables.

```txt
src/components
├── layout
├── shared
└── ui
```

### `src/generated/prisma`

Contiene el Prisma Client generado.

### `src/lib`

Contiene utilidades generales del proyecto, incluyendo la instancia de Prisma.

---

## Requisitos previos

Antes de ejecutar el proyecto, se necesita tener instalado:

* Node.js
* npm
* Docker Desktop
* Git

---

## Instalación

Clonar el repositorio:

```bash
git clone <url-del-repositorio>
cd sistema-contable
```

Instalar dependencias:

```bash
npm install
```

---

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto.

Ejemplo:

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/sistema_contable"
AUTH_SECRET="clave_secreta_segura"
AUTH_TRUST_HOST=true
```

> No subir el archivo `.env` al repositorio.

---

## Base de datos con Docker

Levantar PostgreSQL con Docker:

```bash
docker compose up -d
```

Verificar que el contenedor esté activo:

```bash
docker ps
```

---

## Prisma

Generar Prisma Client:

```bash
npx prisma generate
```

Ejecutar migraciones en desarrollo:

```bash
npx prisma migrate dev
```

Ejecutar seed, si corresponde:

```bash
npm run seed
```

Abrir Prisma Studio:

```bash
npx prisma studio
```

---

## Ejecutar el proyecto en desarrollo

```bash
npm run dev
```

Abrir en el navegador:

```txt
http://localhost:3000
```

---

## Scripts disponibles

### Desarrollo

```bash
npm run dev
```

Ejecuta el proyecto en modo desarrollo.

### Build

```bash
npm run build
```

Compila el proyecto para producción.

### Producción local

```bash
npm run start
```

Ejecuta la versión compilada.

### Lint

```bash
npm run lint
```

Ejecuta ESLint.

### Seed

```bash
npm run seed
```

Ejecuta el archivo de seed de Prisma.

---

## Flujo principal del sistema

```txt
Login
  ↓
Selección de empresa
  ↓
Empresa activa
  ↓
Periodo fiscal activo
  ↓
Módulos administrativos y contables
```

---

## Módulos principales

### Empresas

Permite registrar y administrar empresas. Cada empresa posee sus propios datos, obligaciones tributarias, sucursales, clientes, proveedores, timbrados, comprobantes, cuentas contables y reportes.

### Periodos fiscales

Permite administrar los periodos fiscales de cada empresa y definir cuál está activo para validar operaciones dentro del ejercicio correspondiente.

### Clientes

Permite registrar clientes por empresa, con validación de datos identificatorios y uso posterior en comprobantes de venta.

### Proveedores

Permite registrar proveedores por empresa, con validación de datos identificatorios y uso posterior en comprobantes de compra.

### Sucursales

Permite administrar sucursales vinculadas a cada empresa.

### Timbrados

Permite registrar timbrados propios y timbrados de proveedores, diferenciando el origen y el tipo de comprobante.

### Comprobantes

El sistema maneja comprobantes de venta y compra por separado.

Ventas:

* Se consideran ingresos.
* Pueden anularse.
* El estado puede ser emitido o anulado.
* El número se maneja con formato de comprobante.

Compras:

* Se consideran egresos.
* No se anulan.
* Se editan o eliminan según las reglas del sistema.

### Plan de cuentas

Permite administrar el plan de cuentas contable de cada empresa, diferenciando cuentas agrupadoras y cuentas que aceptan movimiento.

### Configuración contable

Permite definir las cuentas contables necesarias para generar asientos automáticos desde comprobantes de compra y venta.

### Asientos contables

Los asientos pueden ser manuales o automáticos. Los automáticos pueden generarse desde facturas de compra o venta si la configuración contable está activa.

### Reportes

Los reportes permiten consultar información contable y exportarla en distintos formatos.

Reportes disponibles:

* Libro de compras.
* Libro de ventas.
* Registro de comprobantes - DNIT.

### Marangatu / DNIT

El módulo de Marangatu permite generar archivos para importar registros de comprobantes en el sistema de la DNIT.

Formato del ZIP:

```txt
<RUC>_REG_<PERIODO>_<ID>.zip
```

Ejemplo:

```txt
80021940_REG_062026_V0001.zip
```

El archivo interno puede ser `.csv` o `.txt`, según el formato seleccionado.

---

## Consideraciones de la versión actual

Por decisión del alcance inicial, todavía no se implementan:

* Retenciones.
* Centro de costo.
* Gasto deducible / no deducible.

Estos puntos podrán agregarse más adelante si el sistema lo requiere.

---

## Estado del proyecto

El proyecto se encuentra en desarrollo activo.

Pendientes sugeridos:

* Probar exportaciones Excel y PDF con datos reales.
* Revisar visualmente pantallas de detalle.
* Validar generación de archivos Marangatu con archivos reales aceptados por DNIT.
* Mejorar algunos componentes visuales.
* Revisar warnings de React Hook Form si fuera necesario.

---

## Producción

Para pruebas de producción se puede desplegar usando:

```txt
Vercel + Neon PostgreSQL
```

Recomendaciones generales:

* Usar una base PostgreSQL externa.
* Configurar correctamente las variables de entorno.
* Ejecutar migraciones con:

```bash
npx prisma migrate deploy
```

* No usar `prisma migrate dev` en producción.

---

## Autor

Desarrollado por **Claudio Barrios**.

Proyecto desarrollado como sistema administrativo contable para uso empresarial en Paraguay.
