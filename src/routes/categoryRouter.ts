import { Router } from "express";
import { CategoryControler } from "../controllers/categoryController";

const router = Router()



router.get(`/:id`, CategoryControler.getCategoryById)

router.get('/*', CategoryControler.getAllCategories)

router.post('/*', CategoryControler.postCategory)

router.delete(`/:id`, CategoryControler.deleteCategoryById)

router.put(`/:id`, CategoryControler.updateCategoryById)

export default router