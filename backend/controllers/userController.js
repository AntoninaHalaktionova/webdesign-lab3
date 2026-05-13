const db = require('../database/db');

exports.getProfile = (req, res) => {
    const { id } = req.query; // pass user id in query for simplicity
    db.get(`SELECT id, name, email, gender, dob FROM users WHERE id = ?`, [id], (err, row) => {
        if (err || !row) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(row);
    });
};

exports.updateProfile = (req, res) => {
    const { id, name, email, password, gender, dob } = req.body;
    db.run(
        `UPDATE users SET name = ?, email = ?, password = ?, gender = ?, dob = ? WHERE id = ?`,
        [name, email, password, gender, dob, id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to update profile' });
            }
            res.json({ success: true });
        }
    );
};
