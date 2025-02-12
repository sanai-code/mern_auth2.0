import express from "express";
import cors from "cors"
import 'dotenv/config'
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { connectDb } from "./config/mongodb.js";
import { authRouter } from "./routes/authRoute.js";
import { userRouter } from "./routes/userRoutes.js";


let app = express();
let allowOrigins = process.env.FRONTEND_URL
app.use(cors({origin:allowOrigins,credentials:true}))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
const port = process.env.PORT || 4000
connectDb()

//API endpoints
app.get("/",(req,res)=>{
    res.json({
        msg:'helo'
    })
})
app.get("/helo",(req,res)=>{
    res.json({
        msg:'helo'
    })
})
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)


    app.listen(port,()=>{
        console.log(`listning on ${port}`)
    })
