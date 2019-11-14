import { AppRegistry, ToastAndroid, YellowBox } from 'react-native';
import axios from 'axios';
import App from './src/App';
import { name as appName } from './app.json';
import Config from 'react-native-config';

YellowBox.ignoreWarnings([
  'Warning: componentWillMount is deprecated',
  'Warning: componentWillUpdate is deprecated',
  'Setting a timer for a long period',
  'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?',
  'Warning: componentWillReceiveProps is deprecated',
  'Module RCTImageLoader requires'
]);
console.disableYellowBox = true;
axios.defaults.baseURL = Config.API_URL;
// axios.defaults.baseURL = 'http://192.168.1.2:3000/api/';
axios.defaults.timeout = 5000;

global.deepLinking = true;

AppRegistry.registerComponent(appName, () => App);
