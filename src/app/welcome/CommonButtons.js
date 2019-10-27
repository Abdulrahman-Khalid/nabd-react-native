import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { Colors } from '../../constants';
import { Dimensions, View, TouchableOpacity, Text } from 'react-native';
import t from '../../I18n';
const { width, height } = Dimensions.get('screen');

export default class CommonButtons extends Component {
  render() {
    return (
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => Actions.signup()}
        >
          <View style={styles.button}>
            <Text style={{ color: Colors.WHITE, fontFamily: 'Manjari-Bold' }}>
              {t.CreateAccount}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => Actions.signin()}
        >
          <View style={[styles.button, { backgroundColor: Colors.SECONDARY }]}>
            <Text
              style={{
                color: Colors.SECONDARY_DARK,
                fontFamily: 'Manjari-Bold'
              }}
            >
              {t.SignIn}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = {
  buttonsContainer: {
    flex: 1,
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
};
