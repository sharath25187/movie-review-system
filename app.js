const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;
const db = require('./db'); // MySQL connection

const path = require('path');

// Serve static files from frontend folder
app.use(express.static(path.join(__dirname, 'frontend')));


app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());

// Middleware to parse incoming requests
app.use(express.json());  // Use express.json instead of bodyParser.json

// Sample route to test the server
app.get('/', (req, res) => {
    res.send('Welcome to the Movie Review System!');
});

// Routes for authentication
console.log('Registering auth routes...');
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);



// Routes for movies, with JWT protection
console.log('Registering movie routes...');
const movieRoutes = require('./routes/movies');
app.use('/movies', movieRoutes); // Use authenticateToken if needed

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const jwt = require('jsonwebtoken');

app.use((req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        try {
            const user = jwt.verify(token, 'your_secret_key'); // Replace with your secret
            req.user = user;
        } catch (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    }
    next();
});    

