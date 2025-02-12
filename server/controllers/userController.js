import { userModel } from "../models/userModel.js";




export const getUserData = async(req,res)=>{
   let {userId} = req.body
    try {
        let response = await userModel.findOne({
            _id:userId
        },{password:0})
        if(!response){
            return res.json({
                success:false,
                message:'user not found'
            })
        }
        res.json({
            success:true,
            userData:{
                name:response.name,
                isVerified:response.isAccountVerified
            }
        })
    } catch (error) {
        res.json({
            success:false,
            message:'internal server error'
        })
    }
}