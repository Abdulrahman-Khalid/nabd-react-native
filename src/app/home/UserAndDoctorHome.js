import React, { Component } from 'react';
// import { Button } from '../../components';
import AsyncStorage from '@react-native-community/async-storage';
import { Block, Text, Button as GaButton, theme } from 'galio-framework';
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
  Image
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
        <Text style={{ fontSize: 20 }}>Doctor specialization</Text>
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
              <TouchableOpacity onPress={clear}>
                <Image
                  style={[
                    {
                      width: 12,
                      height: 12,
                      margin: 12
                    },
                    styles.shadow
                  ]}
                  source={Images.clearIcon}
                />
              </TouchableOpacity>
              <Image
                style={[styles.imageIconWrapper, styles.shadow]}
                source={selectedItem.img}
              />
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

  isDoctorSelected() {
    // return <Text>this.props.helperType</Text>;
    if (this.props.helperType === 'doctor') {
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
          value: 9
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
    fontSize: 18,
    padding: 8
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
  box: {
    width: 20,
    height: 20,
    marginRight: 10
  },
  imageIcon: {},
  imageIconWrapper: {
    backgroundColor: '#E8E6E3',
    width: 32,
    height: 32,
    borderRadius: 32 / 2,
    margin: 5
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2
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
