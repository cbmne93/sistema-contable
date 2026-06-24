import { z } from "zod";

const optionalCuentaId = z.string().optional().nullable();

export const configuracionContableSchema = z.object({
    generarAsientosAutomaticos: z.boolean().default(false),

    cuentaClientesId: optionalCuentaId,
    cuentaProveedoresId: optionalCuentaId,

    cuentaCajaId: optionalCuentaId,
    cuentaBancoId: optionalCuentaId,

    cuentaIvaDebitoFiscal5Id: optionalCuentaId,
    cuentaIvaDebitoFiscal10Id: optionalCuentaId,

    cuentaIvaCreditoFiscal5Id: optionalCuentaId,
    cuentaIvaCreditoFiscal10Id: optionalCuentaId,
});

export type ConfiguracionContableFormValues = z.infer<
    typeof configuracionContableSchema
>;