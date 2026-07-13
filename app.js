document.addEventListener("DOMContentLoaded", () => {
    // If local database file exists and contains items, load it. Otherwise run live API
    if (typeof moviesDatabase !== 'undefined' && Array.isArray(moviesDatabase) && moviesDatabase.length > 0) {
        renderMovies(moviesDatabase);
    } else {
        console.log("Local database empty or missing. Triggering global hybrid stream api...");
        if(typeof loadCategory === 'function') {
            loadCategory('trending');
        }
    }
});

function renderMovies(moviesList) {
    const container = document.getElementById('movie-grid-container');
    if (!container) return;
    container.innerHTML = "";
    
    if(!moviesList || moviesList.length === 0) {
        container.innerHTML = "<div class='loading-text'>No movies found matching criteria.</div>";
        return;
    }

    moviesList.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        
        // Connect directly to fixed player route inside window context
        card.onclick = () => {
            if (typeof window.routeToDedicatedPlayer === "function") {
                window.routeToDedicatedPlayer(movie.tmdbId, movie.title, movie.type || 'movie', movie.year);
            } else {
                alert("Streaming Engine Error: Click Handler Unbound!");
            }
        };
        
        card.innerHTML = `
            <span class="badge">${movie.quality || '1080p FHD'}</span>
            <img class="movie-poster" src="${movie.poster}">
            <div class="movie-info">
                <strong>${movie.title}</strong>
                <div style="color: #888; font-size:11px; margin-top:5px;">Year: ${movie.year || '2026'}</div>
            </div>
        `;
        container.appendChild(card);
    });
}

function filterCategory(cat) {
    const titleContainer = document.getElementById('current-category-title');
    if(!titleContainer) return;

    if (typeof moviesDatabase === 'undefined' || moviesDatabase.length === 0) {
        titleContainer.innerText = cat.toUpperCase() + " Section";
        return;
    }

    if(cat === 'all' || cat === 'trending') {
        titleContainer.innerText = "Trending Content";
        renderMovies(moviesDatabase);
    } else {
        titleContainer.innerText = cat.toUpperCase() + " Section";
        const filtered = moviesDatabase.filter(m => m.category && m.category.toLowerCase() === cat.toLowerCase());
        renderMovies(filtered);
    }
}

function searchMovies() {
    let query = document.getElementById('search-bar').value.toLowerCase().trim();
    if(!query) {
        if(typeof moviesDatabase !== 'undefined') renderMovies(moviesDatabase);
        return;
    }
    if(typeof moviesDatabase !== 'undefined') {
        let filtered = moviesDatabase.filter(m => m.title && m.title.toLowerCase().includes(query));
        renderMovies(filtered);
    }
}
