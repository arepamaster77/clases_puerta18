import { useEffect } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import Hud from './components/Hud';

function GameScene() {
  const { canvasRef, mousePos, isGameOver, shoot, gameState } = useGame();

  useEffect(() => {
    const handleMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    const handleDown = () => {
      if (!isGameOver) shoot();
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mousedown', handleDown);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mousedown', handleDown);
    };
  }, [isGameOver, shoot]);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', cursor: 'crosshair', backgroundColor: '#000' }}>
      <Hud />
      <canvas 
        ref={canvasRef} 
        width={window.innerWidth} 
        height={window.innerHeight} 
        style={{ display: 'block' }}
      />
      {isGameOver && (
        <div style={{ 
          position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', 
          color: 'white', display: 'flex', flexDirection: 'column', 
          alignItems: 'center', justifyContent: 'center', zIndex: 100 
        }}>
          <h1 style={{ fontSize: '4rem', color: '#e74c3c' }}>GAME OVER</h1>
          <p style={{ fontSize: '1.5rem' }}>Puntos: {gameState.current.score || 0}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{ padding: '15px 30px', fontSize: '1.2rem', cursor: 'pointer', marginTop: '20px' }}
          >
            REINTENTAR
          </button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <GameScene />
    </GameProvider>
  );
}