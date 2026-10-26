document.addEventListener('DOMContentLoaded', () => {
  const containerEl = document.getElementById('arcade-game-container');
  const maxBtn = document.getElementById('game-maximize-btn');
  const minBtn = document.getElementById('game-minimize-btn');
  const resetBtn = document.getElementById('game-reset-btn');
  const gameTitleEl = document.getElementById('arcade-game-title');
  const statusEl = document.getElementById('arcade-status');
  const tabBtns = document.querySelectorAll('.game-tab-btn');
  let activeGame = 'snake';
  function enterMaximizedMode() {
    if (!containerEl) return;
    containerEl.classList.add('maximized');
    if (maxBtn) maxBtn.style.display = 'none';
    if (minBtn) minBtn.style.display = 'inline-block';
    document.body.style.overflow = 'hidden';
  }
  function exitMaximizedMode() {
    if (!containerEl) return;
    containerEl.classList.remove('maximized');
    if (maxBtn) maxBtn.style.display = 'inline-block';
    if (minBtn) minBtn.style.display = 'none';
    document.body.style.overflow = '';
  }
  if (maxBtn) maxBtn.addEventListener('click', enterMaximizedMode);
  if (minBtn) minBtn.addEventListener('click', exitMaximizedMode);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && containerEl && containerEl.classList.contains('maximized')) {
      exitMaximizedMode();
    }
  });
  if (containerEl) {
    containerEl.addEventListener('mouseenter', () => {
      containerEl.style.cursor = 'none';
    });
    containerEl.addEventListener('mouseleave', () => {
      containerEl.style.cursor = 'default';
    });
  }
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedGame = btn.getAttribute('data-game');
      if (selectedGame === activeGame) return;
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.game-view').forEach(v => v.style.display = 'none');
      const targetView = document.getElementById(`view-${selectedGame}`);
      if (targetView) targetView.style.display = selectedGame === 'rpg' ? 'flex' : 'block';
      activeGame = selectedGame;
      if (activeGame === 'snake') {
        initSnake();
        if (resetBtn) resetBtn.textContent = 'Start Game';
      } else {
        startActiveGame();
      }
    });
  });
  function startActiveGame() {
    if (activeGame === 'snake') {
      initSnake(true);
    } else if (activeGame === 'ttt') {
      initTicTacToe();
    } else if (activeGame === 'rpg') {
      initTextRPG();
    } else if (activeGame === 'pong') {
      initPong();
    } else if (activeGame === 'minesweeper') {
      initMinesweeper();
    }
  }
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      startActiveGame();
      resetBtn.textContent = 'Restart';
    });
  }
  let snakeInterval = null;
  function initSnake(startImmediately = false) {
    if (snakeInterval) clearInterval(snakeInterval);
    if (pongAnimId) cancelAnimationFrame(pongAnimId);
    const canvas = document.getElementById('snake-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const gridSize = 20;
    const cols = canvas.width / gridSize;
    const rows = canvas.height / gridSize;
    let snake = [
      { x: Math.floor(cols / 2), y: Math.floor(rows / 2) },
      { x: Math.floor(cols / 2) - 1, y: Math.floor(rows / 2) },
      { x: Math.floor(cols / 2) - 2, y: Math.floor(rows / 2) }
    ];
    let dir = { x: 1, y: 0 };
    let nextDir = { x: 1, y: 0 };
    let food = spawnFood();
    let score = 0;
    let highScore = parseInt(localStorage.getItem('hs_snake_high') || '0', 10);
    let gameOver = false;
    let snakeStarted = false;
    updateSnakeHeader();
    function updateSnakeHeader() {
      if (gameTitleEl) {
        gameTitleEl.innerHTML = `GAME: <span style="color: var(--netflix-red); font-weight: 700;">SNAKE</span> <span style="margin: 0 0.5rem; color: var(--fb-border);">|</span> <span id="arcade-status">Score: ${score} | High: ${highScore}</span>`;
      }
    }
    function spawnFood() {
      let newFood;
      while (true) {
        newFood = {
          x: Math.floor(Math.random() * cols),
          y: Math.floor(Math.random() * rows)
        };
        const collides = snake.some(seg => seg.x === newFood.x && seg.y === newFood.y);
        if (!collides) break;
      }
      return newFood;
    }
    function startSnake() {
      if (snakeStarted || gameOver) return;
      snakeStarted = true;
      if (resetBtn) resetBtn.textContent = 'Restart';
      snakeInterval = setInterval(gameLoop, 100);
    }
    function handleKey(e) {
      if (activeGame !== 'snake') return;
      if (['ArrowUp', 'KeyW'].includes(e.code) && dir.y === 0) {
        e.preventDefault();
        nextDir = { x: 0, y: -1 };
      } else if (['ArrowDown', 'KeyS'].includes(e.code) && dir.y === 0) {
        e.preventDefault();
        nextDir = { x: 0, y: 1 };
      } else if (['ArrowLeft', 'KeyA'].includes(e.code) && dir.x === 0) {
        e.preventDefault();
        nextDir = { x: -1, y: 0 };
      } else if (['ArrowRight', 'KeyD'].includes(e.code) && dir.x === 0) {
        e.preventDefault();
        nextDir = { x: 1, y: 0 };
      } else if (e.code === 'Space' && gameOver) {
        e.preventDefault();
        initSnake(true);
        return;
      }
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(e.code)) {
        startSnake();
      }
    }
    window.removeEventListener('keydown', window._snakeHandler);
    window._snakeHandler = handleKey;
    window.addEventListener('keydown', window._snakeHandler);
    function gameLoop() {
      if (gameOver) return;
      dir = nextDir;
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
      if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
        endGame();
        return;
      }
      if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {
        endGame();
        return;
      }
      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) {
        score += 10;
        if (score > highScore) {
          highScore = score;
          localStorage.setItem('hs_snake_high', highScore);
        }
        updateSnakeHeader();
        food = spawnFood();
      } else {
        snake.pop();
      }
      render();
    }
    function endGame() {
      gameOver = true;
      clearInterval(snakeInterval);
      ctx.fillStyle = 'rgba(20, 20, 20, 0.88)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 26px Space Grotesk, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 10);
      ctx.fillStyle = '#E50914';
      ctx.font = '600 15px Plus Jakarta Sans, sans-serif';
      ctx.fillText(`Final Score: ${score}  |  Press Space or Restart to Replay`, canvas.width / 2, canvas.height / 2 + 25);
    }
    function render() {
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.lineWidth = 1;
      for (let c = 0; c <= cols; c++) {
        ctx.beginPath();
        ctx.moveTo(c * gridSize, 0);
        ctx.lineTo(c * gridSize, canvas.height);
        ctx.stroke();
      }
      for (let r = 0; r <= rows; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r * gridSize);
        ctx.lineTo(canvas.width, r * gridSize);
        ctx.stroke();
      }
      ctx.fillStyle = '#E50914';
      ctx.shadowColor = '#E50914';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(food.x * gridSize + gridSize / 2, food.y * gridSize + gridSize / 2, gridSize / 2 - 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      snake.forEach((seg, index) => {
        if (index === 0) {
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = 8;
        } else {
          ctx.fillStyle = '#ff4b55';
          ctx.shadowBlur = 0;
        }
        ctx.fillRect(seg.x * gridSize + 1, seg.y * gridSize + 1, gridSize - 2, gridSize - 2);
      });
      ctx.shadowBlur = 0;
    }
    render();
    if (startImmediately) startSnake();
  }
  function initTicTacToe() {
    if (snakeInterval) clearInterval(snakeInterval);
    if (pongAnimId) cancelAnimationFrame(pongAnimId);
    const boardEl = document.getElementById('ttt-board');
    const msgEl = document.getElementById('ttt-message');
    const diffSelect = document.getElementById('ttt-diff-select');
    if (!boardEl) return;
    if (gameTitleEl) {
      gameTitleEl.innerHTML = `GAME: <span style="color: var(--netflix-red); font-weight: 700;">TIC-TAC-TOE</span> <span style="margin: 0 0.5rem; color: var(--fb-border);">|</span> <span id="arcade-status">Human (X) vs AI (O)</span>`;
    }
    let board = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    const HUMAN = 'X';
    const AI = 'O';
    const WIN_COMBOS = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    function renderBoard() {
      boardEl.innerHTML = '';
      board.forEach((val, idx) => {
        const cell = document.createElement('div');
        cell.className = 'ttt-cell';
        cell.textContent = val;
        if (val === HUMAN) cell.classList.add('x-mark');
        if (val === AI) cell.classList.add('o-mark');
        cell.addEventListener('click', () => handleCellClick(idx));
        boardEl.appendChild(cell);
      });
    }
    function handleCellClick(idx) {
      if (board[idx] !== '' || !gameActive) return;
      board[idx] = HUMAN;
      renderBoard();
      if (checkWin(board, HUMAN)) {
        if (msgEl) msgEl.textContent = "Victory: Player (X) Defeated AI!";
        gameActive = false;
        return;
      }
      if (isFull(board)) {
        if (msgEl) msgEl.textContent = "State Draw: Equilibrium";
        gameActive = false;
        return;
      }
      gameActive = false;
      if (msgEl) msgEl.textContent = "AI Calculating Strategy...";
      setTimeout(() => {
        makeAIMove();
        renderBoard();
        if (checkWin(board, AI)) {
          if (msgEl) msgEl.textContent = "AI (O) Victory!";
          gameActive = false;
          return;
        }
        if (isFull(board)) {
          if (msgEl) msgEl.textContent = "State Draw: Equilibrium";
          gameActive = false;
          return;
        }
        gameActive = true;
        if (msgEl) msgEl.textContent = "Player (X) Turn";
      }, 260);
    }
    function makeAIMove() {
      const diff = diffSelect ? diffSelect.value : 'hard';
      let move;
      if (diff === 'easy') {
        move = getRandomMove();
      } else if (diff === 'medium') {
        move = Math.random() > 0.4 ? getMinimaxMove() : getRandomMove();
      } else {
        move = getMinimaxMove();
      }
      if (move !== undefined && move !== null) {
        board[move] = AI;
      }
    }
    function getRandomMove() {
      const avail = board.map((v, i) => v === '' ? i : null).filter(v => v !== null);
      return avail[Math.floor(Math.random() * avail.length)];
    }
    function getMinimaxMove() {
      let bestScore = -Infinity;
      let bestMove = null;
      for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
          board[i] = AI;
          let score = minimax(board, 0, false);
          board[i] = '';
          if (score > bestScore) {
            bestScore = score;
            bestMove = i;
          }
        }
      }
      return bestMove !== null ? bestMove : getRandomMove();
    }
    function minimax(currBoard, depth, isMaximizing) {
      if (checkWin(currBoard, AI)) return 10 - depth;
      if (checkWin(currBoard, HUMAN)) return depth - 10;
      if (isFull(currBoard)) return 0;
      if (isMaximizing) {
        let maxScore = -Infinity;
        for (let i = 0; i < 9; i++) {
          if (currBoard[i] === '') {
            currBoard[i] = AI;
            let score = minimax(currBoard, depth + 1, false);
            currBoard[i] = '';
            maxScore = Math.max(score, maxScore);
          }
        }
        return maxScore;
      } else {
        let minScore = Infinity;
        for (let i = 0; i < 9; i++) {
          if (currBoard[i] === '') {
            currBoard[i] = HUMAN;
            let score = minimax(currBoard, depth + 1, true);
            currBoard[i] = '';
            minScore = Math.min(score, minScore);
          }
        }
        return minScore;
      }
    }
    function checkWin(b, player) {
      return WIN_COMBOS.some(combo => combo.every(i => b[i] === player));
    }
    function isFull(b) {
      return b.every(cell => cell !== '');
    }
    if (diffSelect) {
      diffSelect.onchange = () => initTicTacToe();
    }
    if (msgEl) msgEl.textContent = "Player (X) Turn";
    renderBoard();
  }
  function initTextRPG() {
    if (snakeInterval) clearInterval(snakeInterval);
    if (pongAnimId) cancelAnimationFrame(pongAnimId);
    const logEl = document.getElementById('rpg-output');
    const inputEl = document.getElementById('rpg-input');
    const sendBtn = document.getElementById('rpg-send-btn');
    if (!logEl) return;
    if (gameTitleEl) {
      gameTitleEl.innerHTML = `GAME: <span style="color: var(--netflix-red); font-weight: 700;">TEXT RPG</span> <span style="margin: 0 0.5rem; color: var(--fb-border);">|</span> <span id="arcade-status">The Cyber Crypt</span>`;
    }
    logEl.innerHTML = '';
    let player = { hp: 100, maxHp: 100, atk: 22, potions: 2, floor: 1, gold: 50 };
    let enemy = null;
    function print(text, cls = '') {
      const line = document.createElement('div');
      line.className = cls;
      line.textContent = text;
      logEl.appendChild(line);
      logEl.scrollTop = logEl.scrollHeight;
    }
    print("=== TERMINAL DUNGEON (CYBER CRYPT) ===", "system");
    print("Welcome, Operator. Conquer sentry drones and harvest artifacts.", "system");
    print("Available Commands: explore, attack, heal, status, help, look", "system");
    print("--- Floor 1 Initialized. Type 'explore' to initiate encounter. ---");
    function executeCommand(raw) {
      const cmd = raw.trim().toLowerCase();
      if (!cmd) return;
      print(`> ${raw}`);
      switch (cmd) {
        case 'help':
          print("Commands: explore, attack, heal, status, look.", "system");
          break;
        case 'status':
          print(`[STATUS]: HP: ${player.hp}/${player.maxHp} | Atk: ${player.atk} | Potions: ${player.potions} | Gold: ${player.gold} | Floor: ${player.floor}`, "system");
          break;
        case 'look':
          if (enemy) {
            print(`An active threat stands before you: ${enemy.name} (HP: ${enemy.hp}/${enemy.maxHp}, Attack: ${enemy.atk}).`, "combat");
          } else {
            print(`Floor ${player.floor} corridors stretch into deep shadows. Type 'explore'.`);
          }
          break;
        case 'explore':
          if (enemy) {
            print("Cannot explore while an adversary blocks your path! 'attack' or 'heal'.", "combat");
            return;
          }
          const roll = Math.random();
          if (roll < 0.65) {
            const enemies = [
              { name: "Sentry Drone", hp: 45, maxHp: 45, atk: 12, gold: 25 },
              { name: "Daemon Kernel", hp: 60, maxHp: 60, atk: 16, gold: 40 },
              { name: "Silicon Golem", hp: 80, maxHp: 80, atk: 20, gold: 65 }
            ];
            enemy = { ...enemies[Math.min(player.floor - 1, enemies.length - 1)] };
            print(`[ALERT] A ${enemy.name} emerges! HP: ${enemy.hp}, ATK: ${enemy.atk}. Type 'attack'!`, "combat");
          } else if (roll < 0.85) {
            player.potions += 1;
            player.gold += 20;
            print(`[DISCOVERY] Breached a data cache: Acquired +1 Nano Potion & +20 Gold!`, "reward");
          } else {
            player.floor += 1;
            print(`[ELEVATION] Clean corridor found. Advanced to Floor ${player.floor}!`, "reward");
          }
          break;
        case 'attack':
          if (!enemy) {
            print("No hostile targets in range. Type 'explore' to venture deeper.");
            return;
          }
          const pDmg = Math.floor(player.atk * (0.8 + Math.random() * 0.4));
          enemy.hp -= pDmg;
          print(`You struck ${enemy.name} for ${pDmg} damage! (Enemy HP: ${Math.max(0, enemy.hp)})`, "combat");
          if (enemy.hp <= 0) {
            print(`Hostile eliminated! Acquired +${enemy.gold} Gold.`, "reward");
            player.gold += enemy.gold;
            enemy = null;
            return;
          }
          const eDmg = Math.floor(enemy.atk * (0.7 + Math.random() * 0.5));
          player.hp -= eDmg;
          print(`${enemy.name} counter-attacked for ${eDmg} damage! (Your HP: ${Math.max(0, player.hp)}/${player.maxHp})`, "combat");
          if (player.hp <= 0) {
            print("=== SYSTEM FAILURE: OPERATOR TERMINATED ===", "combat");
            print("Restarting simulator...", "system");
            player.hp = player.maxHp;
            player.floor = 1;
            player.potions = 2;
            enemy = null;
          }
          break;
        case 'heal':
          if (player.potions <= 0) {
            print("Nano-potions depleted! Explore rooms to synthesize more.", "combat");
            return;
          }
          player.potions--;
          const healAmt = 45;
          player.hp = Math.min(player.maxHp, player.hp + healAmt);
          print(`Synthesized Nano-Potion! Restored +${healAmt} HP. (Current HP: ${player.hp}/${player.maxHp})`, "reward");
          break;
        default:
          print(`Unrecognized command: '${cmd}'. Type 'help' for command directory.`);
      }
    }
    if (sendBtn && inputEl) {
      sendBtn.onclick = () => {
        const val = inputEl.value;
        inputEl.value = '';
        executeCommand(val);
      };
      inputEl.onkeydown = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const val = inputEl.value;
          inputEl.value = '';
          executeCommand(val);
        }
      };
    }
  }
  let pongAnimId = null;
  function initPong() {
    if (snakeInterval) clearInterval(snakeInterval);
    if (pongAnimId) cancelAnimationFrame(pongAnimId);
    const canvas = document.getElementById('pong-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const paddleW = 10;
    const paddleH = 80;
    let playerY = (canvas.height - paddleH) / 2;
    let aiY = (canvas.height - paddleH) / 2;
    let playerScore = 0;
    let aiScore = 0;
    let ballX = canvas.width / 2;
    let ballY = canvas.height / 2;
    let ballSpeedX = 5;
    let ballSpeedY = 3;
    const ballSize = 8;
    if (gameTitleEl) {
      gameTitleEl.innerHTML = `GAME: <span style="color: var(--netflix-red); font-weight: 700;">PONG</span> <span style="margin: 0 0.5rem; color: var(--fb-border);">|</span> <span id="arcade-status">Player: 0 | AI: 0</span>`;
    }
    function updatePongHeader() {
      if (gameTitleEl) {
        gameTitleEl.innerHTML = `GAME: <span style="color: var(--netflix-red); font-weight: 700;">PONG</span> <span style="margin: 0 0.5rem; color: var(--fb-border);">|</span> <span id="arcade-status">Player: ${playerScore} | AI: ${aiScore}</span>`;
      }
    }
    canvas.onmousemove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const root = document.documentElement;
      const mouseY = e.clientY - rect.top - root.scrollTop;
      playerY = Math.max(0, Math.min(canvas.height - paddleH, mouseY - paddleH / 2));
    };
    window.onkeydown = (e) => {
      if (activeGame !== 'pong') return;
      if (e.code === 'KeyW' || e.code === 'ArrowUp') {
        playerY = Math.max(0, playerY - 25);
      } else if (e.code === 'KeyS' || e.code === 'ArrowDown') {
        playerY = Math.min(canvas.height - paddleH, playerY + 25);
      }
    };
    function resetBall() {
      ballX = canvas.width / 2;
      ballY = canvas.height / 2;
      ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * 5;
      ballSpeedY = (Math.random() * 4 - 2);
    }
    function pongLoop() {
      if (activeGame !== 'pong') return;
      ballX += ballSpeedX;
      ballY += ballSpeedY;
      if (ballY - ballSize <= 0 || ballY + ballSize >= canvas.height) {
        ballSpeedY = -ballSpeedY;
      }
      const aiCenter = aiY + paddleH / 2;
      if (aiCenter < ballY - 12) {
        aiY += 4.2;
      } else if (aiCenter > ballY + 12) {
        aiY -= 4.2;
      }
      aiY = Math.max(0, Math.min(canvas.height - paddleH, aiY));
      if (ballX - ballSize <= 25 + paddleW && ballX >= 25) {
        if (ballY >= playerY && ballY <= playerY + paddleH) {
          ballSpeedX = Math.abs(ballSpeedX) * 1.05;
          const deltaY = ballY - (playerY + paddleH / 2);
          ballSpeedY = deltaY * 0.25;
        }
      }
      if (ballX + ballSize >= canvas.width - 25 - paddleW && ballX <= canvas.width - 25) {
        if (ballY >= aiY && ballY <= aiY + paddleH) {
          ballSpeedX = -Math.abs(ballSpeedX) * 1.05;
          const deltaY = ballY - (aiY + paddleH / 2);
          ballSpeedY = deltaY * 0.25;
        }
      }
      if (ballX < 0) {
        aiScore++;
        updatePongHeader();
        resetBall();
      } else if (ballX > canvas.width) {
        playerScore++;
        updatePongHeader();
        resetBall();
      }
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#E50914';
      ctx.shadowColor = '#E50914';
      ctx.shadowBlur = 10;
      ctx.fillRect(25, playerY, paddleW, paddleH);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 8;
      ctx.fillRect(canvas.width - 25 - paddleW, aiY, paddleW, paddleH);
      ctx.beginPath();
      ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      pongAnimId = requestAnimationFrame(pongLoop);
    }
    pongLoop();
  }
  let msTimerInterval = null;
  function initMinesweeper() {
    if (snakeInterval) clearInterval(snakeInterval);
    if (pongAnimId) cancelAnimationFrame(pongAnimId);
    if (msTimerInterval) clearInterval(msTimerInterval);
    const boardEl = document.getElementById('ms-board');
    const mineCountEl = document.getElementById('ms-mine-count');
    const timerEl = document.getElementById('ms-timer');
    const toggleBtn = document.getElementById('ms-flag-toggle');
    const statusTextEl = document.getElementById('ms-status');
    if (!boardEl) return;
    if (gameTitleEl) {
      gameTitleEl.innerHTML = `GAME: <span style="color: var(--netflix-red); font-weight: 700;">MINESWEEPER</span> <span style="margin: 0 0.5rem; color: var(--fb-border);">|</span> <span id="arcade-status">10 Hidden Mines</span>`;
    }
    const ROWS = 9;
    const COLS = 9;
    const MINES = 10;
    let grid = [];
    let isGameOver = false;
    let flagMode = false;
    let secondsElapsed = 0;
    let timerStarted = false;
    let remainingMines = MINES;
    if (mineCountEl) mineCountEl.textContent = remainingMines;
    if (timerEl) timerEl.textContent = '00:00';
    if (statusTextEl) statusTextEl.textContent = "Left-click to reveal. Right-click (or toggle mode) to plant flag.";
    if (toggleBtn) {
      toggleBtn.textContent = "Mode: Reveal (Click to Flag)";
      toggleBtn.onclick = () => {
        flagMode = !flagMode;
        toggleBtn.textContent = flagMode ? "Mode: Flagging Active" : "Mode: Reveal (Click to Flag)";
        toggleBtn.style.background = flagMode ? "var(--netflix-red)" : "rgba(255, 255, 255, 0.08)";
        toggleBtn.style.color = "#ffffff";
      };
    }
    for (let r = 0; r < ROWS; r++) {
      grid[r] = [];
      for (let c = 0; c < COLS; c++) {
        grid[r][c] = { isMine: false, revealed: false, flagged: false, neighborMines: 0 };
      }
    }
    let planted = 0;
    while (planted < MINES) {
      const rr = Math.floor(Math.random() * ROWS);
      const cc = Math.floor(Math.random() * COLS);
      if (!grid[rr][cc].isMine) {
        grid[rr][cc].isMine = true;
        planted++;
      }
    }
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!grid[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && grid[nr][nc].isMine) {
                count++;
              }
            }
          }
          grid[r][c].neighborMines = count;
        }
      }
    }
    function renderBoard() {
      boardEl.style.gridTemplateColumns = `repeat(${COLS}, 38px)`;
      boardEl.innerHTML = '';
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const cellData = grid[r][c];
          const cellDiv = document.createElement('div');
          cellDiv.className = 'ms-cell';
          if (cellData.revealed) {
            cellDiv.classList.add('revealed');
            if (cellData.isMine) {
              cellDiv.textContent = '💣';
              cellDiv.style.background = 'rgba(229, 9, 20, 0.4)';
            } else if (cellData.neighborMines > 0) {
              cellDiv.textContent = cellData.neighborMines;
              const colors = ['', '#60a5fa', '#34d399', '#f87171', '#a78bfa', '#fbbf24', '#38bdf8', '#c084fc', '#f43f5e'];
              cellDiv.style.color = colors[cellData.neighborMines] || '#ffffff';
            }
          } else if (cellData.flagged) {
            cellDiv.textContent = '🚩';
            cellDiv.style.color = '#fbbf24';
          }
          cellDiv.addEventListener('click', (e) => {
            e.preventDefault();
            if (flagMode) toggleFlag(r, c);
            else revealCell(r, c);
          });
          cellDiv.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            toggleFlag(r, c);
          });
          boardEl.appendChild(cellDiv);
        }
      }
    }
    function startTimer() {
      if (timerStarted) return;
      timerStarted = true;
      msTimerInterval = setInterval(() => {
        secondsElapsed++;
        const mins = String(Math.floor(secondsElapsed / 60)).padStart(2, '0');
        const secs = String(secondsElapsed % 60).padStart(2, '0');
        if (timerEl) timerEl.textContent = `${mins}:${secs}`;
      }, 1000);
    }
    function toggleFlag(r, c) {
      if (isGameOver || grid[r][c].revealed) return;
      startTimer();
      grid[r][c].flagged = !grid[r][c].flagged;
      remainingMines += grid[r][c].flagged ? -1 : 1;
      if (mineCountEl) mineCountEl.textContent = remainingMines;
      renderBoard();
    }
    function revealCell(r, c) {
      if (isGameOver || grid[r][c].revealed || grid[r][c].flagged) return;
      startTimer();
      grid[r][c].revealed = true;
      if (grid[r][c].isMine) {
        isGameOver = true;
        clearInterval(msTimerInterval);
        revealAllMines();
        if (statusTextEl) statusTextEl.textContent = "Detonation Detected! Game Over.";
        renderBoard();
        return;
      }
      if (grid[r][c].neighborMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
              revealCell(nr, nc);
            }
          }
        }
      }
      checkMinesweeperWin();
      renderBoard();
    }
    function revealAllMines() {
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (grid[r][c].isMine) {
            grid[r][c].revealed = true;
          }
        }
      }
    }
    function checkMinesweeperWin() {
      let unrevealedSafe = 0;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (!grid[r][c].isMine && !grid[r][c].revealed) {
            unrevealedSafe++;
          }
        }
      }
      if (unrevealedSafe === 0) {
        isGameOver = true;
        clearInterval(msTimerInterval);
        if (statusTextEl) statusTextEl.textContent = "Sector Cleared: Minesweeper Victory!";
      }
    }
    renderBoard();
  }
  initSnake();
});




