import React from 'react';

export default function Bullet({ data }) {
  const style = {
    position: 'absolute',
    left: data.x,
    top: data.y,
    width: '8px',
    height: '8px',
    backgroundColor: '#f1c40f', // Amarillo brillante
    borderRadius: '50%',
    boxShadow: '0 0 10px #f1c40f', // Efecto de brillo
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none' // Para que no interfiera con clics del mouse
  };

  return <div style={style} />;
}