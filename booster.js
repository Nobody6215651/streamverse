/**
 * StreamVerse External Floating Audio Amplifier Module
 * Runs independently to prevent player script failures.
 */

let globalAudioCtx = null;
let globalGainNode = null;

document.addEventListener("DOMContentLoaded", () => {
    // Generate Floating UI Elements Dynamically
    const container = document.createElement('div');
    container.className = 'volume-container-fab';
    container.innerHTML = `
        <div class="volume-badge" id="volPercent">100%</div>
        <div class="volume-slider-pop">
            <input type="range" id="volumeSliderInput" min="1" max="4" step="0.1" value="1">
        </div>
        <div class="volume-fab" id="volumeBoostBtn" title="Hover to Boost Volume">
            <i class="fas fa-volume-up"></i>
        </div>
    `;

    // Inject Necessary Scoped CSS
    const styles = document.createElement('style');
    styles.innerHTML = `
        .volume-container-fab { position: fixed; bottom: 100px; right: 25px; display: flex; flex-direction: column; align-items: center; gap: 8px; z-index: 9998; }
        .volume-fab { width: 60px; height: 60px; background: linear-gradient(135deg, #00ffcc, #00a8ff); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #000; font-size: 22px; cursor: pointer; box-shadow: 0 4px 20px rgba(0, 255, 204, 0.4); border: 2px solid rgba(255,255,255,0.3); transition: 0.3s; }
        .volume-fab:hover { transform: scale(1.1); }
        .volume-slider-pop { display: none; background: #141414; border: 1px solid #282828; padding: 12px 8px; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); transform: rotate(-90deg); position: absolute; bottom: 110px; width: 120px; height: 20px; align-items: center; justify-content: center; }
        .volume-container-fab:hover .volume-slider-pop { display: flex; }
        .volume-slider-pop input[type=range] { width: 100%; accent-color: #00ffcc; cursor: pointer; height: 4px; }
        .volume-badge { background: #00ffcc; color: #000; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 10px; position: absolute; bottom: 65px; display: none; }
        .volume-container-fab:hover .volume-badge { display: block; }
    `;
    
    document.head.appendChild(styles);
    document.body.appendChild(container);

    const slider = document.getElementById('volumeSliderInput');
    if (slider) {
        slider.addEventListener('input', (e) => {
            adjustExternalAudio(e.target.value);
        });
    }
});

// Listener to reset values when user goes back home
window.addEventListener('playerClosed', () => {
    const slider = document.getElementById('volumeSliderInput');
    const badge = document.getElementById('volPercent');
    if(slider) slider.value = 1;
    if(badge) badge.innerText = "100%";
    adjustExternalAudio(1);
});

function adjustExternalAudio(volumeMultiplier) {
    try {
        const iframe = document.getElementById('streamverse-player');
        const badge = document.getElementById('volPercent');
        const btn = document.getElementById('volumeBoostBtn');
        
        if (!iframe) return;

        let percentValue = Math.round(volumeMultiplier * 100);
        if (badge) badge.innerText = percentValue + "%";

        if (btn) {
            if (volumeMultiplier > 1) {
                btn.style.background = "linear-gradient(135deg, #ff0055, #ff5500)";
                btn.style.color = "white";
                btn.innerHTML = '<i class="fas fa-bolt"></i>';
            } else {
                btn.style.background = "linear-gradient(135deg, #00ffcc, #00a8ff)";
                btn.style.color = "#000";
                btn.innerHTML = '<i class="fas fa-volume-up"></i>';
            }
        }

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!globalAudioCtx) {
            globalAudioCtx = new AudioContext();
            const source = globalAudioCtx.createMediaElementSource(iframe);
            globalGainNode = globalAudioCtx.createGain();
            
            source.connect(globalGainNode);
            globalGainNode.connect(globalAudioCtx.destination);
        }

        globalGainNode.gain.value = parseFloat(volumeMultiplier);
    } catch (error) {
        // Device synchronization fallback block
    }
}
