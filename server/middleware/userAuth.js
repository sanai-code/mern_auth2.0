import jwt from "jsonwebtoken"



export const userAuth = async(req,res,next)=>{
    const {token} = req.cookies;
    if(!token){
        return res.json({
            success:false,
            message:'not authorized login again'
        })
    }
    try {
        let tokenDecode = jwt.verify(token,process.env.JWT_SECRET)
        if(tokenDecode.id){
            req.body.userId = tokenDecode.id
            next();
        }else{
            return res.json({
                success:false,
                message:'not authorized login again'
            })
        }
    } catch (error) {
        res.json({
            success:false,
            message:error.message
        })
    }
}