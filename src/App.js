import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';
import ReduxThunk from 'redux-thunk';
import RouterComponent from './Router';
import { Block } from 'galio-framework';
import Screens from './navigation/Screens';
import SplashScreen from 'react-native-splash-screen';

class App extends Component {
  componentDidMount() {
    SplashScreen.hide();
  }

  render() {
    const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));
    return (
      <Provider store={store}>
        <Block flex>
          <RouterComponent />
          {/* <Screens /> */}
        </Block>
      </Provider>
    );
  }
}

export default App;

// import StepIndicator from './app/firstAid/StepIndicator';

// export default StepIndicator;
