const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db'); // MySQL connection

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
    const { username, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    db.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', 
        [username, hashedPassword, role], 
        (err, result) => {
            if (err) throw err;
            res.send('User registered');
        });
});

// Login user
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, result) => {
        if (err) throw err;
        if (result.length > 0 && await bcrypt.compare(password, result[0].password)) {
            const token = jwt.sign({ userId: result[0].user_id, role: result[0].role }, 'your_jwt_secret');
            res.json({ token });
        } else {
            res.status(400).send('Invalid credentials');
        }
    });
});

module.exports = router;
