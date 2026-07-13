/**
 * StreamVerse Ultra-Premium Auto-Balancing Player Engine - FIXED v4
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

    // Better category detection
    const categoryTitle = document.getElementById('current-category-title')?.innerText.toLowerCase() || "";
    isBollywoodContent = /bollywood|punjabi|south|desi|pathaan|hind/.test(categoryTitle);

    console.log(`🎥 Opening: ${title} (${type}) | Bollywood Mode: ${isBollywoodContent}`);

    // UI Switch
    document.getElementById('main-website-view').style.display = 'none';
    document.getElementById('player-page-view').style.display = 'block';
    
    document.getElementById('player-media-title').innerText = title;
    document.getElementById('player-media-meta').innerText = `${type.toUpperCase()} | ${year} | Auto Mirror System`;

    document.getElementById('video-frame-target').innerHTML = "";

    renderDynamicServerControls();

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

function renderDynamicServerControls() {
    let targetPanel = document.getElementById('series-control-block');
    if (!targetPanel) return;

    // Remove old container to prevent duplicates
    const old = document.getElementById('custom-server-pool-container');
    if (old) old.remove();

    const container = document.createElement('div');
    container.id = 'custom-server-pool-container';
    container.style.marginTop = "20px";
    container.style.borderTop = "1px solid #333";
    container.style.paddingTop = "15px";

    const servers = isBollywoodContent ? bollywoodServersList : hollywoodServersList;
    let html = `<label style="font-size:11px;color:#aaa;letter-spacing:1px;display:block;margin-bottom:10px;">
        ${isBollywoodContent ? "⚡ BOLLYWOOD SERVERS" : "🌍 GLOBAL SERVERS"}
    </label><div style="display:flex;flex-wrap:wrap;gap:8px;">`;

    servers.forEach((server, i) => {
        const isActive = i === currentSelectedServerIndex;
        html += `
            <button onclick="switchActiveStreamingServer(${i})" 
                    style="padding:8px 14px; font-size:13px; border-radius:6px; cursor:pointer; border:1px solid ${isActive ? '#e50914' : '#444'}; 
                    background:${isActive ? '#e50914' : '#222'}; color:white;">
                ${server.name}
            </button>`;
    });

    html += `</div>`;
    container.innerHTML = html;
    targetPanel.appendChild(container);
}

window.switchActiveStreamingServer = function(index) {
    currentSelectedServerIndex = index;
    renderDynamicServerControls();
    loadIframeStream(currentS, currentE);
};

window.exitPlayerPage = function() {
    document.getElementById('player-page-view').style.display = 'none';
    document.getElementById('main-website-view').style.display = 'block';
    document.getElementById('video-frame-target').innerHTML = "";
    window.dispatchEvent(new Event('playerClosed'));
};

window.loadIframeStream = function(s = 1, e = 1) {
    currentS = s;
    currentE = e;
    if (!activeTmdbId) return console.error("No TMDB ID");

    const frameBox = document.getElementById('video-frame-target');
    if (!frameBox) return;

    const servers = isBollywoodContent ? bollywoodServersList : hollywoodServersList;
    let srcUrl = servers[currentSelectedServerIndex].generateUrl(activeTmdbId, s, e, currentType);

    frameBox.innerHTML = `<div style="color:#e50914;padding:50px;text-align:center;">Loading from ${servers[currentSelectedServerIndex].name}...</div>`;

    setTimeout(() => {
        frameBox.innerHTML = `
            <iframe id="streamverse-player" src="${srcUrl}" 
                scrolling="no" frameborder="0" allowfullscreen 
                allow="autoplay; encrypted-media" style="width:100%;height:520px;">
            </iframe>`;
    }, 300);
};
