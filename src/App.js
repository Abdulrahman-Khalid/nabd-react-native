import React, { Component } from 'react';
import { Provider } from 'react-redux';
import RouterComponent from './Router';
import { Block } from 'galio-framework';
import SplashScreen from 'react-native-splash-screen';
import { PersistGate } from 'redux-persist/es/integration/react';
import { persistStore } from 'redux-persist';
import Languages from './I18n';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import CreateStore from './config/CreateStore';
import { argonTheme } from './constants';

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
      // // set default Language for App
      Languages.setLanguage(language.lang);
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
          <ActivityIndicator size="large" color="#ffff" />
        </View>
      );
    }
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: argonTheme.COLORS.APP
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  }
});

export default App;
