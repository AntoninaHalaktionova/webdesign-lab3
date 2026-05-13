const db = require('../database/db');

exports.getAllSurveys = (req, res) => {
    db.all(`SELECT * FROM surveys`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(rows);
    });
};

exports.getSurveyById = (req, res) => {
    const { id } = req.params;
    db.get(`SELECT * FROM surveys WHERE id = ?`, [id], (err, survey) => {
        if (err || !survey) {
            return res.status(404).json({ error: 'Survey not found' });
        }
        db.all(`SELECT * FROM questions WHERE survey_id = ?`, [id], (err, questions) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            const parsedQuestions = questions.map(q => {
                if (q.options) {
                    try { q.options = JSON.parse(q.options); } catch (e) { q.options = []; }
                } else {
                    q.options = [];
                }
                return q;
            });
            res.json({ ...survey, questions: parsedQuestions });
        });
    });
};

exports.createSurvey = (req, res) => {
    const { title, description, user_id, questions } = req.body;
    db.run(
        `INSERT INTO surveys (title, description, user_id) VALUES (?, ?, ?)`,
        [title, description, user_id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to create survey' });
            }
            const surveyId = this.lastID;
            
            // Insert questions
            if (questions && questions.length > 0) {
                const stmt = db.prepare(`INSERT INTO questions (survey_id, text, type, options) VALUES (?, ?, ?, ?)`);
                questions.forEach(q => {
                    const optionsStr = q.options ? JSON.stringify(q.options) : null;
                    stmt.run([surveyId, q.text, q.type, optionsStr]);
                });
                stmt.finalize();
            }
            
            res.json({ id: surveyId, title, description });
        }
    );
};

exports.submitAnswers = (req, res) => {
    const { answers } = req.body; // array of { question_id, text }
    if (!answers || answers.length === 0) {
        return res.status(400).json({ error: 'No answers provided' });
    }

    const stmt = db.prepare(`INSERT INTO answers (question_id, text) VALUES (?, ?)`);
    answers.forEach(a => {
        stmt.run([a.question_id, a.text]);
    });
    stmt.finalize();

    res.json({ success: true });
};

exports.getSurveysByUser = (req, res) => {
    const { userId } = req.params;
    db.all(`SELECT * FROM surveys WHERE user_id = ?`, [userId], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(rows);
    });
};

exports.getSurveyResults = (req, res) => {
    const { id } = req.params;
    db.get(`SELECT * FROM surveys WHERE id = ?`, [id], (err, survey) => {
        if (err || !survey) return res.status(404).json({ error: 'Survey not found' });
        
        db.all(`SELECT * FROM questions WHERE survey_id = ?`, [id], (err, questions) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            
            db.all(`
                SELECT a.*, q.text as question_text, q.type as question_type
                FROM answers a 
                JOIN questions q ON a.question_id = q.id 
                WHERE q.survey_id = ?
            `, [id], (err, answers) => {
                if (err) return res.status(500).json({ error: 'Database error' });
                
                const results = questions.map(q => {
                    let parsedOptions = [];
                    if (q.options) {
                        try { parsedOptions = JSON.parse(q.options); } catch (e) {}
                    }
                    return {
                        ...q,
                        options: parsedOptions,
                        answers: answers.filter(a => a.question_id === q.id).map(a => a.text)
                    };
                });
                
                res.json({ ...survey, results });
            });
        });
    });
};
