import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';
import ReduxThunk from 'redux-thunk';
import RouterComponent from './Router';
import { Block } from 'galio-framework';
import Screens from './navigation/Screens';
import SplashScreen from 'react-native-splash-screen';
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/es/integration/react";
import I18n from 'react-native-i18n';
import NativeModules from 'react-native';

const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

class App extends Component {
  constructor(props) {
    super(props);

    const language = store.getState().language;
    // // set default Language for App
    I18n.locale = language.lang;
    // // Enable for mode RTL
    NativeModules.I18nManager.forceRTL(language.rtl);
  }
  
  componentDidMount() {
    SplashScreen.hide();
  }

  render() {
    const persistor = persistStore(store);
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Block flex>
            <RouterComponent />
          </Block>
        </PersistGate>
      </Provider>
    );
  }
}

export default App;

// import StepIndicator from './app/firstAid/StepIndicator';

// export default StepIndicator;
