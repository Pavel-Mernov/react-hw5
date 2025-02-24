import { Client } from "pg"
import { getProductById } from "./selectproductbyid"

export const deleteProductById = async (client : Client, id : number) => {
    const productWithId = await getProductById(client, id)

    if (typeof productWithId === 'number') { // error number. if problems getting product with same id
        return productWithId // returning same error code
    }

    const queryText = `DELETE FROM products WHERE id = ${id};`
    
    const queryResult = await client.query(queryText)

    return queryResult
}