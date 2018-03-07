import React, { Component } from 'react';
import Routers from './Route';
import { Provider } from 'react-redux';
import store from './store';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <Provider store={store}>
          <Routers />
        </Provider>
      </MuiThemeProvider>
    );
  };
};

export default App;
