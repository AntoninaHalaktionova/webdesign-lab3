const db = require('../database/db');

exports.register = (req, res) => {
    const { name, email, password, gender, dob } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    db.run(
        `INSERT INTO users (name, email, password, gender, dob) VALUES (?, ?, ?, ?, ?)`,
        [name, email, password, gender, dob],
        function (err) {
            if (err) {
                return res.status(400).json({ error: 'User already exists or database error' });
            }
            res.json({ id: this.lastID, name, email });
        }
    );
};

exports.login = (req, res) => {
    const { email, password } = req.body;
    db.get(
        `SELECT * FROM users WHERE email = ? AND password = ?`,
        [email, password],
        (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (!row) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            // Simple session handling: returning user object
            res.json({ id: row.id, name: row.name, email: row.email, gender: row.gender, dob: row.dob });
        }
    );
};
