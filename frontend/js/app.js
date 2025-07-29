// JavaScript for frontend functionality

// Fetch movies from the backend
async function fetchMovies() {
    try {
        const response = await fetch('/movies');
        const movies = await response.json();
        const movieList = document.getElementById('movie-list');
        
        // Clear loading message
        movieList.innerHTML = '';

        if (movies.length === 0) {
            movieList.innerHTML = '<p>No movies found</p>';
            return;
        }

        movies.forEach(movie => {
            const movieItem = document.createElement('div');
            movieItem.className = 'movie-card';
            function getStarRating(avg) {
                const fullStars = Math.floor(avg);             // e.g., 4
                const halfStar = avg % 1 >= 0.5 ? 1 : 0;        // e.g., 0.7 → 1
                const emptyStars = 5 - fullStars - halfStar;
            
                return '★'.repeat(fullStars) + '⯨'.repeat(halfStar) + '☆'.repeat(emptyStars);
            }
            
            const rating = movie.average_rating !== null
              ? getStarRating(movie.average_rating)
              : 'No ratings yet';
            
            movieItem.innerHTML = `
                <h3>${movie.title}</h3>
                <p>Genre: ${movie.genre}</p>
                <p>Release Year: ${movie.release_year}</p>
                <p>Average Rating: <span class="rating">${rating}</span></p>
                <a href="movie.html?id=${movie.movie_id}" class="view-details">View Reviews</a>
            `;
            movieList.appendChild(movieItem);
        });
    } catch (error) {
        console.error('Error fetching movies:', error);
        document.getElementById('movie-list').innerHTML = '<p>Error loading movies. Please try again later.</p>';
    }
}

// Fetch movie details based on movie ID in the URL
async function fetchMovieDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');

    if (!movieId) {
        document.getElementById('movie-details').innerHTML = '<p>Movie ID not provided</p>';
        return;
    }

    try {
        const response = await fetch(`/movies/${movieId}`);
        const movie = await response.json();
        const movieDetails = document.getElementById('movie-details');

        movieDetails.innerHTML = `
            <h2>${movie.title}</h2>
            <div class="movie-info">
                <p><strong>Genre:</strong> ${movie.genre}</p>
                <p><strong>Release Year:</strong> ${movie.release_year}</p>
                <p><strong>Director:</strong> ${movie.director}</p>
            </div>
        `;

        // Fetch reviews for the movie
        const reviewsResponse = await fetch(`/movies/${movieId}/reviews`);
        const reviews = await reviewsResponse.json();
        const reviewsContainer = document.getElementById('reviews');

        if (reviews.length === 0) {
            reviewsContainer.innerHTML = '<p>No reviews yet. Be the first to review!</p>';
            return;
        }

        reviewsContainer.innerHTML = '';  // Clear any loading text
        
        reviews.forEach(review => {
            const reviewItem = document.createElement('div');
            reviewItem.className = 'review-item';
            reviewItem.innerHTML = `
                <div class="rating">Rating: ${getStarRating(review.rating)}</div>
                <p class="review-text">${review.review_text}</p>
            `;
            reviewsContainer.appendChild(reviewItem);
        });
    } catch (error) {
        console.error('Error fetching movie details:', error);
        document.getElementById('movie-details').innerHTML = '<p>Error loading movie details. Please try again later.</p>';
    }
}

// Helper function to display star ratings
function getStarRating(rating) {
    const fullStar = '★';
    const emptyStar = '☆';
    rating = Math.max(0, Math.min(5, rating));
    return fullStar.repeat(rating) + emptyStar.repeat(5 - rating);
}

// Submit review form
async function submitReview(event) {
    event.preventDefault();
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please log in to submit a review');
        window.location.href = 'login.html';
        return;
    }
    
    const reviewText = document.getElementById('review_text').value;
    const rating = document.getElementById('rating').value;
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');

    try {
        // Parse JWT to get user_id (simple parsing, not validation)
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        const userId = tokenData.userId;

        const response = await fetch(`/movies/${movieId}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                review_text: reviewText,
                rating: parseInt(rating),
                user_id: userId
            }),
        });

        if (response.ok) {
            alert('Review added successfully');
            window.location.reload(); // Refresh the page to show the new review
        } else {
            alert('Failed to add review');
        }
    } catch (error) {
        console.error('Error submitting review:', error);
        alert('Error submitting review. Please try again.');
    }
}

// Initialize page based on current page
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'index.html' || currentPage === '') {
        fetchMovies();
    } else if (currentPage === 'movie.html') {
        fetchMovieDetails();
        
        // Add event listener for review form
        const reviewForm = document.getElementById('review-form');
        if (reviewForm) {
            reviewForm.addEventListener('submit', submitReview);
        }
    }
});