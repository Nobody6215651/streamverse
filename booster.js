/**
 * StreamVerse Sensory Booster - Performance Optimized Audio Engine
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
                    this.analyser.fftSize = 128; // Lower complexity from 256 to 128 for lightweight CPU rendering

                    this.gainNode.connect(this.analyser);
                    this.analyser.connect(this.audioCtx.destination);
                    this.initialized = true;
                }
            } catch (err) {
                console.warn("[Sensory Engine] Safe fallback context operational.");
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
                // Isolated cross-origin bridge
            }

            if (this.initialized && this.gainNode) {
                if (this.audioCtx && this.audioCtx.state === 'suspended') {
                    this.audioCtx.resume();
                }
                this.gainNode.gain.setValueAtTime(value, this.audioCtx.currentTime);
            }

            // High performance transitions without heavy CSS layout paint reflows
            if (value > 1.0) {
                const visualContrastBoost = 1.0 + (value - 1.0) * 0.3;
                player.style.filter = `contrast(1.1) brightness(${visualContrastBoost})`;
                this.startRenderLoop();
            } else {
                player.style.filter = "none";
                this.stopRenderLoop();
            }
        }

        startRenderLoop() {
            this.stopRenderLoop();
            if (!this.canvasCtx || !this.canvas) return;

            const bufferLength = this.analyser ? this.analyser.frequencyBinCount : 64;
            const dataArray = new Uint8Array(bufferLength);

            const draw = () => {
                this.animId = requestAnimationFrame(draw);

                const w = this.canvas.width;
                const h = this.canvas.height;

                if (this.initialized && this.analyser) {
                    this.analyser.getByteFrequencyData(dataArray);
                } else {
                    for (let i = 0; i < bufferLength; i++) {
                        dataArray[i] = Math.sin(Date.now() * 0.004 + i) * 20 + 50;
                    }
                }

                this.canvasCtx.fillStyle = '#020202'; 
                this.canvasCtx.fillRect(0, 0, w, h);

                const barWidth = (w / bufferLength) * 2.0;
                let barHeight;
                let x = 0;

                for (let i = 0; i < bufferLength; i++) {
                    barHeight = (dataArray[i] / 255) * h * (this.currentBoosterValue * 0.8);

                    this.canvasCtx.fillStyle = `rgb(229, ${Math.min(255, i * 4)}, 20)`;
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
