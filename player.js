/**
 * StreamVerse Player - FIXED v5 (Stable)
 */

let currentType = "movie";
let activeTmdbId = "";
let activeTitle = "";
let isBollywoodContent = false;
let currentSelectedServerIndex = 0;
let currentS = 1;
let currentE = 1;

window.routeToDedicatedPlayer = function(id, title, type, year) {
    activeTmdbId = id;
    activeTitle = title;
    currentType = type || "movie";
    currentSelectedServerIndex = 0;
    currentS = 1;
    currentE = 1;

    const catTitle = document.getElementById('current-category-title')?.innerText.toLowerCase() || "";
    isBollywoodContent = /bollywood|punjabi|south|pathaan/.test(catTitle);

    console.log(`Opening: ${title} | Bollywood: ${isBollywoodContent}`);

    // Show Player
    document.getElementById('main-website-view').style.display = 'none';
    document.getElementById('player-page-view').style.display = 'block';

    document.getElementById('player-media-title').innerText = title;
    document.getElementById('player-media-meta').innerText = `${type.toUpperCase()} | ${year} | Auto Mirror System`;

    document.getElementById('video-frame-target').innerHTML = "";

    // Render Server Buttons
    renderDynamicServerControls();

    // Load First Stream
    if (type === 'tv') {
        document.getElementById('episodes-dropdown-wrapper').style.display = 'block';
        if (typeof buildAutomatedDropdowns === "function") buildAutomatedDropdowns(id);
    } else {
        document.getElementById('episodes-dropdown-wrapper').style.display = 'none';
        loadIframeStream(1, 1);
    }
};

function renderDynamicServerControls() {
    const panel = document.getElementById('series-control-panel') || document.querySelector('.series-control-panel');
    if (!panel) return;

    // Remove old controls
    const old = document.getElementById('server-controls');
    if (old) old.remove();

    const container = document.createElement('div');
    container.id = 'server-controls';
    container.style.marginTop = "15px";

    const servers = isBollywoodContent ? bollywoodServersList : hollywoodServersList;

    let html = `<p style="margin:10px 0 8px 0;font-size:13px;color:#aaa;">Select Server:</p><div style="display:flex;gap:8px;flex-wrap:wrap;">`;

    servers.forEach((srv, i) => {
        const active = i === currentSelectedServerIndex ? 'background:#e50914;color:white;' : 'background:#222;color:#ddd;';
        html += `<button onclick="switchServer(${i})" style="padding:8px 14px;border-radius:6px;border:none;cursor:pointer;${active}">${srv.name}</button>`;
    });

    html += `</div>`;
    container.innerHTML = html;
    panel.appendChild(container);
}

window.switchServer = function(index) {
    currentSelectedServerIndex = index;
    renderDynamicServerControls();
    loadIframeStream(currentS, currentE);
};

window.loadIframeStream = function(s = 1, e = 1) {
    currentS = s;
    currentE = e;
    if (!activeTmdbId) return;

    const frameBox = document.getElementById('video-frame-target');
    const servers = isBollywoodContent ? bollywoodServersList : hollywoodServersList;
    const srcUrl = servers[currentSelectedServerIndex].generateUrl(activeTmdbId, s, e, currentType);

    frameBox.innerHTML = `<div style="padding:80px 20px;text-align:center;color:#e50914;">Loading from ${servers[currentSelectedServerIndex].name}...</div>`;

    setTimeout(() => {
        frameBox.innerHTML = `
            <iframe src="${srcUrl}" 
                style="width:100%; height:520px; border:none;" 
                allowfullscreen allow="autoplay">
            </iframe>`;
    }, 600);
};

window.exitPlayerPage = function() {
    document.getElementById('player-page-view').style.display = 'none';
    document.getElementById('main-website-view').style.display = 'block';
    document.getElementById('video-frame-target').innerHTML = "";
};

window.tryAlternativeSource = function() {
    if (!activeTmdbId) return;
    const url = currentType === 'movie' 
        ? `https://embed.2embed.to/embed/tmdb/movie?id=${activeTmdbId}`
        : `https://embed.2embed.to/embed/tmdb/tv?id=${activeTmdbId}&s=1&e=1`;
    document.getElementById('video-frame-target').innerHTML = `<iframe src="${url}" style="width:100%;height:520px;border:none;" allowfullscreen></iframe>`;
};
