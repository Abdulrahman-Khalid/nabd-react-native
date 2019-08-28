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
  Alert
} from 'react-native';
import { Block, Text } from 'galio-framework';
import { argonTheme } from '../../constants';
import PhoneInput from 'react-native-phone-input';
import ModalPickerImage from './ModalPickerImage';
import { signInAttempt, fillSignInForm } from '../../actions';
import { connect } from 'react-redux';

const { width, height } = Dimensions.get('screen');

class SignIn extends Component {
  constructor(props) {
    super(props);
    state = {
      email: '',
      password: ''
    };

    this.onPressFlag = this.onPressFlag.bind(this);
    this.selectCountry = this.selectCountry.bind(this);
    this.state = {
      pickerData: null
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

  onClickListener = ViewId => {
    Alert.alert('Alert', 'Button pressed ' + ViewId);
  };

  isLoading() {
    console.log('hi', this.state);
    if (this.props.loading) {
      return <ActivityIndicator size="large" color={argonTheme.COLORS.APP} />;
    }
    return (
      <TouchableOpacity
        style={[styles.buttonContainer, styles.loginButton]}
        onPress={() => {
          const { signInAttempt, phone, password, userType } = this.props;
          signInAttempt({
            phone,
            password,
            userType
          });
        }}
      >
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
    );
  }
  render() {
    return (
      <Block flex middle style={{ backgroundColor: '#fff' }}>
        <StatusBar hidden />
        <Block flex middle>
          <View>
            <Block style={styles.loginContainer}>
              <View style={styles.container}>
                <KeyboardAvoidingView>
                  <View style={styles.inputContainer}>
                    <PhoneInput
                      ref={ref => {
                        this.phone = ref;
                      }}
                      initialCountry="eg"
                      offset={22}
                      onChangePhoneNumber={value => {
                        this.props.fillSignInForm({
                          key: 'phone',
                          value
                        });
                      }}
                      onPressFlag={this.onPressFlag}
                      style={{ paddingLeft: 13 }}
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
                  <View style={styles.inputContainer}>
                    <Image
                      style={styles.inputIcon}
                      source={{
                        uri:
                          'https://img.icons8.com/office/50/000000/key-security.png'
                      }}
                    />
                    <TextInput
                      style={styles.inputs}
                      placeholder="Password"
                      secureTextEntry={true}
                      underlineColorAndroid="transparent"
                      onChangeText={value =>
                        this.props.fillSignInForm({
                          key: 'password',
                          value
                        })
                      }
                    />
                  </View>
                </KeyboardAvoidingView>

                <View>{this.isLoading()}</View>

                <TouchableHighlight
                  underlayColor={argonTheme.COLORS.APP}
                  style={styles.buttonContainer}
                  onPress={() => this.onClickListener('restore_password')}
                >
                  <Text>Forgot your password?</Text>
                </TouchableHighlight>

                <TouchableHighlight
                  underlayColor={argonTheme.COLORS.APP}
                  style={styles.buttonContainer}
                  onPress={() => this.onClickListener('register')}
                >
                  <Text>Register</Text>
                </TouchableHighlight>
              </View>
            </Block>
          </View>
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  loginContainer: {
    width: width * 0.8,
    height: height * 0.6,
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCDCDC'
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderBottomWidth: 1,
    width: 250,
    height: 45,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1
  },
  inputIcon: {
    width: 30,
    height: 30,
    marginLeft: 15,
    justifyContent: 'center'
  },
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    width: 250,
    borderRadius: 30
  },
  loginButton: {
    backgroundColor: argonTheme.COLORS.APP
  },
  loginText: {
    color: 'white'
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
  }
});

const mapSateToProps = state => {
  console.log('state', state);
  const { userType } = state.openApp;
  const { phone, password, loading } = state.signin;
  return { phone, password, loading, userType };
};

export default connect(
  mapSateToProps,
  { signInAttempt, fillSignInForm }
)(SignIn);
