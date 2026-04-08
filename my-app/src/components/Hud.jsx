import { useGame } from '../context/GameContext';

export default function Hud() {
  const { score, health } = useGame();
  
  return (
    <div style={{ 
      position: 'absolute', top: '20px', left: '20px', 
      color: 'white', fontFamily: 'Arial, sans-serif', 
      zIndex: 10, pointerEvents: 'none' 
    }}>
      <h2 style={{ margin: 0, textShadow: '2px 2px 4px #000' }}>PUNTOS: {score}</h2>
      <div style={{ 
        width: '200px', height: '20px', background: 'rgba(0,0,0,0.5)', 
        border: '2px solid white', marginTop: '10px' 
      }}>
        <div style={{ 
          width: `${health}%`, height: '100%', 
          background: health > 30 ? '#2ecc71' : '#e74c3c',
          transition: 'width 0.2s'
        }} />
      </div>
    </div>
  );
}