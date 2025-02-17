import React, { useEffect } from 'react';

const App = () => {
  useEffect(() => {
    import('@mindfiredigital/page-builder-web-component');
  }, []);

  return (
    <div style={{     
      width: '100vw',
      height: '100vh',
    }}>
      <page-builder />
    </div>
  );
};

export default App;

