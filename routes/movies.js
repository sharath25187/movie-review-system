const express = require('express');
const db = require('../db'); // MySQL connection

const router = express.Router();

// ✅ Get all movies
router.get('/', (req, res) => {
    const query = `
        SELECT m.*, 
        ROUND(AVG(r.rating), 1) AS average_rating 
        FROM movies m 
        LEFT JOIN reviews r ON m.movie_id = r.movie_id 
        GROUP BY m.movie_id
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error fetching movies');
        }
        res.json(results);
    });
});


// Add a new movie
router.post('/', (req, res) => {
    const { title, genre, release_year, director } = req.body;
    db.query('INSERT INTO movies (title, genre, release_year, director) VALUES (?, ?, ?, ?)', 
        [title, genre, release_year, director], 
        (err, result) => {
            if (err) throw err;
            res.send('Movie added successfully');
        });
});

// Add a review for a movie
router.post('/:id/reviews', (req, res) => {
    const { review_text, rating, user_id } = req.body;  // Expect user_id in the request body
    const movie_id = req.params.id;  // Get the movie_id from the URL parameter

    db.query('INSERT INTO reviews (movie_id, user_id, review_text, rating) VALUES (?, ?, ?, ?)', 
        [movie_id, user_id, review_text, rating], 
        (err, result) => {
            if (err) {
                console.error(err);  // Log the error for debugging
                return res.status(500).send('Error adding review');
            }
            res.send('Review added successfully');
        });
});

// Get all reviews for a movie
router.get('/:id/reviews', (req, res) => {
    const movie_id = req.params.id;

    db.query('SELECT * FROM reviews WHERE movie_id = ?', [movie_id], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// ✅ Get details of one movie by ID (this is missing currently)
router.get('/:id', (req, res) => {
    const movie_id = req.params.id;

    db.query('SELECT * FROM movies WHERE movie_id = ?', [movie_id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error fetching movie');
        }
        if (results.length === 0) {
            return res.status(404).send('Movie not found');
        }
        res.json(results[0]); // return first movie object
    });
});


router.get('/test', (req, res) => {
    res.send('Movies route is working');
});
const verifyAdmin = require('../middleware/verifyAdmin'); // Import middleware

// DELETE a movie by ID (admin only)
router.delete('/:id', verifyAdmin, (req, res) => {
    const movieId = req.params.id;

    db.query('DELETE FROM movies WHERE movie_id = ?', [movieId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error deleting movie');
        }

        if (result.affectedRows === 0) {
            return res.status(404).send('Movie not found');
        }

        res.send('Movie deleted successfully');
    });
});


module.exports = router;
