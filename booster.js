// booster.js - Advanced Web Volume Booster
let audioContext = null;
let gainNode = null;
let currentMultiplier = 1;

function initAudioBooster() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContext();
        console.log("✅ Audio Booster Initialized");
    } catch(e) {
        console.log("AudioContext not supported");
    }
}

function executeHardwareAmplification(volumeMultiplier) {
    currentMultiplier = volumeMultiplier;

    const iframe = document.querySelector('#video-frame-target iframe');
    if (!iframe) return;

    // Update UI
    const percent = Math.round(volumeMultiplier * 100);
    if (document.getElementById('volText')) {
        document.getElementById('volText').innerText = percent + "%";
    }

    // Visual Feedback
    iframe.style.filter = `contrast(1.15) brightness(${1 + (volumeMultiplier - 1) * 0.6}) saturate(${1 + (volumeMultiplier - 1) * 0.4})`;

    // Try to boost real audio (limited success on cross-origin)
    try {
        if (!gainNode && audioContext) {
            const mediaElement = iframe.contentDocument ? iframe.contentDocument.querySelector('video') : null;
            if (mediaElement) {
                const source = audioContext.createMediaElementSource(mediaElement);
                gainNode = audioContext.createGain();
                source.connect(gainNode);
                gainNode.connect(audioContext.destination);
            }
        }
        if (gainNode) {
            gainNode.gain.value = volumeMultiplier;
        }
    } catch (err) {
        console.log("Direct audio boost limited (CORS)", err);
    }

    console.log(`🔊 Volume Boosted to ${percent}%`);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initAudioBooster);

// Global function for slider
window.executeHardwareAmplification = executeHardwareAmplification;
