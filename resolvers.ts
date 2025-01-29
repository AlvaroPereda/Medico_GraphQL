import { Collection, ObjectId } from "mongodb";
import { CitaModel, PacienteModel } from "./type.ts";
import { GraphQLError } from "graphql";
import { validatePhone } from "./utils.ts";

type Context = {
    PacientesCollection: Collection<PacienteModel>,
    CitasCollection: Collection<CitaModel>
}

type MutationArgsPaciente = {
    id: string,
    nombre: string, 
    telefono: string, 
    email: string
}

type MutationArgsCita = {
    id: string,
    paciente: string,
    fecha: string,
    tipo: string,
}

export const resolvers = {

    Paciente: {
        id: (parent: PacienteModel) => parent._id.toString()
    },
    Cita: {
        id: (parent: CitaModel) => parent._id.toString(),
        paciente: async(
            parent: CitaModel,
            _:unknown,
            context: Context
        ) => await context.PacientesCollection.findOne({_id: parent.paciente}),
        fecha: (parent: CitaModel) => parent.fecha.toString()
    },

    Query: {
        getPaciente: async(
            _:unknown,
            args: MutationArgsPaciente,
            context: Context
        ):Promise<PacienteModel> => {
            const result = await context.PacientesCollection.findOne({_id: new ObjectId(args.id)})
            if(!result) throw new GraphQLError("El paciente no existe")
            return result
        },
        getCitas: async(            
            _:unknown,
            __:unknown,
            context: Context
        ):Promise<CitaModel[]> => await context.CitasCollection.find().toArray()
    },
    Mutation: {
        addPaciente: async(
            _:unknown,
            args: MutationArgsPaciente,
            context: Context
        ):Promise<PacienteModel> => {
            const existePaciente = await context.PacientesCollection.findOne({$or: [
                {email: args.email},
                {telefono: args.telefono}
            ]})
            if(existePaciente) throw new GraphQLError("Ya existe el paciente")
            if(!await validatePhone(args.telefono)) throw new GraphQLError("El numero no existe")
            const { insertedId } = await context.PacientesCollection.insertOne({...args})
            return {
                _id: insertedId,
                ...args
            }

        },
        addCita: async(
            _:unknown,
            args: MutationArgsCita,
            context: Context
        ):Promise<CitaModel> => {
            const { paciente, fecha, tipo } = args
            const pacienteExiste = await context.PacientesCollection.findOne({_id: new ObjectId(paciente)})
            if(!pacienteExiste) throw new GraphQLError("El paciente no existe")
            const { insertedId } = await context.CitasCollection.insertOne({
                paciente: new ObjectId(paciente),
                fecha: new Date(fecha),
                tipo
            })
            return {
                _id: insertedId,
                paciente: new ObjectId(paciente),
                fecha: new Date(fecha),
                tipo
            }
        },
        deleteCita: async(
            _:unknown,
            args: MutationArgsCita,
            context: Context
        ):Promise<boolean> => {
            const { deletedCount } = await context.CitasCollection.deleteOne({_id: new ObjectId(args.id)})
            if(deletedCount === 0) return false
            return true
        },
        updatePaciente: async(
            _:unknown,
            args: MutationArgsPaciente,
            context: Context
        ):Promise<PacienteModel> => {
            const existePaciente = await context.PacientesCollection.findOne({$or: [
                {email: args.email},
                {telefono: args.telefono}
            ]})
            if(existePaciente) throw new GraphQLError("Ya existe el paciente")
            if(args.telefono) if(!await validatePhone(args.telefono)) throw new GraphQLError("El numero no existe")
            const { id, ...updateFields } = args;
            const result = await context.PacientesCollection.findOneAndUpdate(
                {_id: new ObjectId(id)},
                {$set:{...updateFields}},
                {returnDocument: "after"}
            )
            if(!result) throw new GraphQLError("El paciente no existe")
            return result
        }
    }
}