import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { argonTheme, Images } from '../../constants';

const InjuryButton = props => {
  return (
    <View style={styles.container}>
      <View style={[styles.button, { backgroundColor: props.backgroundClr }]}>
        <View style={styles.shadow}>
          <Image style={styles.image} source={Images[props.src]} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{props.txt}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: argonTheme.COLORS.BACKGROUND
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 40,
    color: argonTheme.COLORS.BLACK,
    textAlign: 'center',
    fontWeight: 'bold',
    margin: 10,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
    textShadowColor: argonTheme.COLORS.WHITE
  },
  button: {
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
    shadowColor: argonTheme.COLORS.WHITE,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 5
  },
  image: {
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 150,
    borderRadius: 100
  },
  shadow: {
    margin: 20,
    borderRadius: 100,
    width: 150,
    height: 150,
    justifyContent: 'center',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
    textShadowColor: argonTheme.COLORS.WHITE,
    shadowOpacity: 0.25,
    elevation: 5
  }
});

export default InjuryButton;
