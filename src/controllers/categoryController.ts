import { Router, Request, Response } from "express";
import { selectAllCategories } from "../sql/scripts/categories/selectcategories";
import { getCategoryById } from "../sql/scripts/categories/getcategorybyid";
import { createCategory } from "../sql/scripts/categories/createcategory";
import { deleteCategoryById } from "../sql/scripts/categories/deletecategorybyid";
import { Category } from "../models/category";
import { updateCategoryById } from "../sql/scripts/categories/putcategory";
import { error } from "console";

type CategoryParams = Omit<Category, 'id'>

const getAllCategories = async (
    req : Request<any, any, any, {}>, 
    resp : Response) => {
    const { app : { locals : { sqlClient } } } = req

    const allCategories = await selectAllCategories(sqlClient)

    console.log(`Request: get all categories`)
    resp.json(allCategories)
}

export const CategoryControler = {
    getAllCategories,

    getCategoryById : async (
        req : Request<any, any, any, {}>, 
        resp : Response) => {
            const { id } = req.params
    
            const intId = Number(id)
    
            const { app : { locals : { sqlClient } } } = req
    
            const foundCategory = await getCategoryById(sqlClient, intId)
    
            if ('error' in foundCategory) {
                if (foundCategory.error == 404) {
                    console.error(`Error get category by id. No category with id: ${id}`)

                    resp
                        .status(404)
                        .json({ 
                            status : 404,
                            error : `No category with id : ${id.toString()}` 
                        })
                    return
                }
                if (foundCategory.error == 400) {
                    console.error(`Error get category by id. Bad category id: ${id}`)

                    resp
                        .status(400)
                        .json({ 
                            status : 400,
                            error : `Bad category id : ${id.toString()}` 
                        })
                    return
                    
                }

                console.error(`Error get category by id. Unknown error`)

                    resp
                        .status(foundCategory.error)
                        .json({ 
                            status : foundCategory.error,
                            error : `Unknown error` 
                        })
                    return
            }

            console.log(`found category by id : ${intId}. Name : ${foundCategory.name}`)
            resp.json(foundCategory)
    },

    deleteCategoryById : async (
        req : Request<any, any, any, {}>, 
        resp : Response) => {
            const { id } = req.params
    
            const intId = Number(id)

            if (isNaN(intId)) {
                console.error(`Error update category by id. Bad id: ${id}`)

                resp
                    .status(400)
                    .json({
                        error : `Bad id : ${id.toString()}` 
                    })
                return
            }
    
            const { 'app' : { 'locals' : { sqlClient } } } = req
    
            const deleteResult = await deleteCategoryById(sqlClient, intId)
    
            if ('error' in deleteResult) {
                console.error(`Error delete category by id. ` + deleteResult.message)

                resp
                    .status(deleteResult.error)
                    .json(deleteResult)
                return
            }
            
            console.log(`Category with id: ${id} was deleted successfully`)
            resp.send(`Category with id: ${id} was removed successfully`)
    },

    updateCategoryById : async (
        req : Request<any, any, any, CategoryParams>, 
        resp : Response) => {
            const { id } = req.params
    
            const intId = Number(id)

            if (isNaN(intId)) {
                console.error(`Error update category by id. Bad id: ${id}`)

                resp
                    .status(400)
                    .json({
                        error : `Bad id : ${id.toString()}` 
                    })
                return
            }

            const { 'query' : { name }, 
                    'app' : { 'locals' : { sqlClient } } }
                     = req

            const newCategory : Category = {
                id : intId,
                name
            }
    
            const updateResult = await updateCategoryById(sqlClient, newCategory)
    
            if (updateResult == 404) {
                console.error(`Error update category by id. No category with id: ${id}`)

                resp
                    .status(404)
                    .json({
                        error : `No category with id : ${id.toString()}` 
                    })
                return
            }
            
            resp.send(`Category with id: ${id} was removed successfully`)
    },

    postCategory : async (
        req : Request<any, any, any, CategoryParams>, 
        resp : Response) => {

            const { 'query' : { name }, 
                    'app' : { 'locals' : { sqlClient } } }
                     = req

            if (!name) {
                console.error(`Error Add category: empty category name`)

                resp
                    .status(400)
                    .json({
                        error : `Add category: empty category name` 
                    })
                return
            }

            await createCategory(sqlClient, { name })

            const successString = `Category: ${name} was added successfully`

            console.log(successString)

            resp
                .status(201)
                .send(successString)
    }
}