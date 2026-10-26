console.log("%c⚠️ SYSTEM BREACH DETECTED: You found the source code! Harsh built this entire OS from scratch using pure HTML/CSS/Vanilla JS. If you're a recruiter, type 'hire' in the terminal.", 'background: #E50914; color: #ffffff; font-size: 18px; font-weight: 800; padding: 12px 18px; border-radius: 6px;');
console.log('Type ↑ ↑ ↓ ↓ ← → ← → B A for a surprise.');
document.addEventListener('DOMContentLoaded', () => {
  initLiveClock();
});
function initLiveClock() {
  const clockEl = document.getElementById('sys-clock');
  if (!clockEl) return;
  function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clockEl.textContent = `${hours}:${minutes}:${seconds}`;
  }
  updateClock();
  setInterval(updateClock, 1000);
}
document.addEventListener("DOMContentLoaded", () => {
    const gear = document.createElement('div');
    gear.id = 'settings-gear';
    gear.innerHTML = "⚙️";
    gear.setAttribute('role', 'button');
    gear.setAttribute('aria-label', 'Open settings');
    gear.style.cssText = "position:fixed; bottom:20px; left:20px; z-index:999999; width:50px; height:50px; background:#0B0F19; border:2px solid var(--netflix-red, #ff003c); border-radius:50%; display:flex; justify-content:center; align-items:center; font-size:24px; cursor:pointer; color:white; box-shadow: 0 0 15px rgba(255, 0, 60, 0.3); transition: transform 0.4s ease;";
    const settingsPanel = document.createElement('div');
    settingsPanel.style.cssText = "display:none; position:fixed; bottom:80px; left:20px; z-index:999999; width:250px; background:#0B0F19; border:1px solid var(--netflix-red, #ff003c); border-radius:12px; padding:20px; color:white; flex-direction:column; gap:15px; box-shadow: 0 10px 30px rgba(0,0,0,0.8);";
    settingsPanel.innerHTML = `<h3 style="margin:0; color:var(--netflix-red, #ff003c);">Settings</h3><button id="toggle-theme" style="padding:10px; background:#1a1a1a; border:1px solid #333; color:white; cursor:pointer; border-radius:5px;">Toggle Light/Dark</button><button id="reset-theme" style="padding:10px; background:#1a1a1a; border:1px solid #333; color:white; cursor:pointer; border-radius:5px;">Reset Theme</button><button id="theme-vercel" type="button" class="settings-theme-btn">Vercel Dark</button><button id="theme-cyberpunk" type="button" class="settings-theme-btn">Cyberpunk</button><button id="theme-dracula" type="button" class="settings-theme-btn">Dracula</button><div><label style="font-size:0.8rem; display:block; margin-bottom:5px;">Accent Color</label><input type="color" id="accent-color" value="#E50914" style="width:100%; cursor:pointer;"></div>`;
    const gearStyle = document.createElement('style');
    gearStyle.textContent = '.rotated { transform: rotate(180deg); }';
    document.head.appendChild(gearStyle);
    document.body.appendChild(gear);
    document.body.appendChild(settingsPanel);
    document.addEventListener('click', (event) => {
      if (!settingsPanel.contains(event.target) && !gear.contains(event.target)) {
        settingsPanel.style.display = 'none';
        gear.classList.remove('rotated');
      }
    });
    gear.onclick = () => {
      settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'flex' : 'none';
      gear.classList.toggle('rotated');
    };
    document.getElementById('toggle-theme').onclick = () => {
      document.body.classList.toggle('light-mode');
      document.body.style.filter = document.body.classList.contains('light-mode') ? "invert(1) hue-rotate(180deg)" : "none";
    };
    const resetThemeBtn = document.getElementById('reset-theme');
    resetThemeBtn.onclick = () => {
      localStorage.clear();
      document.documentElement.style.setProperty('--netflix-red', '#E50914');
      document.documentElement.style.setProperty('--accent', '#E50914');
      document.documentElement.style.setProperty('--bg', '#141414');
      document.documentElement.style.setProperty('--bg-netflix', '#141414');
      document.body.classList.remove('light-mode');
      document.body.style.filter = 'none';
      document.getElementById('accent-color').value = '#E50914';
    };
    function applyThemePreset(accent, background) {
      document.documentElement.style.setProperty('--netflix-red', accent);
      document.documentElement.style.setProperty('--accent', accent);
      document.documentElement.style.setProperty('--bg', background);
      document.documentElement.style.setProperty('--bg-netflix', background);
      document.body.classList.remove('light-mode');
      document.body.style.filter = 'none';
      document.getElementById('accent-color').value = accent;
    }
    document.getElementById('theme-vercel').onclick = () => applyThemePreset('#ffffff', '#000000');
    document.getElementById('theme-cyberpunk').onclick = () => applyThemePreset('#00f3ff', '#050505');
    document.getElementById('theme-dracula').onclick = () => applyThemePreset('#bd93f9', '#282a36');
    document.getElementById('accent-color').oninput = (event) => {
      document.documentElement.style.setProperty('--netflix-red', event.target.value);
      document.documentElement.style.setProperty('--accent', event.target.value);
    };
});





/* Interactive portfolio features */
function playBeep(freq) {
  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextConstructor) return;

  try {
    const context = new AudioContextConstructor();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(freq, context.currentTime);
    gain.gain.setValueAtTime(0.05, context.currentTime);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.onended = () => context.close();
    oscillator.start();
    oscillator.stop(context.currentTime + 0.1);
  } catch (error) {
    // Audio is optional; keep the rest of the interface working when unavailable.
  }
}

function initCommandPalette() {
  const palette = document.getElementById('cmd-palette');
  const input = document.getElementById('cmd-input');
  const results = document.getElementById('cmd-results');
  if (!palette || !input || !results) return;

  const commands = [
    { name: 'Home', run: () => { window.location.href = 'index.html'; } },
    { name: 'Projects', run: () => { window.location.href = 'projects.html'; } },
    { name: 'Arcade', run: () => { window.location.href = 'arcade.html'; } },
    { name: 'Socials', run: () => { window.location.href = 'socials.html'; } },
    { name: 'GitHub', run: () => { window.open('https://github.com/sussysniper', '_blank', 'noopener,noreferrer'); } },
    { name: 'Toggle Theme', run: () => {
      const themeButton = document.getElementById('toggle-theme');
      if (themeButton) themeButton.click();
      else {
        document.body.classList.toggle('light-mode');
        document.body.style.filter = document.body.classList.contains('light-mode') ? 'invert(1) hue-rotate(180deg)' : 'none';
      }
    } }
  ];
  let filteredCommands = commands;
  let selectedIndex = 0;

  function closePalette() {
    palette.hidden = true;
    input.value = '';
    renderResults();
  }

  function runCommand(command) {
    if (!command) return;
    closePalette();
    command.run();
  }

  function renderResults() {
    const query = input.value.trim().toLowerCase();
    filteredCommands = commands.filter((command) => command.name.toLowerCase().includes(query));
    selectedIndex = Math.min(selectedIndex, Math.max(0, filteredCommands.length - 1));
    results.replaceChildren();

    filteredCommands.forEach((command, index) => {
      const item = document.createElement('li');
      item.className = 'cmd-result-item';
      item.setAttribute('role', 'option');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'cmd-result-button';
      button.textContent = command.name;
      button.setAttribute('aria-selected', String(index === selectedIndex));
      button.addEventListener('click', () => runCommand(command));
      item.appendChild(button);
      results.appendChild(item);
    });
  }

  document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      palette.hidden = false;
      renderResults();
      input.focus();
    } else if (!palette.hidden && event.key === 'Escape') {
      closePalette();
    }
  });

  input.addEventListener('input', () => {
    selectedIndex = 0;
    renderResults();
  });
  input.addEventListener('keydown', (event) => {
    if (!filteredCommands.length) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      selectedIndex = (selectedIndex + 1) % filteredCommands.length;
      renderResults();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      selectedIndex = (selectedIndex - 1 + filteredCommands.length) % filteredCommands.length;
      renderResults();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      runCommand(filteredCommands[selectedIndex]);
    }
  });
  palette.addEventListener('click', (event) => {
    if (event.target === palette) closePalette();
  });
  renderResults();
}

function initInteractiveTerminal() {
  const form = document.getElementById('term-form');
  const input = document.getElementById('term-input');
  const output = document.getElementById('term-output');
  if (!form || !input || !output) return;

  function printLine(text) {
    const line = document.createElement('div');
    line.className = 'term-line';
    line.textContent = text;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    playBeep(800);
    const command = input.value.trim().toLowerCase();
    if (!command) return;
    printLine(`visitor@hs-os:~$ ${command}`);
    const responses = {
      help: 'Commands: help, about, projects, skills, clear, whoami',
      about: 'Harsh Sharma - CS @ BITS Pilani',
      whoami: 'Harsh Sharma - CS @ BITS Pilani',
      skills: 'C++, Python, React, Scikit-Learn, POSIX',
      projects: 'NeuralFlood (Kaggle), Synapse (RAG), Chronos (Make), Omni (Tool)',
      matrix: 'Matrix mode toggled.',
      hire: "Initiating recruitment protocol... Loading Harsh Sharma's resume... Contact: harsh.sharma80027090@gmail.com",
      sudo: 'Nice try. Permission denied. You cannot delete a masterpiece.',
      'rm -rf /': 'Nice try. Permission denied. You cannot delete a masterpiece.',
      coffee: "ERROR 418: I'm a teapot. No coffee found."
    };
    if (command === 'clear') {
      output.replaceChildren();
    } else {
      printLine(responses[command] || 'Command not found.');
      if (command === 'help') {
        printLine('Secret: Try the Konami Code (↑ ↑ ↓ ↓ ← → ← → B A)');
      }
      if (command === 'matrix') {
        document.body.classList.toggle('matrix-mode');
      }
    }
    input.value = '';
    output.scrollTop = output.scrollHeight;
  });
  input.addEventListener('click', () => playBeep(800));
}

function initProjectCardTilt() {
  document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      const bounds = card.getBoundingClientRect();
      const relativeX = (event.clientX - bounds.left) / bounds.width;
      const relativeY = (event.clientY - bounds.top) / bounds.height;
      const rotateY = (relativeX - 0.5) * 20;
      const rotateX = (0.5 - relativeY) * 20;
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
  });
}

document.addEventListener('click', (event) => {
  if (event.target.closest('button')) playBeep(800);
});

document.addEventListener('DOMContentLoaded', () => {
  initCommandPalette();
  initInteractiveTerminal();
  initProjectCardTilt();
});

function initScrollProgress() {
  let bar = document.getElementById('scroll-bar');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'scroll-bar';
    bar.setAttribute('aria-hidden', 'true');
    document.body.insertBefore(bar, document.body.firstChild);
  }
  let updatePending = false;
  function update() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    bar.style.width = `${Math.min(100, Math.max(0, percent))}%`;
    updatePending = false;
  }
  window.addEventListener('scroll', () => {
    if (!updatePending) {
      window.requestAnimationFrame(update);
      updatePending = true;
    }
  }, { passive: true });
  update();
}

function initKonamiCode() {
  const sequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let position = 0;
  document.addEventListener('keydown', (event) => {
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    position = key === sequence[position] ? position + 1 : (key === sequence[0] ? 1 : 0);
    if (position === sequence.length) {
      document.body.classList.toggle('matrix-mode');
      position = 0;
    }
  });
}

function initParticleBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const context = canvas.getContext('2d');
  if (!context) return;
  const particles = [];
  const pointer = { x: -1000, y: -1000 };
  const maxDistance = 135;
  let width = 0;
  let height = 0;
  let frameId = 0;

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = Math.min(110, Math.max(32, Math.floor((width * height) / 14000)));
    particles.length = 0;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: 1.2 + Math.random() * 1.8
      });
    }
  }

  function accentRgb() {
    const value = getComputedStyle(document.documentElement).getPropertyValue('--netflix-red').trim();
    const hex = value.match(/^#([0-9a-f]{6})$/i);
    if (!hex) return '229, 9, 20';
    const number = parseInt(hex[1], 16);
    return `${(number >> 16) & 255}, ${(number >> 8) & 255}, ${number & 255}`;
  }

  function animate() {
    context.clearRect(0, 0, width, height);
    const rgb = accentRgb();
    particles.forEach((particle, index) => {
      const dx = particle.x - pointer.x;
      const dy = particle.y - pointer.y;
      const distanceToPointer = Math.hypot(dx, dy);
      if (distanceToPointer < 115 && distanceToPointer > 0) {
        const force = (115 - distanceToPointer) / 115 * 0.75;
        particle.vx += (dx / distanceToPointer) * force;
        particle.vy += (dy / distanceToPointer) * force;
      }
      particle.vx *= 0.985;
      particle.vy *= 0.985;
      particle.x += particle.vx;
      particle.y += particle.vy;
      if (particle.x < 0 || particle.x > width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > height) particle.vy *= -1;
      particle.x = Math.max(0, Math.min(width, particle.x));
      particle.y = Math.max(0, Math.min(height, particle.y));

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fillStyle = `rgba(${rgb}, 0.8)`;
      context.shadowColor = `rgba(${rgb}, 0.8)`;
      context.shadowBlur = 12;
      context.fill();
      context.shadowBlur = 0;

      for (let next = index + 1; next < particles.length; next++) {
        const other = particles[next];
        const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
        if (distance < maxDistance) {
          context.beginPath();
          context.moveTo(particle.x, particle.y);
          context.lineTo(other.x, other.y);
          context.strokeStyle = `rgba(${rgb}, ${(1 - distance / maxDistance) * 0.22})`;
          context.lineWidth = 0.7;
          context.stroke();
        }
      }
    });
    frameId = window.requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('pointermove', (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
  }, { passive: true });
  window.addEventListener('blur', () => { pointer.x = -1000; pointer.y = -1000; });
  resize();
  if (frameId) window.cancelAnimationFrame(frameId);
  animate();
}

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initKonamiCode();
  initParticleBackground();
});







