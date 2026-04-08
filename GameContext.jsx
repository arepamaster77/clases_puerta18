import { createContext, useContext, useRef, useState, useEffect } from 'react';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [frame, setFrame] = useState(0); // Solo para forzar el renderizado de React
  
  // Referencias para evitar re-renders constantes y lentos
  const playerRef = useRef({ 
    x: 300, 
    y: 300, 
    angle: 0, 
    speed: 5 
  });
  const keys = useRef({});

  useEffect(() => {
    // Detectar teclado
    const handleKeyDown = (e) => (keys.current[e.key.toLowerCase()] = true);
    const handleKeyUp = (e) => (keys.current[e.key.toLowerCase()] = false);
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // GAME LOOP (60 FPS)
    const update = () => {
      const p = playerRef.current;
      
      if (keys.current['w'] || keys.current['arrowup']) p.y -= p.speed;
      if (keys.current['s'] || keys.current['arrowdown']) p.y += p.speed;
      if (keys.current['a'] || keys.current['arrowleft']) p.x -= p.speed;
      if (keys.current['d'] || keys.current['arrowright']) p.x += p.speed;

      setFrame(f => f + 1); // Forzamos a React a dibujar la nueva posición
      requestAnimationFrame(update);
    };

    const id = requestAnimationFrame(update);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <GameContext.Provider value={{ player: playerRef.current }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);