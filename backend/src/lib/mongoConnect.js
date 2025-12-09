import mongoose from "mongoose";
import dotenv, { config } from 'dotenv';
dotenv.config();

export default async function connect(){
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("connected to database")
    } catch (error) {
        console.log(error.message)
        process.exit(1);
    }
} 