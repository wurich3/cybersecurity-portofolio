// ── CLOCK ──
function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent =
    now.toLocaleTimeString('en-US', { hour12: false });
}
updateClock();
setInterval(updateClock, 1000);

// ── WINDOW MANAGEMENT ──
let zTop = 50;

function focusWin(id) {
  document.querySelectorAll('.win').forEach(w => w.classList.remove('focused'));
  const win = document.getElementById(id);
  win.style.zIndex = ++zTop;
  win.classList.add('focused');
  // sync taskbar active state
  const key = id.replace('win-', 'tb-');
  document.querySelectorAll('.tb-icon').forEach(b => b.classList.remove('active'));
  const tb = document.getElementById(key);
  if (tb) tb.classList.add('active');
}

function openWin(id) {
  const win = document.getElementById(id);
  win.classList.add('visible');
  focusWin(id);
}

function closeWin(id) {
  const win = document.getElementById(id);
  win.classList.remove('visible', 'focused');
  const key = id.replace('win-', 'tb-');
  const tb = document.getElementById(key);
  if (tb) tb.classList.remove('active');
}

function toggleWin(id) {
  const win = document.getElementById(id);
  if (win.classList.contains('visible')) {
    if (win.classList.contains('focused')) {
      closeWin(id);
    } else {
      focusWin(id);
    }
  } else {
    openWin(id);
  }
}

// click anywhere on a window to bring it to focus
document.querySelectorAll('.win').forEach(win => {
  win.addEventListener('mousedown', () => focusWin(win.id));
});

// ── DRAGGING ──
document.querySelectorAll('.win-title').forEach(titlebar => {
  let dragging = false, startX, startY, origLeft, origTop;
  const winEl = () => titlebar.closest('.win');

  titlebar.addEventListener('mousedown', e => {
    if (e.target.classList.contains('win-dot')) return;
    dragging = true;
    const win = winEl();
    const rect = win.getBoundingClientRect();
    startX = e.clientX;
    startY = e.clientY;
    origLeft = rect.left;
    origTop  = rect.top;
    focusWin(win.id);
    e.preventDefault();
  });

  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const win = winEl();
    win.style.left = (origLeft + dx) + 'px';
    win.style.top  = (origTop  + dy) + 'px';
  });

  document.addEventListener('mouseup', () => { dragging = false; });
});

// open the About window by default
setTimeout(() => openWin('win-about'), 400);
