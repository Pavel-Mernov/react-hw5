import { Client } from "pg";
import { Category } from "../../../models/category";
import { selectAllCategories } from "./selectcategories";

type CategoryProps = Omit<Category, 'id'>

export const createCategory = async (client : Client, newCategoryProps : CategoryProps) => {
    const { name } = newCategoryProps
    
    // getting all categories to calculate new Id
    const allCategories = await selectAllCategories(client)

    const catIds = allCategories
        .map(cat => cat.id)
        .sort((id1, id2) => id1 - id2)

    const newId = (catIds.length == 0) ? 0 : catIds[0] + 1

    const queryText = `INSERT INTO categories(id, name) VALUES (${newId}, \'${name}\');`

    const res = await client.query(queryText)

    return res
}