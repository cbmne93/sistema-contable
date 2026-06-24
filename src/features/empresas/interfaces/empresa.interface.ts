export interface Empresa {
    id: string;
    razonSocial: string;
    ruc: string;
    dv: string;
    direccion?: string | null;
    telefono?: string | null;
    email?: string | null;
    estado: "ACTIVO" | "INACTIVO";

    obligacionIvaGeneral: boolean;
    obligacionIrpServicios: boolean;
    obligacionIrpCapital: boolean;
    obligacionIreGeneral: boolean;
    obligacionIreSimple: boolean;
    obligacionIreResimple: boolean;
    obligacionIdu: boolean;
    obligacionInr: boolean;

    createdAt: Date;
    updatedAt: Date;
}

export interface CreateEmpresaInput {
    razonSocial: string;
    ruc: string;
    dv: string;
    direccion?: string | null;
    telefono?: string | null;
    email?: string | null;

    obligacionIvaGeneral?: boolean;
    obligacionIrpServicios?: boolean;
    obligacionIrpCapital?: boolean;
    obligacionIreGeneral?: boolean;
    obligacionIreSimple?: boolean;
    obligacionIreResimple?: boolean;
    obligacionIdu?: boolean;
    obligacionInr?: boolean;
}

export interface UpdateEmpresaInput {
    id: string;
    razonSocial: string;
    ruc: string;
    dv: string;
    direccion?: string | null;
    telefono?: string | null;
    email?: string | null;
    estado?: "ACTIVO" | "INACTIVO";

    obligacionIvaGeneral?: boolean;
    obligacionIrpServicios?: boolean;
    obligacionIrpCapital?: boolean;
    obligacionIreGeneral?: boolean;
    obligacionIreSimple?: boolean;
    obligacionIreResimple?: boolean;
    obligacionIdu?: boolean;
    obligacionInr?: boolean;
}