/**
 * StreamVerse Resilient Metadata Synchronization Engine
 * Path: /js/series_fixer.js
 */
(function (window) {
    'use strict';

    const TMDB_API_KEY = "82e880c89dbf119b940e034ed32a3498";

    class MetadataSynchronizer {
        constructor() {
            this.activeTvId = null;
            this.syncCache = new Map();
        }

        async buildDropdowns(tvId) {
            this.activeTvId = String(tvId);
            const seasonSelect = document.getElementById('season-selector');
            if (!seasonSelect) return;

            seasonSelect.innerHTML = "<option value='' disabled selected>Syncing with API Registry...</option>";

            if (this.syncCache.has(this.activeTvId)) {
                console.log(`[Metadata Sync] Serving cached season structure for ID: ${this.activeTvId}`);
                this.renderSeasons(this.syncCache.get(this.activeTvId));
                return;
            }

            let attempt = 0;
            const maxAttempts = 3;
            let success = false;
            let payload = null;

            while (attempt < maxAttempts && !success) {
                try {
                    const res = await fetch(`https://api.themoviedb.org/3/tv/${this.activeTvId}?api_key=${TMDB_API_KEY}`);
                    if (!res.ok) throw new Error(`Handshake failure. HTTP Error Code: ${res.status}`);
                    payload = await res.json();
                    success = true;
                } catch (err) {
                    attempt++;
                    console.warn(`[API Connection Retry] Attempt ${attempt}/${maxAttempts} failed. Error: ${err.message}`);
                    if (attempt < maxAttempts) {
                        // Exponential backoff wait time calculation
                        const waitTime = 500 * Math.pow(2, attempt) + (Math.random() * 100);
                        await new Promise(resolve => setTimeout(resolve, waitTime));
                    }
                }
            }

            if (success && payload && payload.seasons) {
                // Filter out non-canonical bonus or promo seasons (Season 0)
                let cleanSeasons = payload.seasons.filter(s => Number(s.season_number) > 0);
                if (cleanSeasons.length === 0 && payload.seasons.length > 0) {
                    cleanSeasons = [payload.seasons[0]];
                }
                this.syncCache.set(this.activeTvId, cleanSeasons);
                this.renderSeasons(cleanSeasons);
            } else {
                console.error("[Metadata Sync Critical Error] External catalog unreachable. Initializing local fallback data.");
                this.triggerFallbackDataState();
            }
        }

        renderSeasons(seasons) {
            const seasonSelect = document.getElementById('season-selector');
            if (!seasonSelect) return;
            seasonSelect.innerHTML = "";

            seasons.forEach(s => {
                const opt = document.createElement('option');
                opt.value = String(s.season_number);
                opt.innerText = `${s.name || `Season ${s.season_number}`} (${s.episode_count || 10} Episodes)`;
                opt.setAttribute('data-epcount', String(s.episode_count || 10));
                seasonSelect.appendChild(opt);
            });

            seasonSelect.onchange = () => this.updateEpisodes();
            this.updateEpisodes();
        }

        triggerFallbackDataState() {
            const seasonSelect = document.getElementById('season-selector');
            if (!seasonSelect) return;
            seasonSelect.innerHTML = "";

            const safeFallbackData = [
                { season_number: 1, name: "Season 1 (Fallback Cache)", episode_count: 24 },
                { season_number: 2, name: "Season 2 (Fallback Cache)", episode_count: 22 },
                { season_number: 3, name: "Season 3 (Fallback Cache)", episode_count: 18 }
            ];

            safeFallbackData.forEach(s => {
                const opt = document.createElement('option');
                opt.value = String(s.season_number);
                opt.innerText = `${s.name} (${s.episode_count} Episodes)`;
                opt.setAttribute('data-epcount', String(s.episode_count));
                seasonSelect.appendChild(opt);
            });

            seasonSelect.onchange = () => this.updateEpisodes();
            this.updateEpisodes();
        }

        updateEpisodes() {
            const seasonSelect = document.getElementById('season-selector');
            const episodeSelect = document.getElementById('episode-selector');
            if (!seasonSelect || !episodeSelect) return;

            const selected = seasonSelect.selectedOptions[0];
            const epCount = selected ? Number(selected.getAttribute('data-epcount')) : 12;

            episodeSelect.innerHTML = "";
            for (let i = 1; i <= epCount; i++) {
                const opt = document.createElement('option');
                opt.value = String(i);
                opt.innerText = `Episode ${i}`;
                episodeSelect.appendChild(opt);
            }

            episodeSelect.onchange = () => this.firePlaybackRoute();
            this.firePlaybackRoute();
        }

        firePlaybackRoute() {
            const seasonSelect = document.getElementById('season-selector');
            const episodeSelect = document.getElementById('episode-selector');
            if (!seasonSelect || !episodeSelect) return;

            const s = Number(seasonSelect.value) || 1;
            const e = Number(episodeSelect.value) || 1;

            console.log(`[Metadata Sync Router] Dispatching play state update event: Season ${s} | Episode ${e}`);
            if (window.StreamVersePlayer && typeof window.StreamVersePlayer.loadSecureIframe === 'function') {
                window.StreamVersePlayer.loadSecureIframe(s, e);
            }
        }
    }

    Object.freeze(MetadataSynchronizer);
    Object.freeze(MetadataSynchronizer.prototype);
    window.TVSeriesFixer = new MetadataSynchronizer();

})(window);
