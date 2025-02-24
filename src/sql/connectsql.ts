// SQL connection instead of MongoDB

import { Client } from "pg";
import { initCategories } from "./scripts/categories/initcategories";
import app from "../server";
import { initProducts } from "./scripts/products/initproducts";

const client = new Client({
    user : 'pavelmernov',
    host : 'localhost',
    database : 'mernov-react-hw5-db',
    password : '555555',
    port : 5432
})

export const connectSQL = async () => {
    await client.connect()

    app.locals.sqlClient = client

    console.log("Connected to PostgreSQL")
    
    // creating categories database
    await initCategories(client)
    console.log("Init categories DB successful")

    // creating products database
    await initProducts(client)
    console.log("Init products DB successful")

    return client
}