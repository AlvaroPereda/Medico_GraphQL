export const typeDefs = `#graphql

    type Paciente {
        id: ID!,
        nombre: String!,
        telefono: String!,
        email: String!
    }

    type Cita {
        id: ID!
        paciente: Paciente!,
        fecha: String!,
        tipo: String!,
    }

    type Query {
        getPaciente(id:String!):Paciente
        getCitas:[Cita!]!
    }

    type Mutation {
        addPaciente(nombre:String!, telefono:String!, email:String!):Paciente!
        addCita(paciente:ID!, fecha:String!, tipo:String!):Cita!
        deleteCita(id:ID!):Boolean!
        updatePaciente(id:String!, nombre:String, telefono:String, email:String):Paciente!
    }

`