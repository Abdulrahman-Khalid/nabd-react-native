import React, { Component } from 'react';
// import { Button } from '../../components';
import AsyncStorage from '@react-native-community/async-storage';
import { Block, Text, Button as GaButton, theme } from 'galio-framework';
import { Actions } from 'react-native-router-flux';
import { argonTheme } from '../../constants';
import { connect } from 'react-redux';
import { selectHelperType, requestHelp } from '../../actions';
import {
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions
} from 'react-native';
import { Icon } from '../../components';
import RadioForm, { RadioButton } from 'react-native-simple-radio-button';
import axios from 'axios';
import PubNubReact from 'pubnub-react';
import { CustomPicker } from 'react-native-custom-picker';

const { width, height } = Dimensions.get('screen');

class UserAndDoctorHome extends Component {
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

  renderHeader() {
    return (
      <View style={styles.headerFooterContainer}>
        <Text>Doctor specialization</Text>
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
        <Text>close</Text>
      </TouchableOpacity>
    );
  }

  renderField(settings) {
    const { selectedItem, defaultText, getLabel, clear } = settings;
    return (
      <View style={styles.container}>
        <View>
          {!selectedItem && (
            <Text style={[styles.text, { color: 'grey' }]}>{defaultText}</Text>
          )}
          {selectedItem && (
            <View style={styles.innerContainer}>
              <TouchableOpacity style={styles.clearButton} onPress={clear}>
                <Text style={{ color: '#fff' }}>مسح</Text>
              </TouchableOpacity>
              <Text style={[styles.text, { color: selectedItem.color }]}>
                {getLabel(selectedItem)}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }

  renderOption(settings) {
    const { item, getLabel } = settings;
    return (
      <View style={styles.optionContainer}>
        <View style={styles.innerContainer}>
          <View style={[styles.box, { backgroundColor: item.color }]} />
          <Text style={{ color: item.color, alignSelf: 'flex-start' }}>
            {getLabel(item)}
          </Text>
        </View>
      </View>
    );
  }

  isDoctorSelected() {
    // return <Text>this.props.helperType</Text>;
    if (this.props.helperType === 'doctor') {
      const options = [
        {
          color: '#2660A4',
          label: 'الباطنة والأمراض الصدرية',
          value: 1
        },
        {
          color: '#FF6B35',
          label: 'أمراض القلب والأوعية الدموية',
          value: 2
        },
        {
          color: '#FFBC42',
          label: 'العظام',
          value: 3
        },
        {
          color: '#AD343E',
          label: 'المسالك البولية',
          value: 4
        },
        {
          color: '#051C2B',
          label: 'النساء والتوليد',
          value: 5
        },
        {
          color: '#051C2B',
          label: 'الجلدية',
          value: 6
        },
        {
          color: '#051C2B',
          label: 'طب وجراحةالعيون',
          value: 7
        },
        {
          color: '#051C2B',
          label: 'أطفال',
          value: 7
        }
      ];
      return (
        <CustomPicker
          placeholder={'Please select your doctor specialization...'}
          options={options}
          getLabel={item => item.label}
          fieldTemplate={this.renderField}
          optionTemplate={this.renderOption}
          headerTemplate={this.renderHeader}
          footerTemplate={this.renderFooter}
          onValueChange={value => {
            Alert.alert(
              'Selected Item',
              value ? JSON.stringify(value) : 'No item were selected!'
            );
          }}
        />
      );
    }
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
        <View>{this.isDoctorSelected()}</View>

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
  text: {
    fontSize: 18
  },
  headerFooterContainer: {
    padding: 10,
    alignItems: 'center'
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
  box: {
    width: 20,
    height: 20,
    marginRight: 10
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
