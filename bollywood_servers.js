/**
 * StreamVerse Dedicated Bollywood & Desi Distribution Streams Array
 */
const bollywoodServersList = [
    {
        name: "Desi Master Node (VidSrc.cc)",
        generateUrl: (tmdbId, s, e, type) => {
            return type === 'movie'
                ? `https://vidsrc.cc/vidsrc/movie/${tmdbId}`
                : `https://vidsrc.cc/vidsrc/tv/${tmdbId}/${s}/${e}`;
        }
    },
    {
        name: "Premium Bollywood Server (VidSrc.xyz)",
        generateUrl: (tmdbId, s, e, type) => {
            return type === 'movie'
                ? `https://vidsrc.xyz/embed/movie/${tmdbId}`
                : `https://vidsrc.xyz/embed/tv/${tmdbId}/${s}/${e}`;
        }
    },
    {
        name: "Super-Fast Mirror (SuperEmbed)",
        generateUrl: (tmdbId, s, e, type) => {
            return type === 'movie'
                ? `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1`
                : `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1&s=${s}&e=${e}`;
        }
    }
];
