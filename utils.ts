import { GraphQLError } from "graphql";
import { API_Phone } from "./type.ts";
export const validatePhone = async(telefono: string) => {
    const API_KEY = Deno.env.get("API_KEY")
    if(!API_KEY) throw new GraphQLError("Error en la API_KEY")
    const url = `https://api.api-ninjas.com/v1/validatephone?number=${telefono}`
    const data = await fetch(url, {
        headers: {
            'X-Api-Key': API_KEY
          }
    })    
    if(data.status !== 200) throw new GraphQLError("Error en la petición de la API")
    const result:API_Phone = await data.json()
    return result.is_valid
}