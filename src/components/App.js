import React, { Component } from 'react';
import { MuiThemeProvider } from '@material-ui/core';
import { theme } from '../styles/Wetheme';
import Layout from './Layout';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Layout />
      </MuiThemeProvider>
    );
  }
}

export default App;
