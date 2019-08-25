import React from 'react';
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  View,
  KeyboardAvoidingView
} from 'react-native';
import PhoneInput from 'react-native-phone-input';
import ModalPickerImage from './ModalPickerImage';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';
import { Block, Checkbox, Text, theme } from 'galio-framework';
import { Button, Icon, Input } from '../../components';
import { Images, argonTheme } from '../../constants';
import DatePicker from 'react-native-datepicker';
import { connect } from 'react-redux';
import { Spinner } from '../../components/Spinner';
import { signUpAttempt, fillSignUpForm } from '../../actions';

const { width, height } = Dimensions.get('screen');

class Register extends React.Component {
  constructor() {
    super();
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year

    this.onPressFlag = this.onPressFlag.bind(this);
    this.selectCountry = this.selectCountry.bind(this);

    this.state = {
      pickerData: null,
      todayDate: year + '-' + month + '-' + date,
      birthday: year + '-' + month + '-' + date,
      gender: 'male'
    };
  }

  componentDidMount() {
    this.setState({
      pickerData: this.phone.getPickerData()
    });
  }

  onPressFlag() {
    this.myCountryPicker.open();
  }

  selectCountry(country) {
    this.phone.selectCountry(country.iso2);
  }

  onSelect(index, value) {
    this.setState({
      gender: value
    });
  }

  isLoading() {
    console.log('hi', this.state);
    if (this.props.loading) {
      return <Spinner color={argonTheme.COLORS.APP} />;
    }
    return (
      <Block middle>
        <Button
          color="primary"
          onPress={() =>
            this.props.signUpAttempt({
              name: this.props.name,
              phone: this.phone.getValue(),
              birthday: new Date(`${this.state.birthday}T00:00:00`),
              gender: this.state.gender,
              password: this.props.password,
              confirmPassword: this.props.confirmPassword,
              userType: this.props.userType
            })
          }
          // console.log(
          //   this.phone.isValidNumber(),
          //   this.phone.getValue()
          // );
          style={styles.createButton}
        >
          <Text bold size={14} color={argonTheme.COLORS.WHITE}>
            CREATE ACCOUNT
          </Text>
        </Button>
      </Block>
    );
  }

  render() {
    return (
      <Block flex middle style={{ backgroundColor: 'white' }}>
        <StatusBar hidden />
        <Block flex middle>
          <Block style={styles.registerContainer}>
            <Block flex>
              <Block flex={0.05} middle />
              <Block flex center>
                <KeyboardAvoidingView
                  style={{ flex: 1 }}
                  behavior="padding"
                  enabled
                >
                  <Block width={width * 0.75} style={{ marginBottom: 15 }}>
                    <Input
                      borderless
                      placeholder="Name"
                      iconContent={
                        <Icon
                          size={16}
                          color={argonTheme.COLORS.ICON}
                          name="hat-3"
                          family="ArgonExtra"
                          style={styles.inputIcons}
                        />
                      }
                      onChangeText={value =>
                        this.props.fillSignUpForm({ key: 'name', value })
                      }
                      value={this.props.name}
                    />
                  </Block>
                  <Block width={width * 0.75} style={{ marginBottom: 15 }}>
                    <View style={styles.phoneContainer}>
                      <PhoneInput
                        ref={ref => {
                          this.phone = ref;
                        }}
                        initialCountry="eg"
                        onPressFlag={this.onPressFlag}
                        textProps={{
                          placeholder: 'Phone'
                        }}
                      />

                      <ModalPickerImage
                        ref={ref => {
                          this.myCountryPicker = ref;
                        }}
                        data={this.state.pickerData}
                        onChange={country => {
                          this.selectCountry(country);
                        }}
                        cancelText="Cancel"
                      />
                    </View>
                  </Block>
                  <Block width={width * 0.75} style={{ marginBottom: 7 }}>
                    <Input
                      password
                      borderless
                      placeholder="Password"
                      iconContent={
                        <Icon
                          size={16}
                          color={argonTheme.COLORS.ICON}
                          name="padlock-unlocked"
                          family="ArgonExtra"
                          style={styles.inputIcons}
                        />
                      }
                      onChangeText={value =>
                        this.props.fillSignUpForm({ key: 'password', value })
                      }
                      value={this.props.password}
                    />
                  </Block>
                  <Block width={width * 0.75}>
                    <Input
                      password
                      borderless
                      placeholder="Confirm Password"
                      iconContent={
                        <Icon
                          size={16}
                          color={argonTheme.COLORS.ICON}
                          name="padlock-unlocked"
                          family="ArgonExtra"
                          style={styles.inputIcons}
                        />
                      }
                      onChangeText={value =>
                        this.props.fillSignUpForm({
                          key: 'confirmPassword',
                          value
                        })
                      }
                      value={this.props.confirmPassword}
                    />

                    <Block row style={styles.passwordCheck}>
                      <Text size={12} color={argonTheme.COLORS.MUTED}>
                        password strength:
                      </Text>
                      <Text
                        bold
                        size={12}
                        style={{ paddingLeft: 2 }}
                        color={argonTheme.COLORS.SUCCESS}
                      >
                        strong
                      </Text>
                    </Block>
                  </Block>
                  <Block center>
                    <Block
                      style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        marginTop: 10,
                        marginBottom: 15,
                        paddingRight: 20
                      }}
                    >
                      {/* <Text style={styles.hardText}>Birthday:</Text> */}
                      <DatePicker
                        style={{ width: 200 }}
                        date={this.state.birthday}
                        mode="date"
                        placeholder="Birthday"
                        format="YYYY-MM-DD"
                        minDate="1950-01-01"
                        maxDate={this.state.todayDate}
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                          placeholderText: 'Your birthday',
                          dateText: {
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: 'gray'
                          },
                          dateIcon: {
                            position: 'absolute',
                            left: 0,
                            top: 4,
                            marginLeft: 0,
                            margin: 0
                          },
                          dateInput: {
                            marginLeft: 36
                          }
                          // ... You can check the source to find the other keys.
                        }}
                        onDateChange={date => {
                          this.setState({ birthday: date });
                        }}
                      />
                    </Block>
                    <View
                      style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        marginBottom: 15,
                        marginTop: 0,
                        padding: 0
                      }}
                    >
                      {/* <Text style={styles.hardText}>Gender:</Text> */}
                      <RadioGroup
                        size={20}
                        style={{ float: 'left', margin: 0, padding: 0 }}
                        thickness={2}
                        color={argonTheme.COLORS.APP}
                        selectedIndex={0}
                        onSelect={(index, value) => this.onSelect(index, value)}
                        style={{
                          flexDirection: 'row',
                          flexWrap: 'wrap'
                        }}
                      >
                        <RadioButton
                          style={{
                            padding: 5,
                            paddingRight: 10
                          }}
                          value={'male'}
                        >
                          <Text>Male</Text>
                        </RadioButton>

                        <RadioButton
                          style={{
                            padding: 5
                          }}
                          value={'female'}
                        >
                          <Text>Female</Text>
                        </RadioButton>
                      </RadioGroup>
                    </View>
                  </Block>
                  <Block row width={width * 0.755}>
                    <Checkbox
                      checkboxStyle={{
                        borderWidth: 3
                      }}
                      color={argonTheme.COLORS.APP}
                      label="I agree with the"
                    />
                    <Button
                      style={{ width: 100 }}
                      color="transparent"
                      textStyle={{
                        color: argonTheme.COLORS.PRIMARY,
                        fontSize: 14
                      }}
                    >
                      Privacy Policy
                    </Button>
                  </Block>
                  {this.isLoading()}
                </KeyboardAvoidingView>
              </Block>
            </Block>
          </Block>
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  registerContainer: {
    width: width * 0.9,
    height: height * 0.8,
    backgroundColor: '#F4F5F7',
    borderRadius: 4,
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: 'hidden'
  },
  socialConnect: {
    backgroundColor: argonTheme.COLORS.WHITE,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#8898AA'
  },
  socialButtons: {
    width: 120,
    height: 40,
    backgroundColor: '#fff',
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1
  },
  socialTextButtons: {
    color: argonTheme.COLORS.PRIMARY,
    fontWeight: '800',
    fontSize: 14
  },
  inputIcons: {
    marginRight: 12,
    paddingRight: 12
  },
  passwordCheck: {
    paddingLeft: 15,
    paddingTop: 13,
    paddingBottom: 10
  },
  createButton: {
    width: width * 0.75,
    marginTop: 20,
    backgroundColor: argonTheme.COLORS.APP
  },
  phoneContainer: {
    borderRadius: 4,
    borderColor: argonTheme.COLORS.BORDER,
    height: 44,
    backgroundColor: '#FFFFFF',
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    shadowOpacity: 0.05,
    elevation: 2,
    justifyContent: 'center',
    paddingLeft: 10
  },
  hardText: { fontSize: 20, marginRight: 10 },
  success: {
    borderColor: argonTheme.COLORS.INPUT_SUCCESS
  },
  error: {
    borderColor: argonTheme.COLORS.INPUT_ERROR
  }
});

const mapSateToProps = state => {
  console.log(state);
  const { userType } = state.openApp;
  const { name, password, confirmPassword, loading } = state.signup;
  return { name, password, confirmPassword, loading, userType };
};

export default connect(
  mapSateToProps,
  { signUpAttempt, fillSignUpForm }
)(Register);
