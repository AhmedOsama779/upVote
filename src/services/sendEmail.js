// sendEmail
import nodemailer from 'nodemailer'

export const sendEmail = async ({
    to = '',
    message = '',
    subject = '',
    attachments = []
} = {}) => {
    // configurations
    const transporter = nodemailer.createTransport({
        host: 'localhost', // smtp.gmail.com
        port: 587,
        secure: false,
        service: 'gmail',
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.SENDER_PASS
        }
    })
    // content 
    const info = await transporter.sendMail({
        from: `Route <${process.env.SENDER_EMAIL}>`,
        to,
        subject,
        attachments,
        html: message
    })

    if (info.accepted.length) {
        return true
    }
    return false
}