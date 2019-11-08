import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import LoginManager from '../videoCall/manager/LoginManager';
import CallManager from '../videoCall/manager/CallManager';
import { Voximplant } from 'react-native-voximplant';
import { Block, Text, Button, theme } from 'galio-framework';
import { Actions } from 'react-native-router-flux';
import { Colors, Images } from '../../constants';
import { connect } from 'react-redux';
import { info } from '../../constants';

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
  Modal,
  Platform,
  Switch,
  DeviceEventEmitter,
  ActivityIndicator,
  NativeModules,
  PermissionsAndroid
} from 'react-native';
import {
  Card,
  Modal as CustomModal,
  Icon as CustomIcon,
  LocationPicker
} from '../../components';
import axios from 'axios';
import RNSwipeVerify from 'react-native-swipe-verify';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { openSettings } from 'react-native-permissions';
import t from '../../I18n';
import RNSettings from 'react-native-settings';
import Geolocation from 'react-native-geolocation-service';
import ModalSelector from 'react-native-modal-selector';

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
    image: Images.ambulanceCard
  }
];

class UserHome extends Component {
  constructor(props) {
    super();
    this.state = {
      modalVisible: false,
      switchValue: true,
      gpsOffModal: false,
      startedWatch: false,
      client: Voximplant.getInstance(),
      currentCall: null,
      locationPickerModalVisible: false,
      ambulanceRequestLocation: {
        latitude: null,
        longitude: null
      },
      loading: false,
      loadingModalVisible: false
    };
    props.selectHelperType('doctor');
    this.requestAmbulance = this.requestAmbulance.bind(this);
  }

  componentDidMount() {
    LoginManager.getInstance().on('onConnectionClosed', this._connectionClosed);
    this.setState({ gpsOffModal: true });
    RNSettings.getSetting(RNSettings.LOCATION_SETTING).then(result => {
      if (result == RNSettings.ENABLED) {
        this.setState({ gpsOffModal: false });
      }
    });
    this.props.requestLocationPermission();
    console.log(this.props.permissionGranted);
    DeviceEventEmitter.addListener(
      RNSettings.GPS_PROVIDER_EVENT,
      this.handleGPSProviderEvent
    );
  }

  componentWillUnmount() {
    LoginManager.getInstance().off(
      'onConnectionClosed',
      this._connectionClosed
    );
  }

  _connectionClosed = () => {
    // Actions.welcome();
  };

  async makeCall(isVideoCall, helperNumber) {
    console.log(
      'MainScreen: make call: ' + helperNumber + ', isVideo:' + isVideoCall
    );
    try {
      if (Platform.OS === 'android') {
        let permissions = [PermissionsAndroid.PERMISSIONS.RECORD_AUDIO];
        if (isVideoCall) {
          permissions.push(PermissionsAndroid.PERMISSIONS.CAMERA);
        }
        const granted = await PermissionsAndroid.requestMultiple(permissions);
        const recordAudioGranted =
          granted['android.permission.RECORD_AUDIO'] === 'granted';
        const cameraGranted =
          granted['android.permission.CAMERA'] === 'granted';
        if (recordAudioGranted) {
          if (isVideoCall && !cameraGranted) {
            console.warn(
              'MainScreen: makeCall: camera permission is not granted'
            );
            return;
          }
        } else {
          console.warn(
            'MainScreen: makeCall: record audio permission is not granted'
          );
          return;
        }
      }
      const callSettings = {
        video: {
          sendVideo: isVideoCall,
          receiveVideo: isVideoCall
        }
      };
      if (Platform.OS === 'ios' && parseInt(Platform.Version, 10) >= 10) {
        const useCallKitString = await AsyncStorage.getItem('useCallKit');
        callSettings.setupCallKit = JSON.parse(useCallKitString);
      }

      let call = await Voximplant.getInstance().call(
        helperNumber,
        callSettings
      );
      let callManager = CallManager.getInstance();
      callManager.addCall(call);
      // if (callSettings.setupCallKit) {
      //   callManager.startOutgoingCallViaCallKit(isVideoCall, helperNumber);
      // }
      Actions.CallScreen({
        callId: call.callId,
        isVideo: isVideoCall,
        isIncoming: false
      });
    } catch (e) {
      console.warn('MainScreen: makeCall failed: ' + e);
    }
  }

  async videoCall(helperType, specialization) {
    console.log(helperType);
    // console.log('success login paramedic to call');
    // await LoginManager.getInstance()
    //   .loginWithPassword(
    //     this.props.phone.substring(1) +
    //       '@nabd.abdulrahman.elshafei98.voximplant.com',
    //     info.userPass
    //   )
    //   .then(() => {
    //     console.log('success login user to call');
    //     this.makeCall(true, '201011315102');
    //   });
    await LoginManager.getInstance()
      .loginWithPassword(
        this.props.phone.substring(1) + info.voxAccount,
        info.userPass
      )
      .then(() => {
        axios
          .post(
            `request/${helperType}`,
            helperType === 'doctor'
              ? {
                  specialization
                }
              : {}
          )
          .then(response => {
            console.log(response.data);
            if (response.data.helperNumber) {
              this.makeCall(true, helperNumber);
            } else {
              Alert.alert(t.CallFailed, t.NoHelperFound, [
                {
                  text: t.OK
                }
              ]);
            }
          })
          .catch(error => {
            console.log(error);
            Alert.alert(t.CallFailed, t.ServerError, [
              {
                text: t.OK
              }
            ]);
          });
      })
      .catch(error => {
        console.log(error);
        Alert.alert(t.CallFailed, t.ServerError, [
          {
            text: t.OK
          }
        ]);
      });
  }

  renderRequestDoctorCard() {
    const data = [
      { key: 0, section: true, label: t.DoctorSpecialization },
      {
        label: t.InternalMedicine,
        key: 1
      },
      {
        label: t.Cardiology,
        key: 2
      },
      {
        label: t.Neurology,
        key: 3
      },
      {
        label: t.Orthopaedic,
        key: 4
      },
      {
        label: t.Urology,
        key: 5
      },
      {
        label: t.OBGYN,
        key: 6
      },
      {
        label: t.Dermatology,
        key: 7
      },
      {
        label: t.Ophthalmology,
        key: 8
      },
      {
        label: t.Pediatrics,
        key: 9
      },
      {
        label: t.Otorhinolaryngology,
        key: 10
      }
    ];
    return (
      <ModalSelector
        style={{ flex: 1 }}
        cancelText={t.Cancel}
        data={data}
        ref={selector => {
          this.selector = selector;
        }}
        onChange={option => {
          this.videoCall('doctor', option.value);
        }}
        customSelector={
          <Card
            item={buttons[1]}
            style={{
              paddingTop: theme.SIZES.BASE,
              paddingRight: theme.SIZES.BASE,
              paddingLeft: theme.SIZES.BASE / 2,
              paddingBottom: theme.SIZES.BASE / 2
            }}
            onPress={() => {
              this.selector.open();
            }}
            onPressInfo={() => {
              Alert.alert(t.Info, t.DoctorAlert);
            }}
          />
        }
      />
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
        modalVisible: false,
        locationPickerModalVisible: true
      });
    } else {
      this.setState({
        modalVisible: false,
        loadingModalVisible: true
      });
      this.sendAmbulanceRequest(true);
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
          <Text style={{ fontSize: 18 }}>{t.SendCurrentLocation}</Text>
          <Switch
            value={this.state.switchValue}
            onValueChange={value => {
              this.setState({ switchValue: value });
            }}
          />
        </View>
        <View
          style={{
            marginTop: 20,
            marginBottom: 20
          }}
        >
          <TouchableOpacity
            style={styles.permissionModalButtonContainer}
            onPress={this.requestAmbulance}
          >
            <View
              style={[
                styles.permissionModalButton,
                {
                  backgroundColor: '#fdeaec'
                }
              ]}
            >
              <Text style={{ color: '#d76674', fontFamily: 'IstokWeb-Bold' }}>
                {t.Confirm}
              </Text>
            </View>
          </TouchableOpacity>
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
                <Text style={{ color: '#b3b3b2', fontFamily: 'IstokWeb-Bold' }}>
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
                <Text style={{ color: '#d76674', fontFamily: 'IstokWeb-Bold' }}>
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
                this.videoCall('paramedic', null);
              }}
              onPressInfo={() => {
                Alert.alert(t.Info, t.ParamedicAlert);
              }}
            />
            {this.renderRequestDoctorCard()}
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
                Alert.alert(t.Info, t.AmbulanceAlert);
              }}
            />
          </View>
        </View>
      </View>
    ) : (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" style={{ marginBottom: 20 }} />
        <Text style={{ fontSize: 20 }}>{t.FetchingLocation}</Text>
      </View>
    );
  }

  modalCancelOnPress = () => {
    this.setState({
      locationPickerModalVisible: false
    });
  };

  sendAmbulanceRequest = (sendCurrentLocation = false) => {
    if (sendCurrentLocation) {
      axios
        .post('request/ambulance', {
          userID: this.props.phone,
          pickupLocation: this.props.position.coords
        })
        .then(response => {
          this.setState({
            loadingModalVisible: false
          });
          Actions.WaitForAmbulance({ channelName: response.data.channelName });
        })
        .catch(err => {
          let error = JSON.stringify(err);
          error = JSON.parse(error);
          this.setState({
            loadingModalVisible: false
          });
        })
        .then(() => {
          this.setState({
            loadingModalVisible: false
          });
        });
    } else {
      this.setState({
        loading: true
      });
      axios
        .post('request/ambulance', {
          userID: this.props.phone,
          pickupLocation: this.state.ambulanceRequestLocation
        })
        .then(response => {
          Actions.WaitForAmbulance({ channelName: response.data.channelName });
        })
        .catch(err => {
          let error = JSON.stringify(err);
          error = JSON.parse(error);
          this.setState({
            loading: false,
            locationPickerModalVisible: false
          });
        })
        .then(() => {
          this.setState({
            loading: false,
            locationPickerModalVisible: false
          });
        });
    }
  };

  renderLocationPicker() {
    <Modal
      visible={this.state.locationPickerModalVisible}
      onRequestClose={this.modalCancelOnPress}
    >
      <LocationPicker
        onValueChange={region => {
          this.setState({
            ambulanceRequestLocation: {
              latitude: ambulanceRequestLocation.latitude,
              longitude: ambulanceRequestLocation.longitude
            }
          });
        }}
        cancelOnPress={this.modalCancelOnPress}
        onPressSubmit={this.sendAmbulanceRequest}
        loading={this.state.loading}
      />
    </Modal>;
  }

  renderLoadingModal() {
    return (
      <Modal visible={this.state.loadingModalVisible} transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <ActivityIndicator size="large" color="white" />
        </View>
      </Modal>
    );
  }

  render() {
    return (
      <View style={styles.home}>
        {this.renderGPSOffModal()}
        {this.renderLocationPermissionRequestModal()}
        {this.renderButtons()}
        {this.renderModal()}
        {this.renderLocationPicker()}
        {this.renderLoadingModal()}
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
    fontFamily: 'IstokWeb-Regular',
    marginLeft: theme.SIZES.BASE * 2,
    marginRight: theme.SIZES.BASE * 2
  },
  locationPermissionModalDescription: {
    fontSize: 15,
    color: 'gray',
    textAlign: 'center',
    flex: 1,
    fontFamily: 'IstokWeb-Regular',
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
    fontFamily: 'IstokWeb-Regular',
    marginLeft: theme.SIZES.BASE * 2,
    marginRight: theme.SIZES.BASE * 2
  },
  gpsOffModalDescription: {
    fontSize: 15,
    color: 'gray',
    textAlign: 'center'
  },
  container: {
    borderColor: 'grey',
    borderWidth: 1,
    padding: 15
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'stretch'
  },
  headerFooterContainer: {
    padding: 10,
    alignItems: 'center',
    fontSize: 20
  },
  clearButton: {
    backgroundColor: 'grey',
    borderRadius: 5,
    marginRight: 10,
    padding: 5
  },
  optionContainer: {
    padding: 10,
    borderBottomColor: 'grey',
    borderBottomWidth: 1
  },
  optionInnerContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  imageIconWrapper: {
    backgroundColor: '#E8E6E3',
    width: 32,
    height: 32,
    borderRadius: 32 / 2,
    margin: 5
  }
});

const mapStateToProps = state => {
  const { helperType, helperName } = state.requestHelp;
  const { permissionGranted, position } = state.location;
  const { phone } = state.signin;
  return { phone, helperType, helperName, permissionGranted, position };
};

export default connect(
  mapStateToProps,
  { selectHelperType, requestHelp, requestLocationPermission, updateLocation }
)(UserHome);
