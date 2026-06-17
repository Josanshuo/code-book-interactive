/**
 * Web Audio helper for Morse code and Telegraph simulators.
 * Extracted from ChapterLabsPart1.jsx module-level audio management.
 *
 * Note: Uses module-level state intentionally — a single AudioContext
 * is shared across the app as recommended by Web Audio API best practices.
 */

let audioCtx = null;
let activeOsc = null;
let activeGain = null;

/**
 * Play a short tone at the given frequency for the given duration.
 * @param {number} freq - Frequency in Hz.
 * @param {number} durationMs - Duration in milliseconds.
 */
export const playTone = (freq, durationMs) => {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + durationMs / 1000);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + durationMs / 1000);
  } catch (e) {
    console.error("Audio Context failed", e);
  }
};

/**
 * Start a continuous tone (for press-and-hold interactions).
 * @param {number} freq - Frequency in Hz.
 */
export const startTone = (freq) => {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    if (activeOsc) return;
    activeOsc = audioCtx.createOscillator();
    activeGain = audioCtx.createGain();
    activeOsc.type = 'sine';
    activeOsc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    activeGain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    activeOsc.connect(activeGain);
    activeGain.connect(audioCtx.destination);
    activeOsc.start();
  } catch (e) {
    console.error(e);
  }
};

/**
 * Stop the currently playing continuous tone.
 */
export const stopTone = () => {
  try {
    if (activeOsc) {
      activeGain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      activeGain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.05);
      const tempOsc = activeOsc;
      setTimeout(() => tempOsc.stop(), 50);
      activeOsc = null;
      activeGain = null;
    }
  } catch (e) {
    console.error(e);
  }
};
