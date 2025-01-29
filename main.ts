import { MongoClient } from "mongodb"
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { GraphQLError } from "graphql"
import { typeDefs } from "./typeDefs.ts";
import { resolvers } from "./resolvers.ts";
import { CitaModel, PacienteModel } from "./type.ts";

const MONGO_URL = Deno.env.get("MONGO_URL")
if(!MONGO_URL) throw new GraphQLError("Error en mongodb")

const client = new MongoClient(MONGO_URL)
await client.connect()
console.log("Conectado correctamente a mongodb")

const db = client.db("medico")
const PacientesCollection = db.collection<PacienteModel>("pacientes")
const CitasCollection = db.collection<CitaModel>("citas")

const server = new ApolloServer({typeDefs, resolvers})

const { url } = await startStandaloneServer(server, {
  context: async() => ({ PacientesCollection, CitasCollection })
})

console.log(`🚀  Server ready at: ${url}`);