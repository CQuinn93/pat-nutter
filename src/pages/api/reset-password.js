import db from '../../../database';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const {token, password} = req.body;

        // Find the user by token (if you have saved the token and its expiry in the database)
        // For simplicity, we're skipping this part

        // Assuming we found the user, proceed to reset the password
        const hashedPassword = await bcrypt.hash(password, 10);

        db.run("UPDATE users SET password = ? WHERE resetToken = ?", [hashedPassword, token], (err) => {
            if (err) {
                console.error('Database update error:', err.message);
                return res.status(500).json({error: 'Internal Server Error'});
            }
            res.status(200).json({message: 'Your password has been reset successfully.'});
        });
    } else {
        res.status(405).end();
    }
}
