document.addEventListener("DOMContentLoaded", () => {
    if (typeof moviesDatabase !== 'undefined') {
        renderMovies(moviesDatabase);
    }
});

function renderMovies(moviesList) {
    const container = document.getElementById('movie-grid-container');
    if (!container) return;
    container.innerHTML = "";
    
    moviesList.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        
        card.onclick = () => {
            if (typeof window.routeToDedicatedPlayer === "function") {
                window.routeToDedicatedPlayer(movie.tmdbId, movie.title, movie.type, movie.year);
            } else {
                console.error("Streaming Core Engine down!");
            }
        };
        
        card.innerHTML = `
            <span class="badge">${movie.quality || 'HD'}</span>
            <img class="movie-poster" src="${movie.poster}">
            <div class="movie-info">
                <strong>${movie.title}</strong>
                <div style="color: #888; font-size:11px; margin-top:5px;">Year: ${movie.year}</div>
            </div>
        `;
        container.appendChild(card);
    });
}

function filterCategory(cat) {
    const container = document.getElementById('current-category-title');
    if(cat === 'all') {
        container.innerText = "All Movies & Web Series";
        renderMovies(moviesDatabase);
    } else {
        container.innerText = cat.toUpperCase() + " Section";
        const filtered = moviesDatabase.filter(m => m.category.toLowerCase() === cat.toLowerCase());
        renderMovies(filtered);
    }
}

function searchMovies() {
    let query = document.getElementById('search-bar').value.toLowerCase();
    let filtered = moviesDatabase.filter(m => m.title.toLowerCase().includes(query));
    renderMovies(filtered);
}
