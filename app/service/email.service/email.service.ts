import nodemailer from "nodemailer";

export const emailSend=async(to: string,from:string,subject:string,html: string)=>{
    let transporter = nodemailer.createTransport({
        host: "smtp.sendgrid.net",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.SENDGRID_USER,
            pass: process.env.SENDGRID_PASS,
        },
    });
      await transporter.sendMail({
        from: from, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        html,
    });
}