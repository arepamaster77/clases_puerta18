import { createContext, useContext, useRef, useState, useEffect } from 'react';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [isGameOver, setIsGameOver] = useState(false);
  
  const canvasRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const keys = useRef({});

  // Carga de Assets (Imágenes y Sonidos)
  const assets = useRef({
    bg: new Image(),
    playerSprite: new Image(),
    enemySprite: new Image(),
    shootSound: typeof Audio !== 'undefined' ? new Audio('/sounds/shoot.mp3') : null
  });

  const gameState = useRef({
    player: { x: window.innerWidth / 2, y: window.innerHeight / 2, angle: 0, speed: 4.5, r: 22 },
    bullets: [],
    enemies: [],
    walls: [
      { x: 300, y: 200, w: 60, h: 300 },
      { x: 800, y: 150, w: 300, h: 60 },
      { x: 500, y: 500, w: 400, h: 50 },
    ]
  });

  // Función de colisión Círculo-Rectángulo
  const checkColl = (nx, ny, r, walls) => {
    for (let w of walls) {
      const cX = Math.max(w.x, Math.min(nx, w.x + w.w));
      const cY = Math.max(w.y, Math.min(ny, w.y + w.h));
      if (Math.sqrt((nx - cX)**2 + (ny - cY)**2) < r) return true;
    }
    return false;
  };

  useEffect(() => {
    // Configurar rutas de archivos
    assets.current.bg.src = '/images/bg.png';
    assets.current.playerSprite.src = '/images/player.png';
    assets.current.enemySprite.src = '/images/zombie.png';

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const update = () => {
      if (health <= 0) { setIsGameOver(true); return; }

      const s = gameState.current;
      const p = s.player;

      // 1. MOVIMIENTO (WASD)
      let dx = 0, dy = 0;
      if (keys.current['w']) dy -= p.speed;
      if (keys.current['s']) dy += p.speed;
      if (keys.current['a']) dx -= p.speed;
      if (keys.current['d']) dx += p.speed;
      
      if (dx !== 0 && dy !== 0) { dx *= 0.707; dy *= 0.707; }

      if (!checkColl(p.x + dx, p.y, p.r, s.walls)) p.x += dx;
      if (!checkColl(p.x, p.y + dy, p.r, s.walls)) p.y += dy;

      p.angle = Math.atan2(mousePos.current.y - p.y, mousePos.current.x - p.x);

      // 2. DIBUJAR FONDO
      if (assets.current.bg.complete && assets.current.bg.width > 0) {
        ctx.drawImage(assets.current.bg, 0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = '#1a1a1a'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // 3. DIBUJAR PAREDES (Efecto 3D simple)
      s.walls.forEach(w => {
        ctx.fillStyle = '#333'; ctx.fillRect(w.x + 5, w.y + 5, w.w, w.h); // Sombra
        ctx.fillStyle = '#555'; ctx.fillRect(w.x, w.y, w.w, w.h); // Cara frontal
      });

      // 4. BALAS
      s.bullets.forEach(b => {
        b.x += Math.cos(b.angle) * 14;
        b.y += Math.sin(b.angle) * 14;
        ctx.fillStyle = 'yellow';
        ctx.beginPath(); ctx.arc(b.x, b.y, 4, 0, 7); ctx.fill();
        if (checkColl(b.x, b.y, 4, s.walls)) b.dead = true;
      });

      // 5. ENEMIGOS (Sprites)
      s.enemies.forEach(en => {
        const dist = Math.sqrt((p.x - en.x)**2 + (p.y - en.y)**2);
        const vx = ((p.x - en.x) / dist) * 1.8;
        const vy = ((p.y - en.y) / dist) * 1.8;

        if (!checkColl(en.x + vx, en.y, 18, s.walls)) en.x += vx;
        if (!checkColl(en.x, en.y + vy, 18, s.walls)) en.y += vy;

        ctx.save();
        ctx.translate(en.x, en.y);
        ctx.rotate(Math.atan2(p.y - en.y, p.x - en.x));
        if (assets.current.enemySprite.complete) {
          ctx.drawImage(assets.current.enemySprite, -22, -22, 44, 44);
        } else {
          ctx.fillStyle = 'green'; ctx.fillRect(-20, -20, 40, 40);
        }
        ctx.restore();

        if (dist < 32) setHealth(prev => Math.max(0, prev - 0.4));
        
        s.bullets.forEach(b => {
          if (Math.sqrt((b.x - en.x)**2 + (b.y - en.y)**2) < 25) {
            en.dead = true; b.dead = true; setScore(v => v + 10);
          }
        });
      });

      // 6. JUGADOR (Sprite)
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      if (assets.current.playerSprite.complete) {
        ctx.drawImage(assets.current.playerSprite, -25, -25, 50, 50);
      } else {
        ctx.fillStyle = 'red'; ctx.fillRect(-20, -20, 40, 40);
      }
      ctx.restore();

      // Limpieza de estados
      s.bullets = s.bullets.filter(b => !b.dead && b.x > 0 && b.x < canvas.width && b.y > 0 && b.y < canvas.height);
      s.enemies = s.enemies.filter(en => !en.dead);

      // Spawn aleatorio
      if (Math.random() < 0.02 && s.enemies.length < 15) {
        s.enemies.push({ x: Math.random() > 0.5 ? -50 : canvas.width + 50, y: Math.random() * canvas.height });
      }

      animId = requestAnimationFrame(update);
    };

    const down = (e) => keys.current[e.key.toLowerCase()] = true;
    const up = (e) => keys.current[e.key.toLowerCase()] = false;
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);

    animId = requestAnimationFrame(update);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [health]);

  const shoot = () => {
    const s = gameState.current;
    s.bullets.push({ x: s.player.x, y: s.player.y, angle: s.player.angle });
    if (assets.current.shootSound) {
      const sound = assets.current.shootSound.cloneNode();
      sound.volume = 0.15;
      sound.play();
    }
  };

  return (
    <GameContext.Provider value={{ canvasRef, mousePos, gameState, score, health, isGameOver, shoot }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);