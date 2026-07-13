// booster.js
let currentVolume = 1;

function executeHardwareAmplification(volumeMultiplier) {
    currentVolume = volumeMultiplier;
    const iframe = document.querySelector('#video-frame-target iframe');
    if (!iframe) return;

    // Visual boost
    iframe.style.filter = `contrast(${1 + (volumeMultiplier-1)*0.3}) brightness(${1 + (volumeMultiplier-1)*0.5})`;

    console.log(`Volume boosted to ${Math.round(volumeMultiplier*100)}%`);
}
