import React from 'react';

function FullPageDiv({ children }) {
  const style = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#040404',
  };

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <div style={style}></div>
      {children}
    </div>
  );
}

export default FullPageDiv;