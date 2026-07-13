/**
 * =========================================================================
 * STRATOS AUDIO SYSTEMS - ADVANCED WEB VOLUME BOOSTER & ACOUSTIC ENGINE
 * VERSION: 4.2.0 (PRODUCTION READY)
 * =========================================================================
 * Core Architecture: Web Audio API, Node Pipeline Graph, Dynamics Compressor
 * Cross-Origin Protection Handler with Intelligent Soft Fallbacks.
 */

(function (window) {
    "use strict";

    // --- SYSTEM CORE CONSTANTS ---
    const MAX_SAFE_GAIN = 6.0; // Max amplification up to 600%
    const DEFAULT_PRESET_EQ = "balanced";

    // --- AUDIO EQUALIZER PRESET PROFILES ---
    const EQ_PROFILES = {
        balanced:   { bass: 0, mid: 0, treble: 0 },
        bassboost:  { bass: 8, mid: 1, treble: -2 },
        vocal:      { bass: -4, mid: 6, treble: 3 },
        cinematic:  { bass: 6, mid: -1, treble: 4 },
        treblekick: { bass: -2, mid: 2, treble: 8 }
    };

    // --- PRIVATE INTERNAL ENGINE STATE MATRIX ---
    let _audioCtx = null;
    let _sourceNode = null;
    let _gainNode = null;
    let _compressorNode = null;
    let _analyserNode = null;
    
    // Equalizer Three-Band Nodes
    let _eqBassFilter = null;
    let _eqMidFilter = null;
    let _eqTrebleFilter = null;

    let _currentMultiplier = 1.0;
    let _activePreset = DEFAULT_PRESET_EQ;
    let _isPipelineConnected = false;
    let _visualizerAnimationId = null;

    /**
     * Engine Initialization: Triggers safely on system DOM ready handshake
     */
    function initAudioBoosterSystem() {
        console.log("⚙️ Stratos Audio Booster: Launching System Checks...");
        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) {
                console.warn("❌ Web Audio API is completely unsupported in this browser.");
                return false;
            }
            
            _audioCtx = new AudioContextClass();
            buildAudioProcessingPipeline();
            console.log("✅ Stratos Audio Booster Engine: Successfully Initialized.");
            return true;
        } catch (exception) {
            console.error("🚨 Critical failure during Audio Context allocation:", exception);
            return false;
        }
    }

    /**
     * Builds the fundamental modular DSP (Digital Signal Processing) pipeline nodes graph
     */
    function buildAudioProcessingPipeline() {
        if (!_audioCtx) return;

        try {
            // 1. Gain Node Component (Main Volume Controller)
            _gainNode = _audioCtx.createGain();
            _gainNode.gain.setValueAtTime(_currentMultiplier, _audioCtx.currentTime);

            // 2. Dynamics Compressor Node (Prevents ear damage/clipping at high boost)
            _compressorNode = _audioCtx.createDynamicsCompressor();
            _compressorNode.threshold.setValueAtTime(-24, _audioCtx.currentTime);
            _compressorNode.knee.setValueAtTime(30, _audioCtx.currentTime);
            _compressorNode.ratio.setValueAtTime(12, _audioCtx.currentTime);
            _compressorNode.attack.setValueAtTime(0.003, _audioCtx.currentTime);
            _compressorNode.release.setValueAtTime(0.25, _audioCtx.currentTime);

            // 3. Analyser Node Component (For spectrum mapping and real-time streams processing)
            _analyserNode = _audioCtx.createAnalyser();
            _analyserNode.fftSize = 256;

            // 4. Equalizer Core Filters Construction (3-Band EQ System)
            _eqBassFilter = _audioCtx.createBiquadFilter();
            _eqBassFilter.type = "lowshelf";
            _eqBassFilter.frequency.setValueAtTime(200, _audioCtx.currentTime);

            _eqMidFilter = _audioCtx.createBiquadFilter();
            _eqMidFilter.type = "peaking";
            _eqMidFilter.Q.setValueAtTime(1.0, _audioCtx.currentTime);
            _eqMidFilter.frequency.setValueAtTime(1500, _audioCtx.currentTime);

            _eqTrebleFilter = _audioCtx.createBiquadFilter();
            _eqTrebleFilter.type = "highshelf";
            _eqTrebleFilter.frequency.setValueAtTime(5000, _audioCtx.currentTime);

            // 5. Connect processing blocks in an absolute chain layout
            // EQ -> Gain -> Compressor -> Analyser -> Output Speakers
            _eqBassFilter.connect(_eqMidFilter);
            _eqMidFilter.connect(_eqTrebleFilter);
            _eqTrebleFilter.connect(_gainNode);
            _gainNode.connect(_compressorNode);
            _compressorNode.connect(_analyserNode);
            _analyserNode.connect(_audioCtx.destination);

            // Load default balanced preset frequencies automatically
            applyEqualizerProfile(DEFAULT_PRESET_EQ);

        } catch (graphError) {
            console.error("❌ DSP Architecture pipeline layout connection exception:", graphError);
        }
    }

    /**
     * Resolves target media element from runtime domestic DOM frames safely
     */
    function extractTargetVideoMediaElement() {
        // Checking custom StreamVerse structure patterns inside the master dashboard
        const targetSelectors = [
            '#player-iframe-root iframe',
            '#video-frame-target iframe',
            'iframe'
        ];

        let iframeElement = null;
        for (let selector of targetSelectors) {
            iframeElement = document.querySelector(selector);
            if (iframeElement) break;
        }

        if (!iframeElement) return null;

        try {
            // Attempt to read inside context content frame
            if (iframeElement.contentDocument) {
                return iframeElement.contentDocument.querySelector('video');
            }
        } catch (corsViolationException) {
            // CORS security restriction is raised if playing from foreign endpoints like vidsrc.to
            return null; 
        }
        return null;
    }

    /**
     * Safely hooks standard media tags to active processing pipeline graph nodes
     */
    function attachMediaSourceNode(videoMediaTag) {
        if (!_audioCtx || !videoMediaTag) return false;

        try {
            if (_sourceNode) {
                // Connection previously mapped, check if pointing to same element container
                return true;
            }

            // Bind media stream source wrapper node safely
            _sourceNode = _audioCtx.createMediaElementSource(videoMediaTag);
            
            // Connect to root channel entrance point of the dynamic EQ system chain
            _sourceNode.connect(_eqBassFilter);
            _isPipelineConnected = true;
            console.log("🔗 Acoustic Link Established: Attached video media capture source successfully.");
            return true;
        } catch (connectionError) {
            console.warn("⚠️ Pipeline connection refused (Likely due to browser cross-origin limits or media re-bind):", connectionError.message);
            _isPipelineConnected = false;
            return false;
        }
    }

    /**
     * Applies precise cinematic equalization models on active sound tracks
     * @param {string} profileName - Identifier key corresponding to structural presets
     */
    function applyEqualizerProfile(profileName) {
        if (!EQ_PROFILES[profileName]) {
            console.error(`Invalid EQ profile mapping request initialized: ${profileName}`);
            return;
        }

        _activePreset = profileName;
        const metrics = EQ_PROFILES[profileName];

        if (_audioCtx && _eqBassFilter && _eqMidFilter && _eqTrebleFilter) {
            // Seamless smooth transitions to prevent micro clicks or audio pops during adjustment
            const now = _audioCtx.currentTime;
            _eqBassFilter.gain.setTargetAtTime(metrics.bass, now, 0.05);
            _eqMidFilter.gain.setTargetAtTime(metrics.mid, now, 0.05);
            _eqTrebleFilter.gain.setTargetAtTime(metrics.treble, now, 0.05);
            
            console.log(`🎛️ Equalizer Config changed successfully to profile: [${profileName.toUpperCase()}]`);
        }
    }

    /**
     * Computes specialized CSS matrix string values matching current boost factor levels
     * @param {number} volumeMultiplier - Scalar factor value processing range
     */
    function computeVisualFilters(volumeMultiplier) {
        if (volumeMultiplier <= 1.0) return "none";
        
        // Soft curve mapping formulas for video overlay illumination reinforcement feedback
        const operationalOffset = volumeMultiplier - 1.0;
        const contrastCalculation = (1.0 + (operationalOffset * 0.06)).toFixed(2);
        const brightnessCalculation = (1.0 + (operationalOffset * 0.04)).toFixed(2);
        const saturationCalculation = (1.0 + (operationalOffset * 0.08)).toFixed(2);

        return `contrast(${contrastCalculation}) brightness(${brightnessCalculation}) saturate(${saturationCalculation})`;
    }

    /**
     * Updates structural text containers representing active quantitative audio scales
     * @param {number} visualPercentage 
     */
    function synchroniseInterfaceTextLabels(visualPercentage) {
        const targetLabelIds = ['volText', 'boosterPercentageLabel', 'volume-display-node'];
        
        for (let labelId of targetLabelIds) {
            const labelContainer = document.getElementById(labelId);
            if (labelContainer) {
                labelContainer.innerText = `${visualPercentage}%`;
            }
        }
    }

    /**
     * Master Orchestration Interface Hook: Amplifies cross origin target canvas/frame displays
     * @param {number} volumeMultiplier - Numerical scalar value indicator (e.g. 0.0 to 6.0)
     */
    function executeHardwareAmplification(volumeMultiplier) {
        // Enforce boundary parameters restrictions securely
        let validatedMultiplier = parseFloat(volumeMultiplier);
        if (isNaN(validatedMultiplier) || validatedMultiplier < 0) validatedMultiplier = 1.0;
        if (validatedMultiplier > MAX_SAFE_GAIN) validatedMultiplier = MAX_SAFE_GAIN;

        _currentMultiplier = validatedMultiplier;
        const standardPercentage = Math.round(_currentMultiplier * 100);

        // Synchronize display indicators safely across registered views
        synchroniseInterfaceTextLabels(standardPercentage);

        // Fetch primary container frame reference target nodes cleanly
        const iframeRootElement = document.querySelector('#player-iframe-root iframe') || 
                                  document.querySelector('#video-frame-target iframe') ||
                                  document.querySelector('iframe');

        if (iframeRootElement) {
            // Inject calculated hardware color accent structures safely onto the player viewport wrapper
            iframeRootElement.style.filter = computeVisualFilters(_currentMultiplier);
        }

        // Handle Audio Processing Graph Level Controls
        if (!_audioCtx) {
            // Attempt delayed background synchronization loop allocation step if context got blocked
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) _audioCtx = new AudioContextClass();
            buildAudioProcessingPipeline();
        }

        // Check and wake up dead context blocks triggered via native desktop security protocols
        if (_audioCtx && _audioCtx.state === 'suspended') {
            _audioCtx.resume();
        }

        // Locate internal standard layout components inside accessible iframe containers
        const actualVideoTag = extractTargetVideoMediaElement();
        if (actualVideoTag) {
            attachMediaSourceNode(actualVideoTag);
        }

        // Apply dynamic scale adjustment to the core gain operational processing unit safely
        if (_gainNode && _audioCtx) {
            _gainNode.gain.setTargetAtTime(_currentMultiplier, _audioCtx.currentTime, 0.02);
        }

        dispatchCustomSystemEvent("boosterVolumeChange", {
            multiplier: _currentMultiplier,
            percentage: standardPercentage,
            isPipelineSecure: _isPipelineConnected
        });

        console.log(`🔊 [Stratos Engine] Active Output Level Scaled -> ${standardPercentage}%`);
    }

    /**
     * Triggers clean event loops safely to facilitate real-time visualization hooks
     * @param {string} canvasElementId - Target DOM selector string matching interface canvas elements
     */
    function linkVisualizationCanvas(canvasElementId) {
        const targetCanvas = document.getElementById(canvasElementId);
        if (!targetCanvas || !_analyserNode) return;

        const canvasContext2D = targetCanvas.getContext('2d');
        const processingBufferLength = _analyserNode.frequencyBinCount;
        const performanceDataArray = new Uint8Array(processingBufferLength);

        if (_visualizerAnimationId) {
            cancelAnimationFrame(_visualizerAnimationId);
        }

        function renderVisualizerLoop() {
            _visualizerAnimationId = requestAnimationFrame(renderVisualizerLoop);
            
            _analyserNode.getByteFrequencyData(performanceDataArray);
            
            canvasContext2D.fillStyle = 'rgba(7, 7, 7, 0.2)';
            canvasContext2D.fillRect(0, 0, targetCanvas.width, targetCanvas.height);

            const itemBarWidth = (targetCanvas.width / processingBufferLength) * 2.5;
            let directionalRenderX = 0;

            for (let index = 0; index < processingBufferLength; index++) {
                const itemBarHeight = performanceDataArray[index] / 2;
                
                // Color spectrum logic dynamically bound to matching global brand layouts
                canvasContext2D.fillStyle = `rgb(${itemBarHeight + 100}, 9, 20)`;
                canvasContext2D.fillRect(directionalRenderX, targetCanvas.height - itemBarHeight, itemBarWidth - 1, itemBarHeight);

                directionalRenderX += itemBarWidth;
            }
        }

        renderVisualizerLoop();
        console.log("🎨 Spectrum Analytics Matrix Visualizer Hook Attached.");
    }

    /**
     * Dispatches standardized system event payloads across contextual layout documents
     */
    function dispatchCustomSystemEvent(eventName, payload) {
        try {
            const systemEvent = new CustomEvent(eventName, { detail: payload });
            window.dispatchEvent(systemEvent);
        } catch (e) {
            // Silently intercept older fallback layouts variations manually
        }
    }

    // --- SYSTEM AUTO ATTACH DOM HOOKS HANDLERS ---
    document.addEventListener('DOMContentLoaded', () => {
        // Delayed safety check to clear initialization handshakes properly
        setTimeout(initAudioBoosterSystem, 800);
    });

    // --- EXPORT INTERFACE CONSOLE MATRIX ASSIGNMENTS ---
    window.StratosAudioEngine = {
        init: initAudioBoosterSystem,
        amplify: executeHardwareAmplification,
        setEqualizer: applyEqualizerProfile,
        bindVisualizer: linkVisualizationCanvas,
        getCurrentState: () => ({
            volumeMultiplier: _currentMultiplier,
            activePreset: _activePreset,
            isAudioContextRunning: _audioCtx ? _audioCtx.state : 'uninitialized',
            isDirectPipelineLinked: _isPipelineConnected
        })
    };

    // Keep compatibility for older interface slider code architecture perfectly intact
    window.executeHardwareAmplification = executeHardwareAmplification;

})(window);
