import { Client } from "pg"

export const initProducts = async (client : Client) => {
    const queryText = "CREATE TABLE IF NOT EXISTS products(id INTEGER PRIMARY KEY, name VARCHAR(150), description VARCHAR(5000), price INTEGER, count INTEGER, category_id INTEGER, FOREIGN KEY (category_id) REFERENCES categories(id));"

    return await client.query(queryText)
}