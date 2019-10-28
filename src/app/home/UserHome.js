import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import LoginManager from '../videoCall/manager/LoginManager';
import CallManager from '../videoCall/manager/CallManager';
import { Voximplant } from 'react-native-voximplant';
import { CustomPicker } from 'react-native-custom-picker';
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
// import axios from 'axios';
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
      startedWatch: false,
      client: Voximplant.getInstance(),
      currentCall: null
    };
    props.selectHelperType('doctor');
    this.requestAmbulance = this.requestAmbulance.bind(this);
  }

  componentDidMount() {
    LoginManager.getInstance().on('onConnectionClosed', this._connectionClosed);
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

  componentDidUnmount() {
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
      if (callSettings.setupCallKit) {
        callManager.startOutgoingCallViaCallKit(isVideoCall, helperNumber);
      }
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
    await LoginManager.getInstance()
      .loginWithPassword(
        this.props.phone.substring(1) +
          '@nabd.abdulrahman.elshafei98.voximplant.com',
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
            console.log(response);
            if (response.data.helperNumber) this.makeCall(true, helperNumber);
          })
          .catch(error => {
            console.log(error);
            // alert try again later no user found
          });
      });
    // Alert.alert('Welcome', 'Hello');
  }

  renderHeader() {
    return (
      <View style={styles.headerFooterContainer}>
        <Text style={{ fontSize: 20 }}>تخصص الطبيب</Text>
      </View>
    );
  }

  renderFooter(action) {
    return (
      <TouchableOpacity
        style={styles.headerFooterContainer}
        onPress={() => {
          action.close();
        }}
      >
        <Text>اغلاق</Text>
      </TouchableOpacity>
    );
  }

  renderField(settings) {
    const { selectedItem, defaultText, getLabel, clear } = settings;
    return (
      // <View
      //   style={{
      //     backgroundColor: 'red',
      //     paddingTop: theme.SIZES.BASE,
      //     paddingRight: theme.SIZES.BASE,
      //     paddingLeft: theme.SIZES.BASE / 2,
      //     paddingBottom: theme.SIZES.BASE / 2
      //   }}
      // ></View>
      // <Image
      //   source={buttons[1].image}
      //   style={{
      //     width: width / 2,
      //     height: 200,
      //     paddingTop: theme.SIZES.BASE,
      //     paddingRight: theme.SIZES.BASE,
      //     paddingLeft: theme.SIZES.BASE / 2,
      //     paddingBottom: theme.SIZES.BASE / 2
      //   }}
      // />
      <Card
        item={buttons[1]}
        style={{
          width: width / 2,
          height: height / 3,
          paddingTop: theme.SIZES.BASE,
          paddingRight: theme.SIZES.BASE,
          paddingLeft: theme.SIZES.BASE / 2,
          paddingBottom: theme.SIZES.BASE / 2
        }}
        // onPress={() => {
        //   this.props.selectHelperType('aide');
        // }}
        onPressInfo={() => {
          Alert.alert(
            'Info',
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dignissim congue risus ut accumsan'
          );
        }}
      />
    );
  }

  renderOption(settings) {
    const { item, getLabel } = settings;
    return (
      <View style={styles.optionContainer}>
        <View style={styles.innerContainer}>
          {/* <View style={[styles.box, { backgroundColor: item.color }]} /> */}
          <Image style={styles.imageIconWrapper} source={item.img} />
          <Text
            style={{
              fontSize: 18,
              padding: 8,
              color: item.color,
              alignSelf: 'flex-start'
            }}
          >
            {getLabel(item)}
          </Text>
        </View>
      </View>
    );
  }

  renderRequestDoctorCard() {
    // return <Text>this.props.helperType</Text>;
    const options = [
      {
        color: '#051C2B',
        label: 'الباطنة والأمراض الصدرية',
        img: Images.lungIcon,
        value: 1
      },
      {
        color: '#051C2B',
        label: 'أمراض القلب والأوعية الدموية',
        img: Images.heartIcon,
        value: 2
      },
      {
        color: '#051C2B',
        label: 'مخ و أعصاب',
        img: Images.brainIcon,
        value: 3
      },
      {
        color: '#051C2B',
        label: 'العظام',
        img: Images.boneIcon,
        value: 4
      },
      {
        color: '#051C2B',
        label: 'المسالك بولية و التناسلية',
        img: Images.bladderIcon,
        value: 5
      },
      {
        color: '#051C2B',
        label: 'النساء والتوليد',
        img: Images.pregnantIcon,
        value: 6
      },
      {
        color: '#051C2B',
        label: 'الجلدية',
        img: Images.skinIcon,
        value: 7
      },
      {
        color: '#051C2B',
        label: 'طب وجراحةالعيون',
        img: Images.eyeIcon,
        value: 8
      },
      {
        color: '#051C2B',
        label: 'أطفال',
        img: Images.childIcon,
        value: 9
      },
      {
        color: '#051C2B',
        label: 'أنف و أذن و حنجرة',
        img: Images.throatIcon,
        value: 10
      }
    ];
    return (
      <CustomPicker
        options={options}
        getLabel={item => item.label}
        fieldTemplate={this.renderField}
        optionTemplate={this.renderOption}
        headerTemplate={this.renderHeader}
        footerTemplate={this.renderFooter}
        modalAnimationType="slide"
        onValueChange={item => {
          this.videoCall('doctor', item.value);
        }}
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
            Enable location services for a better experience
          </Text>
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
                Alert.alert(
                  'Info',
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque dignissim congue risus ut accumsan'
                );
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
