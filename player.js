let currentServer1 = "";
let currentServer2 = "";

// Movie/Series Embed Generator Engine
function openPlayer(tmdbId, title, type = "movie", season = "1", episode = "1") {
    document.getElementById('videoPlayerModal').style.display = 'flex';
    document.getElementById('modal-video-title').innerText = "Streaming via Public Node: " + title;
    
    let videoWrapper = document.querySelector('.video-wrapper');
    
    // Public Embedding APIs endpoints
    if (type === "movie") {
        currentServer1 = `https://vidsrc.to/embed/movie/${tmdbId}`;
        currentServer2 = `https://multiembed.to/get.php?video_id=${tmdbId}&tmdb=1`;
    } else {
        currentServer1 = `https://vidsrc.to/embed/tv/${tmdbId}/${season}/${episode}`;
        currentServer2 = `https://multiembed.to/get.php?video_id=${tmdbId}&tmdb=1&s=${season}&e=${episode}`;
    }

    // Default load Server 1
    videoWrapper.innerHTML = `<iframe src="${currentServer1}" style="width: 100%; height: 400px; border: none;" allowfullscreen></iframe>`;
}

function closePlayer() {
    let videoWrapper = document.querySelector('.video-wrapper');
    videoWrapper.innerHTML = ""; // Stop audio stream backend
    document.getElementById('videoPlayerModal').style.display = 'none';
}

function switchServer(serverNum) {
    let videoWrapper = document.querySelector('.video-wrapper');
    let buttons = document.querySelectorAll('.server-btn');
    
    buttons.forEach((btn, i) => {
        if(i === (serverNum - 1)) btn.classList.add('active');
        else btn.classList.remove('active');
    });

    if (serverNum === 1) {
        videoWrapper.innerHTML = `<iframe src="${currentServer1}" style="width: 100%; height: 400px; border: none;" allowfullscreen></iframe>`;
    } else {
        videoWrapper.innerHTML = `<iframe src="${currentServer2}" style="width: 100%; height: 400px; border: none;" allowfullscreen></iframe>`;
    }
}