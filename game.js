// 核爆庇護所：第 04 檢查哨 — 核心遊戲邏輯（含三夜輪班、通行證內線查核、專注連擊、偽人圖鑑與鍵盤快捷鍵）

class CheckpointGame {
  constructor() {
    this.loadCodex();
    this.bindUI();
    this.resetState();
  }

  loadCodex() {
    try {
      const saved = JSON.parse(localStorage.getItem('bunker04_codex') || '[]');
      this.unlockedCodex = new Set(Array.isArray(saved) ? saved : []);
    } catch (_) {
      this.unlockedCodex = new Set();
    }
  }

  unlockMonsterInCodex(id) {
    if (!id || !id.startsWith('m')) return;
    this.unlockedCodex.add(id);
    try {
      localStorage.setItem('bunker04_codex', JSON.stringify([...this.unlockedCodex]));
    } catch (_) {}
    this.updateCodexBadge();
  }

  updateCodexBadge() {
    if (this.el && this.el.codexCount) {
      this.el.codexCount.textContent = `${this.unlockedCodex.size}/20`;
    }
  }

  resetState() {
    this.maxStamina = 10;
    this.maxBreach = 3;
    this.maxInnocentLoss = 3;
    this.panicDurationMs = 4500;

    this.stamina = 10;
    this.coffees = 0;
    this.coffeeProgress = 0;
    this.streak = 0;
    this.night = 1;

    this.monstersCaught = 0;
    this.monstersAdmitted = 0;
    this.humansAdmitted = 0;
    this.innocentsKilled = 0;
    this.isBusy = false;
    this.xrayActive = false;
    this.interrogated = false;
    this.hotlineCalled = false;

    this.clearPanicTimer();
    this.clearTypewriter();

    this.usedTools = {
      thermo: false,
      photo: false,
      xray: false
    };

    // 洗牌訪客佇列：確保管理人員周軒宇出現在第 7~12 位之間，其餘 30 位隨機排序
    const admin = window.GAME_VISITORS.find((v) => v.isAdmin);
    const others = window.GAME_VISITORS.filter((v) => !v.isAdmin);
    this.shuffle(others);
    const adminPos = 6 + Math.floor(Math.random() * 6);
    others.splice(adminPos, 0, admin);

    this.queue = others;
    this.currentIndex = 0;
    this.updateCodexBadge();
  }

  shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  bindUI() {
    this.el = {
      startOverlay: document.getElementById('start-overlay'),
      endingOverlay: document.getElementById('ending-overlay'),
      endingCard: document.getElementById('ending-card'),
      manualOverlay: document.getElementById('manual-overlay'),
      shiftOverlay: document.getElementById('shift-overlay'),
      shiftTitle: document.getElementById('shift-title'),
      shiftDesc: document.getElementById('shift-desc'),
      upgradeGrid: document.getElementById('upgrade-grid'),
      codexOverlay: document.getElementById('codex-overlay'),
      codexModalCount: document.getElementById('codex-modal-count'),
      codexGrid: document.getElementById('codex-grid'),

      btnStart: document.getElementById('btn-start'),
      btnRestart: document.getElementById('btn-restart'),
      btnManual: document.getElementById('btn-manual'),
      btnCloseManual: document.getElementById('btn-close-manual'),
      btnCodex: document.getElementById('btn-codex'),
      btnCloseCodex: document.getElementById('btn-close-codex'),
      codexCount: document.getElementById('codex-count'),
      btnMute: document.getElementById('btn-mute'),

      hudNight: document.getElementById('hud-night'),
      hudStreak: document.getElementById('hud-streak'),
      progressVal: document.getElementById('hud-progress'),
      staminaText: document.getElementById('hud-stamina-text'),
      staminaBar: document.getElementById('hud-stamina-bar'),
      staminaBonusToast: document.getElementById('stamina-bonus-toast'),
      coffeeProgress: document.getElementById('hud-coffee-progress'),
      btnCoffee: document.getElementById('btn-coffee'),
      coffeeCount: document.getElementById('coffee-count'),
      alertBanner: document.getElementById('alert-banner'),
      alertText: document.getElementById('alert-text'),

      windowFrame: document.querySelector('.window-frame'),
      visitorImg: document.getElementById('visitor-img'),
      xraySkeletonOverlay: document.getElementById('xray-normal-skeleton'),
      xrayBeam: document.getElementById('xray-beam'),
      thermoLaser: document.getElementById('thermo-laser'),
      cameraFlash: document.getElementById('camera-flash'),
      containmentDome: document.getElementById('containment-dome'),
      gateOpenFx: document.getElementById('gate-open-fx'),

      idCardBox: document.getElementById('id-card-box'),
      idCode: document.getElementById('id-code'),
      idSector: document.getElementById('id-sector'),
      idExt: document.getElementById('id-ext'),
      idStamp: document.getElementById('id-stamp'),

      visitorTag: document.getElementById('visitor-tag'),
      clearanceBadge: document.getElementById('clearance-badge'),
      dialogueText: document.getElementById('dialogue-text'),
      btnInterrogate: document.getElementById('btn-interrogate'),
      btnHotline: document.getElementById('btn-hotline'),
      adminChoices: document.getElementById('admin-choices'),

      gameShell: document.querySelector('.game-shell'),
      panicBarWrap: document.getElementById('panic-bar-wrap'),
      panicFill: document.getElementById('panic-fill'),
      safetyCover: document.getElementById('safety-cover'),
      polaroidModal: document.getElementById('polaroid-modal'),
      polaroidModalImg: document.getElementById('polaroid-modal-img'),
      polaroidModalCaption: document.getElementById('polaroid-modal-caption'),

      valThermo: document.getElementById('val-thermo'),
      valPhoto: document.getElementById('val-photo'),
      valXray: document.getElementById('val-xray'),

      polaroidSlot: document.getElementById('polaroid-slot'),
      polaroidImg: document.getElementById('polaroid-img'),
      polaroidCaption: document.getElementById('polaroid-caption'),

      btnThermo: document.getElementById('tool-thermo'),
      btnPhoto: document.getElementById('tool-photo'),
      btnXray: document.getElementById('tool-xray'),
      btnRed: document.getElementById('btn-red'),
      btnGreen: document.getElementById('btn-green'),
      redSub: document.getElementById('red-sub')
    };

    this.el.btnStart.addEventListener('click', () => {
      window.soundEngine.init();
      this.el.startOverlay.classList.add('hidden');
      this.resetState();
      this.loadVisitor();
    });

    this.el.btnRestart.addEventListener('click', () => {
      this.el.endingOverlay.classList.add('hidden');
      this.resetState();
      this.loadVisitor();
    });

    this.el.btnManual.addEventListener('click', () => {
      this.el.manualOverlay.classList.remove('hidden');
    });

    this.el.btnCloseManual.addEventListener('click', () => {
      this.el.manualOverlay.classList.add('hidden');
    });

    this.el.btnCodex.addEventListener('click', () => {
      this.renderCodex();
      this.el.codexOverlay.classList.remove('hidden');
    });

    this.el.btnCloseCodex.addEventListener('click', () => {
      this.el.codexOverlay.classList.add('hidden');
    });

    this.el.btnMute.addEventListener('click', () => {
      const muted = window.soundEngine.toggleMute();
      this.el.btnMute.textContent = muted ? '🔇 靜音中' : '🔊 音效開';
    });

    this.el.btnCoffee.addEventListener('click', () => this.drinkCoffee());
    this.el.btnInterrogate.addEventListener('click', () => this.interrogate());
    this.el.btnHotline.addEventListener('click', () => this.callHotline());
    this.el.btnThermo.addEventListener('click', () => this.useThermo());
    this.el.btnPhoto.addEventListener('click', () => this.usePhoto());
    this.el.btnXray.addEventListener('click', () => this.useXray());

    this.el.safetyCover.addEventListener('click', () => {
      if (this.el.btnRed.disabled || this.isBusy) return;
      window.soundEngine.playLatchClick();
      this.el.safetyCover.classList.add('open');
    });

    this.el.polaroidSlot.addEventListener('click', () => {
      if (!this.el.polaroidImg.src) return;
      this.el.polaroidModalImg.src = this.el.polaroidImg.src;
      this.el.polaroidModalCaption.textContent = this.el.polaroidCaption.textContent;
      this.el.polaroidModal.classList.remove('hidden');
    });

    this.el.polaroidModal.addEventListener('click', () => {
      this.el.polaroidModal.classList.add('hidden');
    });

    this.el.btnRed.addEventListener('click', () => this.decide(true));
    this.el.btnGreen.addEventListener('click', () => this.decide(false));

    // 鍵盤快捷鍵支援
    window.addEventListener('keydown', (e) => {
      const anyModalOpen =
        !this.el.startOverlay.classList.contains('hidden') ||
        !this.el.endingOverlay.classList.contains('hidden') ||
        !this.el.manualOverlay.classList.contains('hidden') ||
        !this.el.shiftOverlay.classList.contains('hidden') ||
        !this.el.codexOverlay.classList.contains('hidden');
      if (anyModalOpen || this.isBusy) return;

      const key = e.key.toLowerCase();
      if (key === '1') this.useThermo();
      else if (key === '2') this.usePhoto();
      else if (key === '3') this.useXray();
      else if (key === 'q') this.interrogate();
      else if (key === 'e') this.callHotline();
      else if (key === 'c') this.drinkCoffee();
      else if (e.code === 'Space') {
        e.preventDefault();
        if (!this.el.btnRed.disabled) {
          window.soundEngine.playLatchClick();
          this.el.safetyCover.classList.toggle('open');
        }
      } else if (key === 'r') {
        if (this.el.safetyCover.classList.contains('open') && !this.el.btnRed.disabled) {
          this.decide(true);
        }
      } else if (key === 'g') {
        if (!this.el.btnGreen.disabled) {
          this.decide(false);
        }
      }
    });
  }

  get currentVisitor() {
    return this.queue[this.currentIndex];
  }

  // 檢查是否進入換班結算（第 10 位與第 20 位結束後換班）
  advanceToNextVisitor() {
    this.currentIndex++;
    if (this.currentIndex === 10 && this.night === 1) {
      this.night = 2;
      this.showShiftIntermission(
        '第 1 夜值勤完成！即將進入「第 2 夜：核塵風暴」',
        '外圍刮起了強烈的輻射塵暴，地堡電力偶爾會出現短暫閃爍。指揮部為你恢復了 +3 點體力，請選擇一項值班室強化補給：'
      );
      return;
    }
    if (this.currentIndex === 20 && this.night === 2) {
      this.night = 3;
      this.showShiftIntermission(
        '第 2 夜值勤完成！即將進入「第 3 夜：血月總攻」',
        '黎明前最黑暗的時刻到了，大批偽人正試圖在天亮前混入基地。指揮部為你恢復了 +3 點體力，請選擇最後一項強化補給：'
      );
      return;
    }
    this.loadVisitor();
  }

  showShiftIntermission(title, desc) {
    this.stamina = Math.min(this.maxStamina, this.stamina + 3);
    window.soundEngine.playVictory();
    this.el.shiftTitle.textContent = title;
    this.el.shiftDesc.textContent = desc;
    this.el.upgradeGrid.innerHTML = '';

    const upgrades = [
      {
        title: '☕ 特濃軍用咖啡箱',
        desc: '立即獲得 +2 杯熱咖啡備用（每杯可隨時恢復 +2 體力）。',
        apply: () => {
          this.coffees += 2;
        }
      },
      {
        title: '🔋 高能電容模組',
        desc: '體力上限永久 +2，並立即額外恢復 +3 點體力。',
        apply: () => {
          this.maxStamina += 2;
          this.stamina = Math.min(this.maxStamina, this.stamina + 3);
        }
      },
      {
        title: '🛡️ 防爆窗強化與清消',
        desc: '偽人暴走反撲倒數延長 +2 秒，並消除 1 點已誤放偽人的基地警戒。',
        apply: () => {
          this.panicDurationMs += 2000;
          if (this.monstersAdmitted > 0) this.monstersAdmitted--;
        }
      }
    ];

    upgrades.forEach((u) => {
      const card = document.createElement('button');
      card.className = 'upgrade-card';
      card.innerHTML = `<h3>${u.title}</h3><p>${u.desc}</p>`;
      card.addEventListener('click', () => {
        u.apply();
        window.soundEngine.playCoffee();
        this.el.shiftOverlay.classList.add('hidden');
        this.loadVisitor();
      });
      this.el.upgradeGrid.appendChild(card);
    });

    this.el.shiftOverlay.classList.remove('hidden');
  }

  generatePassData(v) {
    const sectors = ['第 01 動力區', '第 02 居住區', '第 03 醫療區', '第 04 農業溫室', '第 05 通訊中樞'];
    const numHash = v.id.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const sector = sectors[numHash % sectors.length];
    const ext = `#${301 + (numHash % 500)}`;
    const code = `BNK-${100 + (numHash % 890)}`;
    return { code, sector, ext };
  }

  loadVisitor() {
    const v = this.currentVisitor;
    if (!v) {
      this.triggerEnding();
      return;
    }

    this.isBusy = false;
    this.xrayActive = false;
    this.interrogated = false;
    this.hotlineCalled = false;
    this.clearPanicTimer();
    this.usedTools = { thermo: false, photo: false, xray: false };

    // 重置視覺特效
    this.el.containmentDome.classList.remove('dropped');
    this.el.gateOpenFx.classList.remove('active');
    this.el.xraySkeletonOverlay.classList.add('hidden');
    this.el.visitorImg.classList.remove('xray-filter', 'high-clearance');
    this.el.polaroidSlot.classList.add('hidden');
    this.el.adminChoices.classList.add('hidden');
    this.el.adminChoices.innerHTML = '';
    this.el.safetyCover.classList.remove('open');

    // 第 2、3 夜偶爾觸發核塵暴電壓閃爍氛圍
    if (this.night >= 2 && !v.isAdmin && Math.random() < 0.35) {
      this.el.windowFrame.classList.remove('power-flicker');
      void this.el.windowFrame.offsetWidth;
      this.el.windowFrame.classList.add('power-flicker');
      window.soundEngine.playPowerFlicker();
    }

    // 載入角色立繪
    this.el.visitorImg.src = v.imgNormal;
    if (v.isAdmin) this.el.visitorImg.classList.add('high-clearance');

    // 生成通行證資訊
    const pass = this.generatePassData(v);
    this.el.idCode.textContent = v.isAdmin ? 'ADM-000' : pass.code;
    this.el.idSector.textContent = v.isAdmin ? '指揮部核心' : pass.sector;
    this.el.idExt.textContent = v.isAdmin ? '#001' : pass.ext;
    this.el.idStamp.textContent = v.isAdmin ? 'VIP // 最高權限' : 'PASS // 待查驗';
    this.el.idStamp.style.color = v.isAdmin ? '#6ee7b7' : '#94a3b8';
    this.el.idStamp.style.borderColor = v.isAdmin ? '#10b981' : '#475569';

    // 訪客資訊與打字機對話
    this.el.visitorTag.textContent = `${v.name}｜${v.role}`;
    this.typeWrite(v.dialogue);

    // 讀數重置
    this.setReadout(this.el.valThermo, '尚未測量', '');
    this.setReadout(this.el.valPhoto, '尚未拍攝', '');
    this.setReadout(this.el.valXray, '尚未掃描', '');

    // 若為管理人員周軒宇：鎖定紅鈕、體力 +5 並明顯顯示，呈現三選一選項
    if (v.isAdmin) {
      this.stamina += 5;
      window.soundEngine.playCoffee();
      this.el.staminaBonusToast.textContent = '+5 體力！';
      this.el.staminaBonusToast.classList.remove('hidden');

      this.el.clearanceBadge.textContent = '高權限管理人員｜體力 +5';
      this.el.clearanceBadge.classList.remove('hidden');
      this.el.btnRed.disabled = true;
      this.el.redSub.textContent = '最高權限鎖定中';
      this.el.btnGreen.disabled = true;

      const options = ['今天很正常', '今天抓了很多偽人', '覺得很累'];
      options.forEach((opt) => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = `▶ ${opt}`;
        btn.addEventListener('click', () => this.handleAdminChoice(opt));
        this.el.adminChoices.appendChild(btn);
      });
      this.el.adminChoices.classList.remove('hidden');
    } else {
      this.el.staminaBonusToast.classList.add('hidden');
      this.el.clearanceBadge.classList.add('hidden');
      this.el.btnRed.disabled = false;
      this.el.redSub.textContent = '玻璃罩困住消滅';
      this.el.btnGreen.disabled = false;
    }

    this.updateHUD();
  }

  handleAdminChoice(choice) {
    if (this.isBusy) return;
    this.isBusy = true;
    const v = this.currentVisitor;

    this.el.adminChoices.classList.add('hidden');
    this.typeWrite(v.adminReplies[choice]);
    window.soundEngine.playGreenButton();

    setTimeout(() => {
      this.el.gateOpenFx.classList.add('active');
      this.humansAdmitted++;
      setTimeout(() => {
        this.advanceToNextVisitor();
      }, 1100);
    }, 1400);
  }

  setReadout(el, text, cls) {
    el.textContent = text;
    el.className = 'readout-val' + (cls ? ` ${cls}` : '');
  }

  updateHUD() {
    const nightNames = {
      1: '🌙 第 1 夜：前哨警戒',
      2: '🌩️ 第 2 夜：核塵風暴',
      3: '🩸 第 3 夜：血月總攻'
    };
    this.el.hudNight.textContent = nightNames[this.night] || nightNames[1];
    this.el.hudStreak.textContent = `⚡ 專注連擊 ${this.streak}/3`;

    this.el.progressVal.textContent = `${Math.min(this.currentIndex + 1, this.queue.length)} / ${this.queue.length}`;
    this.el.staminaText.textContent = `${this.stamina} / ${this.maxStamina}`;
    this.el.coffeeProgress.textContent = `抓捕進度 ${this.coffeeProgress}/3`;
    this.el.coffeeCount.textContent = `x${this.coffees}`;

    // 體力條格子
    this.el.staminaBar.innerHTML = '';
    const totalPips = Math.max(this.maxStamina, this.stamina);
    for (let i = 0; i < totalPips; i++) {
      const pip = document.createElement('div');
      pip.className = 'stamina-pip';
      if (i < this.stamina) {
        if (i >= this.maxStamina) {
          pip.classList.add('bonus');
        } else {
          pip.classList.add(this.stamina <= 3 ? 'low' : 'active');
        }
      }
      this.el.staminaBar.appendChild(pip);
    }

    this.el.btnCoffee.disabled = this.coffees <= 0 || this.stamina >= this.maxStamina || this.isBusy;

    const v = this.currentVisitor;
    const isAdmin = v && v.isAdmin;
    const noStamina = this.stamina <= 0;

    this.el.btnThermo.disabled = isAdmin || noStamina || this.usedTools.thermo || this.isBusy;
    this.el.btnPhoto.disabled = isAdmin || noStamina || this.usedTools.photo || this.isBusy;
    this.el.btnXray.disabled = isAdmin || noStamina || this.usedTools.xray || this.isBusy;
    this.el.btnInterrogate.disabled = isAdmin || this.interrogated || this.isBusy;
    this.el.btnHotline.disabled = isAdmin || this.hotlineCalled || this.isBusy;

    this.el.btnThermo.classList.toggle('used', this.usedTools.thermo);
    this.el.btnPhoto.classList.toggle('used', this.usedTools.photo);
    this.el.btnXray.classList.toggle('used', this.usedTools.xray);

    this.el.gameShell.classList.toggle('alert-red', this.monstersAdmitted > 0);

    if (this.monstersAdmitted > 0 || this.innocentsKilled > 0) {
      this.el.alertBanner.classList.remove('hidden');
      const msgs = [];
      if (this.monstersAdmitted === 1) msgs.push('基地內部警報：第 3 區傳來奇怪的抓門聲（已放進 1 隻偽人）');
      if (this.monstersAdmitted === 2) msgs.push('極度危險：通風管失去訊號！再放進 1 隻偽人基地就會淪陷！');
      if (this.innocentsKilled > 0) msgs.push(`指揮部警告：已誤殺 ${this.innocentsKilled}/${this.maxInnocentLoss} 名無辜人類`);
      this.el.alertText.textContent = msgs.join(' ｜ ');
    } else {
      this.el.alertBanner.classList.add('hidden');
    }
  }

  consumeStamina() {
    if (this.stamina <= 0) return false;
    this.stamina--;
    this.updateHUD();
    return true;
  }

  drinkCoffee() {
    if (this.coffees <= 0 || this.stamina >= this.maxStamina || this.isBusy) return;
    this.coffees--;
    this.stamina = Math.min(this.maxStamina, this.stamina + 2);
    window.soundEngine.playCoffee();
    this.updateHUD();
  }

  clearTypewriter() {
    if (this.typeTimer) {
      clearInterval(this.typeTimer);
      this.typeTimer = null;
    }
  }

  typeWrite(text) {
    this.clearTypewriter();
    this.el.dialogueText.textContent = '';
    let i = 0;
    this.typeTimer = setInterval(() => {
      if (i >= text.length) {
        this.clearTypewriter();
        return;
      }
      this.el.dialogueText.textContent += text[i];
      if (i % 3 === 0) window.soundEngine.playTypeTick();
      i++;
    }, 22);
  }

  triggerShake() {
    this.el.gameShell.classList.remove('shake');
    void this.el.gameShell.offsetWidth;
    this.el.gameShell.classList.add('shake');
  }

  clearPanicTimer() {
    if (this.panicInterval) {
      clearInterval(this.panicInterval);
      this.panicInterval = null;
    }
    if (this.el && this.el.panicBarWrap) {
      this.el.panicBarWrap.classList.add('hidden');
    }
  }

  startPanicTimer(v) {
    if (this.panicInterval || this.isBusy || this.currentVisitor !== v) return;
    const totalMs = this.panicDurationMs;
    const start = Date.now();
    this.el.panicBarWrap.classList.remove('hidden');
    this.el.panicFill.style.width = '100%';

    // 偽人被識破時的心理威脅／賄賂台詞
    const bribes = [
      '「別按紅色按鈕！！只要你放我進去，我把撿到的咖啡都給你……我保證只吃裡面一個人！」',
      '「被你發現了……嘿嘿嘿，在這扇玻璃被我撞碎之前，你來得及掀開安全蓋嗎？！」',
      '「求求你當作沒看到！外面的核塵太冷了，我只需要一具新鮮的身體保暖而已！」'
    ];
    this.typeWrite(bribes[Math.floor(Math.random() * bribes.length)]);

    this.panicInterval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.max(0, 100 - (elapsed / totalMs) * 100);
      this.el.panicFill.style.width = `${pct}%`;

      if (elapsed >= totalMs) {
        this.clearPanicTimer();
        if (this.isBusy || this.currentVisitor !== v) return;
        this.isBusy = true;
        this.streak = 0;
        this.monstersAdmitted++;
        this.triggerShake();
        window.soundEngine.playHorrorSting();
        this.typeWrite('【防爆窗被撞破！】你反應太慢，偽人趁亂強行闖入了地下基地！');
        this.updateHUD();

        setTimeout(() => {
          if (this.monstersAdmitted >= this.maxBreach) {
            this.triggerEnding();
          } else {
            this.advanceToNextVisitor();
          }
        }, 1600);
      }
    }, 60);
  }

  interrogate() {
    if (this.isBusy || this.interrogated) return;
    const v = this.currentVisitor;
    if (!v || v.isAdmin) return;

    this.interrogated = true;
    this.updateHUD();

    if (!v.isMonster) {
      const normalReplies = [
        `「（喘氣）……我叫${v.name}，原本就在${v.role}崗位工作。核爆警報響起時我照著避難路線一路走過來的，證件編號都對得上。」`,
        `「檢查站守則？進門前配合測溫與掃描、絕不攜帶未檢疫肉品……這些我都記得，拜託快讓我進去吧。」`,
        `「這份${v.role}的工作我做了好幾年，裡面應該還有認識我的同事，你可以用內線電話核對。」`
      ];
      this.typeWrite(normalReplies[Math.floor(Math.random() * normalReplies.length)]);
    } else {
      const monsterReplies = [
        `「……我、我是${v.role}。什麼避難所代號？我……我的頭好痛，別再問了，快把綠色的門打開！」`,
        `「（喉嚨發出奇怪的喀喀聲）……人類都是這樣呼吸、這樣說話的對吧？快點放我進去……裡面好香……」`,
        `「我當然記得守則……第一條是……呃……總之我不是怪物，你再問下去我會生氣的！」`
      ];
      this.typeWrite(monsterReplies[Math.floor(Math.random() * monsterReplies.length)]);
    }
  }

  // 基地內線電話查核（啟發自《That's Not My Neighbor》）
  callHotline() {
    if (this.isBusy || this.hotlineCalled) return;
    const v = this.currentVisitor;
    if (!v || v.isAdmin) return;

    this.hotlineCalled = true;
    window.soundEngine.playPhoneDial();
    this.updateHUD();

    const sector = this.el.idSector.textContent;
    if (!v.isMonster) {
      this.el.idStamp.textContent = 'VERIFIED // 內線吻合';
      this.el.idStamp.style.color = '#34d399';
      this.el.idStamp.style.borderColor = '#10b981';
      this.typeWrite(`☎️【${sector}內線回報】：「是的，${v.name}（${v.role}）今天確實有登記外勤歸隊，通行證有效，請予以放行！」`);
    } else {
      // 60% 機率直接抓出冒用死者／本人在寢室的恐怖破綻；40% 機率電話線路受核塵干擾需靠儀器確認
      const roll = Math.random();
      if (roll < 0.6) {
        this.el.idStamp.textContent = 'ALERT // 身分冒用！';
        this.el.idStamp.style.color = '#f87171';
        this.el.idStamp.style.borderColor = '#ef4444';
        window.soundEngine.playHorrorSting();
        this.triggerShake();
        const creepyReports = [
          `☎️【${sector}內線尖叫】：「你說誰？！真正的${v.name}半小時前就已經回到寢室睡覺了！站在你窗外的那個東西絕對不是他！！」`,
          `☎️【${sector}內線警報】：「不可能！${v.name}早在兩天前的廢墟搜救中就已經陣亡了！快按下紅色按鈕消滅牠！」`
        ];
        this.typeWrite(creepyReports[Math.floor(Math.random() * creepyReports.length)]);
      } else {
        this.el.idStamp.textContent = 'STATIC // 訊號干擾';
        this.el.idStamp.style.color = '#fbbf24';
        this.el.idStamp.style.borderColor = '#f59e0b';
        this.typeWrite(`☎️【${sector}內線雜訊】：「滋……滋……名單上確實有${v.name}外出未歸……但外部落塵干擾嚴重，請務必搭配體溫、拍照或 X 光做最終確認！」`);
      }
    }
  }

  // ===== 三大檢驗工具 =====
  useThermo() {
    if (this.isBusy || this.usedTools.thermo || !this.consumeStamina()) return;
    this.usedTools.thermo = true;
    const v = this.currentVisitor;

    this.el.thermoLaser.classList.remove('active');
    void this.el.thermoLaser.offsetWidth;
    this.el.thermoLaser.classList.add('active');

    const isLow = v.temp < 15;
    const isHigh = v.temp > 42;
    const isAnomaly = isLow || isHigh;

    window.soundEngine.playThermo(isAnomaly);

    if (isLow) {
      this.setReadout(this.el.valThermo, `${v.temp.toFixed(1)} °C（極度低溫！）`, 'cold');
      this.triggerShake();
    } else if (isHigh) {
      this.setReadout(this.el.valThermo, `${v.temp.toFixed(1)} °C（異常高溫！）`, 'hot');
      this.triggerShake();
    } else {
      this.setReadout(this.el.valThermo, `${v.temp.toFixed(1)} °C（正常）`, 'normal');
    }
    this.updateHUD();
  }

  usePhoto() {
    if (this.isBusy || this.usedTools.photo || !this.consumeStamina()) return;
    this.usedTools.photo = true;
    const v = this.currentVisitor;

    window.soundEngine.playCamera();
    this.el.cameraFlash.classList.remove('flash');
    void this.el.cameraFlash.offsetWidth;
    this.el.cameraFlash.classList.add('flash');

    this.el.polaroidSlot.classList.remove('hidden');

    const targetSrc = v.imgPhoto ? v.imgPhoto : v.imgNormal;
    this.el.polaroidImg.src = targetSrc;
    this.el.polaroidImg.classList.add('developing');
    setTimeout(() => this.el.polaroidImg.classList.remove('developing'), 80);

    this.el.polaroidCaption.textContent = v.photoNote ? 'ANOMALY DETECTED' : 'PHOTO LOGGED';
    this.setReadout(this.el.valPhoto, '顯影中……', 'warn');

    setTimeout(() => {
      if (this.isBusy || this.currentVisitor !== v) return;
      if (v.photoNote) {
        this.setReadout(this.el.valPhoto, v.photoNote, 'hot');
        window.soundEngine.playHorrorSting();
        this.triggerShake();
        this.startPanicTimer(v);
      } else {
        this.setReadout(this.el.valPhoto, '影像正常', 'normal');
      }
    }, 1500);

    this.updateHUD();
  }

  useXray() {
    if (this.isBusy || this.usedTools.xray || !this.consumeStamina()) return;
    this.usedTools.xray = true;
    const v = this.currentVisitor;
    const isAnomaly = Boolean(v.imgXray);

    window.soundEngine.playXray(isAnomaly);
    window.soundEngine.playGeiger();
    this.el.xrayBeam.classList.remove('scanning');
    void this.el.xrayBeam.offsetWidth;
    this.el.xrayBeam.classList.add('scanning');

    this.setReadout(this.el.valXray, '掃描中……', 'warn');

    setTimeout(() => {
      if (this.isBusy || this.currentVisitor !== v) return;
      if (v.imgXray) {
        this.el.visitorImg.src = v.imgXray;
      } else {
        this.el.visitorImg.classList.add('xray-filter');
        this.el.xraySkeletonOverlay.classList.remove('hidden');
      }

      if (v.xrayNote) {
        this.setReadout(this.el.valXray, v.xrayNote, 'hot');
        window.soundEngine.playHorrorSting();
        this.triggerShake();
        this.startPanicTimer(v);
      } else {
        this.setReadout(this.el.valXray, '骨骼結構正常', 'normal');
      }
    }, 600);

    this.updateHUD();
  }

  handleCorrectStreak() {
    this.streak++;
    if (this.streak >= 3) {
      this.streak = 0;
      this.stamina = Math.min(this.maxStamina, this.stamina + 1);
      window.soundEngine.playStreakBonus();
      this.el.staminaBonusToast.textContent = '⚡ 專注連擊 +1 體力！';
      this.el.staminaBonusToast.classList.remove('hidden');
    }
  }

  // ===== 紅／綠按鈕處置 =====
  decide(pressRed) {
    if (this.isBusy) return;
    const v = this.currentVisitor;
    if (!v || v.isAdmin) return;

    this.clearPanicTimer();
    this.isBusy = true;
    this.updateHUD();

    if (pressRed) {
      window.soundEngine.playRedButton();
      this.triggerShake();
      this.el.containmentDome.classList.add('dropped');

      if (v.isMonster) {
        this.monstersCaught++;
        this.coffeeProgress++;
        this.unlockMonsterInCodex(v.id);
        this.handleCorrectStreak();

        if (this.coffeeProgress >= 3) {
          this.coffeeProgress = 0;
          this.coffees++;
          this.typeWrite(`【成功消滅偽人！】已解鎖「${v.category}」圖鑑，並獲得 1 杯熱咖啡獎勵（喝下 +2 體力）！`);
        } else {
          this.typeWrite(`【成功消滅偽人！】這隻怪物「${v.category}」已被高溫玻璃罩淨化並收錄至圖鑑。`);
        }
      } else {
        this.streak = 0;
        this.innocentsKilled++;
        window.soundEngine.playHorrorSting();
        this.typeWrite(`【重大失誤】玻璃罩裡傳來絕望的拍打聲……「${v.name}」是無辜的人類！`);
      }
    } else {
      window.soundEngine.playGreenButton();
      this.el.gateOpenFx.classList.add('active');

      if (v.isMonster) {
        this.streak = 0;
        this.monstersAdmitted++;
        window.soundEngine.playHorrorSting();
        this.triggerShake();
        this.typeWrite('【警告】氣閘門關閉後，你總覺得剛進去的那個人影不太對勁……（已誤放偽人）');
      } else {
        this.humansAdmitted++;
        this.handleCorrectStreak();
        this.typeWrite(`【安全放行】${v.name} 順利進入地下基地避難區。`);
      }
    }

    this.updateHUD();

    setTimeout(() => {
      if (this.monstersAdmitted >= this.maxBreach || this.innocentsKilled >= this.maxInnocentLoss) {
        this.triggerEnding();
        return;
      }
      this.advanceToNextVisitor();
    }, 1550);
  }

  renderCodex() {
    const monsters = window.GAME_VISITORS.filter((v) => v.isMonster);
    this.el.codexModalCount.textContent = `${this.unlockedCodex.size}`;
    this.el.codexGrid.innerHTML = '';

    monsters.forEach((m, idx) => {
      const unlocked = this.unlockedCodex.has(m.id);
      const item = document.createElement('div');
      item.className = 'codex-item' + (unlocked ? '' : ' locked');
      const imgSrc = unlocked ? (m.imgPhoto || m.imgXray || m.imgNormal) : m.imgNormal;
      item.innerHTML = `
        <img class="codex-thumb" src="${imgSrc}" alt="圖鑑 #${idx + 1}" />
        <div class="codex-meta">
          <strong>#${String(idx + 1).padStart(2, '0')} ${unlocked ? m.name : '？？？'}</strong>
          <span>${unlocked ? m.category : '尚未捕獲解鎖'}</span>
        </div>
      `;
      this.el.codexGrid.appendChild(item);
    });
  }

  triggerEnding() {
    this.el.endingOverlay.classList.remove('hidden');
    this.el.endingCard.classList.remove('ending-win', 'ending-lose');

    const badge = document.getElementById('ending-badge');
    const title = document.getElementById('ending-title');
    const desc = document.getElementById('ending-desc');
    const endingImg = document.getElementById('ending-img');

    document.getElementById('stat-caught').textContent = `${this.monstersCaught} / 20`;
    document.getElementById('stat-humans').textContent = `${this.humansAdmitted}`;
    document.getElementById('stat-breach').textContent = `${this.monstersAdmitted}`;
    document.getElementById('stat-innocent').textContent = `${this.innocentsKilled}`;

    if (this.monstersAdmitted >= this.maxBreach) {
      this.el.endingCard.classList.add('ending-lose');
      window.soundEngine.playBreachHorror();
      endingImg.src = 'assets/endings/ending_lose_breach.jpg';
      badge.textContent = 'CRITICAL FAILURE // 基地淪陷';
      title.textContent = '失敗結局：偽人吞噬了庇護所';
      desc.textContent =
        '第 04 檢查哨的紅色警報徹底失控。你放進來的偽人從通風管與走廊同時撲向避難區，對講機裡只剩下此起彼落的慘叫聲……下一秒，檢查室身後的氣閘門被從內部緩緩推開。';
    } else if (this.innocentsKilled >= this.maxInnocentLoss) {
      this.el.endingCard.classList.add('ending-lose');
      window.soundEngine.playDefeat();
      endingImg.src = 'assets/endings/ending_lose_terminated.jpg';
      badge.textContent = 'TERMINATED // 解除職務';
      title.textContent = '失敗結局：失去理智的守門人';
      desc.textContent =
        '玻璃罩裡一次又一次無辜者的哀號，徹底壓垮了你的判斷力。基地指揮部強行鎖死檢查台並撤換了你的職務——在冷酷的末日裡，恐懼讓你變成了比偽人更可怕的劊子手。';
    } else if (this.monstersAdmitted === 0 && this.innocentsKilled === 0) {
      this.el.endingCard.classList.add('ending-win');
      window.soundEngine.playVictory();
      endingImg.src = 'assets/endings/ending_win_perfect.jpg';
      badge.textContent = 'PERFECT CLEAR // 完美守護';
      title.textContent = '勝利結局：黎明前的銅牆鐵壁';
      desc.textContent =
        '所有 20 隻偽裝怪物全數被你精準識破並淨化，沒有任何一位無辜倖存者受害！清晨的微光穿透核爆塵埃，管理人員周軒宇透過廣播向你致敬：「第 04 檢查哨零失誤，基地安全了！」';
    } else {
      this.el.endingCard.classList.add('ending-win');
      window.soundEngine.playVictory();
      endingImg.src = 'assets/endings/ending_win_survived.jpg';
      badge.textContent = 'SURVIVED // 艱難守住';
      title.textContent = '勝利結局：劫後餘生的值班夜';
      desc.textContent =
        '雖然過程中付出了些許代價，基地防線仍在你的堅守下撐過了這波危機。當換班的警衛接手控制台時，你才發現自己的手心早已佈滿冷汗。至少今晚，大多數人都活下來了。';
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.game = new CheckpointGame();
});
