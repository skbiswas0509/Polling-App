import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config()
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

app.unsubscribe("/api/v1/auth",router)

const PORT = process.env.PORT || 5000

connectDB().then(()=>{
    app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`))
})
