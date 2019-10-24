import React, { Component } from 'react';
import { Image } from 'react-native';
import { Button } from '../../components';
import { Block, Text, Button as GaButton, theme } from 'galio-framework';
import { Dimensions } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Colors, Images } from '../../constants';
import t from '../../I18n';

const { width, height } = Dimensions.get('screen');

class IamAmbulance extends Component {
  render() {
    return (
      <Block flex style={{ backgroundColor: Colors.BACKGROUND }}>
        <Block center style={{ position: 'absolute', top: 30 }}>
          <Image style={styles.image} source={Images.ambulance} />
          <Text style={{ fontSize: 20, fontWeight: '700' }}>{t.Ambulance}</Text>
          <Text style={styles.descriptionText}>
            Lorem Ipsum is simply dummy text of the printing and type setting
            industry Lorem Ipsum
          </Text>
        </Block>
        <Block center style={{ position: 'absolute', bottom: 10 }}>
          <Block center>
            <Button
              color="secondary"
              style={{
                ...styles.button,
                ...{ borderColor: '#7a7a7a', borderWidth: 1 }
              }}
              textStyle={styles.buttonTextSignup}
              onPress={() => Actions.signin()}
            >
             {t.SignIn}
            </Button>
          </Block>
        </Block>
      </Block>
    );
  }
}

const styles = {
  image: {
    width: 300,
    height: 300,
    marginTop: 30,
    marginLeft: 30,
    marginRight: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2
  },
  button: {
    marginBottom: theme.SIZES.BASE,
    width: width - theme.SIZES.BASE * 2,
    height: height / 15,
    borderRadius: 5
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

export default IamAmbulance;
