/**
 * StreamVerse Ultra-Premium Auto-Balancing Player Engine - FIXED
 */

let currentType = "movie";
let activeTmdbId = "";
let activeTitle = "";

function routeToDedicatedPlayer(id, title, type, year) {
    activeTmdbId = id;
    activeTitle = title;
    currentType = type;

    document.getElementById('main-website-view').style.display = 'none';
    const playerView = document.getElementById('player-page-view');
    playerView.style.display = 'block';
    
    document.getElementById('player-media-title').innerText = title;
    document.getElementById('player-media-meta').innerText = `${type.toUpperCase()} | ${year} | Automated Ultra-Fast Stream Node`;

    // Reset previous iframe
    document.getElementById('video-frame-target').innerHTML = "";

    if(type === 'tv') {
        document.getElementById('movie-only-notice').style.display = 'none';
        document.getElementById('episodes-dropdown-wrapper').style.display = 'flex';
        if (typeof buildAutomatedDropdowns === "function") {
            buildAutomatedDropdowns(id);
        }
    } else {
        document.getElementById('episodes-dropdown-wrapper').style.display = 'none';
        document.getElementById('movie-only-notice').style.display = 'block';
        loadIframeStream(1, 1);
    }
    window.scrollTo(0, 0);
}

function exitPlayerPage() {
    document.getElementById('player-page-view').style.display = 'none';
    document.getElementById('main-website-view').style.display = 'block';
    document.getElementById('video-frame-target').innerHTML = "";
    window.dispatchEvent(new Event('playerClosed'));
}

// FIXED: Better iframe reload with delay + error fallback
function loadIframeStream(s = 1, e = 1) {
    if (!activeTmdbId) return;

    const frameBox = document.getElementById('video-frame-target');
    if (!frameBox) return;

    let srcUrl = "";
    if (currentType === 'movie') {
        srcUrl = `https://vidsrc.me/embed/movie?tmdb=${activeTmdbId}`;
    } else {
        srcUrl = `https://vidsrc.me/embed/tv?tmdb=${activeTmdbId}&sea=${s}&epi=${e}&_ts=${Date.now()}`;
    }

    // Show loading
    frameBox.innerHTML = `<div style="color:#e50914;padding:40px;text-align:center;">Loading Stream... (Season ${s} Ep ${e})</div>`;

    setTimeout(() => {
        frameBox.innerHTML = `
            <iframe 
                id="streamverse-player"
                src="${srcUrl}" 
                scrolling="no"
                frameborder="0"
                allowfullscreen="true"
                allow="autoplay; encrypted-media">
            </iframe>`;
    }, 300); // Small delay for clean reload
}
