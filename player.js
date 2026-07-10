/**
 * StreamVerse Ultra-Premium Auto-Balancing Player Engine
 * CinemaBox & Pikashow Logic - Zero Latency Automated Buffer
 */

let currentType = "movie";
let activeTmdbId = "";
let activeTitle = "";

function routeToDedicatedPlayer(id, title, type, year) {
    activeTmdbId = id;
    activeTitle = title;
    currentType = type;

    // UI Switches
    document.getElementById('main-website-view').style.display = 'none';
    const playerView = document.getElementById('player-page-view');
    playerView.style.display = 'block';
    
    document.getElementById('player-media-title').innerText = title;
    document.getElementById('player-media-meta').innerText = `${type.toUpperCase()} | ${year} | Automated Ultra-Fast Stream Node`;

    if(type === 'tv') {
        document.getElementById('movie-only-notice').style.display = 'none';
        document.getElementById('episodes-dropdown-wrapper').style.display = 'flex';
        
        // Dispatches to external series_fixer engine
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
    
    // Custom reset dispatch hook for external scripts if required
    window.dispatchEvent(new Event('playerClosed'));
}

// 🚀 AUTOMATED MASTER STREAM INJECTOR
// 🚀 AUTOMATED MASTER STREAM INJECTOR (ULTRA-SYNCHRONIZED FIXED)
function loadIframeStream(s = 1, e = 1) {
    // Sync force values safely to prevent fallback drops
    if (typeof activeTmdbId === 'undefined' || !activeTmdbId) return;

    const frameBox = document.getElementById('video-frame-target');
    if (!frameBox) return;

    let srcUrl = "";
    if (currentType === 'movie') {
        srcUrl = `https://vidsrc.me/embed/movie?tmdb=${activeTmdbId}`; 
    } else {
        // Core Fix: Parameter variables passed dynamically with no-cache token
        srcUrl = `https://vidsrc.me/embed/tv?tmdb=${activeTmdbId}&sea=${s}&epi=${e}&_ts=${Date.now()}`;
    }

    // Completely reset DOM element cache node
    frameBox.innerHTML = `
        <iframe 
            id="streamverse-player"
            src="${srcUrl}" 
            scrolling="no"
            frameborder="0"
            allowfullscreen="true"
            webkitallowfullscreen="true"
            mozallowfullscreen="true"
            allow="autoplay; encrypted-media">
        </iframe>`;
}
