import React, { Component } from 'react';
import { Button } from '../../components';
import AsyncStorage from '@react-native-community/async-storage';
import { Block, Text, Button as GaButton, theme } from 'galio-framework';
import { Actions } from 'react-native-router-flux';
import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../../constants';
import axios from 'axios';
import t from '../../I18n';

const { width, height } = Dimensions.get('screen');

export default class AmbulanceHome extends Component {
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
            {t.RequestDoctor}
          </Button>
          <Button
            color="warning"
            style={styles.button}
            textStyle={styles.buttonText}
            // onPress={this.requestParamedic.bind(this)}
          >
            {t.Requestaramedic}
          </Button>
          <Button
            color="warning"
            style={styles.button}
            textStyle={styles.buttonText}
            // onPress={this.requestAmbulance.bind(this)}
          >
            {t.RequestAmbulance}
          </Button>
          {/* <Button color="warning" onPress={this.logoutButtonPressed}>
            <Text>{t.LogOut}</Text>
          </Button> */}
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
    backgroundColor: Colors.APP,
    borderRadius: 5
  },
  buttonText: { fontSize: 20, fontWeight: '700' }
});
