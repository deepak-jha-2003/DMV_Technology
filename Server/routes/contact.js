// routes/contact.js
const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', (req, res) => {
    const { name, email, company, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Required fields missing' });
    }

    const sql = 'INSERT INTO contacts (name, email, company, message) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, email, company, message], (err, result) => {
        if (err) {
            console.error('Failed to insert contact:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json({ message: 'Form submitted successfully' });
    });
});

module.exports = router;
