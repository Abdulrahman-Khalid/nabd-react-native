import React, { Component } from 'react';
import { theme } from 'galio-framework';
import { Actions } from 'react-native-router-flux';
import { Colors, Images } from '../../constants';
import { connect } from 'react-redux';
import { info } from '../../constants';
import LoginManager from '../videoCall/manager/LoginManager';
import {
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
  Text,
  TouchableHighlight,
  NativeModules,
  Modal,
  DeviceEventEmitter,
  ActivityIndicator
} from 'react-native';
import { requestLocationPermission, updateLocation } from '../../actions';
import { Icon, SwitchButton } from '../../components';
import RadioForm, { RadioButton } from 'react-native-simple-radio-button';
import axios from 'axios';
import t from '../../I18n';
import io from 'socket.io-client';
import Pulse from 'react-native-pulse';
import RNSettings from 'react-native-settings';
import Geolocation from 'react-native-geolocation-service';

const { width, height } = Dimensions.get('screen');

class ParamedicHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRtl: this.props.language.lang === 'ar' ? 'rtl' : 'ltr',
      switchValue: false,
      gpsOffModal: false,
      available: false
    };
    this.socket = io.connect(
      axios.defaults.baseURL.substring(0, axios.defaults.baseURL.length - 4) +
        `available/${this.props.userType}s`,
      {
        timeout: 10000,
        jsonp: false,
        transports: ['websocket'],
        autoConnect: false,
        agent: '-',
        // path: '/', // Whatever your path is
        pfx: '-',
        key: props.token, // Using token-based auth.
        cert: '-',
        ca: '-',
        ciphers: '-',
        rejectUnauthorized: '-',
        perMessageDeflate: '-'
      }
    );
  }

  componentDidMount() {
    LoginManager.getInstance()
      .loginWithPassword(
        this.props.phoneNumber + '@nabd.abdulrahman.elshafei98.voximplant.com',
        info.userPass
      )
      .then(() => console.log('success login vox'));
    this.setState({ gpsOffModal: true });
    RNSettings.getSetting(RNSettings.LOCATION_SETTING).then(result => {
      if (result == RNSettings.ENABLED) {
        this.setState({ gpsOffModal: false });
      }
    });
    this.props.requestLocationPermission();
    DeviceEventEmitter.addListener(
      RNSettings.GPS_PROVIDER_EVENT,
      this.handleGPSProviderEvent
    );
    if (this.state.available && !this.socket.connected) {
      this.socket.open();
      console.log(
        'socket opened with phone: ',
        this.props.phoneNumber,
        ',user type: ',
        this.props.userType
      );
      this.socket.emit('available', {
        phoneNumber: this.props.phoneNumber,
        specialization: this.props.specialization
      });
    } else {
      if (!this.state.available && this.socket.connected) {
        this.socket.close();
      }
    }
  }

  componentWillUnmount() {
    LoginManager.getInstance().off(
      'onConnectionClosed',
      this._connectionClosed
    );
    this.socket.close();
  }

  componentDidUpdate() {
    if (this.props.permissionGranted) {
      Geolocation.setRNConfiguration({
        skipPermissionRequests: false,
        authorizationLevel: 'always'
      });
      Geolocation.requestAuthorization();
      this.watchID = Geolocation.watchPosition(
        position => {
          this.props.updateLocation(position);
        },
        error => {
          switch (error.code) {
            case 1:
              Alert.alert(t.Error, t.Error1);
              break;
            case 2:
              Alert.alert(t.Error, t.Error2);
              break;
            case 3:
              Alert.alert(t.Error, t.Error3);
              break;
            case 4:
              Alert.alert(t.Error, t.Error4);
              break;
            case 5:
              Alert.alert(t.Error, t.Error5);
              break;
            default:
              Alert.alert(t.Error, t.Error6);
              break;
          }
        },
        { enableHighAccuracy: true }
      );
    }
    if (this.state.available && !this.socket.connected) {
      this.socket.open();
      console.log(
        'socket opened with phone: ',
        this.props.phoneNumber,
        ',user type: ',
        this.props.userType
      );
      this.socket.emit('available', {
        phoneNumber: this.props.phoneNumber,
        userType: this.props.userType,
        specialization: this.props.specialization
      });
    } else {
      if (!this.state.available && this.socket.connected) {
        this.socket.close();
      }
    }
  }

  handleGPSProviderEvent = e => {
    if (e[RNSettings.LOCATION_SETTING] === RNSettings.DISABLED) {
      this.setState({
        gpsOffModal: true
      });
    }
    if (e[RNSettings.LOCATION_SETTING] === RNSettings.ENABLED) {
      this.setState({
        gpsOffModal: false
      });
    }
  };

  renderParamedicStates() {
    if (!this.state.available) {
      return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Image
            source={Images.coffee}
            style={{ width: 140, height: 140 }}
            resizeMode="contain"
          />
          <Text
            style={{
              color: 'gray',
              fontSize: 16,
              margin: 30,
              textAlign: 'center'
            }}
          >
            {/* Looks like you are taking a break. Turn the switch to "Available" to
            start saving lives! */}
            {t.notAvailableText}
          </Text>
        </View>
      );
    }
    if (this.state.available) {
      return (
        <View>
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <Image
              source={Images.loupe}
              style={{ width: 140, height: 140 }}
              resizeMode="contain"
            />
            <Text
              style={{
                color: 'gray',
                fontSize: 16,
                margin: 30,
                textAlign: 'center'
              }}
            >
              {/* Looks like you are taking a break. Turn the switch to "Available" to
            start saving lives! */}
              {t.searchForHelp}
            </Text>
          </View>
          <Pulse
            color={Colors.APP}
            numPulses={3}
            diameter={400}
            speed={20}
            duration={2000}
            style={{ position: 'absolute', bottom: '-55%' }}
          />
        </View>
      );
    }
  }

  renderLocationPermissionRequestModal() {
    return (
      <Modal visible={!this.props.permissionGranted} animationType="fade">
        <View style={styles.locationPermissionModalContainer}>
          <Image
            style={styles.locationPermissionImage}
            source={Images.locationPermission}
            resizeMode="contain"
          />
          <View style={styles.locationPermissionModalTitleContainer}>
            <Text style={styles.locationPermissionModalTitle}>
              {t.RequiresAccess}
            </Text>
          </View>
          <Text style={styles.locationPermissionModalDescription}>
            {Platform.OS === 'android' ? t.LocationAlert : t.LocationAlert_}
          </Text>
          <View style={styles.permissionModalButtons}>
            <TouchableOpacity
              style={styles.permissionModalButtonContainer}
              onPress={() => {
                openSettings().catch(() =>
                  Alert.alert(t.Error, t.SettingsError)
                );
              }}
            >
              <View
                style={[
                  styles.permissionModalButton,
                  {
                    backgroundColor: '#e8e8e3'
                  }
                ]}
              >
                <Text style={{ color: '#b3b3b2', fontFamily: 'Jaldi-Bold' }}>
                  {t.OpenSettings}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.permissionModalButtonContainer}
              onPress={() => {
                this.props.requestLocationPermission();
              }}
            >
              <View
                style={[
                  styles.permissionModalButton,
                  {
                    backgroundColor: '#fdeaec'
                  }
                ]}
              >
                <Text style={{ color: '#d76674', fontFamily: 'Jaldi-Bold' }}>
                  Refresh
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  renderGPSOffModal() {
    return (
      <Modal visible={this.state.gpsOffModal} animationType="fade">
        <View style={styles.gpsOffModalContainer}>
          <Image
            style={styles.gpsOffImage}
            source={Images.gpsOff}
            resizeMode="contain"
          />
          <View style={styles.gpsOffModalTitleContainer}>
            <Text style={styles.gpsOffModalTitle}>{t.RequiresAccess}</Text>
            <Text style={styles.gpsOffModalDescription}>
              {t.EnableLocation}
            </Text>
          </View>
        </View>
      </Modal>
    );
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        {this.renderGPSOffModal()}
        {this.renderLocationPermissionRequestModal()}
        {this.props.position ? (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'stretch' }}
          >
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: this.state.available ? 'flex-end' : 'center'
              }}
            >
              {this.renderParamedicStates()}
              <SwitchButton
                style={{ marginBottom: 20 }}
                text2={t.Available}
                text1={t.UnAvailable}
                onValueChange={val => {
                  switch (val) {
                    case 2:
                      this.setState({
                        available: true
                      });
                      break;
                    case 1:
                      this.setState({
                        available: false
                      });
                  }
                }}
                fontColor="#817d84"
                switchWidth={250}
                activeFontColor="black"
                switchdirection="rtl"
              />
            </View>
          </View>
        ) : (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <ActivityIndicator size="large" style={{ marginBottom: 20 }} />
            <Text style={{ fontSize: 20 }}>{t.FetchingLocation}</Text>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: width,
    height: height,
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    backgroundColor: theme.COLORS.WHITE,
    borderRadius: 30,
    flex: 1,
    margin: 20,
    width: '90%'
  },
  description: {
    paddingTop: theme.SIZES.BASE,
    paddingLeft: theme.SIZES.BASE,
    paddingRight: theme.SIZES.BASE,
    paddingBottom: theme.SIZES.BASE / 2
  },
  cardTitle: {
    fontSize: 50
  },
  permissionModalButtons: {
    flex: 1,
    flexDirection: 'row',
    margin: 10,
    marginBottom: 30,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  permissionModalButtonContainer: {
    flex: 1,
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10
  },
  permissionModalButton: {
    width: '100%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30
  },
  locationPermissionModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  locationPermissionImage: {
    width: 200,
    height: 200,
    margin: 12,
    flex: 2
  },
  locationPermissionModalTitleContainer: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  locationPermissionModalTitle: {
    fontSize: 30,
    textAlign: 'center',
    fontFamily: 'Jaldi-Regular',
    marginLeft: theme.SIZES.BASE * 2,
    marginRight: theme.SIZES.BASE * 2
  },
  locationPermissionModalDescription: {
    fontSize: 15,
    color: 'gray',
    textAlign: 'center',
    flex: 1,
    fontFamily: 'Jaldi-Regular',
    marginLeft: theme.SIZES.BASE * 2,
    marginRight: theme.SIZES.BASE * 2
  },
  gpsOffModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  gpsOffImage: {
    flex: 1,
    width: 200,
    height: 200,
    margin: 12
  },
  gpsOffModalTitleContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  gpsOffModalTitle: {
    fontSize: 30,
    textAlign: 'center',
    fontFamily: 'Jaldi-Regular',
    marginLeft: theme.SIZES.BASE * 2,
    marginRight: theme.SIZES.BASE * 2
  },
  gpsOffModalDescription: {
    fontSize: 15,
    color: 'gray',
    textAlign: 'center'
  },
  hr: {
    borderBottomColor: 'gray',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginLeft: 20,
    marginRight: 20
  },
  buttonsContainer: {
    flexDirection: 'column',
    marginBottom: 20
  },
  buttonContainer: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 10,
    zIndex: 100
  },
  button: {
    width: '100%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    flexDirection: 'row'
  },
  stopWatchView: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  linearGradient: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 30,
    zIndex: 98
  }
});

const mapStateToProps = state => ({
  phoneNumber: state.signin.phone.substring(1),
  userType: state.signin.userType,
  specialization: state.signin.specialization,
  token: state.signin.token,
  position: state.location.position,
  permissionGranted: state.location.permissionGranted,
  language: state.language
});

export default connect(
  mapStateToProps,
  { requestLocationPermission, updateLocation }
)(ParamedicHome);
