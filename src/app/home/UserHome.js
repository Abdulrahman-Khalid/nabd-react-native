import React, { Component } from 'react';
import { Button } from '../../components';
import AsyncStorage from '@react-native-community/async-storage';
import { Block, Text, Button as GaButton, theme } from 'galio-framework';
import { Actions } from 'react-native-router-flux';
import axios from 'axios';

export default class UserHome extends Component {
  logoutButtonPressed() {
    axios.defaults.headers.common['TOKEN'] = '';
    AsyncStorage.clear()
      .then(() => Actions.welcome())
      .catch(() => {});
  }

  render() {
    return (
      <Block center>
        <Text>Home User</Text>
        <Button color="warning" onPress={this.logoutButtonPressed}>
          <Text>Log out</Text>
        </Button>
      </Block>
    );
  }
}
