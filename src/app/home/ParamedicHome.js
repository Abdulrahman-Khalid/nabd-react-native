import React, { Component } from 'react';
// import { Button } from '../../components';
import AsyncStorage from '@react-native-community/async-storage';
import { Block, Text, Button as GaButton, theme } from 'galio-framework';
import { Actions } from 'react-native-router-flux';
import { argonTheme } from '../../constants';
import { connect } from 'react-redux';
import { selectHelperType, requestHelp } from '../../actions';
import { StyleSheet, TouchableOpacity, View, Dimensions } from 'react-native';
import { Icon } from '../../components';
import RadioForm, { RadioButton } from 'react-native-simple-radio-button';
import axios from 'axios';
import PubNubReact from 'pubnub-react';

const { width, height } = Dimensions.get('screen');

class ParamedicHome extends Component {
  constructor(props) {
    super();
    this.state = {
      type: [
        { label: 'Doctor', value: 'doctor' },
        { label: 'Paramedic', value: 'paramedic' },
        { label: 'Ambulance', value: 'ambulance' }
      ],
      valueIndex: 0
    };
    props.selectHelperType('doctor');
    // Init PubNub. Use your subscribe key here.
    this.pubnub = new PubNubReact({
      subscribeKey: 'sub-key'
    });
    this.pubnub.init(this);
  }

  logoutButtonPressed() {
    axios.defaults.headers.common['TOKEN'] = '';
    AsyncStorage.clear()
      .then(() => Actions.welcome())
      .catch(() => {});
  }

  render() {
    return (
      <Block
        flex
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: argonTheme.COLORS.BACKGROUND
        }}
      >
        {/* <Text style={styles.welcome}>Request</Text> */}
        <View style={styles.component}>
          <RadioForm
            formHorizontal={true}
            animation={true}
            // style={{ paddingLeft: 20 }}
          >
            {this.state.type.map((obj, i) => {
              var that = this;
              var is_selected = this.state.valueIndex == i;
              return (
                <View key={i} style={styles.radioButtonWrap}>
                  <RadioButton
                    labelStyle={{ fontSize: 18, paddingTop: 5 }}
                    isSelected={is_selected}
                    obj={obj}
                    index={i}
                    labelHorizontal={false}
                    buttonColor={argonTheme.COLORS.APP}
                    labelColor={'#000'}
                    style={[
                      i !== this.state.type.length - 1 && styles.radioStyle
                    ]}
                    onPress={(value, index) => {
                      this.setState({ value: value });
                      this.setState({ valueIndex: index });
                      this.props.selectHelperType(value);
                    }}
                  />
                </View>
              );
            })}
          </RadioForm>
          {/* <Text>selected: {this.state.type[this.state.valueIndex].label}</Text> */}
        </View>

        <TouchableOpacity style={styles.circleStyle}>
          <Icon
            size={50}
            color={argonTheme.COLORS.WHITE}
            name="camera-video"
            family="LinearIcon"
            style={{
              textAlign: 'center'
            }}
          />
        </TouchableOpacity>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    marginTop: 20,
    marginBottom: 20,
    paddingRight: 15
  },
  component: {
    alignItems: 'center',
    marginBottom: 50
  },
  radioStyle: {
    borderRightWidth: 2,
    borderColor: argonTheme.COLORS.APP,
    paddingRight: 20
  },
  radioButtonWrap: {
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  circleStyle: {
    padding: 10,
    margin: 20,
    backgroundColor: argonTheme.COLORS.APP,
    borderRadius: 50,
    width: 100,
    height: 100,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5
  }
});

const mapStateToProps = state => {
  const { helperType, helperName } = state.requestHelp;
  return { helperType, helperName };
};

export default connect(
  mapStateToProps,
  { selectHelperType, requestHelp }
)(ParamedicHome);
