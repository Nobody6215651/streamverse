/**
 * StreamVerse Playback Orchestrator and Sandbox Controller
 * Path: /js/player.js
 */
(function[span_13](start_span)[span_13](end_span) (window) {
    'use strict';

    class PlaybackOrchestrator {
        constructor() {
            this.activeTmdbId = null;
            this.activeTitle = "";
            this.activeType = "movie";
            this.activeCategory = "Hollywood";
            this.currentS = 1;
            this.currentE = 1;
            this.useRegionalMatrix = false;
            this.selectedServerIndex = 0;
            this.exitCallbacks = [];

            this.CANVAS_TARGET_ID = 'video-frame-target';
            this.PLAYER_FRAME_ID = 'streamverse-player';
        }

        registerExitCallback(cb) {
            if (typeof cb === 'function') {
                this.exitCallbacks.push(cb);
            }
        }

        routeToPlayer(tmdbId, title, type, year, category) {
            this.activeTmdbId = String(tmdbId);
            this.activeTitle = String(title);
            this.activeType = (type === 'tv' || type === 'series') ? 'tv' : 'movie';
            this.activeCategory = String(category);
            this.selectedServerIndex = 0;
            this.currentS = 1;
            this.currentE = 1;

            const categoryLower = this.activeCategory.toLowerCase();
            this.useRegionalMatrix = categoryLower.includes('bollywood') ||
                                     categoryLower.includes('punjabi') ||
                                     categoryLower.includes('south');

            console.log(`[Player Orchestrator] Initializing playback. Target: ${title} | Regional Node Matrix: ${this.useRegionalMatrix}`);[span_26](start_span)[span_26](end_span)

            const catalogView = document.getElementById('main-website-view');[span_27](start_span)[span_27](end_span)
            const playerView = document.getElementById('player-page-view');[span_28](start_span)[span_28](end_span)
            if (catalogView) catalogView.style.display = 'none';[span_29](start_span)[span_29](end_span)
            if (playerView) playerView.style.display = 'block';[span_30](start_span)[span_30](end_span)

            const titleHeader = document.getElementById('player-media-title');[span_31](start_span)[span_31](end_span)
            const metaHeader = document.getElementById('player-media-meta');[span_32](start_span)[span_32](end_span)
            if (titleHeader) titleHeader.innerText = this.activeTitle;[span_33](start_span)[span_33](end_span)
            if (metaHeader) {[span_34](start_span)[span_34](end_span)
                metaHeader.innerText = `${this.activeType.toUpperCase()} | ${year || '2026'} | Secured Multi-Server Streaming Tunnel`;[span_35](start_span)[span_35](end_span)
            }

            const frameContainer = document.getElementById(this.CANVAS_TARGET_ID);[span_36](start_span)[span_36](end_span)
            if (frameContainer) frameContainer.innerHTML = "";[span_37](start_span)[span_37](end_span)

            this.renderCDNControls();

            if (this.activeType === 'tv') {[span_38](start_span)[span_38](end_span)
                const tvSelector = document.getElementById('episodes-dropdown-wrapper');[span_39](start_span)[span_39](end_span)
                const movieNotice = document.getElementById('movie-only-notice');[span_40](start_span)[span_40](end_span)
                if (tvSelector) tvSelector.style.display = 'flex';[span_41](start_span)[span_41](end_span)
                if (movieNotice) movieNotice.style.display = 'none';[span_42](start_span)[span_42](end_span)

                if (window.TVSeriesFixer && typeof window.TVSeriesFixer.buildDropdowns === 'function') {[span_43](start_span)[span_43](end_span)
                    window.TVSeriesFixer.buildDropdowns(this.activeTmdbId);[span_44](start_span)[span_44](end_span)
                }
            } else {
                const tvSelector = document.getElementById('episodes-dropdown-wrapper');[span_45](start_span)[span_45](end_span)
                const movieNotice = document.getElementById('movie-only-notice');[span_46](start_span)[span_46](end_span)
                if (tvSelector) tvSelector.style.display = 'none';[span_47](start_span)[span_47](end_span)
                if (movieNotice) movieNotice.style.display = 'block';[span_48](start_span)[span_48](end_span)
                this.loadSecureIframe(1, 1);[span_49](start_span)[span_49](end_span)
            }
            window.scrollTo(0, 0);[span_50](start_span)[span_50](end_span)
        }

        renderCDNControls() {
            const controlBox = document.getElementById('series-control-block');
            if (!controlBox) return;

            const oldContainer = document.getElementById('custom-server-pool-container');
            if (oldContainer) oldContainer.remove();

            const container = document.createElement('div');
            container.id = 'custom-server-pool-container';
            container.className = 'server-pool-container';

            const activeCluster = this.useRegionalMatrix ? window.BollywoodServers : window.HollywoodServers;
            const nodes = activeCluster.getNodes();

            const label = document.createElement('label');
            label.className = 'server-pool-label';
            label.innerText = this.useRegionalMatrix ? "⚡ SELECT BOLLYWOOD CDN ROUTE:" : "🌍 SELECT GLOBAL HOLLYWOOD CDN ROUTE:";
            container.appendChild(label);

            const wrapper = document.createElement('div');
            wrapper.className = 'server-btn-wrapper';

            nodes.forEach((node, index) => {
                const btn = document.createElement('button');
                btn.className = 'server-btn';
                btn.innerText = node.name;
                if (index === this.selectedServerIndex) {
                    btn.classList.add('active');
                }
                btn.onclick = () => this.switchCDNRoute(index);
                wrapper.appendChild(btn);
            });

            container.appendChild(wrapper);
            controlBox.appendChild(container);
        }

        switchCDNRoute(index) {
            this.selectedServerIndex = Number(index);
            this.renderCDNControls();
            this.loadSecureIframe(this.currentS, this.currentE);
        }

        exitPlayer() {[span_51](start_span)[span_51](end_span)
            const playerView = document.getElementById('player-page-view');[span_52](start_span)[span_52](end_span)
            const catalogView = document.getElementById('main-website-view');[span_53](start_span)[span_53](end_span)
            if (playerView) playerView.style.display = 'none';[span_54](start_span)[span_54](end_span)
            if (catalogView) catalogView.style.display = 'block';[span_55](start_span)[span_55](end_span)

            const frameContainer = document.getElementById(this.CANVAS_TARGET_ID);[span_56](start_span)[span_56](end_span)
            if (frameContainer) frameContainer.innerHTML = "";[span_57](start_span)[span_57](end_span)

            this.exitCallbacks.forEach(cb => {
                try { cb(); } catch (err) { console.error("[Playback Event Handler Error]", err); }
            });[span_58](start_span)[span_58](end_span)
        }

        loadSecureIframe(s = 1, e = 1) {[span_59](start_span)[span_59](end_span)
            this.currentS = Number(s);
            this.currentE = Number(e);

            if (!this.activeTmdbId) {[span_60](start_span)[span_60](end_span)
                console.error("[Playback Fail] Missing critical TMDB identifier.");[span_61](start_span)[span_61](end_span)
                return;[span_62](start_span)[span_62](end_span)
            }

            const container = document.getElementById(this.CANVAS_TARGET_ID);[span_63](start_span)[span_63](end_span)
            if (!container) return;[span_64](start_span)[span_64](end_span)

            const activeCluster = this.useRegionalMatrix ? window.BollywoodServers : window.HollywoodServers;
            const node = activeCluster.getNodes()[this.selectedServerIndex];
            const routeUrl = node.generateUrl(this.activeTmdbId, this.currentS, this.currentE, this.activeType);

            container.innerHTML = `
                <div class="routing-shimmer">
                    <div class="spinner"></div>
                    <p>Securing Edge Network Connection: ${node.name}...</p>
                    <small>Bypassing redirects on S${this.currentS} E${this.currentE} | Stabilizing Audio-Visual Buffer...</small>
                </div>`;[span_65](start_span)[span_65](end_span)

            setTimeout(() => {
                container.innerHTML = `
                    <iframe 
                        id="${this.PLAYER_FRAME_ID}"
                        src="${routeUrl}" 
                        scrolling="no"
                        frameborder="0"
                        allowfullscreen="true"
                        sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
                        referrerpolicy="no-referrer"
                        allow="autoplay; encrypted-media; picture-in-picture">
                    </iframe>`;[span_66](start_span)[span_66](end_span)
            }, 500);
        }
    }

    Object.freeze(PlaybackOrchestrator);
    Object.freeze(PlaybackOrchestrator.prototype);
    window.StreamVersePlayer = new PlaybackOrchestrator();

})(window);
