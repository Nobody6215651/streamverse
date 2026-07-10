/**
 * StreamVerse Ultra-Premium Auto-Balancing Player Engine - FIXED v2
 */

let currentType = "movie";
let activeTmdbId = "";
let activeTitle = "";

window.routeToDedicatedPlayer = function(id, title, type, year) {
    activeTmdbId = id;
    activeTitle = title;
    currentType = type || "movie";

    console.log(`🎥 Opening: ${title} (${type}) ID: ${id}`);

    document.getElementById('main-website-view').style.display = 'none';
    const playerView = document.getElementById('player-page-view');
    playerView.style.display = 'block';
    
    document.getElementById('player-media-title').innerText = title;
    document.getElementById('player-media-meta').innerText = `${type.toUpperCase()} | ${year} | Automated Ultra-Fast Stream Node`;

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
};

window.exitPlayerPage = function() {
    document.getElementById('player-page-view').style.display = 'none';
    document.getElementById('main-website-view').style.display = 'block';
    document.getElementById('video-frame-target').innerHTML = "";
    window.dispatchEvent(new Event('playerClosed'));
};

window.loadIframeStream = function(s = 1, e = 1) {
    if (!activeTmdbId) {
        console.error("No activeTmdbId found!");
        return;
    }

    const frameBox = document.getElementById('video-frame-target');
    if (!frameBox) return;

    let srcUrl = currentType === 'movie' 
        ? `https://vidsrc.me/embed/movie?tmdb=${activeTmdbId}` 
        : `https://vidsrc.me/embed/tv?tmdb=${activeTmdbId}&sea=${s}&epi=${e}&_ts=${Date.now()}`;

    frameBox.innerHTML = `<div style="color:#e50914;padding:60px 20px;text-align:center;font-size:18px;">Loading Stream... (S${s} E${e})<br><small>Please wait...</small></div>`;

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
    }, 500);
};
