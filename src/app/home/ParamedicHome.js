import React, { Component } from 'react';
import { theme } from 'galio-framework';
import { Actions } from 'react-native-router-flux';
import { Colors, Images } from '../../constants';
import { connect } from 'react-redux';
import { selectHelperType, requestHelp } from '../../actions';
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
  NativeModules
} from 'react-native';
import { Icon, SwitchButton } from '../../components';
import RadioForm, { RadioButton } from 'react-native-simple-radio-button';
import axios from 'axios';
import t from '../../I18n';
import io from 'socket.io-client';
const { width, height } = Dimensions.get('screen');

class ParamedicHome extends Component {
  constructor(props) {
    super();
    this.state = {
      switchValue: false
    };
    this.socket = io.connect(
      axios.defaults.baseURL.substring(0, axios.defaults.baseURL.length - 4),
      {
        timeout: 10000,
        jsonp: false,
        transports: ['websocket'],
        autoConnect: false,
        agent: '-',
        path: '/', // Whatever your path is
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
  }

  componentWillUnmount() {
    LoginManager.getInstance().off(
      'onConnectionClosed',
      this._connectionClosed
    );
  }

  toggleAvailableSwitch(available) {
    if (available) {
      this.socket.open();
      console.log(this.props.phoneNumber + this.props.userType);
      this.socket.emit('available', {
        phoneNumber: this.props.phoneNumber,
        userType: this.props.userType,
        specialization: this.props.specialization
      });
    } else {
      this.socket.close();
    }
  }

  startSearching = () => {
    console.log('start Searching');
  };

  componentWillUnmount() {
    this.socket.close();
  }

  render() {
    return (
      <View>
        <TouchableOpacity onPress={this.startSearching}>
          <SwitchButton
            text1={t.UnAvailable}
            text2={t.Available}
            onValueChange={switchValue => {
              this.setState({
                switchValue
              });
              switch (switchValue) {
                case 1:
                  this.toggleAvailableSwitch(false);
                case 2:
                  this.toggleAvailableSwitch(true);
                  break;
              }
            }}
            fontColor="#817d84"
            switchWidth={250}
            activeFontColor="black"
            switchdirection="rtl"
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({});

const mapStateToProps = state => ({
  phoneNumber: state.signin.phone.substring(1),
  userType: state.signin.userType,
  specialization: state.signin.specialization,
  token: state.signin.token
});

export default connect(
  mapStateToProps,
  { selectHelperType, requestHelp }
)(ParamedicHome);
