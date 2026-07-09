/**
 * StreamVerse Ultra Premium Player Core (Moviebox & Netmirror Logic)
 * No More Heavy Sandboxing - Directly Accessing Pure Streaming Buffers
 */

let currentType = "movie";
let activeTmdbId = "";
let activeTitle = "";
let activeServerNum = 1;

function routeToDedicatedPlayer(id, title, type, year) {
    activeTmdbId = id;
    activeTitle = title;
    currentType = type;
    activeServerNum = 1;

    document.getElementById('main-website-view').style.display = 'none';
    const playerView = document.getElementById('player-page-view');
    playerView.style.display = 'block';
    
    document.getElementById('player-media-title').innerText = title;
    document.getElementById('player-media-meta').innerText = `${type.toUpperCase()} | Release Year: ${year} | Premium MovieBox Hybrid Node`;

    resetServerButtons();

    if(type === 'tv') {
        document.getElementById('movie-only-notice').style.display = 'none';
        document.getElementById('episodes-dropdown-wrapper').style.display = 'flex';
        buildAutomatedDropdowns(id);
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
}

function resetServerButtons() {
    for(let i = 1; i <= 4; i++) {
        let btn = document.getElementById(`srv${i}`);
        if(btn) {
            if(i === 1) btn.classList.add('active');
            else btn.classList.remove('active');
        }
    }
}

async function buildAutomatedDropdowns(tvId) {
    const seasonSelect = document.getElementById('season-selector');
    seasonSelect.innerHTML = "<option>Loading Seasons...</option>";
    
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
        
        updateEpisodeList();
    } catch(e) {
        seasonSelect.innerHTML = "<option value='1'>Season 1 (Default)</option>";
        updateEpisodeList();
    }
}

function updateEpisodeList() {
    const seasonSelect = document.getElementById('season-selector');
    const epSelect = document.getElementById('episode-selector');
    if(!seasonSelect.selectedOptions[0]) return;
    
    let epCount = seasonSelect.selectedOptions[0].getAttribute('data-epcount') || 24;
    epSelect.innerHTML = "";
    
    for(let i = 1; i <= epCount; i++) {
        let opt = document.createElement('option');
        opt.value = i;
        opt.innerText = `Episode ${i}`;
        epSelect.appendChild(opt);
    }
    triggerEpisodePlay();
}

function triggerEpisodePlay() {
    let s = document.getElementById('season-selector').value || 1;
    let e = document.getElementById('episode-selector').value || 1;
    loadIframeStream(s, e);
}

// 👑 UPGRADED HIGH-STREAM PREMIUM PIPELINES
function loadIframeStream(s = 1, e = 1) {
    const frameBox = document.getElementById('video-frame-target');
    let srcUrl = "";

    // Pikashow / Netmirror jese premium free scrapers par shift kar diya
    if(currentType === 'movie') {
        if (activeServerNum === 1) srcUrl = `https://vidsrc.cc/v2/embed/movie/${activeTmdbId}`; // Super FAST & Clean
        else if (activeServerNum === 2) srcUrl = `https://vidlink.pro/movie/${activeTmdbId}`; // Premium No Ad Layout
        else if (activeServerNum === 3) srcUrl = `https://vidsrc.xyz/embed/movie/${activeTmdbId}`;
        else srcUrl = `https://embed.su/embed/movie/${activeTmdbId}`;
    } else {
        if (activeServerNum === 1) srcUrl = `https://vidsrc.cc/v2/embed/tv/${activeTmdbId}/${s}/${e}`;
        else if (activeServerNum === 2) srcUrl = `https://vidlink.pro/tv/${activeTmdbId}/${s}/${e}`;
        else if (activeServerNum === 3) srcUrl = `https://vidsrc.xyz/embed/tv/${activeTmdbId}/${s}/${e}`;
        else srcUrl = `https://embed.su/embed/tv/${activeTmdbId}/${s}/${e}`;
    }

    /**
     * WEAKNESS SOLVED: Humne sandbox ko hata kar frame ko super-clean links de diye hain.
     * Ab video direct load hogi bina kisi loading error ke!
     */
    frameBox.innerHTML = `
        <iframe 
            src="${srcUrl}" 
            scrolling="no"
            frameborder="0"
            allowfullscreen="true"
            webkitallowfullscreen="true"
            mozallowfullscreen="true"
            allow="autoplay; encrypted-media">
        </iframe>`;
}

function switchStreamServer(num) {
    activeServerNum = num;
    
    for(let i = 1; i <= 4; i++) {
        let btn = document.getElementById(`srv${i}`);
        if(btn) btn.className = (i === num) ? "server-btn active" : "server-btn";
    }
    
    if(currentType === 'movie') {
        loadIframeStream();
    } else {
        let s = document.getElementById('season-selector').value || 1;
        let e = document.getElementById('episode-selector').value || 1;
        loadIframeStream(s, e);
    }
}
