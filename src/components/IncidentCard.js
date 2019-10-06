import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Dimensions,
  Image,
  View,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Block, Text, theme } from 'galio-framework';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { argonTheme } from '../constants';
import getDirections from 'react-native-google-maps-directions';

const { width, height } = Dimensions.get('screen');

class IncidentCard extends React.Component {
  handleGetDirections = () => {
    const directionsData = {
      source: {
        latitude: -33.8356372,
        longitude: 18.6947617
      },
      destination: this.props.item.location,
      params: [
        {
          key: 'travelmode',
          value: 'driving' // may be "walking", "bicycling" or "transit" as well
        },
        {
          key: 'dir_action',
          value: 'navigate' // this instantly initializes navigation using the given travel mode
        }
      ]
    };
    getDirections(directionsData);
  };

  render() {
    const {
      item,
      style,
      onPressRemove,
      renderRemove
    } = this.props;
    const cardContainer = [styles.card, styles.shadow, style];
    const imgContainer = [styles.imageContainer, styles.horizontalStyles];

    return (
      <Block row card flex style={cardContainer}>
        <View>
          <View>
            <Block flex style={imgContainer}>
              {item.image ? (
                <Image source={item.image} style={styles.fullImage} />
              ) : (
                <View style={styles.noImage}>
                  <Icon name="image-off" size={100} />
                </View>
              )}
            </Block>
          </View>
          <View>
            <Block flex style={styles.cardDescription}>
              <Text size={18} style={styles.cardTitle}>
                {item.description}
              </Text>
            </Block>
          </View>
          <View style={styles.hr} />
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={this.handleGetDirections}
            >
              <View
                style={[
                  styles.button,
                  {
                    backgroundColor: '#f6f6f4'
                  }
                ]}
              >
                <Text style={{ color: '#b3b3b2', fontFamily: 'Manjari-Bold' }}>
                  Get Directions
                </Text>
              </View>
            </TouchableOpacity>
            {renderRemove ? (
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={onPressRemove}
              >
                <View
                  style={[
                    styles.button,
                    {
                      backgroundColor: '#fdeaec'
                    }
                  ]}
                >
                  <Text
                    style={{ color: '#d76674', fontFamily: 'Manjari-Bold' }}
                  >
                    Remove
                  </Text>
                </View>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </Block>
    );
  }
}

IncidentCard.propTypes = {
  item: PropTypes.object
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.COLORS.WHITE,
    marginTop: theme.SIZES.BASE,
    borderWidth: 0,
    minHeight: 114
  },
  cardDescription: {
    padding: theme.SIZES.BASE / 2
  },
  imageContainer: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    overflow: 'hidden'
  },
  fullImage: {
    height: 200,
    width: width - theme.SIZES.BASE * 2
  },
  noImage: {
    height: 200,
    width: width - theme.SIZES.BASE * 2,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2
  },
  hr: {
    borderBottomColor: 'gray',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginLeft: 20,
    marginRight: 20
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: 'row',
    margin: 10
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10
  },
  button: {
    width: '100%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30
  }
});

export default IncidentCard;
