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
    backgroundColor: 'white'
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
    //margin: 10,
  },
  imageText: {
    fontSize: 50,
    textAlign: 'center',
    //margin: 10,
    fontWeight: 'bold'
  },
  imageContainer: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    //margin : 10,
    borderWidth: 1.5,
    borderColor: 'white'
  },
  imageStyle: {
    margin: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 150,
    borderRadius: 50
  }
});

export default InjuryButton;
