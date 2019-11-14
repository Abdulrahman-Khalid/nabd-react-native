import React, { Component } from 'react';
import { Image, View, Text, TouchableOpacity } from 'react-native';
import CommonButtons from './CommonButtons';
import { theme } from 'galio-framework';
import { Colors, Images } from '../../constants';
import t from '../../I18n';

class IamAmbulance extends Component {
  render() {
    return (
      <View style={styles.mainContainer}>
        <Image
          style={styles.image}
          source={Images.ambulance}
          resizeMode="contain"
        />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{t.AmbulanceDriver}</Text>
          <Text style={styles.description}>{t.AmbulanceInfo}</Text>
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
    marginLeft: theme.SIZES.BASE * 2,
    marginRight: theme.SIZES.BASE * 2
  },
  description: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
    marginLeft: theme.SIZES.BASE * 2,
    marginRight: theme.SIZES.BASE * 2
  },
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
    height: 40,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    flexDirection: 'row',
    backgroundColor: Colors.APP
  }
};

export default IamAmbulance;
