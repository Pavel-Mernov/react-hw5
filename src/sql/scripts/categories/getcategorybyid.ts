import { Client } from "pg"
import { Category } from "../../../models/category"

export const getCategoryById = async (client : Client, id : number) => {
    try {
        const queryText = `SELECT * FROM categories WHERE id = ${id};`
        
        const queryResult = await client.query(queryText)

        const rows = queryResult.rows

        if (rows.length == 0) {
            return { error : 404 } // not found
        }
        
        return rows[0] as Category
    }
    catch (_) {
        return { error: 400 } // bad category id
    }
}