/**
 * StreamVerse Main Single-Page Application Layout Coordinator
 * Path: /js/app.js
 */
(function (window) {
    'use strict';

    class ApplicationCore {
        constructor() {
            this.tmdbBaseUrl = "[span_19](start_span)[span_19](end_span)[span_21](start_span)[span_21](end_span)https://api.themoviedb.org/3";
            this.apiKey = "82e880c89dbf119b940e034ed32a3498";
            this.activeCategory = "all";
            this.debounceTimer = null;
            this.localRegistryCache = new Map();
        }

        initializeSystem() {
            this.bindCoreLayoutEvents();
            this.bootstrapDatabaseSync();
        }

        bindCoreLayoutEvents() {
            const inputField = document.getElementById('search-bar');
            if (inputField) {
                inputField.addEventListener('input', (event) => this.debounceSearchQuery(event));
            }

            // Sync with hardware audio events
            if (window.StreamVersePlayer) {
                window.StreamVersePlayer.registerExitCallback(() => {
                    if (window.StreamVerseBooster) {
                        window.StreamVerseBooster.executeHardwareAmplification(1.0);
                    }
                });
            }
        }

        bootstrapDatabaseSync() {
            if (window.StreamVerseDatabase) {
                const list = window.StreamVerseDatabase.getAll();
                list.forEach(item => this.localRegistryCache.set(Number(item.id), item));
                this.renderGridToTarget(list, 'movie-grid-container');
            }

            // Sync with dynamic trending lists on TMDB in the background
            this.syncLiveTrendingStreams();
        }

        syncLiveTrendingStreams() {
            const endpoint = `${this.tmdbBaseUrl}/trending/all/day?api_key=${this.apiKey}`;
            fetch(endpoint)
                .then(res => {
                    if (!res.ok) throw new Error("TMDB network connection timeout.");
                    return res.json();
                })
                .then(data => {
                    if (data && data.results) {
                        const validatedResults = data.results.slice(0, 18).map((raw, idx) => {
                            const isTv = raw.media_type === 'tv' || raw.first_air_date !== undefined;
                            return {
                                id: 2000 + idx, // Explicit offset index range to protect static keys
                                title: raw.title || raw.name || "Untitled Resource Item",
                                category: isTv ? "Web Series" : "Hollywood",
                                quality: "HDR 10bit",
                                year: (raw.release_date || raw.first_air_date || "2026").split("-")[0],
                                poster: raw.poster_path ? `https://image.tmdb.org/t/p/w300${raw.poster_path}` : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=400",
                                tmdbId: String(raw.id),
                                type: isTv ? "tv" : "movie"
                            };
                        });

                        validatedResults.forEach(item => {
                            if (window.StreamVerseDatabase) {
                                window.StreamVerseDatabase.registerItem(item);
                            }
                            this.localRegistryCache.set(Number(item.id), item);
                        });

                        this.filterSection(this.activeCategory);
                    }
                })
                .catch(err => {
                    console.warn(`[Core Background Sync Warning] Trend API sync failed: ${err.message}`);
                });
        }

        renderGridToTarget(itemList, containerId) {
            const container = document.getElementById(containerId);
            if (!container) return;
            container.innerHTML = "";

            if (itemList.length === 0) {
                container.innerHTML = `
                    <div class="empty-query-indicator">
                        <i class="fas fa-folder-open"></i>
                        <p>No matches matching filter criteria found in database registry.</p>
                    </div>`;
                return;
            }

            const frameFragment = document.createDocumentFragment();

            itemList.forEach(item => {
                const card = document.createElement('div');
                card.className = 'movie-card';
                card.setAttribute('tabindex', '0');

                card.innerHTML = `
                    <span class="badge">${item.quality}</span>
                    <div class="poster-zoom-wrapper">
                        <img class="movie-poster" src="${item.poster}" alt="${item.title} asset artwork" loading="lazy">
                    </div>
                    <div class="movie-info">
                        <strong>${item.title}</strong>
                        <div class="metadata-row">
                            <span>Year: ${item.year}</span>
                            <span class="type-pill">${item.type.toUpperCase()}</span>
                        </div>
                    </div>`;

                card.onclick = () => {
                    if (window.StreamVersePlayer) {
                        window.StreamVersePlayer.routeToPlayer(item.tmdbId, item.title, item.type, item.year, item.category);
                    }
                };

                // Accessibility event listeners
                card.onkeydown = (ev) => {
                    if (ev.key === 'Enter' || ev.keyCode === 13) {
                        card.click();
                    }
                };

                frameFragment.appendChild(card);
            });

            container.appendChild(frameFragment);
        }

        filterSection(category) {
            this.activeCategory = category;
            const categoryTitle = document.getElementById('current-category-title');

            document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
            const cleanButtonId = `btn-${category.toLowerCase().replace(" ", "-")}`;
            const targetButton = document.getElementById(cleanButtonId);
            if (targetButton) targetButton.classList.add('active');

            if (categoryTitle) {
                categoryTitle.innerText = category === 'all' ? "All Movies & Premium Web Series" : `${category} Library Collection`;
            }

            if (!window.StreamVerseDatabase) return;

            const results = category === 'all'
                ? window.StreamVerseDatabase.getAll()
                : window.StreamVerseDatabase.getAll().filter(item => item.category.toLowerCase() === category.toLowerCase());

            this.renderGridToTarget(results, 'movie-grid-container');
        }

        debounceSearchQuery(event) {
            clearTimeout(this.debounceTimer);
            const value = String(event.target.value).trim().toLowerCase();

            this.debounceTimer = setTimeout(() => {
                this.executeSearch(value);
            }, 300);
        }

        executeSearch(query) {
            if (!window.StreamVerseDatabase) return;

            const baseCollection = window.StreamVerseDatabase.getAll();
            if (!query) {
                this.filterSection(this.activeCategory);
                return;
            }

            const matches = baseCollection.filter(item =>
                item.title.toLowerCase().includes(query) ||
                item.category.toLowerCase().includes(query)
            );

            const categoryTitle = document.getElementById('current-category-title');
            if (categoryTitle) {
                categoryTitle.innerText = `Search Output Matches for: "${query}"`;
            }

            this.renderGridToTarget(matches, 'movie-grid-container');
        }
    }

    Object.freeze(ApplicationCore);
    Object.freeze(ApplicationCore.prototype);

    document.addEventListener("DOMContentLoaded", () => {
        window.StreamVerseApp = new ApplicationCore();
        window.StreamVerseApp.initializeSystem();
    });

})(window);
