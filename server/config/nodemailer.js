import nodemailer from "nodemailer"
export const transporter = nodemailer.createTransport({
    host:process.env.SMTP_HOST,
    port:process.env.SMTP_PORT,
    secure:false,
    auth:{
        user:process.env.SENDER_EMAIL,
        pass:process.env.SMTP_PASSWORD
    }
})