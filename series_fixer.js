/**
 * StreamVerse Dynamic Series Dropdown Mapping Module - Professional Core
 * CinemaBox & Pikashow Level Session Reconstruction Layout
 * Bypasses vidsrc internal selection lock permanently.
 */

async function buildAutomatedDropdowns(tvId) {
    const seasonSelect = document.getElementById('season-selector');
    if (!seasonSelect) return;
    
    seasonSelect.innerHTML = "<option>Synchronizing Core Masters...</option>";
    
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
        
        // Dynamic explicit change hook
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
    
    const targetBox = document.getElementById('video-frame-target');
    if (!targetBox) return;

    // STEP 1: Destroy the existing iframe completely from HTML DOM to erase player memory cache
    targetBox.innerHTML = `
        <div class='loading-text' style='color:#00ffcc; text-align:center; padding:50px;'>
            <i class="fas fa-circle-notch fa-spin"></i> Initializing Hardware Node [S${s} : E${e}]...
        </div>`;

    // STEP 2: Wait 200ms for memory release, then inject a completely brand new iframe node
    setTimeout(() => {
        // Safe access to global variables inside player.js if they exist
        if (typeof globalSeason !== 'undefined') globalSeason = parseInt(s);
        if (typeof globalEpisode !== 'undefined') globalEpisode = parseInt(e);

        // Standard fallback URL definition matching your master scraper patterns
        let freshSrcUrl = `https://vidsrc.me/embed/tv?tmdb=${activeTmdbId}&sea=${s}&epi=${e}`;
        
        // CRITICAL FIX: Append unique runtime salt block key to force bypass the top-left player lock
        let securityBusterToken = `&vidsrc_bridge_sync=${Date.now()}&forced_route=1`;
        let completeRoute = freshSrcUrl + securityBusterToken;

        targetBox.innerHTML = `
            <iframe 
                id="streamverse-player"
                src="${completeRoute}" 
                scrolling="no"
                frameborder="0"
                allowfullscreen="true"
                webkitallowfullscreen="true"
                mozallowfullscreen="true"
                allow="autoplay; encrypted-media"
                style="width: 100%; height: 520px; border: none; display: block; background: #000;">
            </iframe>`;
            
        console.log(`StreamVerse Synced: Forced frame update to S${s} E${e}`);
    }, 200);
}
