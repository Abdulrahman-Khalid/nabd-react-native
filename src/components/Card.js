import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity
} from 'react-native';
import { Colors } from '../constants';
import { theme } from 'galio-framework';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';

const { width, height } = Dimensions.get('screen');

class Card extends React.Component {
  render() {
    const { item, style, onPress, onPressInfo } = this.props;
    return (
      <View style={[styles.mainView, style]}>
        <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
          <TouchableOpacity onPress={onPressInfo} style={styles.infoButton}>
            <Icon
              size={25}
              color="white"
              name="information-outline"
              style={{
                textAlign: 'center'
              }}
            />
          </TouchableOpacity>
          <LinearGradient
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            locations={[0.15, 1]}
            colors={['transparent', 'black']}
            style={styles.linearGradient}
          />
          <Image source={item.image} style={styles.image} />
          <Text
            style={{
              fontSize: 35,
              zIndex: 2,
              color: 'white',
              position: 'absolute',
              bottom: 0,
              fontWeight: '900',
              fontFamily: 'IstokWeb-Bold',
              marginLeft: 15
            }}
          >
            {item.title}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  cardContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 30,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.3,
    elevation: 13
  },
  image: {
    height: '100%',
    width: '100%',
    borderRadius: 30
  },
  linearGradient: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 30,
    zIndex: 1
  },
  infoButton: {
    position: 'absolute',
    margin: 12,
    right: 0,
    zIndex: 3
  }
});

export default Card;
