import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,require:true},
    verifyOtp:{type:String,default:""},
    verifyOtpExpiredAt:{type:Number,default:0},
    isAccountVerified:{type:Boolean,default:false},
    resetOtp:{type:String,default:''},
    resetOtpExpireAt:{type:Number,default:0,}
})

export const userModel = mongoose.model.user || mongoose.model("user",userSchema)