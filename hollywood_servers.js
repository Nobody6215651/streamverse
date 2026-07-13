/**
 * StreamVerse Dedicated Hollywood Mirror Configuration Array
 */
const hollywoodServersList = [
    {
        name: "Master Server (VidSrc)",
        generateUrl: (tmdbId, s, e, type) => {
            return type === 'movie' 
                ? `https://vidsrc.me/embed/movie?tmdb=${tmdbId}` 
                : `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&sea=${s}&epi=${e}`;
        }
    },
    {
        name: "Mirror Server 2 (2Embed)",
        generateUrl: (tmdbId, s, e, type) => {
            return type === 'movie'
                ? `https://embed.2embed.to/embed/tmdb/movie?id=${tmdbId}`
                : `https://embed.2embed.to/embed/tmdb/tv?id=${tmdbId}&s=${s}&e=${e}`;
        }
    },
    {
        name: "Mirror Server 3 (AutoEmbed)",
        generateUrl: (tmdbId, s, e, type) => {
            return type === 'movie'
                ? `https://player.autoembed.cc/embed/movie/${tmdbId}`
                : `https://player.autoembed.cc/embed/tv/${tmdbId}/${s}/${e}`;
        }
    }
];
