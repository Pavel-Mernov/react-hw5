import { getProductById } from "../sql/scripts/products/selectproductbyid";
import { selectAllProducts } from "../sql/scripts/products/selectproducts"
import { Router, Request, Response } from "express";
import { Product } from "../models/product";
import { deleteProductById } from "../sql/scripts/products/deleteproductbyid";
import { createProduct } from "../sql/scripts/products/createproduct";
import { updateProductById } from "../sql/scripts/products/updateproductbyid";

interface GetAllProductsProps {
    limit? : number,
    offset? : number,
    categoryId? : number
}

type ProductProps = Partial<{
     [k in keyof Omit<Product, 'id'>] : any
}>

export const ProductController = {
    getAllProducts : async (
        req : Request<any, any, any, GetAllProductsProps>, 
        resp : Response) => {
        const { 
            'query' : queryBody, 
            'app' : { 'locals' : { sqlClient } } 
        } = req
    
        const allProducts = await selectAllProducts(sqlClient, queryBody)

        if ('error' in allProducts && allProducts.error == 400) {
            
            console.error(`Bad request for all products. body : { limit : ${queryBody.limit}, offset: ${queryBody.offset} }`)
            
            resp
                .status(400)
                .json({ 
                    'error' : 'bad request for products',
                    'body' : queryBody
                 })
            return
        }
    
        console.log("Request: get all products")
        resp.json(allProducts)
    },

    getProductById : async (
        req : Request<any, any, any, {}>, 
        resp : Response) => {

        const { 
            'query' : queryBody, 
            'app' : { 'locals' : { sqlClient } },
            'params' : { id }
        } = req

        const selectedProduct = await getProductById(sqlClient, id)

        if (typeof selectedProduct === 'number') { 
            const logString = (selectedProduct == 400) ?
            `Bad id: ${ id }` :
            `No product with id: ${id}`
            
            console.error("Error find product by id. " + logString)

            resp.status(selectedProduct)
                .json({
                    "error" : logString
                })
            return
        }

        console.log("Find product by id: " + id + ". " + JSON.stringify(selectedProduct))
        resp.status(200)
            .json(selectedProduct)
    },

    deleteProductById : async (
        req : Request<any, any, any, {}>, 
        resp : Response) => {

        const { 
            'query' : queryBody, 
            'app' : { 'locals' : { sqlClient } },
            'params' : { id }
        } = req

        const deletedProduct = await deleteProductById(sqlClient, id)

        if (typeof deletedProduct === 'number') { 
            const logString = (deletedProduct == 400) ?
            `Bad id: ${ id }` :
            `No product with id: ${id}`
            
            console.error("Error delete product by id. " + logString)

            resp.status(deletedProduct)
                .json({
                    "error" : logString
                })
            return
        }

        const logString = "Delete product by id: " + id + " successful"

        console.log(logString)
        resp.status(200)
            .send(logString)
    },
    createProduct : async (
        req : Request<any, any, any, ProductProps>, 
        resp : Response) => {

        const { 
            'query' : queryBody, 
            'app' : { 'locals' : { sqlClient } },
        } = req

        const { name, description, categoryId, price, count } = queryBody

        if (!name?.trim().length) {
            const errorString = "Empty product name"
            
            console.error("Error add product: " + errorString)

            resp
                .status(400)
                .json({
                        error : 400,
                        message : errorString
                    })
            return
        } 

        if (!count?.trim().length) {
            const errorString = "Empty product count"
            
            console.error("Error add product: " + errorString)

            resp
                .status(400)
                .json({
                        error : 400,
                        message : errorString
                    })
            return
        }

        if (!categoryId?.trim().length) {
            const errorString = "Empty category id"
            
            console.error("Error add product: " + errorString)

            resp
                .status(400)
                .json({
                        error : 400,
                        message : errorString
                    })
            return
        }
        
        if (!price?.trim().length) {
            const errorString = "Empty product price"
            
            console.error("Error add product: " + errorString)

            resp
                .status(400)
                .json({
                        error : 400,
                        message : errorString
                    })
            return
        } 
        
        const parsedPrice = Number(price)
        const parsedCount = Number(count)
        const parsedCategoryId = Number(categoryId)

        if (isNaN(parsedPrice) || parsedPrice < 0) {
            const errorString = `Bad price: ${price}`
            
            console.error("Error add product: " + errorString)

            resp
                .status(400)
                .json({
                        error : 400,
                        message : errorString
                    })
            return
        } 

        if (isNaN(parsedCount) || parsedCount < 0) {
            const errorString = `Bad count: ${count}`
            
            console.error("Error add product: " + errorString)

            resp
                .status(400)
                .json({
                        error : 400,
                        message : errorString
                    })
            return
        } 

        if (isNaN(parsedCategoryId)) {
            const errorString = `Bad category id: ${categoryId}`
            
            console.error("Error add product: " + errorString)

            resp
                .status(400)
                .json({
                        error : 400,
                        message : errorString
                    })
            return
        } 

        const newBody : Omit<Product, 'id'> = {
            name: name,
            categoryId: parsedCategoryId,
            description: description,
            price: parsedPrice,
            count: parsedCount
        }

        const queryResult = await createProduct(sqlClient, newBody)

        if ('error' in queryResult) { // not created
            console.error("Error adding new product. " + queryResult.message)

            resp
                .status(queryResult.error)
                .json(queryResult)
            
                return
        }

        const successMessage = "New product was added. " + JSON.stringify(queryBody)

        console.log(successMessage)

        resp.status(201).send(successMessage)
    },
    updateProductById : async (
        req : Request<any, any, any, ProductProps>, 
        resp : Response) => {

        const { 
            'query' : queryBody, 
            'app' : { 'locals' : { sqlClient } },
            'params' : { id }
        } = req

        const { name, categoryId, description, price, count } = queryBody

        if (!name && !categoryId && !description && !price && !count) {
            const errorString = "Nothing to update. All fields are empty"
            console.error("Error update product." + errorString)

            resp.status(400).json(
                {
                    error : 400,
                    message : errorString
                })

            return
        }
        if ((name != undefined && name.trim().length == 0)) {
            const errorString = "Empty product name"
            
            console.error("Error update product: " + errorString)

            resp
                .status(400)
                .json({
                        error : 400,
                        message : errorString
                    })
            return
        }
        const numPrice = Number(price)
        if ((price != undefined && isNaN(numPrice)) || (numPrice < 0)) {
            const errorString = `Bad product price: ${price}`
            
            console.error("Error update product: " + errorString)

            resp
                .status(400)
                .json({
                        error : 400,
                        message : errorString
                    })
            return
        }
        const numCount = Number(count)
        if ((count != undefined && isNaN(numCount)) || numCount < 0) {
            const errorString = `Bad product count: ${count}`
            
            console.error("Error update product: " + errorString)

            resp
                .status(400)
                .json({
                        error : 400,
                        message : errorString
                    })
            return
        }

        // id and categoryId fields will be validated while searching by id and category id

        const updateProps = {
            name: name as string,
            categoryId: categoryId as number,
            price: numPrice,
            count: numCount,
            description : description as string | undefined
        }

        const queryResult = await updateProductById(sqlClient, id, updateProps)

        if ('error' in queryResult) {
            console.error("Error update product: " + queryResult.message)

            if ('error' in queryResult) { // not created
                console.error("Error adding new product. " + queryResult.message)
    
                resp
                    .status(queryResult.error)
                    .json(queryResult)
                
                    return
            }
            return
        }

        const successString = `Update product successful. Id: ${id}. Props: ${JSON.stringify(queryBody)}`
        console.log(successString)

        resp.status(200).send(successString)
    }
}