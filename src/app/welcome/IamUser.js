import React, { Component } from 'react';
import { Image } from 'react-native';
import CommonButtons from './CommonButtons';
import { Block, Text, Button as GaButton, theme } from 'galio-framework';

class IamUser extends Component {
  render() {
    return (
      <Block flex style={{ backgroundColor: 'white' }}>
        <Block center style={{ position: 'absolute', top: 30 }}>
          <Image
            style={styles.image}
            source={require('../../assets/imgs/ancient_egypt.jpg')}
          />
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
    marginBottom: 30
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 22,
    marginLeft: 30,
    marginRight: 30
  }
};

export default IamUser;
