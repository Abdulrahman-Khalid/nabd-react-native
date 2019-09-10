import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView
} from 'react-native';
const assets = require('./assets.js');
import { argonTheme } from '../../constants';

const InjuryButton = props => {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.imageContainer,
          { backgroundColor: props.backgroundClr }
        ]}
      >
        <Image style={styles.imageStyle} source={assets[props.imageSource]} />
        <View style={styles.textContainer}>
          <Text style={styles.imageText}>{props.imageText}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row'
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageText: {
    fontSize: 40,
    color: argonTheme.COLORS.BLACK,
    textAlign: 'center',
    fontWeight: 'bold',
    margin: 10,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
    textShadowColor: 'white'
  },
  imageContainer: {
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 8,
    marginTop: 8,
    flex: 1,
    width: 400,
    height: 240,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 20,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  imageStyle: {
    margin: 10,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 150,
    borderRadius: 50,
    elevation: 4,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: 'grey',
    shadowOpacity: 0.5,
    shadowRadius: 10
  }
});

export default InjuryButton;
