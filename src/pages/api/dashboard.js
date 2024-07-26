import db from '../../../database'; // Importing the SQLite database instance

export default function handler(req, res) {
    if (req.method === 'GET') { // Checking if the request method is GET
        db.all("SELECT * FROM users", [], (err, rows) => { // Retrieving all rows from the 'users' table
            if (err) { // If there's an error during retrieval
                res.status(500).json({ error: err.message }); // Respond with a 500 status code and the error message
                return; // Ensure the function exits after sending the response
            }
            res.status(200).json(rows); // On success, respond with the retrieved rows
        });
    } else {
        res.status(405).end(); // If the request method is not GET, respond with a 405 Method Not Allowed status code
    }
}
