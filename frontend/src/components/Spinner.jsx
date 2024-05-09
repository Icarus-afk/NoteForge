import React from 'react';

const Spinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(5px)'
  }}>
    <div style={{
      border: '16px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '50%',
      borderTop: '16px solid rgba(255, 255, 255, 0.8)',
      width: '120px',
      height: '120px',
      animation: 'spin 2s linear infinite'
    }} />
    <style>
      {`
      @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
      }
      `}
    </style>
  </div>
);

export default Spinner;