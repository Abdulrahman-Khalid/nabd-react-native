import React from 'react';
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  View,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity
} from 'react-native';
import PhoneInput from 'react-native-phone-input';
import ModalPickerImage from './ModalPickerImage';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';
import { theme } from 'galio-framework';
import { Button, Icon, Input } from '../../components';
import { Images, Colors } from '../../constants';
import DatePicker from 'react-native-datepicker';
import { connect } from 'react-redux';
import { Spinner } from '../../components/Spinner';
import {
  signUpAttempt,
  fillSignUpForm,
  validateName,
  validateConfirmPassword,
  validateBirthday,
  validatePhone
} from '../../actions';
import AwesomeAlert from 'react-native-awesome-alerts';
import { TextInput } from 'react-native-paper';

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
      todayDate: date + '-' + month + '-' + year,
      birthday: date + '-' + month + '-' + year,
      gender: 'male',
      showAlert: false
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

  createAccountPressed = () => {
    const {
      password,
      nameError,
      phoneError,
      passError,
      passMatchError,
      birthdayError,
      fillSignUpForm,
      validateBirthday
    } = this.props;

    fillSignUpForm({
      key: 'password',
      value: password
    });
    this.loseNameFocus();
    this.losePhoneFocus();
    validateBirthday(this.state.birthday);
    this.loseConfirmPasswordFocus();

    if (
      nameError ||
      phoneError ||
      passError ||
      passMatchError ||
      birthdayError
    ) {
      this.showAlert();
    } else {
      this.props.signUpAttempt({
        name: this.props.name,
        phone: this.phone.getValue(),
        birthday: new Date(this.state.birthday),
        gender: this.state.gender,
        password: this.props.password,
        confirmPassword: this.props.confirmPassword,
        userType: this.props.userType
      });
    }
  };

  isLoading() {
    // console.log('hi', this.state);
    return (
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={this.createAccountPressed}
        >
          <View style={styles.button}>
            {this.props.loading ? (
              <Spinner color={Colors.WHITE} size="small" />
            ) : (
              <Text style={{ color: Colors.WHITE, fontFamily: 'Manjari-Bold' }}>
                Create Account
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  loseNameFocus() {
    this.props.validateName(this.props.name);
  }

  loseConfirmPasswordFocus() {
    const { password, confirmPassword } = this.props;
    this.props.validateConfirmPassword(password, confirmPassword);
  }

  losePhoneFocus() {
    this.props.validatePhone(this.phone.isValidNumber());
  }

  onChangePassword(password) {
    this.props.fillSignUpForm({ key: 'password', value: password });

    if (this.props.confirmPassword) {
      this.props.validateConfirmPassword(password, this.props.confirmPassword);
    }
  }

  phoneInputBorderColor() {
    const { isSuccessPhone, isErrorPhone } = this.props;
    const shadow = {
      borderBottomColor: Colors.BORDER,
      height: 44,
      backgroundColor: '#FFFFFF',
      borderBottomWidth: 4
    };

    if (isSuccessPhone) {
      return {
        ...shadow,
        borderBottomColor: Colors.INPUT_SUCCESS
      };
    } else if (isErrorPhone) {
      return {
        ...shadow,
        borderBottomColor: Colors.INPUT_ERROR
      };
    }
    return shadow;
  }

  errorMessage() {
    var message = '';
    const {
      nameError,
      phoneError,
      passError,
      passMatchError,
      birthdayError
    } = this.props;
    var num = 1;
    if (nameError) {
      message += `${num}) ${nameError}\n`;
      num++;
    }
    if (phoneError) {
      message += `${num}) ${phoneError}\n`;
      num++;
    }
    if (passError) {
      message += `${num}) ${passError}\n`;
      num++;
    }
    if (passMatchError) {
      message += `${num}) ${passMatchError}\n`;
      num++;
    }
    if (birthdayError) {
      message += `${num}) ${birthdayError}`;
      num++;
    }
    return message;
  }

  showAlert = () => {
    this.setState({
      ...this.state,
      showAlert: true
    });
  };

  hideAlert = () => {
    this.setState({
      ...this.state,
      showAlert: false
    });
  };

  render() {
    return (
      <KeyboardAvoidingView
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%'
        }}
        behavior={Platform.OS == 'ios' ? 'padding' : null}
        enabled
      >
        <View style={{ flex: 2, marginTop: 10 }}>
          <View
            style={{
              marginHorizontal: 15,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Text
              style={{
                textAlign: 'left',
                fontSize: 40,
                fontWeight: 'bold',
                marginLeft: 10,
                lineHeight: 50,
                alignSelf: 'flex-start'
              }}
            >
              Create{'\n'}Account
            </Text>
            <Input
              placeholder="Name"
              error={this.props.isErrorName}
              success={this.props.isSuccessName}
              onBlur={this.loseNameFocus.bind(this)}
              iconContent={
                <Icon
                  size={16}
                  color={Colors.BLACK}
                  name="avatar"
                  family="flaticon"
                  style={styles.inputIcons}
                />
              }
              onChangeText={value =>
                this.props.fillSignUpForm({ key: 'name', value })
              }
              value={this.props.name}
            />
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%'
            }}
          >
            <View
              style={{
                ...styles.phoneContainer,
                ...this.phoneInputBorderColor()
              }}
            >
              <PhoneInput
                ref={ref => {
                  this.phone = ref;
                }}
                initialCountry="eg"
                onPressFlag={this.onPressFlag}
                textProps={{
                  onBlur: this.losePhoneFocus.bind(this),
                  placeholder: 'Phone'
                }}
                style={{ flex: 1, width: '100%' }}
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
          </View>
          <View
            style={{
              marginHorizontal: 15,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Input
              password
              error={this.props.isErrorPass}
              success={this.props.isSuccessPass}
              placeholder="Password"
              onBlur={() =>
                this.props.fillSignUpForm({
                  key: 'password',
                  value: this.props.password
                })
              }
              iconContent={
                <Icon
                  size={16}
                  color={Colors.BLACK}
                  name="padlock"
                  family="flaticon"
                  style={styles.inputIcons}
                />
              }
              onChangeText={this.onChangePassword.bind(this)}
              value={this.props.password}
            />
          </View>
          <View
            style={{
              marginHorizontal: 15,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Input
              password
              error={this.props.isErrorPassMatch}
              success={
                this.props.isSuccessPassMatch && this.props.confirmPassword
              }
              placeholder="Confirm Password"
              onBlur={this.loseConfirmPasswordFocus.bind(this)}
              iconContent={
                <Icon
                  size={16}
                  color={Colors.BLACK}
                  name="padlock"
                  family="flaticon"
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
            <View row style={styles.passwordCheck}>
              <Text size={12} color={Colors.MUTED}>
                Password strength:
              </Text>
              <Text
                bold
                size={12}
                style={{ color: this.props.passStrengthColor }}
              >
                {' '}
                {this.props.passStrengthText}
              </Text>
            </View>
          </View>
          <View
            style={{
              marginTop: 15,
              marginHorizontal: 15,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <View
              style={{
                borderRadius: 30,
                flexDirection: 'row',
                marginBottom: 15,
                backgroundColor: Colors.WHITE,
                paddingLeft: 20
              }}
            >
              <Icon
                size={20}
                color={Colors.BLACK}
                name="calendar-full"
                family="LinearIcon"
                style={{ alignSelf: 'center' }}
              />
              {/* <Text style={styles.hardText}>Birthday:</Text> */}
              <DatePicker
                style={{ width: 140 }}
                date={this.state.birthday}
                mode="date"
                placeholder="Birthday"
                format="DD-MM-YYYY"
                minDate="01-01-1920"
                maxDate={this.state.todayDate}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                showIcon={false}
                customStyles={{
                  dateTouchBody: {},
                  placeholderText: 'Select your birthdate',
                  dateText: {
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: 'gray'
                  },
                  dateInput: {
                    borderWidth: 0
                  }
                }}
                onDateChange={date => {
                  this.setState({ ...this.state, birthday: date });
                }}
              />
            </View>
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
                color={Colors.APP}
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
          </View>
        </View>
        <AwesomeAlert
          show={this.state.showAlert}
          showProgress={false}
          title="Sign up failed"
          message={this.errorMessage()}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={false}
          showConfirmButton={true}
          confirmText="OK"
          confirmButtonColor={Colors.APP}
          onConfirmPressed={() => {
            this.hideAlert();
          }}
        />
        {this.isLoading()}
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  registerContainer: {
    width: width * 0.9,
    height: height * 0.8,
    shadowColor: Colors.BLACK,
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
    backgroundColor: Colors.WHITE,
    borderBottomWidth: 4,
    borderColor: '#8898AA'
  },
  socialButtons: {
    width: 120,
    height: 40,
    backgroundColor: '#fff',
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1
  },
  socialTextButtons: {
    color: Colors.PRIMARY,
    fontWeight: '800',
    fontSize: 14
  },
  inputIcons: {
    marginRight: 12,
    paddingRight: 12
  },
  passwordCheck: {
    paddingLeft: 10,
    flexDirection: 'row',
    width: '100%'
  },
  createButton: {
    width: width * 0.75,
    marginTop: 20,
    backgroundColor: Colors.APP
  },
  phoneContainer: {
    paddingLeft: 15,
    borderWidth: 0,
    borderRadius: 30,
    borderBottomColor: Colors.BORDER,
    height: 44,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    marginVertical: 7
  },
  hardText: { fontSize: 20, marginRight: 10 },
  success: {
    borderColor: Colors.INPUT_SUCCESS
  },
  error: {
    borderColor: Colors.INPUT_ERROR
  },
  buttonsContainer: {
    flexDirection: 'row',
    margin: 10,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  buttonContainer: {
    flex: 1,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  button: {
    height: 44,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    flexDirection: 'row',
    backgroundColor: Colors.APP
  }
});

const mapSateToProps = state => {
  // console.log('Register State: ', state);
  const { userType } = state.openApp;
  //add in the reducer signup (birthday)
  const {
    name,
    password,
    confirmPassword,
    loading,
    nameError,
    passError,
    phoneError,
    passMatchError,
    birthdayError,
    passStrengthText,
    passStrengthColor,
    isSuccessName,
    isErrorName,
    isSuccessPhone,
    isErrorPhone,
    isSuccessPass,
    isErrorPass,
    isSuccessPassMatch,
    isErrorPassMatch
  } = state.signup;
  return {
    name,
    password,
    confirmPassword,
    loading,
    userType,
    nameError,
    phoneError,
    passError,
    passMatchError,
    birthdayError,
    passStrengthText,
    passStrengthColor,
    isSuccessName,
    isErrorName,
    isSuccessPhone,
    isErrorPhone,
    isSuccessPass,
    isErrorPass,
    isSuccessPassMatch,
    isErrorPassMatch
  };
};

export default connect(
  mapSateToProps,
  {
    signUpAttempt,
    fillSignUpForm,
    validateName,
    validateConfirmPassword,
    validateBirthday,
    validatePhone
  }
)(Register);
