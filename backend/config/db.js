import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI, {})
        console.log("MONGODB connected")
    } catch (error) {
        console.log("Error connecting to MONGODB", error)
        process.exit(1)
    }
}

export default connectDB