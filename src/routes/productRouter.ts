import { Router } from "express"
import { ProductController } from "../controllers/productController"

const router = Router()

router.get(`/:id`, ProductController.getProductById)

router.get('/', ProductController.getAllProducts)

router.delete("/:id", ProductController.deleteProductById)

router.post("/", ProductController.createProduct)

router.put("/:id", ProductController.updateProductById)

export default router