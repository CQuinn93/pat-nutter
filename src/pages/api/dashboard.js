import db from '../../../database';

export default function handler(req, res) {
    if (req.method === 'GET') {
        const userId = req.query.userId; // Assume user ID is passed as a query parameter

        db.get("SELECT username FROM users WHERE id = ?", [userId], (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (!row) {
                return res.status(404).json({ error: 'User not found' });
            }

            const username = row.username;

            db.all("SELECT * FROM competitions WHERE userId = ?", [userId], (err, competitions) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                res.status(200).json({ username, competitions });
            });
        });
    } else {
        res.status(405).end();
    }
}
