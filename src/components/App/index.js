// libs
import React from 'react';

// packages
import Frame from '../../packages/frame';

// material ui
import theme from '../../styles/material-theme';

// components
import Main from '../Main';

const App = () => {
  return (
    <Frame theme={theme}>
      <Main />
    </Frame>
  );
}

export default App;
