import express from "express"
import { Router } from "express"
import { isAuthenticated, login, logout, regisgter, resetPassword, sendResetOtp, sendVerificationOtp, verifyOtp } from "../controllers/authController.js";
import { userAuth } from "../middleware/userAuth.js";
import { getUserData } from "../controllers/userController.js";
export const authRouter = Router();

import multer from "multer";
const storage = multer.diskStorage({
  destination:function(req,file,cb){
    return cb(null,"./uploads")
  },
  filename:function(req,file,cb){
    return cb(null,`${Date.now()}-${file.originalname}`)
  }
})
const upload = multer({storage:storage})



authRouter.post("/register",upload.single("image"),regisgter)
authRouter.post("/login",login)
authRouter.post("/logout",logout)
authRouter.post("/send-verify-otp",userAuth,sendVerificationOtp)
authRouter.post("/verify-account",userAuth,verifyOtp)
authRouter.get("/is-auth",userAuth,isAuthenticated)
authRouter.post("/send-reset-otp",sendResetOtp)
authRouter.post("/reset-password",resetPassword)
authRouter.get("/profile",userAuth,getUserData)