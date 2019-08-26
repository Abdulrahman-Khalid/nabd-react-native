import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';
import ReduxThunk from 'redux-thunk';
import RouterComponent from './Router';
import { Block } from 'galio-framework';

class App extends Component {
  componentDidMount() {}

  render() {
    const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));
    return (
      <Provider store={store}>
        <Block flex>
          <RouterComponent />
          <Screen />
        </Block>
      </Provider>
    );
  }
}

export default App;
