import { getUserData } from "../controllers/userController.js";
import { userAuth } from "../middleware/userAuth.js";
import { Router } from "express";
export const userRouter = Router();
userRouter.get("/get-details",userAuth,getUserData)