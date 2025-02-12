import bcrypt from "bcrypt";
import { userModel } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { transporter } from "../config/nodemailer.js";
import { EMAIL_VERIFY_TEMPLATE } from "../config/emailTemplates.js";


export const regisgter = async (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.file)
  if (!name || !email || !password) {
    return res.json({
      success: false,
      message: "missing Details",
    });
  }
  try {
    const existinUser = await userModel.findOne({
      email,
    });
    if (existinUser) {
      return res.json({
        success: false,
        msg: "user already exist",
      });
    }
    let hashPassword = await bcrypt.hash(password, 3);
    let user = await userModel.create({
      name,
      email,
      password: hashPassword,
    });
    console.log(user);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      masAge: 7 * 24 * 60 * 60 * 1000,
    });
    //sending welcome email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "thank you sign up",
      text: `Welcome to my portfolio website your account has been created with ${email} this email id`,
    };
    await transporter.sendMail(mailOptions);
    res.json({
      success: true,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "invalid Creadentia",
    });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({
      success: false,
      message: "email and password are required",
    });
  }
  try {
    let user = await userModel.findOne({
      email,
    });
    if (!user) {
      return res.json({
        success: false,
        message: "invalid email",
      });
    }
    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "invalid password",
      });
    }
    let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    console.log(process.env.NODE_ENV);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      masAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({
      success: true,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    res.json({
      success: true,
      message: "loged out",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
// send verification to the users Email
export const sendVerificationOtp = async (req, res) => {
  try {
    const userId = req.body.userId;
    let user = await userModel.findOne({ _id: userId });
    console.log(user);
    if (user.isAccountVerified) {
      return res.json({
        success: false,
        message: "Account already verified",
      });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    let verifyOtp = otp;
    let verifyOtpExpiredAt = Date.now() + 24 * 60 * 60 * 1000;
    // await user.save();
    const result = await userModel.updateOne({
      _id: user._id
     },{$set:{verifyOtp:verifyOtp,verifyOtpExpiredAt:verifyOtpExpiredAt}})
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account verification OTP",
      // text: `your one time password for verificaiton ${otp}.verify your account using this otp`,
      html:EMAIL_VERIFY_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
    };
    await transporter.sendMail(mailOptions);
    res.json({
      success: true,
      message: "Verification OTP Sent Successfull",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  let { otp } = req.body;
  let userId = req.body.userId;
  if (!userId || !otp) {
    return res.json({
      success: false,
      message: "missing details",
    });
  }
  try {
    console.log(userId);
    const user = await userModel.findOne(
      {
        _id: userId,
      },
      { password: 0 }
    );

    console.log(user);
    if (!user) {
      return res.json({
        success: false,
        message: "user not found",
      });
    }
    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.json({
        success: false,
        message: "invalid otp",
      });
    }
    if (user.verifyOtpExpiredAt < Date.now()) {
      return res.json({
        success: false,
        message: "otp expired",
      });
    }
    // user.isAccountVerified = true;
    // user.verifyOtp = "";
    // user.verifyOtpExpiredAt = 0;
    // await user.save();
    const result = await userModel.updateOne({
     _id: user._id
    },{$set:{isAccountVerified:true,verifyOtp:"",verifyOtpExpiredAt:0}})
     
    res.json({
      success: true,
      message: "email verified successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const isAuthenticated = async (req, res) => {
  try {
    return res.json({
      success: true,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const sendResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.json({
      success: false,
      message: "email must be provided",
    });
  }
  try {
    let response = await userModel.findOne(
      {
        email,
      },
      { password: 0 }
    );
    if (!response) {
      return res.json({
        success: false,
        message: "user dosn't exist sign up",
      });
    }
    let otp = String(Math.floor(100000 + Math.random()*900000))
    response.resetOtp = otp
    response.resetOtpExpireAt = Date.now()+15*60*1000
    await response.save();
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: response.email,
      subject: "Account verification OTP",
      // text: `your one time password for resetting you password  ${otp}. use this OTP to proceed with resetting password`,
      html:EMAIL_VERIFY_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",response.email)
    };

    await transporter.sendMail(mailOptions)
    res.json({
        success:true,
        message:'OTP sent successfully'
    })
  } catch (error) {
    res.json({
        success:false,
        message:'some error occured'
    })
  }
};
// reset user password
export const resetPassword = async(req,res)=>{
  let {email,otp,newPassword} = req.body;
  try {
    if(!otp || !email || !newPassword){
      return res.json({
        success:false,
        message:'missing details'
      })
    }
    let reponsedb = await userModel.findOne({
      email
    })
    console.log(reponsedb)
    if(!reponsedb){
      return res.json({
        message:false,
        message:'user not found '
      })
    }
    if(reponsedb.resetOtp === '' || reponsedb.resetOtp !==otp || reponsedb.resetOtpExpireAt<Date.now()){
      return res.json({
        success:false,
        message:'invalid OTP'
      })
    }
    let hashPassword = await bcrypt.hash(newPassword,3)
    reponsedb.resetOtp = ''
    reponsedb.password = hashPassword
    reponsedb.resetOtpExpireAt = 0
    await reponsedb.save()

    res.json({
      success:true,
      message:'password has been reset successfully'
    })
  } catch (error) {
    res.json({
      success:false,
      message:'some error occured'
    })
  }
}