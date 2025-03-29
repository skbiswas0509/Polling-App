import { Router } from "express";
import  {registerUser, getUserInfo, loginUser } from "../controllers/authController.js";
import protect from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const authRouter = Router()

authRouter.post('/register',registerUser)
authRouter.post("/login",loginUser)
authRouter.get("/getUser",protect, getUserInfo)
authRouter.post('/upload-image', upload.single("image"), (req, res)=>{
    if(!req.file){
        return res.status(400).json({message: "No file uploaded"})
    }
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
    }`
    res.status(200).json({ imageUrl })
})

export default authRouter