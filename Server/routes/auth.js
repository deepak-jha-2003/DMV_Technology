const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (result.length > 0) return res.status(409).json({ error: 'Email already exists' });

        const hashed = await bcrypt.hash(password, 10);
        db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashed], (err) => {
            if (err) return res.status(500).json({ error: 'Signup failed' });
            res.status(201).json({ message: 'Registered successfully' });
        });
    });
});

// Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) return res.status(500).json({ error: 'DB error' });
        if (results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

        const user = results[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ message: 'Login successful', token });
    });
});

// Protected profile route
router.get('/profile', authMiddleware, (req, res) => {
    res.json({ message: 'Protected profile data', user: req.user });
});

// Reset password
router.post('/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;
    const hashed = await bcrypt.hash(newPassword, 10);
    db.query('UPDATE users SET password = ? WHERE email = ?', [hashed, email], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error updating password' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'Password updated successfully' });
    });
});

module.exports = router;
