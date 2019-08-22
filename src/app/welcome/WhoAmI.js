import React, { Component } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { Button } from '../../components';
import { Block, Text, Button as GaButton, theme } from 'galio-framework';
import { Actions } from 'react-native-router-flux';
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('screen');
const { height } = Dimensions.get('screen');

export default class WhoAmI extends Component {
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
                <Block center style={{ marginBottom: 4 }}>
                  <Text style={styles.numberText}>300,413</Text>
                  <Text style={styles.textStyle}>Users</Text>
                </Block>
              </Block>
              <Block>
                <Block center>
                  <Text style={styles.numberText}>100,314</Text>
                  <Text style={styles.textStyle}>Doctors</Text>
                </Block>
              </Block>
            </Block>
            <Block style={{ position: 'absolute', right: 15, top: 15 }}>
              <Block>
                <Block center tyle={{ marginBottom: 4 }}>
                  <Text style={styles.numberText}>2,041</Text>
                  <Text style={styles.textStyle}>paramedic</Text>
                </Block>
              </Block>
              <Block>
                <Block center>
                  <Text style={styles.numberText}>1,301</Text>
                  <Text style={styles.textStyle}>Ambulance</Text>
                </Block>
              </Block>
            </Block>
          </Block>
        </Block>
        <Block style={{ alignIems: 'center', justifyContent: 'flex-end' }}>
          <Block center>
            <Image
              style={styles.image}
              source={require('../../assets/imgs/ancient_egypt.jpg')}
            />
          </Block>
          {/* <Block center style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 20, fontWeight: '700' }}>Nabd Egypt</Text>
          </Block> */}
        </Block>
        <Block center style={{ position: 'absolute', bottom: 10 }}>
          <Button
            color="warning"
            style={styles.button}
            textStyle={styles.buttonText}
            onPress={() => Actions.iUser()}
          >
            I am a user
          </Button>
          <Button
            color="warning"
            style={styles.button}
            textStyle={styles.buttonText}
            onPress={() => Actions.iDoctor()}
          >
            I am a doctor
          </Button>
          <Button
            color="warning"
            style={styles.button}
            textStyle={styles.buttonText}
            onPress={() => Actions.iParamedic()}
          >
            I am a paramedic
          </Button>
          <Button
            color="warning"
            style={styles.button}
            textStyle={styles.buttonText}
            onPress={() => Actions.iAmbulance()}
          >
            Ambulance
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
    backgroundColor: '#EF171D',
    borderRadius: 5
  },
  buttonText: { fontSize: 20, fontWeight: '700' },
  numberText: { fontSize: 20, color: '#000' },
  typeText: { fontSize: 18, color: '#A9A9A9' },
  image: {
    width: 200,
    height: 200,
    borderRadius: 200 / 2,
    marginBottom: 10
  },
  textStyle: {
    color: '#484848'
  }
});
