(function(){
  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d');
  const playBtn = document.getElementById('playBtn');
  const gameOver = document.getElementById('gameOver');
  const highScoreDisplay = document.getElementById('highScoreDisplay');

  let W = 0; let H = 0;
  let balls = [];
  let extraBalls = [];
  let bricks = [];
  const brickPadding = 6;
  let score = 0; let highScore = 0; let level = 1; let running = false;
  const paddle = { w:140, h:12, x:0, y:0 };
  let pointerDownState = false; let lastX = 0;
  let audioEnabled = false;
  
  try {
    highScore = parseInt(localStorage.getItem('breakoutHigh')) || 0;
    highScoreDisplay.textContent = 'HIGH: ' + highScore;
  } catch(e) {}

  function resize(){
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W; canvas.height = H;
    
    const isMobile = W < 768;
    const isLandscape = W > H && isMobile;
    const isNarrow = W < 432;
    
    if(isNarrow) {
      paddle.w = W * 0.35;
    } else if(isMobile) {
      paddle.w = isLandscape ? W * 0.25 : W * 0.3;
    } else {
      paddle.w = Math.max(90, Math.min(240, Math.floor(W*0.18)));
    }
    
    paddle.x = Math.max(0, Math.min(W-paddle.w, paddle.x || (W-paddle.w)/2));
    paddle.y = H - 20;
  }
  window.addEventListener('resize', resize, {passive:true});
  window.addEventListener('orientationchange', function() {
    setTimeout(resize, 100);
  }, {passive: true});
  resize();

  function enableAudio() {
    if(!audioEnabled && AudioCtx.state === 'suspended') {
      AudioCtx.resume();
      audioEnabled = true;
    }
  }

  const AudioCtx = new (window.AudioContext || window.webkitAudioContext)();
  function playSound(f,d,v){
    if(!audioEnabled) return;
    try{
      const n = AudioCtx.currentTime;
      const o = AudioCtx.createOscillator();
      const g = AudioCtx.createGain();
      o.connect(g); g.connect(AudioCtx.destination);
      g.gain.setValueAtTime(v||0.07, n);
      o.frequency.setValueAtTime(f, n);
      o.type = 'sine';
      o.start(n);
      g.gain.exponentialRampToValueAtTime(0.001, n + (d||0.08));
      o.stop(n + (d||0.08));
    }catch(e){ }
  }

  function createBall(){
    const isMobile = W < 768;
    const isLandscape = W > H && isMobile;
    const isShortScreen = H < 500;
    
    let baseSpeed;
    
    if(isShortScreen) {
      // Kısa ekranlarda (özellikle mobil yatay) yavaş
      baseSpeed = Math.max(3 + level*0.3, Math.min(6, Math.floor(H/120) + level*0.5));
    } else if(isMobile && isLandscape) {
      // Mobil yatay (ama yükseklik normal)
      baseSpeed = Math.max(4 + level*0.4, Math.min(7, Math.floor(W/180) + level*0.6));
    } else if(isMobile) {
      // Mobil dikey: normal hız (eski yavaşlama kaldırıldı)
      baseSpeed = Math.max(5 + level*0.5, Math.min(8, Math.floor(W/160) + level));
    } else {
      baseSpeed = Math.max(5 + level*0.5, Math.min(10, Math.floor(W/200) + level));
    }
    
    return { 
      r: Math.max(8, Math.min(14, Math.floor(W*0.02))), 
      x: W/2, 
      y: Math.max(40, paddle.y-20), 
      vx: (Math.random()>0.5?1:-1)*baseSpeed, 
      vy: -baseSpeed, 
      speed: baseSpeed, 
      dead:false 
    };
  }
  function resetBalls(){ balls = [createBall()]; extraBalls = []; }

  function createBricks(){
    const rows = 6;
    bricks = [];
    
    const isMobile = W < 768;
    const isNarrow = W < 432;
    const isLandscape = W > H && isMobile;
    
    let blocksCount;
    if(isNarrow) blocksCount = 1;          // 432 altı: 1 blok
    else if(isMobile) blocksCount = 2;     // Mobil: 2 blok
    else blocksCount = 3;                  // Masaüstü: 3 blok
    
    const blockCols = 8;
    const gap = 1;
    const bw = Math.max(18, Math.floor(W * (isMobile ? 0.095 : 0.035)));
    const totalWidth = (blockCols * blocksCount * bw) + (gap * (blocksCount - 1) * bw);
    const startX = (W - totalWidth) / 2;
    const bh = Math.max(12, Math.min(20, bw * 0.7));
    
    const startY = isLandscape ? 30 : 40;
    
    for(let r=0; r<rows; r++){
      for(let block=0; block<blocksCount; block++){
        for(let c=0; c<blockCols; c++){
          const colOffset = block * (blockCols + gap);
          const x = startX + (bw * colOffset) + (bw * c);
          const y = startY + (bh + 4)*r;
          
          const isPower = Math.random() < 0.15;
          
          let baseColor;
          if(r < 2) baseColor = '#ff5555';
          else if(r < 4) baseColor = '#ffaa00'; 
          else baseColor = '#00ff88';
          
          const color = isPower ? 
            (r < 2 ? '#ff3366' : r < 4 ? '#ff9900' : '#00cc66') : 
            baseColor;
          
          bricks.push({ 
            x, y, w: bw-2, h: bh-2, 
            alive: true, 
            hits: isPower ? 2 : 1,          
            maxHits: isPower ? 2 : 1,       
            color: color
          });
        }
      }
    }
  }

  function resetGame(){
    score = 0;
    level = 1;
    createBricks();
    const isMobile = W < 768;
    const isLandscape = W > H;
    paddle.w = isMobile ? (isLandscape ? W * 0.2 : W * 0.3) : Math.max(90, Math.min(240, Math.floor(W*0.18)));
    paddle.x = (W - paddle.w)/2;
    paddle.y = H - 20;
    resetBalls();
    running = false;
    pointerDownState = false;
    playBtn.style.display = 'block';
    gameOver.style.display = 'none';
  }

  function update(){
    if(!running) return;
    const allBalls = [].concat(balls, extraBalls);
    
    for(const ball of allBalls){
      if(ball.dead) continue;
      ball.x += ball.vx;
      ball.y += ball.vy;
      if(ball.x - ball.r < 0){ ball.x = ball.r; ball.vx *= -1; playSound(380); }
      if(ball.x + ball.r > W){ ball.x = W - ball.r; ball.vx *= -1; playSound(380); }
      if(ball.y - ball.r < 0){ ball.y = ball.r; ball.vy *= -1; playSound(430); }
      if(ball.y + ball.r > H){ ball.dead = true; }
      if(ball.y + ball.r > paddle.y && ball.x > paddle.x && ball.x < paddle.x + paddle.w){
        const hitPos = (ball.x - (paddle.x + paddle.w/2)) / (paddle.w/2);
        ball.vx = ball.speed * hitPos;
        ball.vy = -Math.abs(ball.speed);
        playSound(650);
      }
    }

    balls = balls.filter(b=>!b.dead);
    extraBalls = extraBalls.filter(b=>!b.dead);

    if(balls.length === 0 && extraBalls.length === 0){
      gameOver.textContent = 'GAME OVER\nSCORE: ' + score + '\nHIGH: ' + highScore;
      gameOver.style.display = 'block';
      running = false;
      pointerDownState = false;
      if(score > highScore) {
        highScore = score;
        highScoreDisplay.textContent = 'HIGH: ' + highScore;
        try { localStorage.setItem('breakoutHigh', highScore); } catch(e) {}
      }
      setTimeout(resetGame, 1800);
      return;
    }

    for(const b of bricks){
      if(!b.alive) continue;
      for(const ball of [].concat(balls, extraBalls)){
        if(ball.dead) continue;
        const collided = ball.x > b.x && ball.x < b.x + b.w && ball.y - ball.r < b.y + b.h && ball.y + ball.r > b.y;
        if(collided){
          b.hits--;
          if(b.hits <= 0) {
            b.alive = false;
            score += b.maxHits * 10;
            playSound(880, 0.08);
            
            if(b.maxHits > 1 && Math.random() < 0.3) {
              const powerBall = createBall();
              powerBall.x = b.x + b.w/2;
              powerBall.y = b.y + b.h/2;
              powerBall.vx = (Math.random()-0.5)*8;
              powerBall.vy = -6;
              extraBalls.push(powerBall);
            }
          } else {
            playSound(550, 0.06);
          }
          ball.vy *= -1;
          break;
        }
      }
    }

    if(bricks.every(b=>!b.alive)){
      level++;
      createBricks(); 
      resetBalls();
      const isMobile = W < 768;
      const isLandscape = W > H;
      paddle.w = isMobile ? 
        (isLandscape ? 
          Math.max(W*0.18, Math.min(W*0.3, paddle.w * 0.95)) :
          Math.max(W*0.25, Math.min(W*0.4, paddle.w * 0.95))) :
        Math.max(60, Math.min(300, paddle.w * 0.95));
    }
  }

  function draw(){
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle = '#07102a'; 
    ctx.fillRect(0,0,W,H);
    
    for(const b of bricks){
      if(!b.alive) continue;
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x, b.y, b.w, b.h);
      if(b.maxHits > 1) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(b.x + 2, b.y + 2, b.w - 4, b.h - 4);
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x + 4, b.y + 4, b.w - 8, b.h - 8);
      }
    }
    
    ctx.fillStyle = '#00ffe1'; 
    ctx.shadowColor = '#00ffe1';
    ctx.shadowBlur = 10;
    ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.shadowBlur = 0;
    
    const allBalls = running ? [].concat(balls, extraBalls) : balls;
    for(const ball of allBalls){
      if(!ball.dead){
        ctx.beginPath(); 
        ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI*2); 
        ctx.fillStyle = '#fff'; 
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 8;
        ctx.fill(); 
        ctx.closePath();
        ctx.shadowBlur = 0;
      }
    }
    
    ctx.fillStyle = '#fff'; 
    ctx.font = '12px "Press Start 2P"'; 
    ctx.fillText('SCORE: ' + score, 12, 20);
    ctx.fillText('LEVEL: ' + level, 12, 40);
  }

  let last = 0;
  function loop(t){ last = t; update(); draw(); requestAnimationFrame(loop); }
  requestAnimationFrame(loop);

  document.addEventListener('keydown', function(e){
    if(e.key === 'ArrowLeft') paddle.x = Math.max(0, paddle.x - 50);
    if(e.key === 'ArrowRight') paddle.x = Math.min(W - paddle.w, paddle.x + 50);
  });

  function down(x){ pointerDownState = true; lastX = x; }
  function move(x){ lastX = x; }
  function up(){ pointerDownState = false; }

  window.addEventListener('pointerdown', function(e){ 
    enableAudio();
    down(e.clientX); 
    e.preventDefault(); 
  }, {passive: false});
  
  window.addEventListener('pointermove', function(e){ 
    if(pointerDownState && running) move(e.clientX); 
  }, {passive: true});
  
  window.addEventListener('pointerup', function(e){ up(); });

  setInterval(function(){ 
    if(pointerDownState && running){ 
      const isMobile = W < 768;
      const sensitivity = isMobile ? 0.5 : 0.35;
      const dx = lastX - (paddle.x + paddle.w/2); 
      paddle.x += dx * sensitivity; 
      paddle.x = Math.max(0, Math.min(W - paddle.w, paddle.x)); 
    } 
  }, 16);

  playBtn.addEventListener('click', function(){ 
    enableAudio();
    running = true; 
    playBtn.style.display = 'none'; 
    gameOver.style.display = 'none';
  });

  resetGame();
})();