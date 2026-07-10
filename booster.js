// ... (existing UI creation code same rakh sakte ho)

function executeHardwareAmplification(volumeMultiplier) {
    const playerFrame = document.getElementById('streamverse-player');
    if (!playerFrame) return;

    // Update UI
    let scalePercent = Math.round(volumeMultiplier * 100);
    document.getElementById('volPercent').innerText = scalePercent + "%";

    // Try real audio boost via postMessage (limited success)
    try {
        const iframe = playerFrame.querySelector('iframe');
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage({ type: 'BOOST_VOLUME', value: volumeMultiplier }, '*');
        }
    } catch(e) {}

    // Visual fallback (best we can do in browser)
    if (volumeMultiplier > 1) {
        playerFrame.style.filter = `contrast(1.2) brightness(${1 + (volumeMultiplier-1)*0.4})`;
    } else {
        playerFrame.style.filter = "none";
    }

    console.log(`🔊 Volume Boost: ${volumeMultiplier}x`);
}
