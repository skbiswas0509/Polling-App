import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config()
import path from 'path'
import { fileURLToPath } from 'url'
import connectDB from './config/db.js'
import router from './routes/authRoutes.js'

const app = express();

//Middleware to handle cors
app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    methods : ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use(express.json())

app.use("/api/v1/auth",router)

//manually defining __dirname in ES module
const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

//server uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

const PORT = process.env.PORT || 5000

connectDB().then(()=>{
    app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`))
})
