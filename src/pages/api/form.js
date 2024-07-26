import db from '../../../database'; // Importing the SQLite database instance
import bcrypt from 'bcrypt'; // Importing bcrypt for password hashing

export default async function handler(req, res) {
    if (req.method === 'POST') { // Checking if the request method is POST
        const { username, email, password } = req.body; // Extracting 'username', 'email', and 'password' from the request body

        try {
            // Check if the username or email already exists
            db.get("SELECT * FROM users WHERE username = ? OR email = ?", [username, email], async (err, row) => {
                if (err) {
                    console.error('Database query error:', err.message);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
                if (row) {
                    if (row.username === username) {
                        return res.status(409).json({ error: 'Username already exists' }); // 409 Conflict
                    }
                    if (row.email === email) {
                        return res.status(409).json({ error: 'Email already exists' }); // 409 Conflict
                    }
                }

                // Hash the password using bcrypt with a salt round of 10
                const hashedPassword = await bcrypt.hash(password, 10);

                // Insert 'username', 'email', and 'hashedPassword' into the 'users' table
                db.run("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [username, email, hashedPassword], function(err) {
                    if (err) { // If there's an error during insertion, log the error and send a 500 status code with the error message
                        console.error('Database insertion error:', err.message);
                        return res.status(500).json({ error: 'Internal Server Error' });
                    }
                    res.status(200).json({ id: this.lastID }); // On success, respond with the newly created user ID
                });
            });
        } catch (error) {
            // Log the error if bcrypt hashing fails
            console.error('Password hashing error:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).end(); // If the request method is not POST, respond with a 405 Method Not Allowed status code
    }
}
