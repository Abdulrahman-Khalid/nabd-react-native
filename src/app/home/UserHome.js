import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { Block, Text, Button, theme } from 'galio-framework';
import { Actions } from 'react-native-router-flux';
import { Colors, Images } from '../../constants';
import { connect } from 'react-redux';
import {
  selectHelperType,
  requestHelp,
  requestLocationPermission,
  updateLocation
} from '../../actions';
import {
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
  ScrollView,
  Modal,
  Platform,
  Switch,
  DeviceEventEmitter,
  ActivityIndicator
} from 'react-native';
import {
  Card,
  Modal as CustomModal,
  Icon as CustomIcon
} from '../../components';
import axios from 'axios';
import PubNubReact from 'pubnub-react';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel
} from 'react-native-simple-radio-button';
import RNSwipeVerify from 'react-native-swipe-verify';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { openSettings } from 'react-native-permissions';
import t from '../../I18n';
import RNSettings from 'react-native-settings';
import Geolocation from 'react-native-geolocation-service';

const { width, height } = Dimensions.get('screen');

const buttons = [
  {
    title: t.RequestHelp,
    image: Images.aideCard
  },
  {
    title: t.RequestDoctor,
    image: Images.doctorCard
  },
  {
    title: t.RequestAmbulance,
    image: Images.ambulanceCard,
    horizontal: true
  }
];

class UserHome extends Component {
  constructor(props) {
    super();
    this.state = {
      modalVisible: false,
      switchValue: true,
      gpsOffModal: false,
      startedWatch: false
    };
    props.selectHelperType('doctor');
    // Init PubNub. Use your subscribe key here.
    this.pubnub = new PubNubReact({
      subscribeKey: 'sub-key'
    });
    this.pubnub.init(this);
    this.requestAmbulance = this.requestAmbulance.bind(this);
  }

  componentDidMount() {
    if (Platform.OS === 'android') {
      this.setState({ gpsOffModal: true });
      RNSettings.getSetting(RNSettings.LOCATION_SETTING).then(result => {
        if (result == RNSettings.ENABLED) {
          this.setState({ gpsOffModal: false });
        }
      });
    } else {
      this.props.requestLocationPermission();
      console.log(this.props.permissionGranted);
    }
    DeviceEventEmitter.addListener(
      RNSettings.GPS_PROVIDER_EVENT,
      this.handleGPSProviderEvent
    );
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
              Alert.alert('Error', 'Location permission is not granted');
              break;
            case 2:
              Alert.alert('Error', 'Location provider not available');
              break;
            case 3:
              Alert.alert('Error', 'Location request timed out');
              break;
            case 4:
              Alert.alert(
                'Error',
                'Google play service is not installed or has an older version'
              );
              break;
            case 5:
              Alert.alert(
                'Error',
                'Location service is not enabled or location mode is not appropriate for the current request'
              );
              break;
            default:
              Alert.alert('Error', 'Please try again');
              break;
          }
        },
        { enableHighAccuracy: true }
      );
    }
  }

  componentWillUnmount() {
    Geolocation.clearWatch(this.watchID);
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
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

  requestAmbulance() {
    if (!this.state.switchValue) {
      this.setState({
        modalVisible: false
      });
      Actions.waitForAmbulance();
    } else {
      console.log('send current position');
    }
  }

  renderModal() {
    return (
      <CustomModal
        title="Proceed carefully"
        modalVisible={this.state.modalVisible}
        onRequestClose={() => {
          this.setModalVisible(false);
        }}
      >
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-around'
          }}
        >
          <Text style={{ fontSize: 18 }}>Send current location?</Text>
          <Switch
            value={this.state.switchValue}
            onValueChange={value => {
              this.setState({ switchValue: value });
            }}
          />
        </View>
        <View style={{ marginTop: 20, marginBottom: 20 }}>
          <RNSwipeVerify
            width={width - 100}
            buttonSize={60}
            borderColor="#ffff"
            buttonColor={Colors.APP}
            backgroundColor="#d4d4d4"
            borderRadius={30}
            okButton={{ visible: false, duration: 400 }}
            icon={
              <CustomIcon
                name="swipe-right"
                family="flaticon"
                size={25}
                color="white"
              />
            }
            onVerified={this.requestAmbulance}
          >
            <Text style={{ fontSize: 25 }}>Confirm</Text>
          </RNSwipeVerify>
        </View>
        <TouchableOpacity
          onPress={() => {
            this.setModalVisible(false);
          }}
          style={styles.closeModalButton}
        >
          <Icon
            size={30}
            color="black"
            name="close"
            style={{
              textAlign: 'center'
            }}
          />
        </TouchableOpacity>
      </CustomModal>
    );
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
              Nabd requires access to your location
            </Text>
          </View>
          <Text style={styles.locationPermissionModalDescription}>
            {Platform.OS === 'android'
              ? `In order to have help at your fingertips, location access is required. Press 'Open Settings' > Permissions > Location > Allow all the time > Go back to Nabd > Press 'Refresh'`
              : `In order to have help at your fingertips, location access is required. Press 'Open Settings' > Location > Always > Go back to Nabd > Press 'Refresh'`}
          </Text>
          <View style={styles.permissionModalButtons}>
            <TouchableOpacity
              style={styles.permissionModalButtonContainer}
              onPress={() => {
                openSettings().catch(() =>
                  Alert.alert('Error', 'Cannot open settings')
                );
              }}
            >
              <View
                style={[
                  styles.permissionModalButton,
                  {
                    backgroundColor: '#f6f6f4'
                  }
                ]}
              >
                <Text style={{ color: '#b3b3b2', fontFamily: 'Manjari-Bold' }}>
                  Open Settings
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
                <Text style={{ color: '#d76674', fontFamily: 'Manjari-Bold' }}>
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
            <Text style={styles.gpsOffModalTitle}>
              Nabd requires access to your location
            </Text>
            <Text style={styles.gpsOffModalDescription}>Enable location services for a better experience</Text>
          </View>
        </View>
      </Modal>
    );
  }

  logoutButtonPressed() {
    axios.defaults.headers.common['TOKEN'] = '';
    AsyncStorage.clear()
      .then(() => Actions.welcome())
      .catch(() => {});
  }

  renderButtons() {
    return this.props.position ? (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center'
        }}
      >
        <View style={{ height: '100%', width: width }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Card
              item={buttons[0]}
              style={{
                paddingTop: theme.SIZES.BASE,
                paddingLeft: theme.SIZES.BASE,
                paddingRight: theme.SIZES.BASE / 2,
                paddingBottom: theme.SIZES.BASE / 2
              }}
              onPress={() => {
                this.props.selectHelperType('aide');
              }}
              onPressInfo={() => {
                Alert.alert(
                  'Info',
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dignissim congue risus ut accumsan'
                );
              }}
            />
            <Card
              item={buttons[1]}
              style={{
                paddingTop: theme.SIZES.BASE,
                paddingRight: theme.SIZES.BASE,
                paddingLeft: theme.SIZES.BASE / 2,
                paddingBottom: theme.SIZES.BASE / 2
              }}
              onPress={() => {
                this.props.selectHelperType('doctor');
              }}
              onPressInfo={() => {
                Alert.alert(
                  'Info',
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dignissim congue risus ut accumsan'
                );
              }}
            />
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Card
              item={buttons[2]}
              style={{
                paddingTop: theme.SIZES.BASE / 2,
                paddingLeft: theme.SIZES.BASE,
                paddingRight: theme.SIZES.BASE,
                paddingBottom: theme.SIZES.BASE
              }}
              onPress={() => {
                this.props.selectHelperType('ambulance');
                this.setModalVisible(true);
              }}
              onPressInfo={() => {
                Alert.alert(
                  'Info',
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dignissim congue risus ut accumsan'
                );
              }}
            />
          </View>
        </View>
      </View>
    ) : (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" style={{ marginBottom: 20 }} />
        <Text style={{ fontSize: 20 }}>Fetching your location</Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.home}>
        {this.renderGPSOffModal()}
        {this.renderLocationPermissionRequestModal()}
        {this.renderButtons()}
        {this.renderModal()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  home: {
    flex: 1,
    width: width,
    height: height,
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeModalButton: {
    position: 'absolute',
    margin: 14,
    right: 0,
    zIndex: 1
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
    fontFamily: 'Manjari-Regular',
    marginLeft: theme.SIZES.BASE * 2,
    marginRight: theme.SIZES.BASE * 2
  },
  locationPermissionModalDescription: {
    fontSize: 15,
    color: 'gray',
    textAlign: 'center',
    flex: 1,
    fontFamily: 'Manjari-Regular',
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
    margin: 12,
  },
  gpsOffModalTitleContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  gpsOffModalTitle: {
    fontSize: 30,
    textAlign: 'center',
    fontFamily: 'Manjari-Regular',
    marginLeft: theme.SIZES.BASE * 2,
    marginRight: theme.SIZES.BASE * 2
  },
  gpsOffModalDescription: {
    fontSize: 15,
    color: 'gray',
    textAlign: 'center',
  }
});

const mapStateToProps = state => {
  const { helperType, helperName } = state.requestHelp;
  const { permissionGranted, position } = state.location;
  return { helperType, helperName, permissionGranted, position };
};

export default connect(
  mapStateToProps,
  { selectHelperType, requestHelp, requestLocationPermission, updateLocation }
)(UserHome);
