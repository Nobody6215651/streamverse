/**
 * StreamVerse Dynamic Series Dropdown - FIXED VERSION
 */

async function buildAutomatedDropdowns(tvId) {
    const seasonSelect = document.getElementById('season-selector');
    if (!seasonSelect) return;
    
    seasonSelect.innerHTML = "<option>Loading Seasons...</option>";
    
    try {
        let response = await fetch(`https://api.themoviedb.org/3/tv/${tvId}?api_key=${API_KEY}`);
        let data = await response.json();
        seasonSelect.innerHTML = "";

        let seasons = data.seasons.filter(s => s.season_number > 0);
        if (seasons.length === 0 && data.seasons.length > 0) seasons = [data.seasons[0]];

        seasons.forEach(s => {
            let opt = document.createElement('option');
            opt.value = s.season_number;
            opt.innerText = `${s.name} (${s.episode_count} Episodes)`;
            opt.setAttribute('data-epcount', s.episode_count);
            seasonSelect.appendChild(opt);
        });
        
        seasonSelect.onchange = () => updateEpisodeList();
        updateEpisodeList(); // Initial load
    } catch(e) {
        console.error("Season fetch failed", e);
        seasonSelect.innerHTML = "<option value='1' data-epcount='24'>Season 1 (Fallback)</option>";
        seasonSelect.onchange = () => updateEpisodeList();
        updateEpisodeList();
    }
}

function updateEpisodeList() {
    const seasonSelect = document.getElementById('season-selector');
    const epSelect = document.getElementById('episode-selector');
    if(!seasonSelect || !epSelect) return;

    let epCount = parseInt(seasonSelect.selectedOptions[0]?.getAttribute('data-epcount')) || 24;
    epSelect.innerHTML = "";

    for(let i = 1; i <= epCount; i++) {
        let opt = document.createElement('option');
        opt.value = i;
        opt.innerText = `Episode ${i}`;
        epSelect.appendChild(opt);
    }
    
    epSelect.onchange = () => triggerEpisodePlay();
    triggerEpisodePlay(); // Auto-play first episode of season
}

function triggerEpisodePlay() {
    let s = parseInt(document.getElementById('season-selector').value) || 1;
    let e = parseInt(document.getElementById('episode-selector').value) || 1;
    
    console.log(`🎬 Playing S${s}E${e}`);
    if (typeof loadIframeStream === "function") {
        loadIframeStream(s, e);
    }
}
