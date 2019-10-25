import React, { Component } from 'react';
import { Provider } from 'react-redux';
import RouterComponent from './Router';
import { Block } from 'galio-framework';
import SplashScreen from 'react-native-splash-screen';
import { PersistGate } from 'redux-persist/es/integration/react';
import { persistStore } from 'redux-persist';
import Languages from './I18n';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  StatusBar,
  NativeModules
} from 'react-native';
import CreateStore from './config/CreateStore';
import { Colors } from './constants';
import {
  setCustomText,
  setCustomTextInput,
  setCustomView
} from 'react-native-global-props';
import { Provider as PaperProvider } from 'react-native-paper';
import RNRestart from 'react-native-restart';

const { store } = CreateStore();
let persistor;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { rehydrated: false };
  }
  componentWillMount() {
    persistor = persistStore(store, {}, () => {
      const language = store.getState().language;
      let customProps;
      // // set default Language for App
      Languages.setLanguage(language.lang);
      if (NativeModules.I18nManager.isRTL == false && language.lang == 'ar') {
        NativeModules.I18nManager.forceRTL(true);
        setTimeout(() => {
          RNRestart.Restart();
        }, 500);
      }

      switch (language.lang) {
        case 'en':
          customProps = {
            style: {
              fontFamily: 'Manjari-Regular'
            }
          };
          break;
        case 'ar':
          customProps = {
            style: {
              fontFamily: 'Tajawal-Regular'
            }
          };
          break;
        default:
          customProps = {
            style: {}
          };
          break;
      }
      setCustomText(customProps);
      setCustomTextInput(customProps);
      setCustomView(customProps);
      this.setState({ rehydrated: true });
    });
  }
  componentDidUpdate() {
    if (this.state.rehydrated) {
      SplashScreen.hide();
    }
  }

  render() {
    if (!this.state.rehydrated) {
      return (
        <View style={[styles.container, styles.horizontal]}>
          <StatusBar backgroundColor={Colors.APP} barStyle="light-content" />
          <ActivityIndicator size="large" color="#ffff" />
        </View>
      );
    }
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <PaperProvider>
            <StatusBar backgroundColor={Colors.APP} barStyle="light-content" />
            <Block flex>
              <RouterComponent />
            </Block>
          </PaperProvider>
        </PersistGate>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.APP
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  }
});

export default App;
