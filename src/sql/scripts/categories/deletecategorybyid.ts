import { Client } from "pg"
import { getCategoryById } from "./getcategorybyid"
import { getProductById } from "../products/selectproductbyid"
import { selectAllProducts } from "../products/selectproducts"
import { error } from "console"

export const deleteCategoryById = async (client : Client, id : number) => {
    // finding category with same id
    const catWithSameId = await getCategoryById(client, id)

    // if no category with same id, return 404 (not found)
    if ('error' in catWithSameId) {
        if (catWithSameId.error == 404) {
            return { error : 404, message : `No category with id : ${id}` }
        }
        return { error : catWithSameId.error, message : `unknown error` }
        
    }

    const productsByCatId = await selectAllProducts(client, { categoryId : id })

    if (!('error' in productsByCatId) && productsByCatId.length != 0) {
        return {
            error : 403,
            message : `Cannot delete category. There are some products in this category. Category id: ${id}`
        }
    }
    
    const queryText = `DELETE FROM categories WHERE id = ${id};`
    
    await client.query(queryText)

    return catWithSameId
}