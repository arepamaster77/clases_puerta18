import React from 'react';

export default function Enemy({ data }) {
  const style = {
    position: 'absolute',
    left: data.x,
    top: data.y,
    width: '40px',
    height: '40px',
    backgroundColor: '#27ae60', // Verde zombie
    border: '3px solid #1a5276',
    borderRadius: '4px',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  };

  const healthBarStyle = {
    width: '100%',
    height: '5px',
    backgroundColor: '#c0392b',
    position: 'absolute',
    top: '-10px',
    borderRadius: '2px'
  };

  return (
    <div style={style}>
      {/* Barra de vida visual */}
      <div style={healthBarStyle}>
        <div style={{
          width: `${(data.health / 50) * 100}%`,
          height: '100%',
          backgroundColor: '#2ecc71',
          transition: 'width 0.1s'
        }} />
      </div>
      
      {/* Ojos del zombie */}
      <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', marginTop: '8px' }}>
        <div style={{ width: 6, height: 6, background: 'white', borderRadius: '50%' }} />
        <div style={{ width: 6, height: 6, background: 'white', borderRadius: '50%' }} />
      </div>
    </div>
  );
}