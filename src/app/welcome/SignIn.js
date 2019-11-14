import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  ActivityIndicator,
  StatusBar,
  Alert,
  Platform
} from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Icon } from '../../components';
import { Block, Text } from 'galio-framework';
import { Colors } from '../../constants';
import PhoneInput from 'react-native-phone-input';
import ModalPickerImage from './ModalPickerImage';
import { signInAttempt, fillSignInReducer } from '../../actions';
import { connect } from 'react-redux';
import t from '../../I18n';
import { Actions } from 'react-native-router-flux';
import { Spinner } from '../../components/Spinner';

const { width, height } = Dimensions.get('screen');

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      showAlert: false,
      pickerData: null,
      isValidNumber: false
    };

    this.onPressFlag = this.onPressFlag.bind(this);
    this.selectCountry = this.selectCountry.bind(this);
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

  isLoading() {
    // console.log('hi', this.state);
    return (
      <View style={styles.buttonsContainer}>
        {this.props.loading ? (
          <View style={[styles.buttonContainer, styles.button]}>
            <Spinner color={Colors.WHITE} size="small" />
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.buttonContainer, styles.button]}
            onPress={() => {
              if (!this.phone.isValidNumber()) {
                this.setState({ isValidNumber: false });
                console.log('is valid: ', this.phone.isValidNumber());
                this.showAlert();
              } else {
                this.setState({ isValidNumber: true });
                const { signInAttempt, phone, password, userType } = this.props;
                signInAttempt({
                  phone,
                  password,
                  userType
                });
                setTimeout(() => {
                  this.showAlert();
                }, 3000);
              }
            }}
          >
            <Text
              style={{
                color: Colors.WHITE,
                fontFamily:
                  this.props.language == 'en'
                    ? 'Quicksand-SemiBold'
                    : 'Tajawal-Medium'
              }}
            >
              {t.LogIn}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  errorMessage(isValidNumber) {
    var message = '';
    const { error } = this.props;
    console.log(`error is ${error}`);
    var num = 1;
    if (!isValidNumber) {
      message += `${num}) ${t.PhoneNotValid}\n`;
      num++;
    }
    if (error) {
      message += `${num}) ${error}\n`;
      num++;
    }
    console.log(message);
    return message;
  }

  showAlert = () => {
    this.setState({
      showAlert: true
    });
  };

  hideAlert = () => {
    this.setState({
      showAlert: false
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
          contentContainerStyle={{
            paddingTop: 20,
            flexDirection: 'column',
            justifyContent: 'center'
          }}
          behavior={Platform.OS == 'ios' ? 'padding' : null}
          // enabled
          scrollEnabled={true}
        >
          <Text
            style={{
              textAlign: 'left',
              fontSize: 50,
              marginLeft: 20,
              marginBottom: 25,
              fontFamily:
                this.props.language == 'en'
                  ? 'Quicksand-SemiBold'
                  : 'Tajawal-Medium'
            }}
          >
            {t.Welcome}
            {'\n'}
            {t.Back}
          </Text>
          <View>
            <View style={styles.inputContainer}>
              <PhoneInput
                ref={ref => {
                  this.phone = ref;
                }}
                initialCountry="eg"
                offset={22}
                onChangePhoneNumber={value => {
                  this.props.fillSignInReducer({
                    key: 'phone',
                    value
                  });
                }}
                onPressFlag={this.onPressFlag}
                style={{ paddingLeft: 13 }}
                textProps={{
                  placeholder: t.PhoneNumber
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
            <View style={styles.passwordContainer}>
              <Icon
                size={16}
                color={Colors.BLACK}
                name="padlock"
                family="flaticon"
                style={styles.inputIcons}
              />
              <TextInput
                style={styles.inputs}
                placeholder={t.Password}
                secureTextEntry={true}
                underlineColorAndroid="transparent"
                onChangeText={value =>
                  this.props.fillSignInReducer({
                    key: 'password',
                    value
                  })
                }
              />
            </View>
          </View>
          {this.isLoading()}
        </KeyboardAwareScrollView>

        <AwesomeAlert
          show={this.state.showAlert}
          showProgress={false}
          title={t.SignInFailed}
          message={this.errorMessage(this.state.isValidNumber)}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={false}
          showConfirmButton={true}
          confirmText={t.OK}
          confirmButtonColor={Colors.APP}
          onConfirmPressed={() => {
            this.hideAlert();
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch'
  },
  inputContainer: {
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 0,
    borderRadius: 30,
    height: 55,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    marginBottom: 10,
    justifyContent: 'center'
  },
  passwordContainer: {
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 0,
    borderRadius: 30,
    height: 55,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    marginBottom: 10,
    justifyContent: 'center'
  },
  inputs: {
    height: 55,
    borderBottomColor: '#FFFFFF',
    flex: 1
  },
  inputIcons: {
    alignSelf: 'center',
    margin: 10,
    marginLeft: 20
  },
  textButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 100,
    marginBottom: 10
  },
  loginButton: {
    backgroundColor: Colors.APP
  },
  loginText: {
    color: 'white'
  },
  phoneContainer: {
    borderColor: Colors.BORDER,
    height: 44,
    backgroundColor: '#FFFFFF',
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    shadowOpacity: 0.05,
    elevation: 2,
    justifyContent: 'center',
    paddingLeft: 10
  },
  buttonsContainer: {
    flexDirection: 'row',
    margin: 10,
    justifyContent: 'center'
  },
  buttonContainer: {
    width: '100%',
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
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: Colors.APP
  }
});

const mapSateToProps = state => {
  // console.log('state', state);
  const language = state.language.lang;
  const { userType } = state.openApp;
  const { phone, password, loading, error } = state.signin;
  return { phone, password, loading, userType, language, error };
};

export default connect(mapSateToProps, { signInAttempt, fillSignInReducer })(
  SignIn
);
