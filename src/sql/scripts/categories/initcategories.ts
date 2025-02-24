import { Client } from "pg";



export const initCategories = async (client : Client) => {
    const queryText = "CREATE TABLE IF NOT EXISTS categories(id INTEGER PRIMARY KEY, name VARCHAR(150));"

    return await client.query(queryText)
}