import React, { Component } from 'react';
import { Image } from 'react-native';
import CommonButtons from './CommonButtons';
import { Block, Text, Button as GaButton, theme } from 'galio-framework';
import { argonTheme, Images } from '../../constants';

class IamUser extends Component {
  render() {
    return (
      <Block flex style={{ backgroundColor: argonTheme.COLORS.BACKGROUND }}>
        <Block center style={{ position: 'absolute', top: 30 }}>
          <Image style={styles.image} source={Images.user} />
          <Text style={{ fontSize: 20, fontWeight: '700' }}>User</Text>
          <Text style={styles.descriptionText}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry Lorem Ipsum
          </Text>
        </Block>
        <Block center style={{ position: 'absolute', bottom: 10 }}>
          <CommonButtons />
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
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 22,
    marginLeft: 30,
    marginRight: 30
  }
};

export default IamUser;
