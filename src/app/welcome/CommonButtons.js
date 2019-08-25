import React, { Component } from 'react';
import { Button } from '../../components';
import { Actions } from 'react-native-router-flux';
import { argonTheme } from '../../constants';
import { Dimensions } from 'react-native';
import { Block, Button as GaButton, theme } from 'galio-framework';

const { width, height } = Dimensions.get('screen');

export default class CommonButtons extends Component {
  render() {
    return (
      <Block center>
        <Button
          color="warning"
          style={{ ...styles.button, ...styles.appColor }}
          onPress={() => Actions.signup()}
          textStyle={styles.buttonTextNew}
        >
          I am new
        </Button>
        <Button
          color="secondary"
          style={{
            ...styles.button,
            ...{ borderColor: '#7a7a7a', borderWidth: 1 }
          }}
          textStyle={styles.buttonTextSignup}
          onPress={() => Actions.signin()}
        >
          Sign in
        </Button>
      </Block>
    );
  }
}

const styles = {
  button: {
    marginBottom: theme.SIZES.BASE,
    width: width - theme.SIZES.BASE * 2,
    height: height / 15,
    borderRadius: 5
  },
  appColor: {
    backgroundColor: argonTheme.COLORS.APP
  },
  buttonTextNew: {
    color: argonTheme.COLORS.WHITE,
    fontSize: 20,
    fontWeight: 'bold'
  },
  buttonTextSignup: {
    color: '#7a7a7a',
    fontSize: 20,
    fontWeight: '700'
  }
};
