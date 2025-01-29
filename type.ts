import { ObjectId, OptionalId } from "mongodb";

export type PacienteModel = OptionalId<{
    nombre: string,
    telefono: string,
    email: string
}>

export type CitaModel = OptionalId<{
    paciente: ObjectId,
    fecha: Date,
    tipo: string,
}>

// https://api-ninjas.com/api/validatephone
export type API_Phone = {
    is_valid: boolean
}