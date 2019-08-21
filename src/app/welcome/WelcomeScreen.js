import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { Button } from '../../components';
import { Block, Text, Button as GaButton, theme } from 'galio-framework';
import {
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity
} from 'react-native';

const { width } = Dimensions.get('screen');
const { height } = Dimensions.get('screen');

export default class WelcomeScreen extends Component {
  render() {
    return (
      <Block flex style={{ backgroundColor: '#ffffff' }}>
        <Block>
          <Block>
            <Block
              style={{
                flexWrap: 'wrap',
                left: 15,
                top: 15
              }}
            >
              <Block>
                <Text style={styles.numberText}>2,3141,241</Text>
                <Block center>
                  <Text style={styles.textStyle}>Doctors</Text>
                </Block>
              </Block>
              <Block>
                <Text style={styles.numberText}>2,3141,241</Text>
                <Block center>
                  <Text style={styles.textStyle}>Doctors</Text>
                </Block>
              </Block>
            </Block>
            <Block style={{ position: 'absolute', right: 15, top: 15 }}>
              <Block>
                <Text style={styles.numberText}>2,3141,241</Text>
                <Block center>
                  <Text style={styles.textStyle}>Doctors</Text>
                </Block>
              </Block>
              <Block>
                <Text style={styles.numberText}>2,3141,241</Text>
                <Block center>
                  <Text style={styles.textStyle}>Doctors</Text>
                </Block>
              </Block>
            </Block>
          </Block>
        </Block>
        <Block style={{ alignIems: 'center', justifyContent: 'flex-end' }}>
          <Block center>
            <Image
              style={{
                width: 200,
                height: 200,
                borderRadius: 200 / 2,
                marginBottom: 10
              }}
              source={require('../../assets/imgs/ancient_egypt.jpg')}
            />
          </Block>
          <Block center style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 20, fontWeight: '700' }}>Nabd Egypt</Text>
          </Block>
          <Block center>
            <Button
              color="warning"
              style={styles.button}
              textStyle={styles.buttonText}
            >
              I am a user
            </Button>
            <Button
              color="warning"
              style={styles.button}
              textStyle={styles.buttonText}
            >
              I am a doctor
            </Button>
            <Button
              color="warning"
              style={styles.button}
              textStyle={styles.buttonText}
            >
              I am a paramedic
            </Button>
            <Button
              color="warning"
              style={styles.button}
              textStyle={styles.buttonText}
            >
              Ambulance
            </Button>
          </Block>
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
    backgroundColor: '#EF171D',
    borderRadius: 5
  },
  buttonText: { fontSize: 20, fontWeight: '700' },
  numberText: { fontSize: 20, color: '#000' },
  typeText: { fontSize: 18, color: '#A9A9A9' }
});
