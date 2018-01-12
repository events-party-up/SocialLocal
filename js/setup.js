
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import App from './App';
import configureStore from './configureStore';
import {SyncDbListener} from './actions/listeners'

function setup():React.Component {
  class Root extends Component {

    constructor() {
      super();
      this.state = {
        isLoading: false,
        store: configureStore(() => this.setState({ isLoading: false })),
      };

      // custom subscribers
      this.state.store.subscribe(() => SyncDbListener(this.state.store.getState(), this.state.store.dispatch))
    }

    render() {
      return (
        <Provider store={this.state.store}>
          <App />
        </Provider>
      );
    }
  }
  return Root;
}

export default setup;
