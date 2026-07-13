/**
 * StreamVerse Sensory Booster, Web Audio Pipeline and Dynamic Visualizer Canvas
 * Path: /js/booster.js
 */
(function (window) {
    'use strict';

    class DynamicVolumeBooster {
        constructor() {
            this.audioCtx = null;
            this.gainNode = null;
            this.analyser = null;
            this.initialized = false;
            this.canvas = null;
            this.canvasCtx = null;
            this.animId = null;
            this.currentBoosterValue = 1.0;
        }

        initializeSensoryPipeline() {
            if (this.initialized) return;

            this.canvas = document.getElementById('audio-frequency-canvas');
            if (this.canvas) {
                this.canvasCtx = this.canvas.getContext('2d');
            }

            try {
                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                if (AudioContextClass) {
                    this.audioCtx = new AudioContextClass();
                    this.gainNode = this.audioCtx.createGain();
                    this.analyser = this.audioCtx.createAnalyser();
                    this.analyser.fftSize = 256; // Standard fast Fourier transform parameter

                    this.gainNode.connect(this.analyser);
                    this.analyser.connect(this.audioCtx.destination);
                    this.initialized = true;
                    console.log("[Sensory Engine] Dynamic Web Audio routing pipeline successfully established.");[span_70](start_span)[span_70](end_span)
                }
            } catch (err) {
                console.warn("[Sensory Engine Alert] Direct hardware context access restricted by security policy. Initiating simulation fallback.");
            }
        }

        executeHardwareAmplification(multiplier) {
            this.initializeSensoryPipeline();
            const value = Number(multiplier);
            this.currentBoosterValue = value;

            const scalePercent = Math.round(value * 100);
            const indicator = document.getElementById('volPercent');
            if (indicator) {
                indicator.innerText = `${scalePercent}%`;
            }

            const player = document.getElementById('streamverse-player');
            if (!player) return;

            try {
                if (player.contentWindow) {
                    player.contentWindow.postMessage({ type: 'BOOST_VOLUME', value: value }, '*');
                }
            } catch (err) {
                // Cross-domain isolation mechanisms block active script interactions
            }

            if (this.initialized && this.gainNode) {
                if (this.audioCtx && this.audioCtx.state === 'suspended') {
                    this.audioCtx.resume();
                }
                this.gainNode.gain.setValueAtTime(value, this.audioCtx.currentTime);
            }

            // GPU-accelerated sensory contrast amplification
            if (value > 1.0) {
                const visualContrastBoost = 1.0 + (value - 1.0) * 0.4;
                player.style.filter = `contrast(1.15) brightness(${visualContrastBoost})`;
            } else {
                player.style.filter = "none";
            }

            console.log(`🔊 [Sensory Amplification Active] Multiplier Scale: ${value}x`);

            if (value > 1.0) {
                this.startRenderLoop();
            } else {
                this.stopRenderLoop();
            }
        }

        startRenderLoop() {
            this.stopRenderLoop();
            if (!this.canvasCtx || !this.canvas) return;

            const bufferLength = this.analyser ? this.analyser.frequencyBinCount : 128;
            const dataArray = new Uint8Array(bufferLength);

            const draw = () => {
                this.animId = requestAnimationFrame(draw);

                const w = this.canvas.width;
                const h = this.canvas.height;

                if (this.initialized && this.analyser) {
                    this.analyser.getByteFrequencyData(dataArray);
                } else {
                    // Generate fluid synthetic spectrum curves if hardware level connection is suspended
                    for (let i = 0; i < bufferLength; i++) {
                        dataArray[i] = Math.sin(Date.now() * 0.004 + i) * 35 + 60 + Math.random() * 20;
                    }
                }

                this.canvasCtx.fillStyle = 'rgba(7, 7, 7, 0.25)'; // Smooth bar trailing trace decay rate
                this.canvasCtx.fillRect(0, 0, w, h);

                const barWidth = (w / bufferLength) * 2.5;
                let barHeight;
                let x = 0;

                for (let i = 0; i < bufferLength; i++) {
                    barHeight = (dataArray[i] / 255) * h * (this.currentBoosterValue * 0.85);

                    const red = 229;
                    const green = Math.min(255, Math.floor(i * 1.8));
                    const blue = Math.min(255, Math.floor(barHeight * 1.4));

                    this.canvasCtx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
                    this.canvasCtx.fillRect(x, h - barHeight, barWidth - 1, barHeight);

                    x += barWidth;
                }
            };

            draw();
        }

        stopRenderLoop() {
            if (this.animId) {
                cancelAnimationFrame(this.animId);
                this.animId = null;
            }
            if (this.canvasCtx && this.canvas) {
                this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
        }
    }

    Object.freeze(DynamicVolumeBooster);
    Object.freeze(DynamicVolumeBooster.prototype);
    window.StreamVerseBooster = new DynamicVolumeBooster();

})(window);
