import { Client } from "pg"
import { getCategoryById } from "./getcategorybyid"
import { Category } from "../../../models/category"

export const updateCategoryById = async (client : Client, category : Category) => {
    const { id, name } = category
    
    // finding category with same id
    const catWithSameId = await getCategoryById(client, id)

    // if no category with same id, return 404 not found
    if ('error' in catWithSameId && catWithSameId.error == 404) {
        console.error(`Category update: category with id: ${id} does not exist`)
        return 404
    }
    
    const queryText = `UPDATE categories SET name = \'${name}\' WHERE id = ${id};`
    
    await client.query(queryText)

    console.log(`Category (${id}, ${name}) was updated successfully`)

    return catWithSameId
}