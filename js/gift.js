// gift.js — Mở hộp quà 20/11 & Hiển thị ảnh quà tặng

const giftBox    = document.getElementById('giftBox');
const openBtn    = document.getElementById('openGiftBtn');
const imageModal = document.getElementById('imageModal');
const overlay    = document.getElementById('overlay');
const closeBtn   = document.getElementById('closeModal');

function openGift() {
  imageModal.style.display = 'block';
  overlay.style.display    = 'block';

  // Hiệu ứng pháo hoa ăn mừng khi mở hộp quà
  fireworks();
}

function closeGift() {
  imageModal.style.display = 'none';
  overlay.style.display    = 'none';
}

// Cho phép bấm cả nút lẫn bấm trực tiếp vào chiếc hộp quà
if (openBtn) openBtn.addEventListener('click', openGift);
if (giftBox) giftBox.addEventListener('click', openGift);

if (closeBtn) closeBtn.addEventListener('click', closeGift);
if (overlay) overlay.addEventListener('click', closeGift);

// Hiệu ứng pháo bông rực rỡ khi mở quà
function fireworks() {
  const colors = ['#fde68a', '#fca5a5', '#86efac', '#93c5fd', '#f472b6', '#fef08a'];
  for (let i = 0; i < 45; i++) {
    setTimeout(() => {
      const p = document.createElement('div');
      p.style.cssText = `
        position: fixed;
        left: ${15 + Math.random() * 70}vw;
        top:  ${15 + Math.random() * 55}vh;
        width: ${4 + Math.random() * 5}px;
        height: ${4 + Math.random() * 5}px;
        border-radius: 50%;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        pointer-events: none; z-index: 9999;
        animation: sparkFly ${0.7 + Math.random() * 0.8}s ease-out forwards;
        --tx: ${(Math.random() - 0.5) * 120}px;
        --ty: ${-30 - Math.random() * 90}px;
      `;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 1600);
    }, i * 25);
  }
}

// Keyframe cho pháo bông
if (!document.querySelector('#sparkStyle')) {
  const style = document.createElement('style');
  style.id = 'sparkStyle';
  style.textContent = `
    @keyframes sparkFly {
      0%   { opacity: 1; transform: translate(0,0) scale(1); }
      100% { opacity: 0; transform: translate(var(--tx), var(--ty)) scale(0.2); }
    }
  `;
  document.head.appendChild(style);
}
