import { Client } from "pg";
import { Product } from "../../../models/product";
import { getCategoryById } from "../categories/getcategorybyid";
import { selectAllProducts } from "./selectproducts";

type CreateProductProps = Omit<Product, 'id'>

interface ErrorMessage {
    error : number,
    message : string
}

export const createProduct = async (client : Client, props : CreateProductProps) => {
    const { name, description, categoryId, price, count } = props

    let errorString = ""
    
    
    const foundCategory = await getCategoryById(client, categoryId)

    if ('error' in foundCategory) {
        if (foundCategory.error = 400) {
            errorString = `Bad category id: ${categoryId}`

            return {
                error : 400,
                message : errorString
            } as ErrorMessage
        }
        else if (foundCategory.error == 404) {
            errorString = `No category with id: ${categoryId}`

            return {
                error : 400,
                message : errorString
            } as ErrorMessage
        }
    }

    const allProducts = await selectAllProducts(client)

    if ('error' in allProducts) {
        if (allProducts.error == 400) {
            return {
                error : 500,
                message : "Cannot find all categories"
            } as ErrorMessage
        }
        return { error : allProducts.error, message : '' }
    }

    const nextId = (allProducts.length != 0) ?
         allProducts.map(prod => prod.id).sort((a, b) => a - b)[0] + 1 :
         0

    const queryString = `INSERT INTO products(id, name, category_id, description, price, count) VALUES(${nextId}, \'${name}\', ${categoryId}, \'${description ? description : ""}\', ${price}, ${count});`

    try {
        const result = client.query(queryString)

        return result
    }
    catch (err : any) {
        return {
            error : 500,
            message : err.toString() as string
        } as ErrorMessage
    }
}