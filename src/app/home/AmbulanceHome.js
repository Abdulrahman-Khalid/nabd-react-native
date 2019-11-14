import React, { Component } from 'react';
import { theme, Block } from 'galio-framework';
import { Actions } from 'react-native-router-flux';
import { Colors, Images } from '../../constants';
import { connect } from 'react-redux';
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
  Linking,
  ActivityIndicator
} from 'react-native';
import { Icon, SwitchButton } from '../../components';
import { requestLocationPermission, updateLocation } from '../../actions';
import axios from 'axios';
import t from '../../I18n';
import io from 'socket.io-client';
import Pulse from 'react-native-pulse';
import RNSettings from 'react-native-settings';
import { openSettings } from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import LinearGradient from 'react-native-linear-gradient';
import getDirections from 'react-native-google-maps-directions';
import { Stopwatch } from 'react-native-stopwatch-timer';
import KeepAwake from 'react-native-keep-awake';

const { width, height } = Dimensions.get('screen');

const deviceLanguage =
  Platform.OS === 'ios'
    ? NativeModules.SettingsManager.settings.AppleLocale.substring(0, 2)
    : NativeModules.I18nManager.localeIdentifier.substring(0, 2);

var locationEmitterID = null;

const stopWatchOptions = {
  container: {
    backgroundColor: Colors.LIGHT,
    borderRadius: 30,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    width: 220
  },
  text: {
    fontSize: 30,
    color: '#FFF',
    marginLeft: 7
  }
};

class AmbulanceHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRtl:
        deviceLanguage == 'ar'
          ? 'rtl'
          : this.props.language.lang === 'ar'
          ? 'rtl'
          : 'ltr',
      stopwatchStart: true,
      stopwatchReset: false,
      gpsOffModal: false,
      available: false,
      startLocationTracking: false,
      patientName: null,
      patientPhoneNumber: null,
      patientLocation: null
    };
    this.sendLiveLocation = this.sendLiveLocation.bind(this);
    this.socket = io(
      axios.defaults.baseURL.substring(0, axios.defaults.baseURL.length - 4) +
        'available/ambulances',
      { autoConnect: false }
    );
  }

  componentDidMount() {
    KeepAwake.activate();
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
      this.socket.emit('available', {
        phoneNumber: this.props.phoneNumber
      });
      this.socket.on('send live location', data => {
        console.log(data);
        this.setState({
          patientName: data.name,
          patientPhoneNumber: data.phoneNumber,
          patientLocation: data.location,
          startLocationTracking: true
        });
        locationEmitterID = setInterval(this.sendLiveLocation, 2000);
      });
    } else {
      if (!this.state.available && this.socket.connected) {
        this.socket.close();
        clearInterval(locationEmitterID);
        locationEmitterID = null;
      }
    }
  }

  componentWillUnmount() {
    KeepAwake.deactivate();
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
      this.socket.emit('available', {
        phoneNumber: this.props.phoneNumber
      });
      this.socket.on('send live location', data => {
        this.setState({
          patientName: data.name,
          patientPhoneNumber: '+' + data.phoneNumber,
          patientLocation: data.location,
          startLocationTracking: true
        });
        locationEmitterID = setInterval(this.sendLiveLocation, 2000);
      });
    } else {
      if (!this.state.available && this.socket.connected) {
        this.socket.close();
        clearInterval(locationEmitterID);
        locationEmitterID = null;
      }
    }
  }

  async sendLiveLocation() {
    this.socket.emit('location', {
      latitude: this.props.position.coords.latitude,
      longitude: this.props.position.coords.longitude,
      heading: this.props.position.coords.heading
    });
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
                  {t.Refresh}
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

  handleGetDirections = () => {
    const directionsData = {
      source: {
        latitude: this.props.position.coords.latitude,
        longitude: this.props.position.coords.longitude
      },
      destination: {
        latitude: this.state.patientLocation.latitude,
        longitude: this.state.patientLocation.longitude
      },
      params: [
        {
          key: 'travelmode',
          value: 'driving' // may be "walking", "bicycling" or "transit" as well
        },
        {
          key: 'dir_action',
          value: 'navigate' // this instantly initializes navigation using the given travel mode
        }
      ]
    };
    getDirections(directionsData);
  };

  renderAmbulanceStates() {
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
            {t.notAvailableText}
          </Text>
        </View>
      );
    }
    if (this.state.available && !this.state.startLocationTracking) {
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
    if (this.state.available && this.state.startLocationTracking) {
      return (
        <View style={styles.container}>
          <LinearGradient
            start={{ x: 0.95, y: 0.7 }}
            end={{ x: 1.0, y: 0.0 }}
            locations={[0.3, 1]}
            colors={['transparent', 'rgba(0, 0, 0, 0.3)']}
            style={styles.linearGradient}
          />
          <View style={{ flex: 1 }}>
            <View style={styles.description}>
              <Text style={styles.cardTitle}>{this.state.patientName}</Text>
            </View>
          </View>
          <View style={styles.stopWatchView}>
            <Stopwatch
              laps
              msecs={false}
              start={this.state.stopwatchStart}
              reset={this.state.stopwatchReset}
              options={stopWatchOptions}
            />
          </View>
          <View style={styles.hr} />
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={this.handleGetDirections}
            >
              <View
                style={[
                  styles.button,
                  {
                    backgroundColor: '#e8e8e3'
                  }
                ]}
              >
                <Icon
                  name="map"
                  family="flaticon"
                  style={{ marginRight: 5 }}
                  color="#b3b3b2"
                  size={17}
                />
                <Text style={{ color: '#b3b3b2', fontFamily: 'Jaldi-Bold' }}>
                  {t.GetDirections}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => {
                Linking.openURL(`tel:${'+' + this.state.patientPhoneNumber}`);
              }}
            >
              <View
                style={[
                  styles.button,
                  {
                    backgroundColor: '#fdeaec'
                  }
                ]}
              >
                <Icon
                  name="phone-handset"
                  family="flaticon"
                  style={{ marginRight: 5 }}
                  color="#d76674"
                  size={17}
                />
                <Text style={{ color: '#d76674', fontFamily: 'Jaldi-Bold' }}>
                  {t.CarrierCall}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
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
              {this.renderAmbulanceStates()}
              {this.state.startLocationTracking ? (
                <TouchableOpacity
                  style={{
                    width: '50%',
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 20
                  }}
                  onPress={() => {
                    this.socket.close();
                    this.setState({
                      patientName: null,
                      patientPhoneNumber: null,
                      patientLocation: null,
                      requestDate: null,
                      startLocationTracking: false,
                      available: false
                    });
                    clearInterval(locationEmitterID);
                    locationEmitterID = null;
                  }}
                >
                  <View
                    style={{
                      backgroundColor: Colors.APP,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 30,
                      flexDirection: 'row',
                      flex: 1,
                      width: '100%'
                    }}
                  >
                    <Icon
                      name="like"
                      family="flaticon"
                      style={{ marginRight: 5 }}
                      color="white"
                      size={17}
                    />
                    <Text style={{ color: 'white', fontFamily: 'Jaldi-Bold' }}>
                      {t.Arrived}
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : (
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
                  switchdirection={this.state.isRtl}
                />
              )}
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
  phoneNumber: state.signin.phone,
  userType: state.signin.userType,
  position: state.location.position,
  permissionGranted: state.location.permissionGranted,
  language: state.language
});

export default connect(mapStateToProps, {
  requestLocationPermission,
  updateLocation
})(AmbulanceHome);
