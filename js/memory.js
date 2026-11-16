// ============================================================
// memory.js — Canvas vẽ tay & Tải ảnh trang trí: Sổ Ký Ức Ô Ly
// ============================================================

const canvas  = document.getElementById('notebookCanvas');
const ctx     = canvas.getContext('2d');
const wrap    = document.querySelector('.notebook-page-wrap');

// Mảng chứa các ảnh đã chèn để vẽ lại cùng nền và nét vẽ
let placedImages = [];

// ---- Resize canvas cho vừa container ----
function resizeCanvas() {
  const rect = wrap.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return;

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  if (canvas.width > 0) {
    tempCanvas.getContext('2d').drawImage(canvas, 0, 0);
  }

  canvas.width  = rect.width;
  canvas.height = rect.height;

  drawNotebookBg();

  // Vẽ lại toàn bộ ảnh trang trí
  redrawImages();

  if (tempCanvas.width > 0) {
    ctx.drawImage(tempCanvas, 0, 0);
  }
}

// ---- Vẽ nền ô ly ----
function drawNotebookBg() {
  const W = canvas.width, H = canvas.height;

  // Nền trắng giấy
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);

  const lineH = 32;   // Khoảng cách dòng kẻ
  const marginX = 50; // Vạch đỏ lề

  // Kẻ ngang ô ly (xanh nhạt)
  ctx.strokeStyle = '#bfdbfe';
  ctx.lineWidth = 1;
  for (let y = lineH; y < H; y += lineH) {
    ctx.beginPath();
    ctx.moveTo(0, y); ctx.lineTo(W, y);
    ctx.stroke();
  }

  // Vạch đỏ dọc lề trang
  ctx.strokeStyle = '#fca5a5';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(marginX, 0); ctx.lineTo(marginX, H);
  ctx.stroke();

  // Số dòng mờ bên lề
  ctx.font = '11px Quicksand, sans-serif';
  ctx.fillStyle = 'rgba(100,116,139,0.3)';
  ctx.textAlign = 'right';
  for (let i = 1; i * lineH < H; i++) {
    ctx.fillText(i, marginX - 6, i * lineH - 6);
  }
  ctx.textAlign = 'left';

  // Dòng chữ watermark mờ trang trọng
  ctx.font = 'italic 13px Quicksand, sans-serif';
  ctx.fillStyle = 'rgba(100,116,139,0.25)';
  ctx.fillText('Tri ân Ngày Nhà Giáo Việt Nam 20/11 ✦ Nét chữ tri ân người lái đò', marginX + 12, lineH - 8);
}

// Vẽ lại danh sách ảnh đã chèn
function redrawImages() {
  placedImages.forEach(item => {
    ctx.save();
    // Khung ảnh Polaroid nhẹ
    ctx.shadowColor = 'rgba(0,0,0,0.15)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 3;

    // Viền trắng ảnh
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(item.x - 5, item.y - 5, item.w + 10, item.h + 10);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.strokeRect(item.x - 5, item.y - 5, item.w + 10, item.h + 10);

    ctx.restore();
    ctx.drawImage(item.img, item.x, item.y, item.w, item.h);
  });
}

// ---- Chức năng thêm ảnh trang trí ----
function addImageToCanvas(file) {
  if (!file || !file.type.startsWith('image/')) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      // Tính toán kích thước ảnh hợp lý (tối đa 220px chiều rộng/cao)
      const maxDim = 200;
      let w = img.width;
      let h = img.height;
      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }

      // Đặt ảnh vào vị trí ngẫu nhiên hoặc góc phải trên của trang
      const x = Math.min(canvas.width - w - 40, Math.max(70, Math.floor(Math.random() * (canvas.width - w - 80))));
      const y = Math.min(canvas.height - h - 40, Math.max(40, Math.floor(Math.random() * (canvas.height - h - 80))));

      placedImages.push({ img, x, y, w, h });

      // Vẽ ngay ảnh lên canvas
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.15)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 3;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x - 5, y - 5, w + 10, h + 10);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.strokeRect(x - 5, y - 5, w + 10, h + 10);
      ctx.restore();

      ctx.drawImage(img, x, y, w, h);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// Bắt sự kiện chọn file từ input
const imageUpload = document.getElementById('imageUpload');
if (imageUpload) {
  imageUpload.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      addImageToCanvas(e.target.files[0]);
    }
  });
}

// Hỗ trợ kéo thả ảnh (Drag and Drop) trực tiếp vào trang sổ
wrap.addEventListener('dragover', (e) => {
  e.preventDefault();
  wrap.style.boxShadow = '0 0 15px rgba(253,230,138,0.7)';
});

wrap.addEventListener('dragleave', (e) => {
  e.preventDefault();
  wrap.style.boxShadow = '';
});

wrap.addEventListener('drop', (e) => {
  e.preventDefault();
  wrap.style.boxShadow = '';
  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
    addImageToCanvas(e.dataTransfer.files[0]);
  }
});

// ---- Trạng thái vẽ tay ----
let isDrawing  = false;
let isErasing  = false;
let color      = '#1e293b';
let brushSize  = 3;
let lastX = 0, lastY = 0;

function getPos(e) {
  const rect = canvas.getBoundingClientRect();
  if (e.touches && e.touches.length > 0) {
    return {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top
    };
  }
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

function startDraw(e) {
  e.preventDefault();
  isDrawing = true;
  const { x, y } = getPos(e);
  [lastX, lastY] = [x, y];

  ctx.beginPath();
  ctx.arc(x, y, (isErasing ? brushSize * 3 : brushSize) / 2, 0, Math.PI * 2);
  ctx.fillStyle = isErasing ? '#ffffff' : color;
  ctx.fill();
}

function draw(e) {
  if (!isDrawing) return;
  e.preventDefault();
  const { x, y } = getPos(e);

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.strokeStyle = isErasing ? '#ffffff' : color;
  ctx.lineWidth   = isErasing ? brushSize * 3 : brushSize;
  ctx.lineCap     = 'round';
  ctx.lineJoin    = 'round';
  ctx.stroke();

  [lastX, lastY] = [x, y];
}

function stopDraw() { isDrawing = false; }

// Mouse events
canvas.addEventListener('mousedown',  startDraw);
canvas.addEventListener('mousemove',  draw);
canvas.addEventListener('mouseup',    stopDraw);
canvas.addEventListener('mouseleave', stopDraw);

// Touch events
canvas.addEventListener('touchstart',  startDraw, { passive: false });
canvas.addEventListener('touchmove',   draw,       { passive: false });
canvas.addEventListener('touchend',    stopDraw);

// ---- Color palette ----
document.getElementById('colorPalette').addEventListener('click', e => {
  const btn = e.target.closest('.color-btn');
  if (!btn) return;
  document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  color = btn.dataset.color;
  isErasing = false;
  document.getElementById('eraseBtn').style.borderColor = '';
  document.getElementById('eraseBtn').style.color = '';
});

// ---- Brush size ----
const brushSlider = document.getElementById('brushSize');
const brushLabel  = document.getElementById('brushSizeLabel');
brushSlider.addEventListener('input', () => {
  brushSize = +brushSlider.value;
  brushLabel.textContent = brushSize + 'px';
});

// ---- Erase toggle ----
const eraseBtn = document.getElementById('eraseBtn');
eraseBtn.addEventListener('click', () => {
  isErasing = !isErasing;
  eraseBtn.style.borderColor = isErasing ? '#93c5fd' : '';
  eraseBtn.style.color       = isErasing ? '#93c5fd' : '';
  canvas.style.cursor        = isErasing ? 'cell' : 'crosshair';
});

// ---- Clear ----
document.getElementById('clearBtn').addEventListener('click', () => {
  placedImages = [];
  drawNotebookBg();
});

// ---- Save PNG ----
document.getElementById('saveBtn').addEventListener('click', () => {
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width  = canvas.width;
  tempCanvas.height = canvas.height;
  const tCtx = tempCanvas.getContext('2d');

  tCtx.drawImage(canvas, 0, 0);

  // Watermark góc dưới
  tCtx.font = '13px Quicksand, sans-serif';
  tCtx.fillStyle = 'rgba(100,116,139,0.5)';
  tCtx.textAlign = 'right';
  tCtx.fillText('🌹 Ngày Nhà Giáo VN 20/11 — Lưu Bút Kỷ Niệm', tempCanvas.width - 15, tempCanvas.height - 12);

  const link = document.createElement('a');
  link.download = 'luu-but-tri-an-20-11.png';
  link.href = tempCanvas.toDataURL('image/png');
  link.click();
});

// ---- Khởi chạy ----
window.addEventListener('resize', resizeCanvas);
// Chờ layout ổn định để đo kích thước chuẩn
setTimeout(resizeCanvas, 100);
