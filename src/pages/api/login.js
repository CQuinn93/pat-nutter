import db from '../../../database';
import bcrypt from 'bcrypt';

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        db.get("SELECT * FROM users WHERE email = ?", [email], async (err, row) => {
            if (err) {
                console.error('Database query error:', err.message);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            if (!row) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            const isPasswordValid = await bcrypt.compare(password, row.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            // Set up session or token here for logged in user

            res.status(200).json({ message: 'Login successful' });
        });
    } else {
        res.status(405).end();
    }
}
