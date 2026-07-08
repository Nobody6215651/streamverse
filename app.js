document.addEventListener("DOMContentLoaded", () => {
    renderMovies(moviesDatabase);
});

function renderMovies(moviesList) {
    const container = document.getElementById('movie-grid-container');
    container.innerHTML = "";
    
    moviesList.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.onclick = () => openPlayer(movie.tmdbId, movie.title, movie.type, movie.season, movie.episode);
        
        card.innerHTML = `
            <span class="badge">${movie.quality}</span>
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
    if(cat === 'all') {
        document.getElementById('current-category-title').innerText = "All Movies & Web Series";
        renderMovies(moviesDatabase);
    } else {
        document.getElementById('current-category-title').innerText = cat + " Section";
        const filtered = moviesDatabase.filter(m => m.category === cat);
        renderMovies(filtered);
    }
}

function searchMovies() {
    let query = document.getElementById('search-bar').value.toLowerCase();
    let filtered = moviesDatabase.filter(m => m.title.toLowerCase().includes(query));
    renderMovies(filtered);
}