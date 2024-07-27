import db from '../../../database';

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { userId, name, description } = req.body;

        db.run("INSERT INTO competitions (userId, name, description) VALUES (?, ?, ?)", [userId, name, description], function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.status(200).json({ id: this.lastID });
        });
    } else if (req.method === 'PUT') {
        const { userId, competitionId } = req.body;

        db.run("INSERT INTO user_competitions (userId, competitionId) VALUES (?, ?)", [userId, competitionId], function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.status(200).json({ message: 'Joined competition successfully' });
        });
    } else {
        res.status(405).end();
    }
}
