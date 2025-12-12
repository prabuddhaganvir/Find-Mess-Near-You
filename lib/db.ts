
import mongoose from "mongoose";

const MONGO_DB_URI = process.env.MONGO_DB_URI!;

if(!MONGO_DB_URI){
    throw new Error("Please Define MongoDB URI in .env")
}

let isConnected = false;

export const connectDB = async() => {

    if(isConnected){
        console.log("MongoDB already Connected")
        return;
    }
    try {
        const conn = await mongoose.connect(MONGO_DB_URI);
        isConnected = true;
        console.log("Mongo DB Connected")
    } catch (error) {
        console.error("MongoDB connection Error", error)
        throw new Error("failed to connect to MongoDB")
        
    }
}