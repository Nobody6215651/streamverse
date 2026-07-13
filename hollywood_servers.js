/**
 * StreamVerse Hollywood CDN Distribution Matrix
 * Path: /js/hollywood_servers.js
 */
(function (window) {
    'use strict';

    class HollywoodCDNCluster {
        constructor() {
            this.clusterRegion = "GLOBAL-WEST";
            this.routingNodes = [
                {
                    id: "h-node-1",
                    name: "Primary CDN (VidSrc.me)",
                    priority: 10,
                    generateUrl: (tmdbId, s, e, type) => {
                        const secureId = encodeURIComponent(tmdbId);
                        return type === 'movie'
                            ? `https://vidsrc.me/embed/movie?tmdb=${secureId}`
                            : `https://vidsrc.me/embed/tv?tmdb=${secureId}&sea=${Number(s)}&epi=${Number(e)}`;
                    }
                },
                {
                    id: "h-node-2",
                    name: "Fallback CDN (2Embed)",
                    priority: 8,
                    generateUrl: (tmdbId, s, e, type) => {
                        const secureId = encodeURIComponent(tmdbId);
                        return type === 'movie'
                            ? `https://embed.2embed.to/embed/tmdb/movie?id=${secureId}`
                            : `https://embed.2embed.to/embed/tmdb/tv?id=${secureId}&s=${Number(s)}&e=${Number(e)}`;
                    }
                },
                {
                    id: "h-node-3",
                    name: "Alternative CDN (AutoEmbed)",
                    priority: 5,
                    generateUrl: (tmdbId, s, e, type) => {
                        const secureId = encodeURIComponent(tmdbId);
                        return type === 'movie'
                            ? `https://player.autoembed.cc/embed/movie/${secureId}`
                            : `https://player.autoembed.cc/embed/tv/${secureId}/${Number(s)}/${Number(e)}`;
                    }
                }
            ];
            Object.freeze(this.routingNodes);
        }

        getNodes() {
            return this.routingNodes;
        }

        getHighestPriorityNode() {
            return this.routingNodes[0];
        }
    }

    Object.freeze(HollywoodCDNCluster);
    Object.freeze(HollywoodCDNCluster.prototype);
    window.HollywoodServers = new HollywoodCDNCluster();

})(window);
