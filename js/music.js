// ============================================================
// music.js — Quản lý nhạc nền & nút Bật/Tắt âm thanh toàn website
// Tự động lưu tiến độ (playback time) để nhạc tiếp tục phát mượt mà khi chuyển trang
// ============================================================

(function () {
  // Không hiển thị nút và không phát nhạc ở trang chủ index.html
  const currentPath = window.location.pathname.toLowerCase();
  if (currentPath.endsWith('index.html') || currentPath.endsWith('/') || currentPath === '') {
    return;
  }

  // Tạo nút âm thanh nổi góc trên bên phải
  const musicBtn = document.createElement('button');
  musicBtn.id = 'bgMusicToggleBtn';
  musicBtn.setAttribute('title', 'Bật / Tắt âm thanh');
  musicBtn.innerHTML = `
    <span class="music-icon">🎵</span>
  `;

  // Thêm CSS cho nút âm thanh
  const style = document.createElement('style');
  style.textContent = `
    #bgMusicToggleBtn {
      position: fixed;
      top: 15px;
      right: 20px;
      z-index: 99999;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      background: rgba(30, 41, 59, 0.75);
      border: 1px solid rgba(253, 230, 138, 0.5);
      color: #fde68a;
      font-family: 'Baloo 2', 'Quicksand', sans-serif;
      font-size: 0.9rem;
      font-weight: 700;
      border-radius: 20px;
      cursor: pointer;
      backdrop-filter: blur(5px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      transition: all 0.25s ease;
      user-select: none;
    }
    #bgMusicToggleBtn:hover {
      background: rgba(30, 41, 59, 0.95);
      border-color: #fde68a;
      transform: scale(1.05);
      box-shadow: 0 0 12px rgba(253, 230, 138, 0.4);
    }
    #bgMusicToggleBtn.muted {
      border-color: rgba(248, 250, 252, 0.3);
      color: rgba(248, 250, 252, 0.5);
      background: rgba(15, 23, 42, 0.6);
    }
    #bgMusicToggleBtn .music-icon {
      font-size: 1.1rem;
      display: inline-block;
      animation: musicRotate 4s linear infinite;
    }
    #bgMusicToggleBtn.muted .music-icon {
      animation: none;
      filter: grayscale(1);
    }
    @keyframes musicRotate {
      0% { transform: rotate(0deg); }
      50% { transform: rotate(15deg); }
      100% { transform: rotate(0deg); }
    }
    @media (max-width: 600px) {
      #bgMusicToggleBtn {
        top: 10px;
        right: 12px;
        padding: 5px 10px;
        font-size: 0.8rem;
      }
      #bgMusicToggleBtn .music-text {
        display: none;
      }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(musicBtn);

  let isMuted = localStorage.getItem('bg_music_muted') === 'true';

  // 1. Audio element phát file audio/bg-music.mp3
  const audioEl = new Audio('audio/bg-music.mp3');
  audioEl.loop = true;
  audioEl.volume = 0.5;

  // Lấy lại vị trí thời gian bài hát từ lần chuyển trang trước
  const savedCurrentTime = parseFloat(sessionStorage.getItem('bg_music_time') || '0');
  const savedTimestamp = parseFloat(sessionStorage.getItem('bg_music_timestamp') || '0');

  // Ước tính vị trí thời gian nếu nhạc vẫn đang phát trong khi chuyển trang
  let targetTime = savedCurrentTime;
  if (savedTimestamp > 0 && !isMuted) {
    const elapsedSeconds = (Date.now() - savedTimestamp) / 1000;
    // Bù thêm thời gian chuyển trang nếu hợp lệ
    if (elapsedSeconds > 0 && elapsedSeconds < 30) {
      targetTime = savedCurrentTime + elapsedSeconds;
    }
  }

  // Khi audio metadata sẵn sàng, tua tới vị trí đã lưu
  audioEl.addEventListener('loadedmetadata', () => {
    if (targetTime > 0 && targetTime < audioEl.duration) {
      audioEl.currentTime = targetTime;
    }
  });

  // Liên tục lưu vị trí hiện tại của bài hát vào sessionStorage
  let saveInterval = null;
  function startTracking() {
    if (saveInterval) clearInterval(saveInterval);
    saveInterval = setInterval(() => {
      if (!audioEl.paused && !isNaN(audioEl.currentTime)) {
        sessionStorage.setItem('bg_music_time', audioEl.currentTime.toString());
        sessionStorage.setItem('bg_music_timestamp', Date.now().toString());
      }
    }, 300);
  }

  // Lưu ngay thời điểm rời trang (trước khi chuyển trang)
  window.addEventListener('beforeunload', () => {
    if (!audioEl.paused && !isNaN(audioEl.currentTime)) {
      sessionStorage.setItem('bg_music_time', audioEl.currentTime.toString());
      sessionStorage.setItem('bg_music_timestamp', Date.now().toString());
    } else if (useSynth) {
      sessionStorage.setItem('bg_music_synth_idx', noteIndex.toString());
      sessionStorage.setItem('bg_music_timestamp', Date.now().toString());
    }
  });

  let useSynth = false;
  let synthContext = null;
  let synthTimer = null;

  // 2. Bộ nhạc tổng hợp Web Audio API (dự phòng khi không load được mp3)
  const melodyNotes = [
    261.63, 293.66, 329.63, 392.00, 440.00, 523.25,
    392.00, 329.63, 293.66, 261.63, 329.63, 392.00,
    440.00, 523.25, 587.33, 523.25, 440.00, 392.00,
    329.63, 293.66, 261.63, 196.00, 220.00, 261.63
  ];
  let noteIndex = parseInt(sessionStorage.getItem('bg_music_synth_idx') || '0', 10);

  function initSynth() {
    if (!synthContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) synthContext = new AudioCtx();
    }
    if (synthContext && synthContext.state === 'suspended') {
      synthContext.resume();
    }
  }

  function playTone(freq, duration = 1.2) {
    if (isMuted || !synthContext) return;
    try {
      const osc = synthContext.createOscillator();
      const gain = synthContext.createGain();
      const now = synthContext.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.08, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(synthContext.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      // Bỏ qua lỗi audio
    }
  }

  function startSynthMelody() {
    if (synthTimer) clearInterval(synthTimer);
    initSynth();
    synthTimer = setInterval(() => {
      if (!isMuted && useSynth) {
        const freq = melodyNotes[noteIndex % melodyNotes.length];
        playTone(freq, 1.4);
        if (noteIndex % 4 === 0) {
          playTone(freq / 2, 2.0);
        }
        noteIndex++;
        sessionStorage.setItem('bg_music_synth_idx', noteIndex.toString());
      }
    }, 900);
  }

  function stopSynthMelody() {
    if (synthTimer) {
      clearInterval(synthTimer);
      synthTimer = null;
    }
  }

  // Khởi động phát nhạc
  function startMusic() {
    if (isMuted) return;

    // Thiết lập thời gian nếu audio đã sẵn sàng
    if (targetTime > 0 && audioEl.readyState >= 1) {
      try {
        audioEl.currentTime = targetTime;
      } catch (e) {}
    }

    audioEl.play().then(() => {
      useSynth = false;
      startTracking();
    }).catch(() => {
      // Trình duyệt chặn autoplay hoặc file không tồn tại -> chuyển sang Web Audio Synth
      useSynth = true;
      startSynthMelody();
    });
  }

  function updateButtonUI() {
    if (isMuted) {
      musicBtn.classList.add('muted');
      musicBtn.innerHTML = `
        <span class="music-icon">🔇</span>
      `;
    } else {
      musicBtn.classList.remove('muted');
      musicBtn.innerHTML = `
        <span class="music-icon">🎵</span>
      `;
    }
  }

  // Xử lý bật / tắt khi bấm nút
  musicBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    isMuted = !isMuted;
    localStorage.setItem('bg_music_muted', isMuted);
    updateButtonUI();

    if (isMuted) {
      audioEl.pause();
      stopSynthMelody();
      if (saveInterval) clearInterval(saveInterval);
    } else {
      startMusic();
    }
  });

  // Nếu người dùng vừa nhấn "Viết lên bảng" từ index hoặc đang trong phiên duyệt web
  if (sessionStorage.getItem('music_started') === 'true' && !isMuted) {
    startMusic();
  }

  // Tương tác của người dùng trên trang sẽ mở khoá âm thanh nếu trình duyệt hạn chế autoplay
  function handleFirstUserGesture() {
    if (!isMuted && audioEl.paused && !synthTimer) {
      startMusic();
    }
    window.removeEventListener('click', handleFirstUserGesture);
    window.removeEventListener('keydown', handleFirstUserGesture);
    window.removeEventListener('touchstart', handleFirstUserGesture);
  }

  window.addEventListener('click', handleFirstUserGesture);
  window.addEventListener('keydown', handleFirstUserGesture);
  window.addEventListener('touchstart', handleFirstUserGesture);

  // Cập nhật trạng thái ban đầu
  updateButtonUI();
})();
