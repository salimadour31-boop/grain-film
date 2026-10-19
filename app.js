const canvas = document.getElementById('preview');
const ctx = canvas.getContext('2d');
const intensityInput = document.getElementById('intensity');
const sizeInput = document.getElementById('size');
const tintInput = document.getElementById('tint');
const speedInput = document.getElementById('speed');
const bgFile = document.getElementById('bg-file');
const clearBgBtn = document.getElementById('clear-bg');
const exportBtn = document.getElementById('export-png');

let bgImage = null;
let animId = null;
let time = 0;

function resizeCanvas() {
  const container = canvas.parentElement;
  const maxW = Math.min(800, container.clientWidth || 800);
  canvas.width = maxW;
  canvas.height = Math.round(maxW * 9 / 16);
}

function drawGrain() {
  const w = canvas.width;
  const h = canvas.height;
  const intensity = parseFloat(intensityInput.value);
  const size = parseInt(sizeInput.value, 10);
  const tint = tintInput.value;
  const speed = parseFloat(speedInput.value);

  // Clear
  ctx.clearRect(0, 0, w, h);

  // Background
  if (bgImage) {
    ctx.drawImage(bgImage, 0, 0, w, h);
  } else {
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, w, h);
  }

  // Grain overlay
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;
  const seed = Math.floor(time * speed * 10);

  for (let y = 0; y < h; y += size) {
    for (let x = 0; x < w; x += size) {
      // Simple pseudo-random based on position + seed
      const rnd = ((x * 374761393 + y * 668265263 + seed) % 2147483647) / 2147483647;
      const noise = (rnd - 0.5) * intensity * 255;

      // Apply to block
      for (let dy = 0; dy < size && y + dy < h; dy++) {
        for (let dx = 0; dx < size && x + dx < w; dx++) {
          const i = ((y + dy) * w + (x + dx)) * 4;
          // Tint influence
          const r = parseInt(tint.slice(1, 3), 16);
          const g = parseInt(tint.slice(3, 5), 16);
          const b = parseInt(tint.slice(5, 7), 16);
          const factor = noise / 255;
          data[i] = Math.max(0, Math.min(255, data[i] + factor * r));
          data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + factor * g));
          data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + factor * b));
          // Alpha stays
        }
      }
    }
  }
  ctx.putImageData(imageData, 0, 0);

  if (speed > 0) {
    time += 0.016;
    animId = requestAnimationFrame(drawGrain);
  }
}

function startAnim() {
  if (animId) cancelAnimationFrame(animId);
  time = 0;
  drawGrain();
}

intensityInput.addEventListener('input', startAnim);
sizeInput.addEventListener('input', startAnim);
tintInput.addEventListener('input', startAnim);
speedInput.addEventListener('input', startAnim);

bgFile.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const img = new Image();
  img.onload = () => {
    bgImage = img;
    startAnim();
  };
  img.src = URL.createObjectURL(file);
});

clearBgBtn.addEventListener('click', () => {
  bgImage = null;
  bgFile.value = '';
  startAnim();
});

exportBtn.addEventListener('click', () => {
  // Pause anim for clean export
  if (animId) cancelAnimationFrame(animId);
  drawGrain(); // one frame
  canvas.toBlob((blob) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'grain-film.png';
    a.click();
    URL.revokeObjectURL(a.href);
    if (parseFloat(speedInput.value) > 0) startAnim();
  });
});

window.addEventListener('resize', () => {
  resizeCanvas();
  startAnim();
});

resizeCanvas();
startAnim();
