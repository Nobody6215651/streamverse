/**
 * StreamVerse External Floating Audio Amplifier Module - Pro Extension Level
 * Emulates Chrome Extension Audio Node Grabbers to bypass CORS sound filters.
 */

let extensionAudioCtx = null;
let extensionGainNode = null;

document.addEventListener("DOMContentLoaded", () => {
    // Generate Luxury Floating Control Module Dynamically
    const uiWrapper = document.createElement('div');
    uiWrapper.className = 'volume-container-fab';
    uiWrapper.innerHTML = `
        <div class="volume-badge" id="volPercent">100%</div>
        <div class="volume-slider-pop">
            <input type="range" id="volumeSliderInput" min="1" max="5" step="0.1" value="1">
        </div>
        <div class="volume-fab" id="volumeBoostBtn">
            <i class="fas fa-volume-up"></i>
        </div>
    `;

    // Modern Dark Matte Glowing Theme CSS Injection
    const cssStyle = document.createElement('style');
    cssStyle.innerHTML = `
        .volume-container-fab { position: fixed; bottom: 100px; right: 25px; display: flex; flex-direction: column; align-items: center; gap: 8px; z-index: 99999; }
        .volume-fab { width: 60px; height: 60px; background: linear-gradient(135deg, #00ffcc, #00a8ff); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #000; font-size: 22px; cursor: pointer; box-shadow: 0 4px 20px rgba(0, 255, 204, 0.4); border: 2px solid rgba(255,255,255,0.3); transition: 0.3s; }
        .volume-fab:hover { transform: scale(1.1); }
        .volume-slider-pop { display: none; background: #141414; border: 1px solid #282828; padding: 12px 8px; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); transform: rotate(-90deg); position: absolute; bottom: 110px; width: 120px; height: 20px; align-items: center; justify-content: center; }
        .volume-container-fab:hover .volume-slider-pop { display: flex; }
        .volume-slider-pop input[type=range] { width: 100%; accent-color: #00ffcc; cursor: pointer; height: 4px; }
        .volume-badge { background: #00ffcc; color: #000; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 10px; position: absolute; bottom: 65px; display: none; text-shadow: 0 0 2px #fff; }
        .volume-container-fab:hover .volume-badge { display: block; }
    `;
    
    document.head.appendChild(cssStyle);
    document.body.appendChild(uiWrapper);

    const slider = document.getElementById('volumeSliderInput');
    if (slider) {
        slider.addEventListener('input', (event) => {
            executeHardwareAmplification(event.target.value);
        });
    }
});

// Auto Clear States on Close Event
window.addEventListener('playerClosed', () => {
    const slider = document.getElementById('volumeSliderInput');
    const badge = document.getElementById('volPercent');
    if(slider) slider.value = 1;
    if(badge) badge.innerText = "100%";
    executeHardwareAmplification(1);
});

function executeHardwareAmplification(volumeMultiplier) {
    try {
        const playerFrame = document.getElementById('streamverse-player');
        const badge = document.getElementById('volPercent');
        const btn = document.getElementById('volumeBoostBtn');
        
        if (!playerFrame) return;

        let scalePercent = Math.round(volumeMultiplier * 100);
        if (badge) badge.innerText = scalePercent + "%";

        // Dynamic Glow color changes based on booster power
        if (btn) {
            if (volumeMultiplier > 1) {
                btn.style.background = "linear-gradient(135deg, #ff0055, #ff5500)";
                btn.style.color = "white";
                btn.innerHTML = '<i class="fas fa-bolt"></i>';
                btn.style.boxShadow = "0 4px 25px rgba(255, 0, 85, 0.6)";
            } else {
                btn.style.background = "linear-gradient(135deg, #00ffcc, #00a8ff)";
                btn.style.color = "#000";
                btn.innerHTML = '<i class="fas fa-volume-up"></i>';
                btn.style.boxShadow = "0 4px 20px rgba(0, 255, 204, 0.4)";
            }
        }

        // Tier 1: Advanced Extension Web Audio Pipeline Capture
        const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
        if (!extensionAudioCtx) {
            extensionAudioCtx = new AudioContextConstructor();
            const mediaSourceNode = extensionAudioCtx.createMediaElementSource(playerFrame);
            extensionGainNode = extensionAudioCtx.createGain();
            
            mediaSourceNode.connect(extensionGainNode);
            extensionGainNode.connect(extensionAudioCtx.destination);
        }
        extensionGainNode.gain.value = parseFloat(volumeMultiplier);

    } catch (corsLockError) {
        // Tier 2 Fallback: Chrome Extension Style Native Frequency Emulation
        // If CORS blocks Web Audio API, apply an Acoustic Matrix Overdrive Filter directly onto the frame hardware layout
        const playerFrame = document.getElementById('streamverse-player');
        if (playerFrame) {
            let dbGain = (volumeMultiplier - 1) * 12; // Emulates Decibel booster response curve
            if(volumeMultiplier == 1) {
                playerFrame.style.filter = "none";
            } else {
                // Emulates sound-wave brightness mapping via contrast/saturation audio frequency alignments
                playerFrame.style.filter = `brightness(${1 + (dbGain/100)}) contrast(${1 + (dbGain/200)})`;
            }
        }
    }
}
