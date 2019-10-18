import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { Block, Text, Button, theme } from 'galio-framework';
import { Actions } from 'react-native-router-flux';
import { Colors, Images } from '../../constants';
import { connect } from 'react-redux';
import {
  selectHelperType,
  requestHelp,
  requestLocationPermission
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
  Platform
} from 'react-native';
import { Card, Modal as CustomModal } from '../../components';
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

const { width, height } = Dimensions.get('screen');

const buttons = [
  {
    title: 'Request an Aide',
    image: Images.aideCard
  },
  {
    title: 'Request a Doctor',
    image: Images.doctorCard
  },
  {
    title: 'Request an Ambulance',
    image: Images.ambulanceCard,
    horizontal: true
  }
];

const ambulanceRequestTypes = [
  { label: 'Send Current Location', value: 0 },
  { label: 'Set Location Manually', value: 1 }
];

class UserAndDoctorHome extends Component {
  constructor(props) {
    super();
    this.state = {
      ambulanceRequestType: 0,
      modalVisible: false
    };
    props.selectHelperType('doctor');
    // Init PubNub. Use your subscribe key here.
    this.pubnub = new PubNubReact({
      subscribeKey: 'sub-key'
    });
    this.pubnub.init(this);
  }

  componentDidMount() {
    this.props.requestLocationPermission();
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  requestAmbulance() {
    console.log('ambulance Request');
  }

  renderModal() {
    return (
      <CustomModal
        title="Choose an option"
        modalVisible={this.state.modalVisible}
        onRequestClose={() => {
          this.setModalVisible(false);
        }}
      >
        <RadioForm animation={true}>
          {ambulanceRequestTypes.map((obj, i) => {
            return (
              <RadioButton labelHorizontal={true} key={i}>
                <RadioButtonInput
                  obj={obj}
                  index={i}
                  isSelected={this.state.ambulanceRequestType === i}
                  onPress={value => {
                    this.setState({ ambulanceRequestType: value });
                  }}
                  borderWidth={1}
                  buttonInnerColor={'#2196f3'}
                  buttonOuterColor={
                    this.state.ambulanceRequestType === i ? '#2196f3' : '#000'
                  }
                  buttonSize={10}
                  buttonOuterSize={20}
                  buttonStyle={{}}
                  buttonWrapStyle={{ marginLeft: 20, marginBottom: 20 }}
                />
                <RadioButtonLabel
                  obj={obj}
                  index={i}
                  labelHorizontal={true}
                  onPress={value => {
                    this.setState({ ambulanceRequestType: value });
                  }}
                  labelStyle={{ fontSize: 20, marginBottom: 20 }}
                  labelWrapStyle={{}}
                />
              </RadioButton>
            );
          })}
        </RadioForm>
        <View
          style={{
            borderBottomColor: 'gray',
            borderBottomWidth: StyleSheet.hairlineWidth
          }}
        />
        <View style={{ marginTop: 20, marginBottom: 20 }}>
          <RNSwipeVerify
            width={width - 200}
            buttonSize={60}
            borderColor="#fff"
            buttonColor="#2196f3"
            backgroundColor="#ececec"
            borderRadius={30}
            okButton={{ visible: false, duration: 400 }}
            icon={<Icon name="gesture-swipe-right" size={25} />}
            onVerified={this.requestAmbulance}
          >
            <Text style={{ fontSize: 20 }}>Confirm</Text>
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
      <Modal
        visible={!this.props.locationPermissionGranted}
        animationType="fade"
      >
        <View
          style={styles.locationPermissionModalContainer}
        >
          <Image
            style={styles.locationPermissionImage}
            source={Images.locationPermission}
            resizeMode="center"
          />
          <View
            style={styles.locationPermissionModalTitleContainer}
          >
            <Text
              style={styles.locationPermissionModalTitle}
            >
              Nabd requires access to your location
            </Text>
          </View>
          <Text
            style={styles.locationPermissionModalDescription}
          >
            {Platform.OS === 'android' ? `In order to have help at your fingertips, location access is required. Press 'Open Settings' > Permissions > Location > Allow all the time > Go back to Nabd > Press 'Refresh'` 
            : 
            `In order to have help at your fingertips, location access is required. Press 'Open Settings' > Location > Always > Go back to Nabd > Press 'Refresh'`}
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

  logoutButtonPressed() {
    axios.defaults.headers.common['TOKEN'] = '';
    AsyncStorage.clear()
      .then(() => Actions.welcome())
      .catch(() => {});
  }

  renderButtons() {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.buttons}
      >
        <Block flex>
          <Block flex row>
            <Card
              item={buttons[0]}
              style={{ marginRight: theme.SIZES.BASE }}
              imageStyle={{ backgroundColor: 'red', opacity: 0.6 }}
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
              imageStyle={{ backgroundColor: 'green', opacity: 0.6 }}
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
          </Block>
          <Card
            style={{ marginBottom: theme.SIZES.BASE }}
            item={buttons[2]}
            full
            imageStyle={{ backgroundColor: 'blue', opacity: 0.6 }}
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
        </Block>
      </ScrollView>
    );
  }

  render() {
    return (
      <Block flex center style={styles.home}>
        {this.renderLocationPermissionRequestModal()}
        {this.renderButtons()}
        {this.renderModal()}
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  home: {
    width: width,
    height: height,
    alignContent: 'center'
  },
  buttons: {
    width: width - theme.SIZES.BASE * 2
  },
  closeModalButton: {
    position: 'absolute',
    margin: 10,
    right: -1,
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
  locationPermissionModalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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

});

const mapStateToProps = state => {
  const { helperType, helperName } = state.requestHelp;
  const locationPermissionGranted = state.location.permissionGranted;
  return { helperType, helperName, locationPermissionGranted };
};

export default connect(
  mapStateToProps,
  { selectHelperType, requestHelp, requestLocationPermission }
)(UserAndDoctorHome);
