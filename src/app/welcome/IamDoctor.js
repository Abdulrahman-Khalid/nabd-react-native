import React, { Component } from 'react';
import { Image, View, Text, TouchableOpacity } from 'react-native';
import CommonButtons from './CommonButtons';
import { theme } from 'galio-framework';
import { Colors, Images } from '../../constants';
import t from '../../I18n';

class IamDoctor extends Component {
  render() {
    return (
      <View style={styles.mainContainer}>
        <Image
          style={styles.image}
          source={Images.doctor}
          resizeMode="contain"
        />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{t.Doctor}</Text>
          <Text style={styles.description}>{t.DoctorInfo}</Text>
        </View>
        <CommonButtons />
      </View>
    );
  }
}

const styles = {
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: 200,
    height: 200,
    margin: 20,
    marginTop: 40,
    flex: 1
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    fontFamily: 'IstokWeb-Regular',
    marginLeft: theme.SIZES.BASE * 2,
    marginRight: theme.SIZES.BASE * 2
  },
  description: {
    fontSize: 15,
    color: 'gray',
    textAlign: 'center',
    fontFamily: 'IstokWeb-Regular',
    marginLeft: theme.SIZES.BASE * 2,
    marginRight: theme.SIZES.BASE * 2
  }
};

export default IamDoctor;
