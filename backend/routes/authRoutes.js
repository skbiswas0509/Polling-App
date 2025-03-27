import { Router } from "express";
import  {registerUser, getUserInfo, loginUser } from "../controllers/authController.js";
import protect from "../middlewares/authMiddleware.js";

const router = Router()

router.post('/register',registerUser)
router.post("/login",loginUser)
router.get("/getUser",protect, getUserInfo)

export default router