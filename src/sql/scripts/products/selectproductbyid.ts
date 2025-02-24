import { Client } from "pg"
import { Product } from "../../../models/product"

export const getProductById = async (client : Client, id : number) => {
    const queryText = `SELECT * FROM products WHERE id = ${id};`
    
    try {
        const queryResult = await client.query(queryText)

        const rows = queryResult.rows

        if (rows.length == 0) {
            return 404 // error code : not found
        }

        return rows[0] as Product
    }
    catch (_) {
        return 400 // error code : bad request (bad number)
    }
}