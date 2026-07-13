/**
 * StreamVerse Player - FINAL STABLE v6
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

    const cat = document.getElementById('current-category-title')?.innerText.toLowerCase() || "";
    isBollywoodContent = /bollywood|punjabi|south|pathaan/.test(cat);

    console.log("🚀 Opening Player:", title, type);

    // Show Player Page
    document.getElementById('main-website-view').style.display = 'none';
    document.getElementById('player-page-view').style.display = 'block';

    document.getElementById('player-media-title').innerText = title;
    document.getElementById('player-media-meta').innerText = `${(type || 'movie').toUpperCase()} | ${year} | Auto Mirror System`;

    // Clear previous video
    document.getElementById('video-frame-target').innerHTML = "<div style='padding:100px;text-align:center;color:#666;'>Connecting to stream...</div>";

    // Render servers
    renderDynamicServerControls();

    // FORCE LOAD VIDEO
    setTimeout(() => {
        loadIframeStream(1, 1);
    }, 300);
};

function renderDynamicServerControls() {
    let panel = document.querySelector('.series-control-panel');
    if (!panel) return;

    // Remove old
    let old = document.getElementById('server-controls');
    if (old) old.remove();

    const container = document.createElement('div');
    container.id = 'server-controls';
    container.style.margin = "15px 0";

    const servers = isBollywoodContent ? bollywoodServersList : hollywoodServersList;

    let html = `<strong style="color:#aaa;font-size:13px;">Servers:</strong><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;">`;

    servers.forEach((srv, i) => {
        const style = i === currentSelectedServerIndex ? 'background:#e50914;color:white;' : 'background:#222;color:#ccc;';
        html += `<button onclick="window.switchServer(${i})" style="padding:9px 16px;border:none;border-radius:6px;cursor:pointer;${style}">${srv.name}</button>`;
    });

    html += `</div>`;
    container.innerHTML = html;
    panel.appendChild(container);
}

window.switchServer = function(i) {
    currentSelectedServerIndex = i;
    renderDynamicServerControls();
    loadIframeStream(currentS, currentE);
};

window.loadIframeStream = function(s = 1, e = 1) {
    currentS = s; currentE = e;
    if (!activeTmdbId) {
        console.error("No ID");
        return;
    }

    const frameBox = document.getElementById('video-frame-target');
    const servers = isBollywoodContent ? bollywoodServersList : hollywoodServersList;
    const url = servers[currentSelectedServerIndex].generateUrl(activeTmdbId, s, e, currentType);

    frameBox.innerHTML = `<div style="padding:60px 20px;text-align:center;color:#e50914;">Loading ${servers[currentSelectedServerIndex].name}...</div>`;

    setTimeout(() => {
        frameBox.innerHTML = `
            <iframe 
                src="${url}"
                style="width:100%;height:520px;border:none;background:#000;"
                allowfullscreen 
                allow="autoplay; encrypted-media">
            </iframe>`;
    }, 400);
};

window.exitPlayerPage = function() {
    document.getElementById('player-page-view').style.display = 'none';
    document.getElementById('main-website-view').style.display = 'block';
    document.getElementById('video-frame-target').innerHTML = "";
};

window.tryAlternativeSource = function() {
    if (!activeTmdbId) return alert("No media loaded");
    const url = currentType === 'movie' 
        ? `https://embed.2embed.to/embed/tmdb/movie?id=${activeTmdbId}`
        : `https://embed.2embed.to/embed/tmdb/tv?id=${activeTmdbId}&s=1&e=1`;
    document.getElementById('video-frame-target').innerHTML = `<iframe src="${url}" style="width:100%;height:520px;border:none;" allowfullscreen></iframe>`;
};
