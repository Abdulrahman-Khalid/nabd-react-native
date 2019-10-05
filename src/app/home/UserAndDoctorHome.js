import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { Block, Text, Button, theme } from 'galio-framework';
import { Actions } from 'react-native-router-flux';
import { argonTheme, Images } from '../../constants';
import { connect } from 'react-redux';
import { selectHelperType, requestHelp } from '../../actions';
import {
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
  ScrollView
} from 'react-native';
import { Card, Modal } from '../../components';
import axios from 'axios';
import PubNubReact from 'pubnub-react';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel
} from 'react-native-simple-radio-button';
import RNSwipeVerify from 'react-native-swipe-verify';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';

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

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  requestAmbulance() {
    console.log('ambulance Request');
  }

  renderModal() {
    return (
      <Modal
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
  }
});

const mapStateToProps = state => {
  const { helperType, helperName } = state.requestHelp;
  return { helperType, helperName };
};

export default connect(
  mapStateToProps,
  { selectHelperType, requestHelp }
)(UserAndDoctorHome);
