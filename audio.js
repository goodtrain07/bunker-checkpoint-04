// 使用 Web Audio API 即時合成末日檢查哨的環境音與操作音效（無需外部音檔）
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.ambientStarted = false;
    this.ambientGain = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (!this.ambientStarted) {
      this.startAmbient();
      this.ambientStarted = true;
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setTargetAtTime(this.muted ? 0 : 0.04, this.ctx.currentTime, 0.1);
    }
    return this.muted;
  }

  startAmbient() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    this.ambientGain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.value = 54;
    osc2.type = 'sine';
    osc2.frequency.value = 108;

    filter.type = 'lowpass';
    filter.frequency.value = 130;

    this.ambientGain.gain.value = this.muted ? 0 : 0.04;

    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(this.ambientGain);
    this.ambientGain.connect(this.ctx.destination);

    osc.start();
    osc2.start();
  }

  playTone(freq, duration, type = 'sine', vol = 0.12, slideTo = null) {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (slideTo) {
      osc.frequency.exponentialRampToValueAtTime(slideTo, now + duration);
    }

    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  playThermo(isAnomaly) {
    this.playTone(1200, 0.08, 'square', 0.07);
    setTimeout(() => {
      if (isAnomaly) {
        this.playTone(440, 0.18, 'sawtooth', 0.14, 220);
      } else {
        this.playTone(1560, 0.12, 'sine', 0.1);
      }
    }, 120);
  }

  playCamera() {
    if (this.muted || !this.ctx) return;
    // 快門白噪音
    const bufferSize = this.ctx.sampleRate * 0.12;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const gain = this.ctx.createGain();
    gain.gain.value = 0.22;
    noise.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start();

    // 閃光燈電容充電聲
    this.playTone(800, 0.5, 'sine', 0.05, 2200);
  }

  playXray(isAnomaly) {
    this.playTone(160, 0.85, 'sawtooth', 0.07, 420);
    if (isAnomaly) {
      setTimeout(() => this.playTone(110, 0.45, 'sawtooth', 0.14, 70), 550);
    }
  }

  playRedButton() {
    // 厚重玻璃罩砸下與電漿消滅聲
    this.playTone(130, 0.34, 'triangle', 0.32, 38);
    setTimeout(() => this.playTone(85, 0.5, 'sawtooth', 0.18, 36), 160);
  }

  playLatchClick() {
    // 金屬安全蓋彈開卡榫聲
    this.playTone(920, 0.04, 'square', 0.08, 1480);
  }

  playTypeTick() {
    // 對講機打字機微弱滴答聲
    this.playTone(680, 0.018, 'square', 0.025);
  }

  playGeiger() {
    // X 光蓋格計數器隨機劈啪聲
    if (this.muted || !this.ctx) return;
    [60, 150, 230, 340, 460, 580].forEach((ms) => {
      setTimeout(() => this.playTone(1800 + Math.random() * 900, 0.015, 'square', 0.045), ms);
    });
  }

  playGreenButton() {
    // 氣閘門開啟提示音
    this.playTone(523.25, 0.14, 'sine', 0.12);
    setTimeout(() => this.playTone(659.25, 0.22, 'sine', 0.12), 110);
  }

  playCoffee() {
    this.playTone(660, 0.12, 'sine', 0.1);
    setTimeout(() => this.playTone(880, 0.18, 'sine', 0.12), 100);
  }

  playPhoneDial() {
    if (this.muted || !this.ctx) return;
    [697, 770, 852].forEach((f, idx) => {
      setTimeout(() => this.playTone(f, 0.06, 'sine', 0.08), idx * 75);
    });
    setTimeout(() => this.playTone(440, 0.22, 'sine', 0.06), 280);
  }

  playStreakBonus() {
    [587.33, 783.99, 1046.5].forEach((f, idx) => {
      setTimeout(() => this.playTone(f, 0.16, 'triangle', 0.1), idx * 80);
    });
  }

  playPowerFlicker() {
    this.playTone(60, 0.25, 'sawtooth', 0.09, 45);
  }

  playHorrorSting() {
    this.playTone(62, 0.85, 'sawtooth', 0.2, 42);
    this.playTone(138.59, 0.75, 'sawtooth', 0.15, 65);
    this.playTone(146.83, 0.75, 'sawtooth', 0.13, 62);
  }

  playVictory() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, idx) => {
      setTimeout(() => this.playTone(f, 0.35, 'sine', 0.12), idx * 140);
    });
  }

  playDefeat() {
    [220, 196, 164.81, 110].forEach((f, idx) => {
      setTimeout(() => this.playTone(f, 0.45, 'sawtooth', 0.15), idx * 190);
    });
  }

  // 基地淪陷結局專屬：約 5 秒的防爆窗碎裂＋野獸嘶吼＋怪物尖嘯＋緊急警報音
  playBreachHorror() {
    if (this.muted || !this.ctx) return;
    const now = this.ctx.currentTime;

    // 1. 防爆玻璃碎裂白噪音（0.0s ~ 0.45s）
    const glassLen = Math.floor(this.ctx.sampleRate * 0.45);
    const glassBuf = this.ctx.createBuffer(1, glassLen, this.ctx.sampleRate);
    const gData = glassBuf.getChannelData(0);
    for (let i = 0; i < glassLen; i++) {
      gData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (glassLen * 0.25));
    }
    const glassSrc = this.ctx.createBufferSource();
    glassSrc.buffer = glassBuf;
    const glassFilter = this.ctx.createBiquadFilter();
    glassFilter.type = 'highpass';
    glassFilter.frequency.value = 1800;
    const glassGain = this.ctx.createGain();
    glassGain.gain.setValueAtTime(0.32, now);
    glassSrc.connect(glassFilter);
    glassFilter.connect(glassGain);
    glassGain.connect(this.ctx.destination);
    glassSrc.start(now);

    // 2. 深沉野獸／怪獸喉音低吼（0.2s ~ 5.0s）
    const growl1 = this.ctx.createOscillator();
    const growl2 = this.ctx.createOscillator();
    const growlLfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    const growlFilter = this.ctx.createBiquadFilter();
    const growlGain = this.ctx.createGain();

    growl1.type = 'sawtooth';
    growl2.type = 'sawtooth';
    growl1.frequency.setValueAtTime(68, now + 0.15);
    growl1.frequency.linearRampToValueAtTime(42, now + 2.4);
    growl1.frequency.linearRampToValueAtTime(56, now + 3.4);
    growl1.frequency.linearRampToValueAtTime(34, now + 5.0);

    growl2.frequency.setValueAtTime(72, now + 0.15);
    growl2.frequency.linearRampToValueAtTime(44, now + 2.4);
    growl2.frequency.linearRampToValueAtTime(59, now + 3.4);
    growl2.frequency.linearRampToValueAtTime(36, now + 5.0);

    // 喉音顫動 LFO（模擬野獸咆哮顆粒感）
    growlLfo.type = 'sine';
    growlLfo.frequency.value = 16;
    lfoGain.gain.value = 14;
    growlLfo.connect(lfoGain);
    lfoGain.connect(growl1.frequency);
    lfoGain.connect(growl2.frequency);

    growlFilter.type = 'lowpass';
    growlFilter.frequency.setValueAtTime(340, now + 0.15);
    growlFilter.frequency.linearRampToValueAtTime(520, now + 1.6);
    growlFilter.frequency.linearRampToValueAtTime(220, now + 5.0);

    growlGain.gain.setValueAtTime(0.001, now + 0.15);
    growlGain.gain.linearRampToValueAtTime(0.24, now + 0.55);
    growlGain.gain.setValueAtTime(0.22, now + 3.6);
    growlGain.gain.exponentialRampToValueAtTime(0.001, now + 5.1);

    growl1.connect(growlFilter);
    growl2.connect(growlFilter);
    growlFilter.connect(growlGain);
    growlGain.connect(this.ctx.destination);

    growl1.start(now + 0.15);
    growl2.start(now + 0.15);
    growlLfo.start(now + 0.15);
    growl1.stop(now + 5.15);
    growl2.stop(now + 5.15);
    growlLfo.stop(now + 5.15);

    // 3. 兩波刺耳怪物尖嘯聲（0.8s~2.6s 與 2.5s~4.6s）
    const shrieks = [
      { start: 0.75, dur: 1.85, fStart: 520, fPeak: 890, fEnd: 290 },
      { start: 2.55, dur: 2.1, fStart: 460, fPeak: 960, fEnd: 240 }
    ];
    shrieks.forEach((s) => {
      const oscA = this.ctx.createOscillator();
      const oscB = this.ctx.createOscillator();
      const vib = this.ctx.createOscillator();
      const vibGain = this.ctx.createGain();
      const bp = this.ctx.createBiquadFilter();
      const sGain = this.ctx.createGain();

      oscA.type = 'sawtooth';
      oscB.type = 'square';
      const t0 = now + s.start;
      oscA.frequency.setValueAtTime(s.fStart, t0);
      oscA.frequency.exponentialRampToValueAtTime(s.fPeak, t0 + s.dur * 0.3);
      oscA.frequency.exponentialRampToValueAtTime(s.fEnd, t0 + s.dur);

      oscB.frequency.setValueAtTime(s.fStart * 1.04, t0);
      oscB.frequency.exponentialRampToValueAtTime(s.fPeak * 1.07, t0 + s.dur * 0.3);
      oscB.frequency.exponentialRampToValueAtTime(s.fEnd * 1.03, t0 + s.dur);

      vib.frequency.value = 24;
      vibGain.gain.value = 28;
      vib.connect(vibGain);
      vibGain.connect(oscA.frequency);

      bp.type = 'bandpass';
      bp.frequency.value = 950;
      bp.Q.value = 1.6;

      sGain.gain.setValueAtTime(0.001, t0);
      sGain.gain.linearRampToValueAtTime(0.14, t0 + 0.18);
      sGain.gain.exponentialRampToValueAtTime(0.001, t0 + s.dur);

      oscA.connect(bp);
      oscB.connect(bp);
      bp.connect(sGain);
      sGain.connect(this.ctx.destination);

      oscA.start(t0);
      oscB.start(t0);
      vib.start(t0);
      oscA.stop(t0 + s.dur + 0.05);
      oscB.stop(t0 + s.dur + 0.05);
      vib.stop(t0 + s.dur + 0.05);
    });

    // 4. 背景基地紅色緊急警報脈衝（持續 5 秒）
    for (let k = 0; k < 4; k++) {
      setTimeout(() => {
        this.playTone(760, 0.45, 'sawtooth', 0.055, 510);
      }, k * 1150);
    }
  }
}

window.soundEngine = new SoundEngine();
