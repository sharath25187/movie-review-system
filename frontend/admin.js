document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Login required');
        window.location.href = 'login.html';
        return;
    }

    const decoded = JSON.parse(atob(token.split('.')[1]));
    if (decoded.role !== 'admin') {
        alert('Access denied. Admins only.');
        window.location.href = 'index.html';
        return;
    }

    const form = document.getElementById('add-movie-form');
    const moviesContainer = document.getElementById('movies-container');

    async function fetchMovies() {
        try {
            const response = await fetch('https://your-backend.onrender.com/movies');  // ✅ changed
            const movies = await response.json();

            moviesContainer.innerHTML = '';
            movies.forEach(movie => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${movie.title} (${movie.release_year}) - ${movie.genre} | Director: ${movie.director}</span>
                    <button onclick="deleteMovie(${movie.movie_id})">🗑️ Delete</button>
                `;
                moviesContainer.appendChild(li);
            });
        } catch (error) {
            console.error('Error fetching movies:', error);
        }
    }

    window.deleteMovie = async function (id) {
        if (!confirm('Are you sure you want to delete this movie?')) return;
        try {
            const response = await fetch(`https://your-backend.onrender.com/movies/${id}`, {  // ✅ changed
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                alert('Movie deleted');
                fetchMovies();
            } else {
                alert('Failed to delete movie');
            }
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const movie = {
            title: document.getElementById('title').value,
            genre: document.getElementById('genre').value,
            release_year: document.getElementById('release_year').value,
            director: document.getElementById('director').value
        };

        try {
            const response = await fetch('https://your-backend.onrender.com/movies', {  // ✅ changed
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(movie)
            });

            if (response.ok) {
                alert('Movie added!');
                form.reset();
                fetchMovies();
            } else {
                alert('Failed to add movie');
            }
        } catch (error) {
            console.error('Error adding movie:', error);
        }
    });

    fetchMovies();
});
