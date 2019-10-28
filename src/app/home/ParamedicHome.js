import React, { Component } from 'react';
import { theme } from 'galio-framework';
import { Actions } from 'react-native-router-flux';
import { Colors, Images } from '../../constants';
import { connect } from 'react-redux';
import { selectHelperType, requestHelp } from '../../actions';
import {
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
  Text
} from 'react-native';
import { Icon } from '../../components';
import RadioForm, { RadioButton } from 'react-native-simple-radio-button';
import axios from 'axios';
import t from '../../I18n';
import io from 'socket.io-client';

const { width, height } = Dimensions.get('screen');

class ParamedicHome extends Component {
  constructor(props) {
    super();
    this.state = {};
  }

  componentDidMount() {
    const socket = io(axios.defaults.baseURL.substring(0, axios.defaults.baseURL.length - 4));
    socket.connect();
  }

  startSearching = () => {
    console.log('start Searching');
  };

  render() {
    return (
      <View>
        <TouchableOpacity onPress={this.startSearching}>
          <Text>I'm Available</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({});

const mapStateToProps = state => {
  const { helperType, helperName } = state.requestHelp;
  return { helperType, helperName };
};

export default connect(
  mapStateToProps,
  { selectHelperType, requestHelp }
)(ParamedicHome);
