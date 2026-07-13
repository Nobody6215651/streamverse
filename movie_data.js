/**
 * StreamVerse Premium Database Registry and Schema Enforcer
 * Path: /js/movie_data.js
 */
(function (window) {
    'use strict';

    const SCHEMA_FIELDS = ['id', 'title', 'category', 'quality', 'year', 'poster', 'tmdbId', 'type'];
    const CATEGORY_REGISTRY = ['Hollywood', 'Bollywood', 'Punjabi', 'South', 'Web Series'];
    const VALUE_TYPES = ['movie', 'tv'];

    class DataIntegrityGuard {
        static enforce(item) {
            if (!item || typeof item !== 'object') return null;

            for (const key of SCHEMA_FIELDS) {
                if (!(key in item) || item[key] === undefined || item[key] === null) {
                    console.error(`[Integrity Violation] Missing critical parameter: ${key} for entry:`, item);
                    return null;
                }
            }

            const verifiedItem = {
                id: Number(item.id),
                title: String(item.title).trim(),
                category: String(item.category).trim(),
                quality: String(item.quality).trim(),
                year: String(item.year).trim(),
                poster: String(item.poster).trim(),
                tmdbId: String(item.tmdbId).trim(),
                type: String(item.type).toLowerCase()
            };

            if (!VALUE_TYPES.includes(verifiedItem.type)) {
                verifiedItem.type = 'movie';
            }

            if (verifiedItem.type === 'tv') {
                verifiedItem.season = item.season ? String(item.season) : "1";
                verifiedItem.episode = item.episode ? String(item.episode) : "1";
            }

            return verifiedItem;
        }
    }

    const initialDatabaseBootstrap = [
        { id: 1, title: "Avatar: The Way of Water", category: "Hollywood", quality: "4K UHD", year: "2022", poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=400", tmdbId: "76600", type: "movie" },
        { id: 2, title: "Pathaan", category: "Bollywood", quality: "1080p FHD", year: "2023", poster: "https://images.unsplash.com/photo-1616530940355-351fabd9524b?q=80&w=400", tmdbId: "868759", type: "movie" },
        { id: 3, title: "Stranger Things", category: "Hollywood", quality: "HDR 10bit", year: "2016", poster: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=400", tmdbId: "66732", type: "tv", season: "1", episode: "1" },
        { id: 4, title: "The Dark Knight", category: "Hollywood", quality: "4K Dolby Vision", year: "2008", poster: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=400", tmdbId: "155", type: "movie" },
        { id: 5, title: "Jawan", category: "Bollywood", quality: "1080p HQ", year: "2023", poster: "https://images.unsplash.com/photo-1616530940355-351fabd9524b?q=80&w=400", tmdbId: "872585", type: "movie" },
        { id: 6, title: "Carry on Jatta 3", category: "Punjabi", quality: "1080p WebDL", year: "2023", poster: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=400", tmdbId: "1042586", type: "movie" },
        { id: 7, title: "K.G.F: Chapter 2", category: "South", quality: "4K UHD", year: "2022", poster: "https://images.unsplash.com/photo-1616530940355-351fabd9524b?q=80&w=400", tmdbId: "718032", type: "movie" },
        { id: 8, title: "Breaking Bad", category: "Web Series", quality: "4K UHD", year: "2008", poster: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=400", tmdbId: "1396", type: "tv", season: "1", episode: "1" }
    ];

    class StorageRegistry {
        constructor() {
            this._store = new Map();
            this.bootRegistry();
        }

        bootRegistry() {
            initialDatabaseBootstrap.forEach(item => {
                const parsed = DataIntegrityGuard.enforce(item);
                if (parsed) {
                    this._store.set(parsed.id, Object.freeze(parsed));
                }
            });
            console.log(`[Storage Registry] Verified ${this._store.size} records in safe state storage.`);
        }

        getAll() {
            return Array.from(this._store.values());
        }

        getById(id) {
            return this._store.get(Number(id)) || null;
        }

        getByCategory(category) {
            const cleanCat = String(category).toLowerCase();
            return this.getAll().filter(item => item.category.toLowerCase() === cleanCat);
        }

        registerItem(item) {
            const parsed = DataIntegrityGuard.enforce(item);
            if (!parsed) {
                console.error("[Storage Registry] Item rejected due to schema violation.");
                return false;
            }
            this._store.set(parsed.id, Object.freeze(parsed));
            return true;
        }
    }

    Object.freeze(StorageRegistry);
    Object.freeze(StorageRegistry.prototype);
    Object.freeze(DataIntegrityGuard);
    Object.freeze(DataIntegrityGuard.prototype);

    window.StreamVerseDatabase = new StorageRegistry();

})(window);
