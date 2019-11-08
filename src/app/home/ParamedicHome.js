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
      available: false
    };
    this.socket = io(
      axios.defaults.baseURL.substring(0, axios.defaults.baseURL.length - 4),
      { autoConnect: false }
    );
  }

  componentDidMount() {
    LoginManager.getInstance()
      .loginWithPassword(
        this.props.phoneNumber.substring(1) +
          '@nabd.abdulrahman.elshafei98.voximplant.com',
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

  componentDidUpdate() {
    console.log(this.props);
    if (this.state.available) {
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
    console.log(this.socket.connected);
  }

  startSearching = () => {
    console.log('start Searching');
  };

  render() {
    return (
      <View>
        <TouchableOpacity onPress={this.startSearching}>
          <SwitchButton
            text1={t.Available}
            text2={t.UnAvailable}
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
            switchdirection={NativeModules.I18nManager.isRTL}
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
  specialization: state.signin.specialization
});

export default connect(
  mapStateToProps,
  { selectHelperType, requestHelp }
)(ParamedicHome);
