import { useGame } from '../context/GameContext';

export default function Player() {
  const { gameState } = useGame();
  const p = gameState.current.player;

  return (
    <div style={{
      position: 'absolute', left: p.x, top: p.y,
      width: 40, height: 40, backgroundColor: '#e74c3c',
      transform: `translate(-50%, -50%) rotate(${p.angle}deg)`,
      border: '3px solid #2c3e50'
    }}>
      <div style={{ width: 20, height: 10, background: '#2c3e50', position: 'absolute', right: -15, top: 12 }} />
    </div>
  );
}