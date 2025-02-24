import { Client } from "pg"
import { Product } from "../../../models/product"
import { off } from "process"

interface SelectProductsProps {
    limit ?: number,
    offset ?: number,
    categoryId ?: number
}

const defaultProps : SelectProductsProps = {}

export const selectAllProducts = async (client : Client, props : SelectProductsProps = defaultProps) => {
    const { limit, offset, categoryId } = props
    
    const queryText = 
         `SELECT * FROM products ${categoryId != undefined ? `WHERE category_id = ${categoryId} ` : ` `} ${limit != undefined ? `LIMIT ${limit}` : ` `} ${offset != undefined ? `OFFSET ${offset}` : ``};`

    try {
        const queryResult = await client.query(queryText)
        return queryResult.rows.map( row => row as Product)
    }
    catch (_) {
        return { error : 400 } // error code
    }
    
}