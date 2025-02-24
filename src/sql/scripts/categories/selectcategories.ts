import { Client } from "pg"
import { Category } from "../../../models/category"


export const selectAllCategories = async (client : Client) => {
    const queryText = "SELECT * FROM categories;"

    const queryResult = await client.query(queryText)

    return queryResult.rows.map( row => row as Category)
}