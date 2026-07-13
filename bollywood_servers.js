/**
 * StreamVerse Bollywood and Regional Asian CDN Distribution Matrix
 * Path: /js/bollywood_servers.js
 */
(function (window) {
    'use strict';

    class BollywoodCDNCluster {
        constructor() {
            this.clusterRegion = "SOUTH-ASIA-MUMBAI";
            this.routingNodes = [
                {
                    id: "b-node-1",
                    name: "Regional CDN Edge (VidSrc.cc)",
                    priority: 10,
                    generateUrl: (tmdbId, s, e, type) => {
                        const secureId = encodeURIComponent(tmdbId);
                        return type === 'movie'
                            ? `https://vidsrc.cc/vidsrc/movie/${secureId}`
                            : `https://vidsrc.cc/vidsrc/tv/${secureId}/${Number(s)}/${Number(e)}`;
                    }
                },
                {
                    id: "b-node-2",
                    name: "Secondary Regional Node (VidSrc.xyz)",
                    priority: 7,
                    generateUrl: (tmdbId, s, e, type) => {
                        const secureId = encodeURIComponent(tmdbId);
                        return type === 'movie'
                            ? `https://vidsrc.xyz/embed/movie/${secureId}`
                            : `https://vidsrc.xyz/embed/tv/${secureId}/${Number(s)}/${Number(e)}`;
                    }
                },
                {
                    id: "b-node-3",
                    name: "Fallback Mirror Node (SuperEmbed)",
                    priority: 4,
                    generateUrl: (tmdbId, s, e, type) => {
                        const secureId = encodeURIComponent(tmdbId);
                        return type === 'movie'
                            ? `https://multiembed.mov/?video_id=${secureId}&tmdb=1`
                            : `https://multiembed.mov/?video_id=${secureId}&tmdb=1&s=${Number(s)}&e=${Number(e)}`;
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

    Object.freeze(BollywoodCDNCluster);
    Object.freeze(BollywoodCDNCluster.prototype);
    window.BollywoodServers = new BollywoodCDNCluster();

})(window);
