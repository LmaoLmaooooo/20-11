// ============================================================
// chalk-letter.js
// ============================================================

const messages = [
  // Mẫu 1
  `Hôm nay là ngày đặc biệt – Ngày Nhà giáo Việt Nam 20/11, một dịp trọn vẹn để dừng lại giữa nhịp sống hối hả và gửi gắm những suy nghĩ chân thành nhất đến thầy cô.
  Xin được gửi lời cảm ơn sâu sắc đến các thầy cô – những người lái đò thầm lặng đã luôn tận tụy, kiên nhẫn dìu dắt biết bao thế hệ học trò qua từng con chữ, từng bài học làm người.
  Xin cảm ơn những trăn trở, những hy sinh thầm lặng và ngọn lửa nhiệt huyết luôn cháy sáng trên bục giảng để soi đường cho các lớp học trò bước vào đời.
  Nhân ngày 20/11, kính chúc thầy cô luôn dồi dào sức khỏe, luôn giữ vững sự bình an và niềm vui trong cuộc sống, để tiếp tục chèo lái thêm nhiều chuyến đò tri thức cập bến thành công. Chúc mừng Ngày Nhà giáo Việt Nam! 🌸`,

  // Mẫu 2
  `Thời gian có thể làm mờ đi phấn trắng trên bảng đen, nhưng những bài học quý giá cùng tình yêu thương của thầy cô sẽ mãi in đậm trong tâm trí chúng em.
  Mỗi con chữ hôm nay chúng em viết, mỗi bước tiến trên đường đời mai sau đều mang bóng dáng công ơn dạy dỗ ân cần của thầy cô. Cảm ơn thầy cô vì đã luôn kiên nhẫn ngay cả khi chúng em vụng về, bồng bột nhất.
  Kính chúc thầy cô một ngày 20/11 tràn ngập hoa tươi, nụ cười và ngập tràn hạnh phúc bên gia đình và các thế hệ học trò thân yêu! 🌹`,

  // Mẫu 3:
  `Có một nghề không trồng cây vào đất, nhưng lại nở cho đời muôn ngàn đóa hoa thơm. Đó chính là nghề dạy học cao quý của thầy cô.
  Cảm ơn thầy cô đã truyền cho chúng em ngọn lửa đam mê, dạy chúng em biết ước mơ và dám dấn bước trên con đường phía trước. Những lời răn dạy năm nào giờ đây là hành trang vô giá theo suốt cuộc đời chúng em.
  Nhân ngày 20/11, kính chúc thầy cô luôn dồi dào sức khỏe, giữ mãi ngọn lửa nhiệt huyết yêu nghề để tiếp tục dìu dắt thêm nhiều thế hệ mai sau! 🕯️✨`,

  // Mẫu 4:
  `Dẫu mai này đi khắp bốn phương trời, chúng em vẫn mãi khắc ghi lời thầy cô dạy bảo. Bụi phấn rơi vương trên mái tóc thầy cô là hạt giống tri thức gieo mầm vào tương lai của chúng em.
  Xin gửi ngàn lời tri ân sâu sắc nhất tới thầy cô trong ngày 20/11 ý nghĩa này. Chúc thầy cô luôn an vui, may mắn, dồi dào sức khỏe và luôn tự hào về những chuyến đò tri thức đã cập bến bình an! 💐`,

  // Mẫu 5:
  `🌺Cảm ơn thầy cô đã luôn thấu hiểu, lắng nghe và tiếp thêm cho chúng em niềm tin vào chính mình. Thầy cô không chỉ là người truyền trao tri thức, mà còn là người bạn lớn, người dẫn đường đáng tin cậy nhất.
  Kính chúc thầy cô luôn giữ trọn niềm vui trên bục giảng, mãi tươi trẻ, dồi dào năng lượng và gặt hái thật nhiều thành công trong sự nghiệp trồng người cao quý! 🏫💖`,

  // Mẫu 6: Lời chúc sâu sắc, tôn vinh sự tận tụy thầm lặng
  `Nhân ngày Nhà giáo Việt Nam 20/11, chúng em xin bày tỏ lòng biết ơn chân thành nhất! 🌟
  Cảm ơn thầy cô vì những đêm miệt mài bên trang giáo án, những ân cần chỉ bảo từng nét chữ, con số đầu đời. Những hy sinh thầm lặng ấy chính là nấc thang nâng bước ước mơ của chúng em bay cao, bay xa.
  Kính chúc thầy cô một ngày lễ thật ấm áp, ngập tràn lời chúc tốt đẹp và mãi là niềm tự hào của bao thế hệ học sinh! 🍃✨`
];

// ---- Lấy tên từ sessionStorage ----
const teacherName = sessionStorage.getItem('teacherName') || 'Thầy Cô';

// ---- Chọn lời chúc ngẫu nhiên  ----
const lastIdx = sessionStorage.getItem('lastMessageIdx');
let availableIndices = messages.map((_, i) => i);
if (lastIdx !== null && messages.length > 1) {
  availableIndices = availableIndices.filter(i => i !== parseInt(lastIdx, 10));
}
const chosenIdx = availableIndices[Math.floor(Math.random() * availableIndices.length)];
sessionStorage.setItem('lastMessageIdx', chosenIdx);

const rawMsg = messages[chosenIdx];
const fullMsg = rawMsg.replace(/{name}/g, teacherName);

// Biến điều khiển tốc độ typewriter khi nhấp chuột liên tục
let typeSpeed = 50; // tốc độ cơ bản (ms)
let isTypewriterFinished = false;
let finishTypingNow = null;

// ---- Hiển thị tiêu đề "Kính gửi..." ----
function animateTitle() {
  const el = document.getElementById('letterTo');
  const title = `✦ Kính gửi ${teacherName} ✦`;
  let i = 0;
  return new Promise(resolve => {
    function tick() {
      if (i < title.length) {
        el.textContent += title[i++];
        setTimeout(tick, 35);
      } else {
        setTimeout(resolve, 200);
      }
    }
    tick();
  });
}

// ---- Typewriter lời chúc có hỗ trợ tăng tốc / hoàn thành ngay ----
function typeMessage(text) {
  const el = document.getElementById('message');
  el.textContent = '';
  let i = 0;
  let timer = null;

  return new Promise(resolve => {
    function finishNow() {
      if (timer) clearTimeout(timer);
      el.textContent = text;
      el.classList.add('done');
      isTypewriterFinished = true;
      const box = document.querySelector('.letter-box');
      if (box) box.scrollTop = box.scrollHeight;
      spawnLineDust();
      resolve();
    }

    finishTypingNow = finishNow;

    function tick() {
      if (i < text.length) {
        el.textContent += text[i++];
        if (text[i - 1] === '\n') {
          spawnLineDust();
          // Tự động cuộn theo nét chữ khi văn bản dài
          const box = document.querySelector('.letter-box');
          if (box) box.scrollTop = box.scrollHeight;
        }

        // Tốc độ thay đổi linh hoạt theo typeSpeed
        const currentDelay = text[i - 1] === '\n' ? Math.min(typeSpeed * 3, 200) : typeSpeed;
        timer = setTimeout(tick, currentDelay);
      } else {
        el.classList.add('done');
        isTypewriterFinished = true;
        const box = document.querySelector('.letter-box');
        if (box) box.scrollTop = box.scrollHeight;
        resolve();
      }
    }
    tick();
  });
}

// Bắt sự kiện Click / Phím Space để TĂNG TỐC hoặc HIỂN THỊ HẾT NGAY
function handleSpeedUpOrComplete(e) {
  // Bỏ qua nếu click vào các nút bấm điều hướng
  if (e.target && e.target.closest && (e.target.closest('button') || e.target.closest('a'))) {
    return;
  }

  if (isTypewriterFinished) return;

  // Giảm delay xuống 10ms hoặc 2ms mỗi lần click
  if (typeSpeed > 15) {
    typeSpeed = 10;
    // Báo hiệu trực quan bằng hạt phấn nhỏ
    const clientX = e.clientX || window.innerWidth / 2;
    const clientY = e.clientY || window.innerHeight / 2;
    spawnDust(clientX, clientY, 6);
  } else if (typeSpeed > 2) {
    typeSpeed = 2;
    const clientX = e.clientX || window.innerWidth / 2;
    const clientY = e.clientY || window.innerHeight / 2;
    spawnDust(clientX, clientY, 10);
  } else {
    // Click thêm lần nữa khi đã ở max speed -> Hiện toàn bộ ngay lập tức!
    if (typeof finishTypingNow === 'function') {
      finishTypingNow();
    }
  }
}

document.addEventListener('click', handleSpeedUpOrComplete);
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.key === ' ') {
    handleSpeedUpOrComplete(e);
  }
});

// ---- Bụi phấn khi xuống dòng ----
function spawnLineDust() {
  const el = document.getElementById('message');
  if (!el) return;
  const rect = el.getBoundingClientRect();
  spawnDust(rect.left + Math.random() * rect.width, rect.bottom, 8);
}

// ---- Hiển thị nút sau khi xong ----
function showButtons() {
  const btns = document.getElementById('action-buttons');
  if (!btns) return;
  btns.classList.add('show');
  for (let i = 0; i < 4; i++) {
    setTimeout(() => celebrationDust(), i * 150);
  }
}

function celebrationDust() {
  const x = 100 + Math.random() * (window.innerWidth - 200);
  const y = 100 + Math.random() * (window.innerHeight - 200);
  spawnDust(x, y, 12);
}

// ---- Chalk Dust Particle ----
function spawnDust(x, y, count = 15) {
  const container = document.getElementById('dust-container');
  if (!container) return;
  const colors = [
    'rgba(248,250,252,', 'rgba(253,230,138,',
    'rgba(134,239,172,', 'rgba(226,232,240,'
  ];
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'chalk-dust';
    const size  = 2 + Math.random() * 4;
    const angle = Math.random() * 2 * Math.PI;
    const dist  = 20 + Math.random() * 60;
    const tx    = Math.cos(angle) * dist;
    const ty    = Math.sin(angle) * dist - 15;
    const dur   = 0.5 + Math.random() * 0.7;
    const col   = colors[Math.floor(Math.random() * colors.length)];

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

// ---- Điều hướng ----
function go(page) {
  const inner = document.querySelector('.board-inner');
  if (inner) {
    inner.style.transition = 'opacity 0.4s ease';
    inner.style.opacity = '0';
  }
  setTimeout(() => window.location.href = page, 400);
}

// ---- Chạy khi load ----
(async () => {
  await new Promise(r => setTimeout(r, 200));
  await animateTitle();
  await typeMessage(fullMsg);
  await new Promise(r => setTimeout(r, 200));
  showButtons();
})();
