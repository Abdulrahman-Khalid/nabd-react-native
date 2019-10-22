import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Colors, Images } from '../../constants';
import { theme } from 'galio-framework';

const InjuryButton = (props) => {
  return (
    <TouchableOpacity style={[styles.container, styles.button, { backgroundColor: props.backgroundClr }]} onPress={props.onPress}  >
          <Image style={styles.image} source={Images[props.src]} />
        <View style={styles.textContainer}>
          <Text style={styles.text}>{props.txt}</Text>
        </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 16,
    borderRadius: 30,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 40,
    color: "white",
    textAlign: 'center',
    fontWeight: 'bold',
    margin: 10,
  },
  button: {
    flex: 1,
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 50,
    shadowOpacity: 0.5,
    elevation: 10
  },
  image: {
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 150,
  },
});

export default InjuryButton;
