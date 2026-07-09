/**
 * StreamVerse Dynamic Series Dropdown Mapping Module - Enterprise Level
 * CinemaBox & Pikashow Level Cache-Busting Sync System
 */

async function buildAutomatedDropdowns(tvId) {
    const seasonSelect = document.getElementById('season-selector');
    if (!seasonSelect) return;
    
    seasonSelect.innerHTML = "<option>Synchronizing Seasons...</option>";
    
    try {
        let response = await fetch(`https://api.themoviedb.org/3/tv/${tvId}?api_key=${API_KEY}`);
        let data = await response.json();
        seasonSelect.innerHTML = "";
        
        let seasons = data.seasons.filter(s => s.season_number > 0);
        if(seasons.length === 0 && data.seasons.length > 0) seasons = [data.seasons[0]];

        seasons.forEach(s => {
            let opt = document.createElement('option');
            opt.value = s.season_number;
            opt.innerText = `${s.name} (${s.episode_count} Episodes)`;
            opt.setAttribute('data-epcount', s.episode_count);
            seasonSelect.appendChild(opt);
        });
        
        // Strict explicit binding
        seasonSelect.onchange = function() { updateEpisodeList(); };
        updateEpisodeList();
    } catch(e) {
        seasonSelect.innerHTML = "<option value='1' data-epcount='24'>Season 1 (Scraper Backup)</option>";
        seasonSelect.onchange = function() { updateEpisodeList(); };
        updateEpisodeList();
    }
}

function updateEpisodeList() {
    const seasonSelect = document.getElementById('season-selector');
    const epSelect = document.getElementById('episode-selector');
    if(!seasonSelect || !epSelect || !seasonSelect.selectedOptions[0]) return;
    
    let epCount = seasonSelect.selectedOptions[0].getAttribute('data-epcount') || 24;
    epSelect.innerHTML = "";
    
    for(let i = 1; i <= epCount; i++) {
        let opt = document.createElement('option');
        opt.value = i;
        opt.innerText = `Episode ${i}`;
        epSelect.appendChild(opt);
    }
    
    epSelect.onchange = function() { triggerEpisodePlay(); };
    triggerEpisodePlay();
}

function triggerEpisodePlay() {
    let s = document.getElementById('season-selector').value || 1;
    let e = document.getElementById('episode-selector').value || 1;
    
    // Core Fix: Destroying player cache dynamically to push fresh stream parameters
    const targetBox = document.getElementById('video-frame-target');
    if (targetBox && typeof loadIframeStream === "function") {
        
        // Clear frame explicitly to release player layout locks
        targetBox.innerHTML = "<div class='loading-text' style='color:#00ffcc;'>Handshaking Fresh Episode Stream Node...</div>";
        
        setTimeout(() => {
            // Overriding global state to push to the parent loadIframeStream engine
            if (typeof globalSeason !== 'undefined') globalSeason = parseInt(s);
            if (typeof globalEpisode !== 'undefined') globalEpisode = parseInt(e);
            
            // Call the core loader
            loadIframeStream(parseInt(s), parseInt(e));
            
            // Append a unique timestamp matrix directly inside the iframe src to bypass vidsrc internal routing locks
            const activeIframe = document.getElementById('streamverse-player');
            if (activeIframe && activeIframe.src) {
                let separator = activeIframe.src.includes('?') ? '&' : '?';
                activeIframe.src = activeIframe.src + separator + "stream_session=" + Date.now();
            }
        }, 150);
    }
}
