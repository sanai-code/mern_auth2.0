import express from "express";
import cors from "cors"
import 'dotenv/config'
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { connectDb } from "./config/mongodb.js";
import { authRouter } from "./routes/authRoute.js";
import { userRouter } from "./routes/userRoutes.js";
// import multer from "multer";

// const storage = multer.diskStorage({
//     destination:function (req,file,cb){
//        return cb(null,"./uploads")
//     },
//     filename:function (req,file,cb){
//         return cb(null,`${Date.now()}-${file.originalname}`)
//     }
// })
// const upload = multer({storage:storage})
let app = express();
let allowOrigins = 'http://localhost:5173'
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
app.use("/api/auth",authRouter)

// app.post("/api/v1/upload", upload.single("image"), (req, res) => {
//     console.log(req.file);
//     res.json({
//         msg:'hi'
//     })
// });

app.use("/api/user",userRouter)


    app.listen(port,()=>{
        console.log(`listning on ${port}`)
    })
