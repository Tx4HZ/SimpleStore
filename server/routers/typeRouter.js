import { Router } from "express"
import typeController from "../controllers/typeController.js"
import checkRole from "../middleware/checkRoleMiddleware.js"
const router = new Router()

router.post("/", checkRole('ADMIN'), typeController.create)
router.get("/", checkRole("ADMIN"), typeController.getAll)

export default router
