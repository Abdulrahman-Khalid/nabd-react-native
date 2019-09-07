import React, { Component } from 'react';
import { Button } from '../../components';
import AsyncStorage from '@react-native-community/async-storage';
import { Block, Text, Button as GaButton, theme } from 'galio-framework';
import { Actions } from 'react-native-router-flux';
import { StyleSheet, Dimensions } from 'react-native';
import { argonTheme } from '../../constants';
import axios from 'axios';

const { width, height } = Dimensions.get('screen');

export default class ParamedicHome extends Component {
  logoutButtonPressed() {
    axios.defaults.headers.common['TOKEN'] = '';
    AsyncStorage.clear()
      .then(() => Actions.welcome())
      .catch(() => {});
  }

  render() {
    return (
      <Block center>
        <Block center style={{ position: 'absolute', bottom: 10 }}>
          <Button
            color="warning"
            style={styles.button}
            textStyle={styles.buttonText}
            // onPress={this.requestDoctor.bind(this)}
          >
            Request doctor
          </Button>
          <Button
            color="warning"
            style={styles.button}
            textStyle={styles.buttonText}
            // onPress={this.requestParamedic.bind(this)}
          >
            Request paramedic
          </Button>
          <Button
            color="warning"
            style={styles.button}
            textStyle={styles.buttonText}
            // onPress={this.requestAmbulance.bind(this)}
          >
            Request ambulance
          </Button>
          <Button color="warning" onPress={this.logoutButtonPressed}>
            <Text>Log out</Text>
          </Button>
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    marginBottom: theme.SIZES.BASE,
    width: width - theme.SIZES.BASE * 2,
    height: height / 15,
    backgroundColor: argonTheme.COLORS.APP,
    borderRadius: 5
  },
  buttonText: { fontSize: 20, fontWeight: '700' }
});
