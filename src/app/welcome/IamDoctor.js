import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { Button } from '../../components';
import { Block, Text, Button as GaButton, theme } from 'galio-framework';
import { Dimensions } from 'react-native';
const { width } = Dimensions.get('screen');
const { height } = Dimensions.get('screen');

class IamDoctor extends Component {
  render() {
    return (
      <Block flex style={{ backgroundColor: 'white' }}>
        <Block center style={{ position: 'absolute', top: 30 }}>
          <Image
            style={styles.image}
            source={require('../../assets/imgs/ancient_egypt.jpg')}
          />
          <Text style={{ fontSize: 20, fontWeight: '700' }}>Doctor</Text>
          <Text style={styles.descriptionText}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry Lorem Ipsum
          </Text>
        </Block>
        <Block center style={{ position: 'absolute', bottom: 10 }}>
          <Block center>
            <Button
              color="warning"
              style={{ ...styles.button, ...styles.appColor }}
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
            >
              Sign in
            </Button>
          </Block>
        </Block>
      </Block>
    );
  }
}

const styles = {
  image: {
    width: 200,
    height: 200,
    borderRadius: 200 / 2,
    marginBottom: 30
  },
  button: {
    marginBottom: theme.SIZES.BASE,
    width: width - theme.SIZES.BASE * 2,
    height: height / 15,
    borderRadius: 5
  },
  appColor: {
    backgroundColor: '#EF171D'
  },
  buttonTextNew: { color: '#fff', fontSize: 20, fontWeight: '700' },
  buttonTextSignup: {
    color: '#7a7a7a',
    fontSize: 20,
    fontWeight: '700'
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 22,
    marginLeft: 30,
    marginRight: 30
  }
};
export default IamDoctor;
