import { transporter } from "../config/mailer.js";
import dotenv from 'dotenv';

dotenv.config();

export async function sendVerificationEmail({ email, token }) {

    const verificationUrl = `${process.env.BASE_URL}/auth/verify-email?token=${token}`;
    
    const mailContents = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Chill App's Email Verification",
        html: `
            <h1>Verifikasi Email</h1>
            <p>Silakan klik link berikut ini untuk memverifikasi email anda:</p>
            <a href="${verificationUrl}">${verificationUrl}</a>
            <p>Jika anda tidak membuat akun Chill app, abaikan email ini.</p>
        `
    };

    await transporter.sendMail(mailContents);
}
