import React, { Component } from 'react';
import { Block, Text, Button as GaButton, theme } from 'galio-framework';
import { Actions } from 'react-native-router-flux';

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
        <Text>Home User</Text>);
        <Button color="warning" onPress={this.logoutButtonPressed} />
      </Block>
    );
  }
}
