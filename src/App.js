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

class App extends Component {
  componentDidMount() {
    SplashScreen.hide();

    // const language = store.getState().language;
    // // set default Language for App
    // Languages.setLanguage(language.lang);

    // // Enable for mode RTL
    // I18nManager.forceRTL(language.lang === "ar");
  }

  render() {
    const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));
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
