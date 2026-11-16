// ============================================================
// index.js — Màn hình nhập tên + hiệu ứng bảng đen
// ============================================================

// ---- Đếm ngược 20/11 ----
function updateCountdown() {
  const badge = document.getElementById('countdownBadge');
  if (!badge) return;

  const now = new Date();
  const year = now.getFullYear();
  let target = new Date(year, 10, 20, 0, 0, 0); // tháng 11 (index 10)
  if (now > target) target = new Date(year + 1, 10, 20, 0, 0, 0);

  const diff = target - now;
  if (diff <= 0) {
    badge.textContent = '🎉 Hôm nay là Ngày Nhà Giáo!';
    return;
  }
  const days  = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins  = Math.floor((diff % 3600000) / 60000);

  if (days > 0) badge.textContent = `📅 Còn ${days} ngày ${hours} giờ đến 20/11`;
  else          badge.textContent = `⏳ Còn ${hours} giờ ${mins} phút đến 20/11`;
}
updateCountdown();
setInterval(updateCountdown, 60000);

// ---- Chalk Dust Particle ----
function spawnDust(x, y, count = 20) {
  const container = document.getElementById('dust-container');
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'chalk-dust';
    const size = 2 + Math.random() * 5;
    const angle = Math.random() * 2 * Math.PI;
    const dist  = 30 + Math.random() * 80;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist - 20;
    const dur = 0.6 + Math.random() * 0.8;
    // Phấn trắng hoặc vàng ngẫu nhiên
    const colors = ['rgba(248,250,252,', 'rgba(253,230,138,', 'rgba(226,232,240,'];
    const col = colors[Math.floor(Math.random() * colors.length)];

    p.style.cssText = `
      left: ${x}px; top: ${y}px;
      width: ${size}px; height: ${size}px;
      background: ${col}${0.5 + Math.random() * 0.5});
      --tx: ${tx}px; --ty: ${ty}px;
      animation-duration: ${dur}s;
    `;
    container.appendChild(p);
    setTimeout(() => p.remove(), dur * 1000 + 100);
  }
}

// ---- Chuyển trang ----
function goToChalkLetter() {
  const input = document.getElementById('nameInput');
  const name = input.value.trim() || 'Thầy Cô';

  // Lưu tên vào sessionStorage
  sessionStorage.setItem('teacherName', name);

  // Hiệu ứng bụi phấn tại vị trí nút
  const btn = document.querySelector('.chalk-btn');
  const rect = btn.getBoundingClientRect();
  spawnDust(rect.left + rect.width / 2, rect.top + rect.height / 2, 35);

  // Fade out màn hình
  const intro = document.getElementById('intro-screen');
  intro.classList.add('fade-out');

  // Kích hoạt trạng thái bật nhạc cho các trang tiếp theo khi bắt đầu viết lên bảng
  localStorage.setItem('bg_music_muted', 'false');
  sessionStorage.setItem('music_started', 'true');

  setTimeout(() => {
    window.location.href = 'chalk-letter.html';
  }, 700);
}

// ---- Enter key shortcut ----
document.getElementById('nameInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') goToChalkLetter();
});

// ---- Dust nhẹ khi hover board (ambient) ----
let ambientTimer;
document.querySelector('.board-inner').addEventListener('mousemove', e => {
  clearTimeout(ambientTimer);
  ambientTimer = setTimeout(() => {
    if (Math.random() < 0.3) {
      spawnDust(e.clientX, e.clientY, 3);
    }
  }, 60);
});
