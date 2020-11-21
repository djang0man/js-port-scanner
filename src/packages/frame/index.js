// libs
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

// material ui
import { MuiThemeProvider } from '@material-ui/core/styles';

const Frame = props => {
  const { children, theme } = props;

  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>{children}</BrowserRouter>
    </MuiThemeProvider>
  )
};

export default Frame;