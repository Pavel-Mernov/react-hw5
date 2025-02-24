import { Client } from "pg"
import { getProductById } from "./selectproductbyid"
import { Product } from "../../../models/product"
import { getCategoryById } from "../categories/getcategorybyid"

type ProductUpdateProps = Partial<Omit<Product, 'id'>>

interface ErrorMessage {
    error : number,
    message : string
}

export const updateProductById = async (client : Client, id : number, props : ProductUpdateProps) => {
    const productWithId = await getProductById(client, id)

    if (typeof productWithId === 'number') { // error number. if problems getting product with same id
        if (productWithId == 400) {
            return {
                error : productWithId,
                message : `Bad product id: ${id}`
            } as ErrorMessage
        }
        else if (productWithId == 404) {
            return {
                error : productWithId,
                message : `No product with id: ${id}`
            } as ErrorMessage
        }
    }

    const { name, categoryId, description, price, count } = props

    if (categoryId != undefined) {
        const foundCategory = await getCategoryById(client, categoryId)

        if ('error' in foundCategory) {
            if (foundCategory.error == 400) {
                const errorString = `Bad category id: ${categoryId}`
        
                return {
                    error : 400,
                    message : errorString
                } as ErrorMessage
            }
            else if (foundCategory.error == 404) {
                const errorString = `No category with id: ${categoryId}`
        
                return {
                    error : 400,
                    message : errorString
                } as ErrorMessage
            }
        }
    }

    const fieldsToUpdate = [ 
        name ? `name = \'${name}\'` : "",
        categoryId != undefined ? `category_id = ${categoryId}` : "",
        description ? `description = \'${description}\'` : "",
        price ? `price = ${price}` : "",
        count ? `count = ${count}` : ""
    ].filter(str => str.length != 0).join(", ")

    const queryText = `UPDATE products SET ${fieldsToUpdate} WHERE id = ${id};`
    
    // console.log(queryText)

    try {
        const queryResult = await client.query(queryText)

        return queryResult
    }
    catch (err : any) {
        return {
            error: 500,
            message: err.toString()
        } as ErrorMessage
    }
}