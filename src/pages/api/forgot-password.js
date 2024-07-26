import db from '../../../database';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false // Allow self-signed certificates
    }
});

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { email } = req.body;

        db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
            if (err) {
                console.error('Database query error:', err.message);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            if (!row) {
                return res.status(200).json({ message: 'If this email is registered, you will receive a password reset link.' });
            }

            const token = crypto.randomBytes(20).toString('hex');
            const expiry = Date.now() + 3600000; // 1 hour from now
            const resetLink = `http://localhost:3000/reset-password?token=${token}`;

            db.run("UPDATE users SET resetToken = ?, resetTokenExpiry = ? WHERE email = ?", [token, expiry, email], (err) => {
                if (err) {
                    console.error('Database update error:', err.message);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }

                const mailOptions = {
                    to: email,
                    from: 'first2fantasysports@gmail.com',
                    subject: 'Password Reset',
                    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
          Please click on the following link, or paste this into your browser to complete the process:\n\n
          ${resetLink}\n\n
          If you did not request this, please ignore this email and your password will remain unchanged.\n`
                };

                transporter.sendMail(mailOptions, (error) => {
                    if (error) {
                        console.error('Email sending error:', error.message);
                        return res.status(500).json({ error: 'Internal Server Error' });
                    }
                    res.status(200).json({ message: 'If this email is registered, you will receive a password reset link.' });
                });
            });
        });
    } else {
        res.status(405).end();
    }
}
