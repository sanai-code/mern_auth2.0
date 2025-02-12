import mongoose from "mongoose";

export const connectDb = async()=>{
    mongoose.connection.on('connected',()=>console.log('Database connected'))
    await mongoose.connect(process.env.DATABASE_URL)
}