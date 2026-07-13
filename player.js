/**
 * StreamVerse Ultra-Premium Auto-Balancing Player Engine - Bollywood Enabled v3
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
    currentSelectedServerIndex = 0; // Reset default to first server
    currentS = 1;
    currentE = 1;

    // Detect if content falls under Bollywood/Desi radar
    const activeCategoryElement = document.getElementById('current-category-title');
    const activeCategoryText = activeCategoryElement ? activeCategoryElement.innerText.toLowerCase() : "";
    
    // Auto flag checker for servers routing integration
    if (activeCategoryText.includes('bollywood') || activeCategoryText.includes('punjabi') || activeCategoryText.includes('south')) {
        isBollywoodContent = true;
    } else {
        isBollywoodContent = false;
    }

    console.log(`🎥 Opening: ${title} (${type}) ID: ${id} | Desi Engine: ${isBollywoodContent}`);[cite: 12]

    document.getElementById('main-website-view').style.display = 'none';[cite: 12]
    const playerView = document.getElementById('player-page-view');[cite: 12]
    playerView.style.display = 'block';[cite: 12]
    
    document.getElementById('player-media-title').innerText = title;[cite: 12]
    document.getElementById('player-media-meta').innerText = `${type.toUpperCase()} | ${year} | Automated Ultra-Fast Stream Node`;[cite: 12]

    document.getElementById('video-frame-target').innerHTML = "";[cite: 12]

    // Setup Server Control UI Switch Panel
    renderDynamicServerControls();

    if(type === 'tv') {[cite: 12]
        document.getElementById('movie-only-notice').style.display = 'none';[cite: 12]
        document.getElementById('episodes-dropdown-wrapper').style.display = 'flex';[cite: 12]
        if (typeof buildAutomatedDropdowns === "function") {[cite: 12]
            buildAutomatedDropdowns(id);[cite: 12]
        }
    } else {
        document.getElementById('episodes-dropdown-wrapper').style.display = 'none';[cite: 12]
        document.getElementById('movie-only-notice').style.display = 'block';[cite: 12]
        loadIframeStream(1, 1);[cite: 12]
    }
    window.scrollTo(0, 0);[cite: 12]
};

function renderDynamicServerControls() {
    let targetPanel = document.getElementById('series-control-block');
    if (!targetPanel) return;

    // Remove any previously rendered custom server container if exists
    const oldContainer = document.getElementById('custom-server-pool-container');
    if(oldContainer) oldContainer.remove();

    const serverContainer = document.createElement('div');
    serverContainer.id = 'custom-server-pool-container';
    serverContainer.style.marginTop = "20px";
    serverContainer.style.borderTop = "1px solid #333";
    serverContainer.style.paddingTop = "15px";

    let labelText = isBollywoodContent ? "⚡ SELECT BOLLYWOOD SERVER:" : "🌍 SELECT GLOBAL HOLLYWOOD SERVER:";
    let activeList = isBollywoodContent ? bollywoodServersList : hollywoodServersList;

    let serverButtonsHtml = `<label style="font-size:11px;color:#aaa;letter-spacing:1px;display:block;margin-bottom:10px;">${labelText}</label><div style="display:flex;flex-wrap:wrap;gap:8px;">`;
    
    activeList.forEach((srv, idx) => {
        let activeClass = idx === currentSelectedServerIndex ? 'background:#e50914;border-color:#e50914;' : 'background:#222;border-color:#444;';
        serverButtonsHtml += `
            <button class="server-btn" style="color:#fff;padding:8px 12px;cursor:pointer;border-radius:4px;border:1px solid;font-size:12px;font-weight:bold;${activeClass}" onclick="switchActiveStreamingServer(${idx})">
                ${srv.name}
            </button>
        `;
    });
    serverButtonsHtml += `</div>`;
    serverContainer.innerHTML = serverButtonsHtml;
    targetPanel.appendChild(serverContainer);
}

window.switchActiveStreamingServer = function(index) {
    currentSelectedServerIndex = index;
    renderDynamicServerControls();
    loadIframeStream(currentS, currentE);
};

window.exitPlayerPage = function() {[cite: 12]
    document.getElementById('player-page-view').style.display = 'none';[cite: 12]
    document.getElementById('main-website-view').style.display = 'block';[cite: 12]
    document.getElementById('video-frame-target').innerHTML = "";[cite: 12]
    window.dispatchEvent(new Event('playerClosed'));[cite: 12]
};

window.loadIframeStream = function(s = 1, e = 1) {[cite: 12]
    currentS = s;
    currentE = e;
    if (!activeTmdbId) {[cite: 12]
        console.error("No activeTmdbId found!");[cite: 12]
        return;[cite: 12]
    }

    const frameBox = document.getElementById('video-frame-target');[cite: 12]
    if (!frameBox) return;[cite: 12]

    // Determine target pool link
    let activeList = isBollywoodContent ? bollywoodServersList : hollywoodServersList;
    let srcUrl = activeList[currentSelectedServerIndex].generateUrl(activeTmdbId, s, e, currentType);

    frameBox.innerHTML = `<div style="color:#e50914;padding:60px 20px;text-align:center;font-size:18px;">Routing via ${activeList[currentSelectedServerIndex].name}... (S${s} E${e})<br><small>Connecting to master stream cloud database...</small></div>`;[cite: 12]

    setTimeout(() => {
        frameBox.innerHTML = `
            <iframe 
                id="streamverse-player"
                src="${srcUrl}" 
                scrolling="no"
                frameborder="0"
                allowfullscreen="true"
                allow="autoplay; encrypted-media">
            </iframe>`;[cite: 12]
    }, 400);
};
