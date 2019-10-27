import React, { Component, createRef } from 'react';
import { Alert, Animated, Image, Text, View } from 'react-native';
import { Block } from 'galio-framework';
import { Button } from '../../../../components';
import axios from 'axios';
import CodeInput from 'react-native-confirmation-code-field';
import styles, {
  ACTIVE_CELL_BG_COLOR,
  CELL_BORDER_RADIUS,
  CELL_SIZE,
  DEFAULT_CELL_BG_COLOR,
  NOT_EMPTY_CELL_BG_COLOR
} from './styles';
import { Actions } from 'react-native-router-flux';
import { Images } from '../../../../constants';

const codeLength = 4;

export default class AnimatedExample extends Component {
  _animationsColor = [...new Array(codeLength)].map(
    () => new Animated.Value(0)
  );
  _animationsScale = [...new Array(codeLength)].map(
    () => new Animated.Value(1)
  );

  // constructor(){

  // }
  // componentDidMount() {
  //   var voxAPI = VoxImplant.getInstance();
  // }

  animateCell({ hasValue, index, isFocused }) {
    Animated.parallel([
      Animated.timing(this._animationsColor[index], {
        toValue: isFocused ? 1 : 0,
        duration: 250
      }),
      Animated.spring(this._animationsScale[index], {
        toValue: hasValue ? 0 : 1,
        duration: hasValue ? 300 : 250
      })
    ]).start();
  }

  handlerOnFulfill = code => {
    axios
      .post('confirmation', {
        phoneNo: this.props.phoneNum.substring(1),
        randomCode: code
      })
      .then(() => {
        axios(
          'https://api.voximplant.com/platform_api/AddUser/?account_id=' +
            info.accountId +
            '&api_key=' +
            info.apiKey +
            '&user_name=' +
            this.props.phone.substring(1) +
            '&user_display_name=' +
            this.props.name +
            '&user_password=' +
            info.userPass +
            '&application_id=' +
            info.appId
        )
          .then(response => {
            this.props.cacheUserId(response.data.user_id);
            console.log(response);
          })
          .catch(error => {
            console.log(error);
          });
        return Alert.alert(
          'Confirmation Code',
          'Successful!',
          [{ text: 'OK', onPress: () => Actions.signin() }],
          {
            cancelable: false
          }
        );
      })
      .catch(error => {
        console.log(error);
        return Alert.alert(
          'Confirmation Code',
          'Failed!',
          [
            {
              text: 'OK',
              onPress: () => {
                this.clearCode();
              }
            }
          ],
          {
            cancelable: false
          }
        );
      });
  };

  field = createRef();

  clearCode() {
    const { current } = this.field;

    if (current) {
      current.clear();
    }
  }

  pasteCode() {
    const { current } = this.field;

    if (current) {
      current.handlerOnTextChange(value);
    }
  }

  cellProps = ({ hasValue, index, isFocused }) => {
    const animatedCellStyle = {
      backgroundColor: hasValue
        ? this._animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [NOT_EMPTY_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR]
          })
        : this._animationsColor[index].interpolate({
            inputRange: [0, 1],
            outputRange: [DEFAULT_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR]
          }),
      borderRadius: this._animationsScale[index].interpolate({
        inputRange: [0, 1],
        outputRange: [CELL_SIZE, CELL_BORDER_RADIUS]
      }),
      transform: [
        {
          scale: this._animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.2, 1]
          })
        }
      ]
    };

    // Run animation on next event loop tik
    // Because we need first return new style prop and then animate this value
    setTimeout(() => {
      this.animateCell({ hasValue, index, isFocused });
    }, 0);

    return {
      style: [styles.input, animatedCellStyle]
    };
  };

  containerProps = { style: styles.inputWrapStyle };

  render() {
    /*concept : https://dribbble.com/shots/5476562-Forgot-Password-Verification/attachments */
    return (
      <Block flex>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Verification</Text>
          <Image style={styles.icon} source={Images.verification} resizeMode="contain" />
          <Text style={styles.inputSubLabel}>
            {'Please enter the verification code\nwe sent to '}
            {this.props.phoneNum}
          </Text>
          <Block center>
            <CodeInput
              maskSymbol=" "
              variant="clear"
              codeLength={codeLength}
              keyboardType="numeric"
              cellProps={this.cellProps}
              containerProps={this.containerProps}
              ref={this.field}
              onFulfill={this.handlerOnFulfill}
              CellComponent={Animated.Text}
            />
            {/* <Text style={{ fontSize: 20 }}>Veri4124124142fy</Text> */}
            <Button>
              {/* <Text style={styles.nextButtonText}>Verify</Text> */}
            </Button>
          </Block>
        </View>
      </Block>
    );
  }
}

const mapSateToProps = ({ signup }) => {
  const { name, phone } = signup;
  return {
    name,
    phone
  };
};

export default connect(
  mapSateToProps,
  cacheUserId
)(AnimatedExample);
// const apiKey = 'a70036fa-792b-4f9c-a13a-ba6a0dd606f5';
// const accountId = '3233280';
// const userPass = 'nabd_app';
// const appId = '7423899';
// axios
//   .post('https://api.voximplant.com/platform_api/AddUser/', {
//     account_id: accountId,
//     api_key: apiKey,
//     user_name: '201011315175',
//     user_display_name: 'Abdulrahman Khalid',
//     user_password: userPass,
//     application_id: appId
//   })
//   .then(function(response) {
//     console.log(response);
//   })
//   .catch(function(error) {
//     console.log(error);
//   });
